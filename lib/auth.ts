import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "./prisma";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) return null;

        const user = await prisma.user.findUnique({
          where: { username: credentials.username },
          include: { permissions: true },
        });
        if (!user) return null;

        const valid = await bcrypt.compare(credentials.password, user.passwordHash);
        if (!valid) return null;

         return {
          id: user.id,
          name: user.username,
          displayName: user.displayName || user.username,
          role: user.role,
          permissions: user.permissions.map((p) => p.feature),
        } as any;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role;
        token.permissions = (user as any).permissions;
        token.displayName = (user as any).displayName;
      }
      return token;
    },
    async session({ session, token }) {
      (session.user as any).role = token.role;
      (session.user as any).permissions = token.permissions;
      (session.user as any).id = token.sub;
      (session.user as any).displayName = token.displayName;
      return session;
    },
  },
};
