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
          const refreshResult = await refreshAccessToken();

          if (refreshResult.success) {
            // Update the session with new token
            await update({
              user: {
                ...session.user,
                ...refreshResult.user,
              },
            });
          }
        }
      } catch (error) {
        // Token refresh check error - could log to monitoring service
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
  }, [session?.accessToken, update]);

  return {
    isRefreshing: false, // Could add state for this if needed
  };
};

export default useTokenRefresh;
