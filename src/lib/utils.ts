import { clsx, type ClassValue } from "clsx"
import { SignJWT } from "jose";
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const secret = new TextEncoder().encode(process.env.JWT_SECRET || "secret_key");

export async function generateToken(user: any) {
  const token = await new SignJWT({
    id: user.id,
    email: user.email,
    role: user.role,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(100 * 365 * 24 * 60 * 60)
    .sign(secret);

  return token;
}
