import express from "express";
import {
  handleUserSignup,
  handleUserLogin,
  handleOAuthUser,
  getUserById,
  getAllUsers,
  deleteUserById,
} from "../controllers/user.js";

const router = express.Router();

router.post("/signup", handleUserSignup);
router.post("/login", handleUserLogin);
router.post("/oauth", handleOAuthUser);
router.route("/:id").get(getUserById).delete(deleteUserById);
router.get("/", getAllUsers);

export default router;
