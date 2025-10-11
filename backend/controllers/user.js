import ApiResponse from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import {} from "dotenv/config";
import { User } from "../models/User.js";

const JWT_SECRET = process.env.JWT_SECRET;

// Email/Password Signup
const handleUserSignup = async (req, res) => {
  try {
    const { email, password, name } = req.body;

    // Check if user already exists
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return ApiResponse.error(res, "User with this email already exists", 400);
    }

    // Hash password
    const saltRounds = 10;
    const password_hash = await bcrypt.hash(password, saltRounds);

    // Create new user
    const user = await User.create({
      email,
      password_hash,
      name,
      provider: "email",
      provider_id: null,
    });

    // Generate JWT token
    const token = jwt.sign(
      {
        exp: Math.floor(Date.now() / 1000) + 60 * 60, // 1 hour expiration
        data: { id: user.id, email: user.email, name: user.name },
      },
      JWT_SECRET,
      { algorithm: "HS256" }
    );

    return ApiResponse.success(
      res,
      {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
        token: token,
      },
      "User signed up successfully"
    );
  } catch (error) {
    console.error("Signup error:", error);
    return ApiResponse.serverError(res, "Failed to sign up user");
  }
};

// Email/Password Login
const handleUserLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findByEmail(email);
    if (!user) {
      return ApiResponse.error(res, "Invalid credentials", 401);
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      return ApiResponse.error(res, "Invalid credentials", 401);
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        exp: Math.floor(Date.now() / 1000) + 60 * 60, // 1 hour expiration
        data: { id: user.id, email: user.email, name: user.name },
      },
      JWT_SECRET,
      { algorithm: "HS256" }
    );

    return ApiResponse.success(
      res,
      {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
        token: token,
      },
      "User logged in successfully"
    );
  } catch (error) {
    console.error("Login error:", error);
    return ApiResponse.serverError(res, "Failed to log in user");
  }
};

// OAuth User Creation/Login (for NextAuth)
const handleOAuthUser = async (req, res) => {
  try {
    const { email, provider, provider_id, name } = req.body;

    // Check if user exists with this provider_id
    let user = await User.findByProviderId(provider, provider_id);

    if (!user) {
      // Check if user exists with same email but different provider
      const existingUser = await User.findByEmail(email);
      if (existingUser) {
        return ApiResponse.error(
          res,
          "User with this email already exists with different provider",
          400
        );
      }

      // Create new OAuth user
      user = await User.create({
        email,
        provider,
        provider_id,
        name,
        password_hash: null,
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        exp: Math.floor(Date.now() / 1000) + 60 * 60, // 1 hour expiration
        data: { id: user.id, email: user.email, name: user.name },
      },
      JWT_SECRET,
      { algorithm: "HS256" }
    );

    return ApiResponse.success(
      res,
      {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          provider: user.provider,
        },
        token: token,
      },
      "OAuth user authenticated successfully"
    );
  } catch (error) {
    console.error("OAuth user error:", error);
    return ApiResponse.serverError(res, "Failed to authenticate OAuth user");
  }
};

// Get user by ID
const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    if (!user) {
      return ApiResponse.error(res, "User not found", 404);
    }

    return ApiResponse.success(
      res,
      {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          provider: user.provider,
          created_at: user.created_at,
        },
      },
      "User retrieved successfully"
    );
  } catch (error) {
    console.error("Get user error:", error);
    return ApiResponse.serverError(res, "Failed to get user");
  }
};

// Get all users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.getAll();
    if (!users) {
      return ApiResponse.error(res, "No users found", 404);
    }
    return ApiResponse.success(res, users, "Users retrieved successfully");
  } catch (error) {
    console.error("Get all users error:", error);
    return ApiResponse.serverError(res, "Failed to get all users");
  }
};

// Delete user by ID
const deleteUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.delete(id);
    if (!user) {
      return ApiResponse.error(res, "User not found", 404);
    }
    return ApiResponse.success(res, user, "User deleted successfully");
  } catch (error) {
    console.error("Delete user error:", error);
    return ApiResponse.serverError(res, "Failed to delete user");
  }
};

export {
  handleUserSignup,
  handleUserLogin,
  handleOAuthUser,
  getUserById,
  getAllUsers,
  deleteUserById,
};
