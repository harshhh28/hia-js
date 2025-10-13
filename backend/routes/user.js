import express from "express";
import {
  handleUserSignup,
  handleUserLogin,
  handleOAuthUser,
  handleGetUserById,
  handleGetAllUsers,
  handleDeleteUserById,
  handleRefreshToken,
  handleLogout,
} from "../controllers/user.js";
import { verifyUserToken, verifyAdminToken } from "../middlewares/index.js";

const router = express.Router();

// Public routes
router.post("/signup", handleUserSignup);
router.post("/login", handleUserLogin);
router.post("/oauth", handleOAuthUser);
router.post("/refresh", handleRefreshToken);
router.post("/logout", handleLogout);

// Protected routes
router
  .route("/:id")
  .get(verifyUserToken, handleGetUserById)
  .delete(verifyUserToken, handleDeleteUserById);

// Admin-only routes
router.get("/", verifyAdminToken, handleGetAllUsers);

export default router;
