import express from "express";
import {} from "dotenv/config";
import userRoutes from "./routes/user.js";
import { User } from "./models/User.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize database
User.createTable();

app.use("/api/users", userRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Server is running on http://localhost:${process.env.PORT}`);
});
