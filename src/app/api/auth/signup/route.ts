import bcrypt from "bcryptjs";
import { NextResponse, NextRequest } from "next/server";
import prisma from "../../../../../prisma/prisma";
import { cookies } from "next/headers";
import { generateToken } from "@/lib/utils";


export async function POST(req: NextRequest) {
  const { email, password } = await req.json();

  const userName = email.split("@")[0]

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        username: userName,
      },
    });

    const token = await generateToken(user);
    const response = NextResponse.json(user, { status: 200 });

    (await cookies()).set("boravision", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 100 * 365 * 24 * 60 * 60,
    });
    return response;
  } catch (error) {
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}