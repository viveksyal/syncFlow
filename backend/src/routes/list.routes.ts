import { Router } from "express";
import { validate } from "../middlewares/validate.middleware.js";
import { authentication } from "../middlewares/auth.middleware.js";
import { ListParamsSchema, ListReorderSchema, ListSchema } from "../validators/list.validator.js";
import { createListController, deleteListController, getListsController, reorderListController, updateListController } from "../controllers/list.controller.js";
import { BoardParamsSchema } from "../validators/board.validator.js";
const router = Router();

router.post("/boards/:boardId/lists", authentication, validate(BoardParamsSchema, "params"), validate(ListSchema, "body"), createListController);
router.get("/boards/:boardId/lists", authentication, validate(BoardParamsSchema, "params"), getListsController);
router.patch("/lists/:listId", authentication, validate(ListParamsSchema, "params"), validate(ListSchema, "body"), updateListController);
router.delete("/lists/:listId", authentication, validate(ListParamsSchema, "params"), deleteListController);

router.patch("/lists/reorder", authentication, validate(ListReorderSchema, "body"), reorderListController);

 export default router;