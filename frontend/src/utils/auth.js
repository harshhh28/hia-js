import { getSession, signOut } from "next-auth/react";
import { logoutUser } from "./api";

export const checkAuth = async () => {
  const session = await getSession();
  return {
    isAuthenticated: !!session,
    session,
  };
};

export const getAuthHeaders = async () => {
  const session = await getSession();
  return {
    headers: {
      Authorization: session?.accessToken
        ? `Bearer ${session.accessToken}`
        : "",
    },
  };
};

// Enhanced logout function that calls backend
export const handleLogout = async () => {
  try {
    // Call backend logout to clear cookies
    const result = await logoutUser();

    if (result.success) {
      console.log("Backend logout successful");
    } else {
      console.warn("Backend logout failed:", result.error);
      // Continue with frontend logout even if backend fails
    }
  } catch (error) {
    console.error("Backend logout error:", error);
    // Continue with frontend logout even if backend fails
  }

  // Sign out from NextAuth
  await signOut({ callbackUrl: "/auth" });
};

// Check if access token is expired (basic check)
export const isTokenExpired = (token) => {
  if (!token) return true;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const currentTime = Date.now() / 1000;
    return payload.exp < currentTime;
  } catch (_error) {
    return true;
  }
};
