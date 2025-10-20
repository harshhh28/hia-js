import ApiResponse from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import {} from "dotenv/config";
import { User } from "../models/User.js";
import { setCookie } from "../utils/setCookie.js";
import { clearCookie } from "../utils/clearCookie.js";
import { generateTokens } from "../utils/generateTokens.js";

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

    // Generate JWT tokens
    const { accessToken, refreshToken } = generateTokens(user);
    setCookie(res, accessToken, refreshToken);

    return ApiResponse.success(
      res,
      {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
        accessToken: accessToken,
        refreshToken: refreshToken,
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

    // Generate JWT tokens
    const { accessToken, refreshToken } = generateTokens(user);
    setCookie(res, accessToken, refreshToken);

    return ApiResponse.success(
      res,
      {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
        accessToken: accessToken,
        refreshToken: refreshToken,
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

    // Generate JWT tokens
    const { accessToken, refreshToken } = generateTokens(user);
    setCookie(res, accessToken, refreshToken);

    return ApiResponse.success(
      res,
      {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          provider: user.provider,
        },
        accessToken: accessToken,
        refreshToken: refreshToken,
      },
      "OAuth user authenticated successfully"
    );
  } catch (error) {
    console.error("OAuth user error:", error);
    return ApiResponse.serverError(res, "Failed to authenticate OAuth user");
  }
};

// Get user by ID
const handleGetUserById = async (req, res) => {
  try {
    const { id } = req.user;
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
const handleGetAllUsers = async (req, res) => {
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

// Refresh access token
const handleRefreshToken = async (req, res) => {
  try {
    // Check for refresh token in cookies first, then in Authorization header
    const refreshToken =
      req.cookies?.refreshToken ||
      (req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer ")
        ? req.headers.authorization.substring(7)
        : null);

    if (!refreshToken) {
      return ApiResponse.error(res, "Refresh token required", 401);
    }

    // Basic token format validation
    if (
      typeof refreshToken !== "string" ||
      refreshToken.split(".").length !== 3
    ) {
      console.error(
        "Malformed refresh token received:",
        refreshToken.substring(0, 20) + "..."
      );
      return ApiResponse.error(res, "Invalid refresh token format", 401);
    }

    try {
      const decoded = jwt.verify(refreshToken, JWT_SECRET);
      const user = await User.findById(decoded.data.id);

      if (!user) {
        return ApiResponse.error(res, "User not found", 404);
      }

      // Generate new tokens
      const { accessToken, refreshToken: newRefreshToken } =
        generateTokens(user);
      setCookie(res, accessToken, newRefreshToken);

      return ApiResponse.success(
        res,
        {
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
          },
          accessToken: accessToken,
          refreshToken: newRefreshToken,
        },
        "Token refreshed successfully"
      );
    } catch (error) {
      console.error("JWT verification error:", error);
      if (error.name === "TokenExpiredError") {
        return ApiResponse.error(res, "Refresh token expired", 401);
      } else if (error.name === "JsonWebTokenError") {
        return ApiResponse.error(res, "Invalid refresh token format", 401);
      }
      return ApiResponse.error(res, "Invalid refresh token", 401);
    }
  } catch (error) {
    console.error("Refresh token error:", error);
    return ApiResponse.serverError(res, "Failed to refresh token");
  }
};

// Logout user
const handleLogout = async (req, res) => {
  if (!req.user) {
    return ApiResponse.error(res, "User not found", 404);
  }
  try {
    clearCookie(res);
    return ApiResponse.success(res, null, "Logged out successfully");
  } catch (error) {
    console.error("Logout error:", error);
    return ApiResponse.serverError(res, "Failed to logout");
  }
};

// Delete user by ID
const handleDeleteUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.delete(parseInt(id));
    if (!user) {
      return ApiResponse.error(res, "User not found", 404);
    }
    clearCookie(res); // Clear cookies when user is deleted
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
  handleGetUserById,
  handleGetAllUsers,
  handleDeleteUserById,
  handleRefreshToken,
  handleLogout,
};
