import { getSession } from "next-auth/react";

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
      Authorization: session ? `Bearer ${session.accessToken}` : "",
    },
  };
};
