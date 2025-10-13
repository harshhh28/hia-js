import { useSession } from "next-auth/react";
import { refreshAccessToken } from "../utils/api";

export const useTokenRefresh = () => {
  const { data: session, update } = useSession();

  const refreshToken = async () => {
    try {
      const result = await refreshAccessToken();

      if (result.success) {
        // Update the NextAuth session with new tokens
        await update({
          accessToken: result.accessToken,
          refreshToken: result.refreshToken,
        });
        return { success: true };
      } else {
        return { success: false, error: result.error };
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  return { refreshToken };
};
