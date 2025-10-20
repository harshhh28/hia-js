import express from "express";
import { handleGroqResponse } from "../controllers/groq.js";
import verifyUserToken from "../middlewares/verifyUserToken.js";

const router = express.Router();

router.post("/response", verifyUserToken, handleGroqResponse);

export default router;
