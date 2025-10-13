import { useSession } from "next-auth/react";
import { useEffect, useRef } from "react";
import { refreshAccessToken } from "../utils/api";

// Custom hook for automatic token refresh
export const useTokenRefresh = () => {
  const { data: session, update } = useSession();
  const refreshIntervalRef = useRef(null);

  useEffect(() => {
    if (!session?.accessToken) return;

    // Check if token is expired or will expire soon (within 5 minutes)
    const checkAndRefreshToken = async () => {
      try {
        const payload = JSON.parse(atob(session.accessToken.split(".")[1]));
        const currentTime = Date.now() / 1000;
        const timeUntilExpiry = payload.exp - currentTime;

        // If token expires within 5 minutes, refresh it
        if (timeUntilExpiry < 300) {
          console.log("Token expiring soon, refreshing...");
          const refreshResult = await refreshAccessToken();

          if (refreshResult.success) {
            // Update the session with new token
            await update({
              ...session,
              accessToken: refreshResult.accessToken,
            });
            console.log("Token refreshed successfully");
          } else {
            console.error("Token refresh failed:", refreshResult.error);
            // Could redirect to login here if needed
          }
        }
      } catch (error) {
        console.error("Token refresh check error:", error);
      }
    };

    // Check token every minute
    refreshIntervalRef.current = setInterval(checkAndRefreshToken, 60000);

    // Initial check
    checkAndRefreshToken();

    return () => {
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
      }
    };
  }, [session?.accessToken, update, session]);

  return {
    isRefreshing: false, // Could add state for this if needed
  };
};

export default useTokenRefresh;
