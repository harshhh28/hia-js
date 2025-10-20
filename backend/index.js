import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import {} from "dotenv/config";
import { User } from "./models/User.js";
import { ChatSession } from "./models/ChatSession.js";
import { ChatMessage } from "./models/ChatMessage.js";
import { MedicalReport } from "./models/MedicalReport.js";
import { VectorEmbedding } from "./models/VectorEmbedding.js";
import userRoutes from "./routes/user.js";
import chatSessionRoutes from "./routes/chatSession.js";
import chatMessageRoutes from "./routes/chatMessage.js";
import medicalReportRoutes from "./routes/medicalReport.js";
import docsRoutes from "./routes/docs.js";
import groqRoutes from "./routes/groq.js";

const app = express();

// CORS configuration
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true, // Allow cookies to be sent
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/users", userRoutes);
app.use("/api/chat-sessions", chatSessionRoutes);
app.use("/api/chat-messages", chatMessageRoutes);
app.use("/api/medical-reports", medicalReportRoutes);
app.use("/api/docs", docsRoutes);
app.use("/api/groq", groqRoutes);

app.listen(process.env.PORT, async () => {
  console.log(`Server is running on http://localhost:${process.env.PORT}`);

  try {
    await User.createTable();
    await ChatSession.createTable();
    await ChatMessage.createTable();
    await MedicalReport.createTable();
    await VectorEmbedding.createTable();
    console.log("All database tables initialized successfully");
  } catch (error) {
    console.error("Error initializing database tables:", error);
  }
});
