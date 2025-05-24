import express from "express";
import { postMessage } from "../controllers/message.js";

const messageRouter = express.Router();

messageRouter.post("/",postMessage);


export default messageRouter;