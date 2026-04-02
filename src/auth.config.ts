import type { NextAuthConfig } from "next-auth"

export const authConfig = {
  providers: [], // Providers will be added in auth.ts
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        Object.assign(session.user, {
          role: token.role,
          id: token.id
        });
      }
      return session
    }
  },
  session: {
    strategy: "jwt"
  },
  pages: {
    signIn: "/auth/signin"
  }
} satisfies NextAuthConfig
