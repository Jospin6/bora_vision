// auth.ts
import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import  prisma  from "../../prisma/prisma";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { loginSchema, signupSchema } from "@/validators/auth"; // Validation Zod

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Credentials({
      id: "credentials",
      name: "Email/Mot de passe",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Mot de passe", type: "password" },
        isSignUp: { type: "hidden" } // Pour différencier login/signup
      },
      async authorize(credentials) {
        try {
          // 1. Validation des données
          const { email, password, isSignUp } = credentials;
          
          if (isSignUp === "true") {
            const parsed = signupSchema.parse({ email, password });
            // 2. Inscription
            const existingUser = await prisma.user.findUnique({
              where: { email: parsed.email }
            });
            if (existingUser) throw new Error("Email déjà utilisé");

            const hashedPassword = await bcrypt.hash(parsed.password, 12);
            const newUser = await prisma.user.create({
              data: {
                email: parsed.email,
                password: hashedPassword,
                // Ajoutez d'autres champs si nécessaire
              }
            });
            return newUser;
          } else {
            // 3. Connexion
            const parsed = loginSchema.parse({ email, password });
            const user = await prisma.user.findUnique({
              where: { email: parsed.email }
            });
            if (!user?.password) return null;

            const isValid = await bcrypt.compare(parsed.password, user.password);
            if (!isValid) return null;

            return user;
          }
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id as string;
      session.user.email = token.email as string;
      return session;
    }
  },
  session: {
    strategy: "jwt"
  },
  pages: {
    signIn: "/connexion"
  },
  secret: process.env.AUTH_SECRET
});