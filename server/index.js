import express from "express";
import dotenv from "dotenv";
import router from "../server/routes/index.js";
import { runDummyPGQuery } from "./helpers/pg.js";
import { findNearestPG } from "./helpers/executeToolCall.js";
import cors from "cors";
dotenv.config();

const app = express();
app.use(express.json());

const ENVIRONMENT=process.env.ENVIRONMENT;
const FRONTEND_URL=process.env.FRONTEND_URL;


const allowedOrigins = ENVIRONMENT==="DEV"?['http://localhost:5173']:[FRONTEND_URL];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'OPTIONS', 'PUT', 'DELETE','PATCH'],
  credentials: false,
  allowedHeaders: ['X-CSRF-Token', 'X-Requested-With', 'Accept', 'Accept-Version', 'Content-Length', 'Content-MD5', 'Content-Type', 'Date', 'X-Api-Version', 'Authorization'],
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

app.use(router);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// runDummyPGQuery();
// findNearestPG("TCs Gitanjali Park, Kolkata");


