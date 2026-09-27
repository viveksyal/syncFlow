import { Router } from "express";
import { validate } from "../middlewares/validate.middleware.js";
import { authentication } from "../middlewares/auth.middleware.js";
import { CardMoveSchema, CardParamsSchema, CardReorderSchema, CardSchema, UpdateCardSchema } from "../validators/card.validator.js";
import { createCardController, deleteCardController, getCardsController, moveCardController, reorderCardController, updateCardController } from "../controllers/card.controller.js";
import { ListParamsSchema } from "../validators/list.validator.js";
const router = Router();

router.post("/lists/:listId/cards", authentication, validate(ListParamsSchema, "params"), validate(CardSchema, "body"), createCardController);
router.get("/lists/:listId/cards", authentication, validate(ListParamsSchema, "params"), getCardsController);
router.patch("/cards/:cardId", authentication, validate(CardParamsSchema, "params"), validate(UpdateCardSchema, "body"), updateCardController);
router.delete("/cards/:cardId", authentication, validate(CardParamsSchema, "params"), deleteCardController);
router.patch("/cards/reorder", authentication, validate(CardReorderSchema, "body"), reorderCardController);
router.patch("/cards/move", authentication, validate(CardMoveSchema, "body"), moveCardController);


export default router;