import { AzureOpenAI } from 'openai';

import dotenv from "dotenv";
dotenv.config();
// for LLM -Chat Call.
const endpoint = process.env.AZURE_OPENAI_ENDPOINT;
const apiKey = process.env.AZURE_OPENAI_API_KEY;
const deploymentName = "gpt-4o-mini";
const apiVersion = "2025-01-01-preview";
const options = { endpoint, apiKey, deploymentName, apiVersion };

const openai = new AzureOpenAI(options);


export default openai;
