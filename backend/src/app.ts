import express from "express";
import authRouter from "./routes/auth.routes.js"
import boardRouter from "./routes/board.routes.js"
import listRouter from "./routes/list.routes.js"
import cardRouter from "./routes/card.routes.js"
import { errorHandler } from "./middlewares/error.middleware.js";
import cookieParser from "cookie-parser";

const app = express();
app.use(cookieParser());
app.use(express.json());

app.use("/api/auth", authRouter);
app.use("/api/boards", boardRouter);
app.use("/api", listRouter);
app.use("/api", cardRouter);

app.get("/health", (req, res) => {
    res.json({
        status: "ok"
    })
});

app.use(errorHandler);

export default app;