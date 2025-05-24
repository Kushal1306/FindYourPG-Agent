import express from "express";
import dotenv from "dotenv";
dotenv.config();
import messageRouter from "./messages.js";
import pgRouter from "./pgRoutes.js";
import geoDataRouter from "./geoData.js";

const router = express.Router();

router.use("/messages", messageRouter);
router.use("/pg", pgRouter);
router.use("/geo-data",geoDataRouter)

export default router;