import bcrypt from "bcryptjs";
import { NextResponse, NextRequest } from "next/server";
import prisma from "../../../../prisma/prisma";
import { cookies } from "next/headers";
import { generateToken } from "@/lib/utils";

<<<<<<< HEAD

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    });

    const token = await generateToken(user);
    const response = NextResponse.json(user, { status: 200 });

=======
export async function POST(req: NextRequest) {
  try {
    const { email, password, username, firstName, lastName } = await req.json();

    // Validation des champs requis
    if (!email || !password || !username) {
      return NextResponse.json(
        { message: "Email, mot de passe et nom d'utilisateur sont requis" },
        { status: 400 }
      );
    }

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email },
          { username }
        ]
      }
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "Un utilisateur avec cet email ou nom d'utilisateur existe déjà" },
        { status: 400 }
      );
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Créer l'utilisateur
    const user = await prisma.user.create({
      data: {
        email,
        username,
        password: hashedPassword,
        firstName: firstName || null,
        lastName: lastName || null,
      },
    });

    // Générer le token
    const token = await generateToken(user);
    
    // Créer la réponse
    const response = NextResponse.json(
      {
        id: user.id,
        email: user.email,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role
      },
      { status: 201 }
    );

    // Définir le cookie
>>>>>>> 313a75d (front login and signup)
    (await cookies()).set("token_bora_vision", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
<<<<<<< HEAD
      maxAge: 100 * 365 * 24 * 60 * 60,
    });
    return response;
  } catch (error) {
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
=======
      maxAge: 100 * 365 * 24 * 60 * 60, // 100 ans
    });

    return response;
  } catch (error) {
    console.error("Erreur lors de l'inscription:", error);
    return NextResponse.json(
      { message: "Erreur interne du serveur" },
      { status: 500 }
    );
>>>>>>> 313a75d (front login and signup)
  }
}