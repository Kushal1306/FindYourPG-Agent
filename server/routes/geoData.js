import express from "express";
import { getGeoDataToIndexPG } from "../controllers/geoData.js";

const geoDataRouter = express.Router();

geoDataRouter.post("/",getGeoDataToIndexPG);

export default geoDataRouter;