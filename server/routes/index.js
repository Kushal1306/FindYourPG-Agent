import express from "express";
import dotenv from "dotenv";
dotenv.config();
import messageRouter from "./messages.js";
import pgRouter from "./pgRoutes.js";
import geoDataRouter from "./geoData.js";

const mainRouter = express.Router();

mainRouter.use("/messages", messageRouter);
mainRouter.use("/pg", pgRouter);
mainRouter.use("/geo-data",geoDataRouter)

export default mainRouter;