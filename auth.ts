import NextAuth from "next-auth";
import type { Session } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { getUserByEmail, verifyPassword } from "@/lib/db";

export const { handlers, signIn, signOut, auth } = NextAuth({
  // We use credentials (email + password) not OAuth
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },

      // This function runs when a user tries to log in
      // Return the user object if valid, null if invalid
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const email = credentials.email as string;
        const password = credentials.password as string;

        // Check if this is the admin logging in
        // Admin credentials come from environment variables
        if (
          email === process.env.ADMIN_EMAIL &&
          password === process.env.ADMIN_PASSWORD
        ) {
          return {
            id: "admin",
            email,
            role: "ADMIN",
            companyId: undefined,
          };
        }

        // Otherwise check the database for a company account
        const user = await getUserByEmail(email);
        if (!user?.password) return null;

        const passwordValid = await verifyPassword(password, user.password);
        if (!passwordValid) return null;

        return {
          id: user.id,
          email: user.email,
          role: user.role,
          companyId: user.company?.id,
        };
      },
    }),
  ],

  // Store session as a JWT token in a cookie
  // This means no session table needed in the database
  session: { strategy: "jwt" },

  callbacks: {
    // This runs when the JWT is created
    // We add role and companyId to the token so they're available everywhere
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.companyId = user.companyId;
      }
      return token;
    },

    // This runs when session is accessed via useSession()
    // We copy the token data into the session object
    async session({ session, token }) {
      if (token.id && token.role) {
        session.user.id = String(token.id);
        session.user.role = token.role as Session["user"]["role"];
        session.user.companyId =
          typeof token.companyId === "string" ? token.companyId : undefined;
      }
      return session;
    },
  },

  pages: {
    signIn: "/auth/login", // redirect here when login is required
  },

  secret: process.env.NEXTAUTH_SECRET,
});
