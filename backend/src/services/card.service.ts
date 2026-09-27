import { prisma } from "../lib/prisma.js";
import { appError } from "../utils/error.utils.js";

type CardType = {
    userId: string,
    title: string,
    description?: string
    listId: string
}

type UpdateCardType = {
    userId: string,
    title?: string,
    description?: string
    cardId: string
}

type DeleteCardType = {
    userId: string,
    cardId: string
}

type GetCardsType = {
    userId: string,
    listId: string
}

type ReorderCardType = {  
    userId: string,
    currentCardId: string,
    previousCardId: string | null,
    nextCardId: string | null
}

type MoveCardType = ReorderCardType & {
    destinationListId: string
}

export async function createCard({userId, title, description, listId}: CardType){
    const listData = await prisma.list.findFirst({
        where: {
            id: listId,
            board: {ownerId: userId}
        },
        select: {
            cards: {
                orderBy: {
                    order: "desc"
                },
                take: 1,
                select: {order: true}
            }
        }
    })

    if (listData === null){
        throw appError("List not found", 404)
    }

    const lastOrder = listData.cards[0]?.order ?? 0;
    const newOrder = lastOrder + 1000;
    const cardData = await prisma.card.create({
        data: {
            title,
            description: description ?? null,
            order: newOrder,
            listId: listId
        }
    });
    return cardData;
}

export async function getCards({userId, listId}: GetCardsType){
    const listData = await prisma.list.findFirst({
        where: {
            id: listId,
            board: {ownerId: userId}
        },
        select: {
            cards: {
                orderBy: {
                    order: "asc"
                },
                select: {id: true, title: true, description:true, order: true,}
            }
        }
    })

    if (listData === null){
        throw appError("List not found", 404)
    }

    return listData.cards;
}

export async function updateCard({userId, title, description, cardId}: UpdateCardType){
    const data: { title?: string; description?: string } = {};

    const cardExists = await prisma.card.findFirst({
        where: {
            id: cardId,
            list: {
                board: {ownerId: userId}
            }
        },
        select : {id: true}
    })

    if (cardExists === null){
        throw appError("Card not found", 404)
    }

    if (title !== undefined) {
        data.title = title;
    }

    if (description !== undefined) {
        data.description = description;
    }

    const card = await prisma.card.update({
        where: {id: cardId},
        data
    })

    return card;
}

export async function deleteCard({userId, cardId}: DeleteCardType){

    const cardExists = await prisma.card.findFirst({
        where: {
            id: cardId,
            list: {
                board: {ownerId: userId}
            }
        },
        select : {id: true}
    })

    if (cardExists === null){
        throw appError("Card not found", 404)
    }

    const card = await prisma.card.delete({
        where: {id: cardId},
        select: {id: true, title: true, description: true, order: true}
    })

    return card;
}

export async function reorderCard({ userId, previousCardId, currentCardId, nextCardId }: ReorderCardType) {
    const cardIds = [previousCardId, currentCardId, nextCardId].filter(id => id !== null)
    
    const cards = await prisma.card.findMany({
        where: {list: {board: {ownerId: userId} }, id: {in: cardIds}},
        select: {id: true, order: true, listId: true}
    })

    const currentCard = cards.find(
        card => card.id === currentCardId
    );

    const previousCard = cards.find(
        card=> card.id === previousCardId
    );
    
    const nextCard = cards.find(
        card => card.id === nextCardId
    );
    
    if (!currentCard) {
        throw appError("Current card not found", 404);
    }

    if (!previousCard && nextCard !== undefined) {
        throw appError("Previous card not found", 404);
    }

    if (!nextCard && previousCard !== undefined) {
        throw appError("Next card not found", 404);
    }

    if ((previousCard && previousCard.listId !== currentCard.listId) || (nextCard && nextCard.listId !== currentCard.listId)) {
        throw appError("Cards must belong to the same list", 400);
    }

    let newOrder: number;

    if(!previousCard){ 
        newOrder = nextCard!.order/2;
    } else if(!nextCard){
        newOrder = previousCard.order + 1000;
    } else{
        newOrder = (previousCard.order + nextCard.order)/2;
    }

    const updatedCardOrder = await prisma.card.update({
        where: {id: currentCardId},
        data: {
            order: newOrder
        }
    });
    return updatedCardOrder;
}

export async function moveCard({userId, destinationListId, previousCardId, currentCardId, nextCardId}: MoveCardType){
    const cardIds = [previousCardId, currentCardId, nextCardId].filter(id => id !== null)


    const cards = await prisma.card.findMany({
        where: {list: {board: {ownerId: userId} }, id: {in: cardIds}},
        select: {id: true, order: true, listId: true}
    })

    const currentCard = cards.find(
        card => card.id === currentCardId
    );

        if(currentCard?.listId === destinationListId){
            throw appError("Bad Request", 400)
    }

    const previousCard = cards.find(
        card=> card.id === previousCardId
    );
    
    const nextCard = cards.find(
        card => card.id === nextCardId
    );

    if (!currentCard) {
        throw appError("Current card not found", 404);
    }

    if (!previousCard && nextCardId !== null) {
        throw appError("Previous card not found", 404);
    }

    if (!nextCard && previousCardId !== null) {
        throw appError("Next card not found", 404);
    }

    const destinationList = await prisma.list.findFirst({
        where: {board: {ownerId: userId}, id: destinationListId},
        select: {id: true}
    })

    if (!destinationList){
        throw appError("Destination list not found", 404)
    }

    if (previousCard && previousCard.listId !== destinationListId) {
        throw appError("Previous card must belong to destination list", 400);
    }

    if (nextCard && nextCard.listId !== destinationListId) {
        throw appError("Next card must belong to destination list", 400);
    }

    let newOrder: number;

    if ((previousCard?.listId === destinationListId) && (nextCard?.listId !== destinationListId)){
        newOrder = previousCard.order + 1000;
    } else if ((previousCard?.listId !== destinationListId) && (nextCard?.listId === destinationListId)){
        newOrder = nextCard.order/2;
    } else if ((previousCard?.listId === destinationListId) && (nextCard?.listId === destinationListId)){
        newOrder = (previousCard.order + nextCard.order)/2;
    } else if(!previousCard && !nextCard){
        newOrder = 1000
    } else {
        throw appError("Invalid card positioning parameters", 400)
    }
    const movedCard = await prisma.card.update({
        where: {id: currentCardId},
        data: {
            order: newOrder,
            listId: destinationListId
        }
    })
    return movedCard;
}