import axios from "axios";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";

async function refreshAccessToken(token) {
  try {
    console.log("Attempting to refresh token...");
    console.log("Refresh token exists:", !!token.refreshToken);

    if (!token.refreshToken) {
      console.log("No refresh token available");
      return {
        ...token,
        error: "RefreshAccessTokenError",
        accessToken: null,
        refreshToken: null,
      };
    }

    // Basic token format validation
    if (
      typeof token.refreshToken !== "string" ||
      token.refreshToken.split(".").length !== 3
    ) {
      console.log("Malformed refresh token detected, clearing session");
      return {
        ...token,
        error: "RefreshAccessTokenError",
        accessToken: null,
        refreshToken: null,
      };
    }

    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/refresh`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token.refreshToken}`,
        },
      }
    );

    console.log("Token refresh successful");
    const refreshedTokens = response.data.data;

    return {
      ...token,
      accessToken: refreshedTokens.accessToken,
      refreshToken: refreshedTokens.refreshToken ?? token.refreshToken, // Fall back to old refresh token
      accessTokenExpires: Date.now() + 15 * 60 * 1000, // 15 minutes
    };
  } catch (error) {
    console.error("Error refreshing access token:", error);
    console.error("Error status:", error.response?.status);
    console.error("Error message:", error.response?.data?.message);

    // If refresh token is expired or invalid, clear the session
    if (error.response?.status === 401) {
      console.log("Refresh token is invalid/expired, clearing session");
      return {
        ...token,
        error: "RefreshAccessTokenError",
        accessToken: null,
        refreshToken: null,
      };
    }

    return {
      ...token,
      error: "RefreshAccessTokenError",
    };
  }
}

const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        name: { label: "Name", type: "text" },
        isSignup: { label: "Is Signup", type: "text" },
      },
      async authorize(credentials) {
        try {
          const { email, password, name, isSignup } = credentials;

          console.log("Credentials provider called with:", {
            email,
            name,
            isSignup,
          });

          // Create axios instance with credentials to handle cookies
          const authClient = axios.create({
            baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
            withCredentials: true,
            timeout: 10000,
          });

          if (isSignup === "true") {
            // Handle signup
            const response = await authClient.post("/api/users/signup", {
              email,
              password,
              name,
            });

            if (response.data.status === "success") {
              console.log(
                "Signup successful, user data:",
                response.data.data.user
              );
              return {
                id: response.data.data.user.id.toString(),
                email: response.data.data.user.email,
                name: response.data.data.user.name,
                accessToken: response.data.data.accessToken,
                refreshToken: response.data.data.refreshToken,
              };
            } else {
              console.error("Signup failed:", response.data.message);
              return null;
            }
          } else {
            // Handle login
            const response = await authClient.post("/api/users/login", {
              email,
              password,
            });

            if (response.data.status === "success") {
              console.log(
                "Login successful, user data:",
                response.data.data.user
              );
              return {
                id: response.data.data.user.id.toString(),
                email: response.data.data.user.email,
                name: response.data.data.user.name,
                accessToken: response.data.data.accessToken,
                refreshToken: response.data.data.refreshToken,
              };
            } else {
              console.error("Login failed:", response.data.message);
              return null;
            }
          }
        } catch (error) {
          console.error("Credentials authentication error:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google" || account?.provider === "github") {
        try {
          // Create axios instance with credentials to handle cookies
          const authClient = axios.create({
            baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
            withCredentials: true,
            timeout: 10000,
          });

          // Create or find user in our database
          const response = await authClient.post("/api/users/oauth", {
            email: user.email,
            provider: account.provider,
            provider_id: account.providerAccountId,
            name: user.name,
          });

          if (response.data.status === "success") {
            user.id = response.data.data.user.id.toString();
            // Store the tokens in the user object so we can access them later
            user.accessToken = response.data.data.accessToken;
            user.refreshToken = response.data.data.refreshToken;
            return true;
          } else {
            console.error("OAuth backend response failed:", response.data);
            return false;
          }
        } catch (error) {
          console.error("OAuth signin error:", error);
          return false;
        }
      }

      return true;
    },
    async jwt({ token, user, account }) {
      // Initial sign in
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
        token.accessTokenExpires = Date.now() + 15 * 60 * 1000; // 15 minutes
        return token;
      }

      // If there's already an error, don't try to refresh
      if (token.error === "RefreshAccessTokenError") {
        return token;
      }

      // Return previous token if the access token has not expired yet
      if (Date.now() < token.accessTokenExpires) {
        return token;
      }

      // Access token has expired, try to update it
      return await refreshAccessToken(token);
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.email = token.email;
        session.user.name = token.name;
        session.accessToken = token.accessToken;
        session.refreshToken = token.refreshToken;

        // If there's a token error or tokens are null, clear the session
        if (token.error === "RefreshAccessTokenError" || !token.accessToken) {
          session.accessToken = null;
          session.refreshToken = null;
          session.user = null;
        }
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth",
  },
  session: {
    strategy: "jwt",
    maxAge: 15 * 60, // 15 minutes
  },
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: true,
      },
    },
  },
  // debug: process.env.NODE_ENV === "development", // Set to false in production
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
export { authOptions };
