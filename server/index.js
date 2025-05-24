import express from 'express';
import cors from 'cors';
import mainRouter from './routes/index.js';
import dotenv from 'dotenv';
dotenv.config();

const PORT = process.env.PORT || 3000;
const ENVIRONMENT = process.env.ENVIRONMENT;
const FRONTEND_URL = process.env.FRONTEND_URL;

const app = express();

const allowedOrigins =['http://localhost:5173','https://find-your-pg-agent.vercel.app'];
  // ENVIRONMENT === 'DEV'
  //   ? ['http://localhost:5173']
  //   : [FRONTEND_URL];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'OPTIONS', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization'],
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

app.use(express.json());

app.use(mainRouter);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
