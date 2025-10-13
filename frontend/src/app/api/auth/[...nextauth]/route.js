import axios from "axios";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";

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
          return {
            id: "1", // This will be replaced with actual user ID
            email: email,
            name: name || email.split("@")[0],
          };
        } catch (error) {
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

          const data = await response.data.data;

          if (response.data.status === "success") {
            user.id = data.user.id.toString();
            return true;
          }
        } catch (error) {
          // OAuth signin error - could log to monitoring service
        }
      }

      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth",
  },
  session: {
    strategy: "jwt",
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
