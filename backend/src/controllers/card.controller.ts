import type { Request, Response } from "express";
import { createCard, deleteCard, getCards, moveCard, reorderCard, updateCard } from "../services/card.service.js";


export async function createCardController(req: Request <{listId: string}>, res: Response){
    const {title, description} = req.body;
    const userId = req.user.userId
    const listId = req.params.listId
    const cardData = await createCard({userId, title, description, listId});
    res.status(201).json({
        message: "Card created successfully",
        id: cardData.id,
        title: cardData.title,
        description: cardData.description,
        order: cardData.order
    })
}

export async function getCardsController(req: Request <{listId: string}>, res: Response){
    const userId = req.user.userId
    const listId = req.params.listId
    const cards = await getCards({userId, listId});
    res.status(200).json({
        message: "Cards fetched successfully",
        cards
    })
}

export async function updateCardController(req: Request <{cardId: string}>, res: Response){
    const {title, description} = req.body;
    const userId = req.user.userId;
    const cardId = req.params.cardId;
    const cardData = await updateCard({userId, title, description, cardId});
    res.status(200).json({
        message: "Card updated successfully",
        id: cardData.id,
        title: cardData.title,
        description: cardData.description,
        order: cardData.order
    });
}

export async function deleteCardController(req: Request <{cardId: string}>, res: Response){
    const userId = req.user.userId;
    const cardId = req.params.cardId;
    const cardData = await deleteCard({userId, cardId});
    res.status(200).json({
        message: "Card deleted successfully",
        id: cardData.id,
        title: cardData.title,
        description: cardData.description,
        order: cardData.order
    });
}

export async function reorderCardController(req: Request, res: Response){
    const userId = req.user.userId;
    const {previousCardId, currentCardId, nextCardId} = req.body;
    const updatedCardOrder = await reorderCard({userId, previousCardId, currentCardId, nextCardId});
    res.status(200).json({
        message:"Card reordered successfully",
        updatedCardOrder
    });
}

export async function moveCardController(req: Request, res: Response){
    const userId = req.user.userId;
    const {destinationListId, previousCardId, currentCardId, nextCardId} = req.body;
    const movedCard = await moveCard({userId, destinationListId, previousCardId, currentCardId, nextCardId});
    res.status(200).json({
        message:"Card moved successfully",
        movedCard
    });
}