// import { PrismaAdapter } from "@auth/prisma-adapter";
// import Credentials from "@auth/core/providers/credentials";
// import  prisma  from "../../prisma/prisma";
// import bcrypt from "bcryptjs";

// export const authConfig = {
//   adapter: PrismaAdapter(prisma),
//   providers: [
//     Credentials({
//       name: "Credentials",
//       credentials: {
//         email: { label: "Email", type: "text" },
//         password: { label: "Password", type: "password" },
//       },
//       async authorize(credentials) {
//         if (!credentials?.email || !credentials?.password) return null;

//         const user = await prisma.user.findUnique({
//           where: { email: credentials.email },
//         });

//         if (!user || !user.password) return null;

//         const valid = await bcrypt.compare(credentials.password, user.password);

//         return valid ? user : null;
//       },
//     }),
//   ],
//    session: {
//     strategy: "jwt", // <-- ici, TS doit comprendre que c’est bien le littéral "jwt"
//   } as const,
//   secret: process.env.AUTH_SECRET,
//   pages: {
//     signIn: "/login",
//   },
// };

export const hashPassword = (password: string): string => {

    return ""
}

export const verifyPassword = (currentPassword: string, password: string): boolean => {
    return false
}
