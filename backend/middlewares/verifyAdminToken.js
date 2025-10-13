import ApiResponse from "../utils/ApiResponse.js";
import {} from "dotenv/config";

export default function verifyAdminToken(req, res, next) {
  const adminToken = req.headers.authorization?.replace("Bearer ", "");

  if (!adminToken) {
    return ApiResponse.error(res, "Admin token required", 401);
  }

  const expectedAdminToken = process.env.ADMIN_TOKEN;

  if (!expectedAdminToken) {
    console.error("ADMIN_TOKEN not configured in environment variables");
    return ApiResponse.error(res, "Admin authentication not configured", 500);
  }

  if (adminToken !== expectedAdminToken) {
    return ApiResponse.error(res, "Invalid admin token", 403);
  }

  // Add admin flag to request for potential use in controllers
  req.isAdmin = true;
  next();
}
