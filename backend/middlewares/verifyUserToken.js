import jwt from "jsonwebtoken";
import ApiResponse from "../utils/ApiResponse.js";
import {} from "dotenv/config";

const JWT_SECRET = process.env.JWT_SECRET;

export default function verifyUserToken(req, res, next) {
  // Check for access token in cookies first, then in Authorization header
  const accessToken =
    req.cookies?.accessToken ||
    (req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
      ? req.headers.authorization.substring(7)
      : null);

  if (!accessToken) {
    return ApiResponse.error(res, "Access token required", 401);
  }

  try {
    const decoded = jwt.verify(accessToken, JWT_SECRET);
    req.user = decoded.data;
    next();
  } catch (error) {
    // If access token is expired, try to refresh using refresh token
    if (error.name === "TokenExpiredError") {
      return ApiResponse.error(res, "Access token expired", 401);
    }
    return ApiResponse.error(res, "Invalid access token", 401);
  }
}
