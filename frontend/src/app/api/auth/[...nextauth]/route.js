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
          console.log("Auth attempt:", { email, isSignup });

          if (isSignup === "true") {
            // Handle signup
            const response = await axios.post(
              `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/signup`,
              {
                email,
                password,
                name,
              },
            );

            const data = response.data.data;
            console.log("Signup response:", response.data);

            if (response.data.status === "success") {
              console.log("Signup successful, returning user:", data.user);
              return {
                id: data.user.id.toString(),
                email: data.user.email,
                name: data.user.name,
                accessToken: data.accessToken,
              };
            } else {
              console.log("Signup failed:", response.data);
            }
          } else {
            // Handle login
            const response = await axios.post(
              `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/login`,
              {
                email,
                password,
              },
            );

            const data = response.data.data;
            console.log("Login response:", response.data);

            if (response.data.status === "success") {
              console.log("Login successful, returning user:", data.user);
              return {
                id: data.user.id.toString(),
                email: data.user.email,
                name: data.user.name,
                accessToken: data.accessToken,
              };
            } else {
              console.log("Login failed:", response.data);
            }
          }

          console.log("Auth failed - returning null");
          return null;
        } catch (error) {
          console.error("Auth error:", error);
          console.error("Error response:", error.response?.data);
          console.error("Error status:", error.response?.status);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google" || account?.provider === "github") {
        try {
          // Create or find user in our database
          const response = await axios.post(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/oauth`,
            {
              email: user.email,
              provider: account.provider,
              provider_id: account.providerAccountId,
              name: user.name,
            },
          );

          const data = await response.data.data;

          if (response.data.status === "success") {
            user.id = data.user.id.toString();
            user.accessToken = data.accessToken;
            return true;
          }
        } catch (error) {
          console.error("OAuth signin error:", error);
        }
      }

      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.accessToken = user.accessToken;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.accessToken = token.accessToken;
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
  debug: process.env.NODE_ENV === "development",
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
export { authOptions };
