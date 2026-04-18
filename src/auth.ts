import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import prisma from "@/lib/prisma"
import Credentials from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import { authConfig } from "./auth.config"

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(prisma),
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        const email = credentials.email as string;
        const password = credentials.password as string;

        // Auto-create Master Merchant if it's the first login attempt with specific credentials
        // or ensure it exists if the email matches
        if (email === "merchant@nexus.shop") {
          const merchant = await prisma.user.findUnique({
            where: { email }
          });

          if (!merchant) {
            // Hardcoded initial setup for the Master Merchant
            const hashedPassword = await bcrypt.hash("NexusSuperSecret2026!#", 10);
            const hashedPin = await bcrypt.hash("987654", 10);
            
            await prisma.user.create({
              data: {
                email,
                name: "Master Merchant",
                password: hashedPassword,
                merchantPin: hashedPin,
                role: "merchant",
                isImmutable: true,
              }
            });
          }
        }

        const user = await prisma.user.findUnique({
          where: { email }
        })

        if (!user) {
          throw new Error("USER_NOT_FOUND")
        }

        if (!user.password) return null

        const isValid = await bcrypt.compare(password, user.password)

        if (!isValid) {
          throw new Error("INVALID_PASSWORD")
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role
        }
      }
    })
  ]
})
