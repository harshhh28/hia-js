import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";

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

          if (isSignup === "true") {
            // Handle signup
            const response = await fetch(
              `${process.env.BACKEND_URL}/api/users/signup`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password, name }),
              }
            );

            const data = await response.json();

            if (data.success) {
              return {
                id: data.data.user.id.toString(),
                email: data.data.user.email,
                name: data.data.user.name,
                token: data.data.token,
              };
            }
          } else {
            // Handle login
            const response = await fetch(
              `${process.env.BACKEND_URL}/api/users/login`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
              }
            );

            const data = await response.json();

            if (data.success) {
              return {
                id: data.data.user.id.toString(),
                email: data.data.user.email,
                name: data.data.user.name,
                token: data.data.token,
              };
            }
          }

          return null;
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "google" || account?.provider === "github") {
        try {
          // Create or find user in our database
          const response = await fetch(
            `${process.env.BACKEND_URL}/api/users/oauth`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                email: user.email,
                provider: account.provider,
                provider_id: account.providerAccountId,
                name: user.name,
              }),
            }
          );

          const data = await response.json();

          if (data.success) {
            user.id = data.data.user.id.toString();
            user.token = data.data.token;
            return true;
          }
        } catch (error) {
          console.error("OAuth signin error:", error);
        }
      }

      return true;
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
        token.token = user.token;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.token = token.token;
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
