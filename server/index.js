import express from 'express';
import cors from 'cors';
import mainRouter from './routes/index.js';
import dotenv from 'dotenv';
dotenv.config();

const PORT = process.env.PORT || 3000;
const ENVIRONMENT = process.env.ENVIRONMENT;
const FRONTEND_URL = process.env.FRONTEND_URL;

const app = express();
app.use(express.json());

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
  allowedHeaders: ['Content-Type', 'Authorization'],
};
app.use(cors(corsOptions));

app.use(mainRouter);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
