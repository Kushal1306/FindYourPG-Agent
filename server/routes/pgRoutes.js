import express from "express";
import { postPG } from "../controllers/pg.js";

const pgRouter = express.Router();

pgRouter.post("/", postPG);

export default pgRouter;

