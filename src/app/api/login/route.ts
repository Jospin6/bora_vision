import bcrypt from "bcryptjs";
import { NextResponse, NextRequest } from "next/server";
import prisma from "../../../../prisma/prisma";
import { cookies } from "next/headers";
import { generateToken } from "@/lib/utils";

export async function POST(req: NextRequest) {
<<<<<<< HEAD
  const { email, password } = await req.json();
  const user = await prisma.user.findUnique({
    where: { email },
  })

  if (!user) {
    return NextResponse.json({ message: "Utilisateur non trouvé" }, { status: 400 });
  }

  if (!user.password) {
    return NextResponse.json({ message: "Mot de passe non défini" }, { status: 400 });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password)

  if (!isPasswordValid) {
    throw new Error('Mot de passe incorrect')
  }

  const token = await generateToken(user);
  
  const response = NextResponse.json(user, { status: 200 });
  
  (await cookies()).set("token_bora_vision", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 100 * 365 * 24 * 60 * 60, 
  });
  return response;
=======
  try {
    const { email, password } = await req.json();

    // Validation des champs requis
    if (!email || !password) {
      return NextResponse.json(
        { message: "Email et mot de passe sont requis" },
        { status: 400 }
      );
    }

    // Rechercher l'utilisateur
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        { message: "Utilisateur non trouvé" },
        { status: 400 }
      );
    }

    if (!user.password) {
      return NextResponse.json(
        { message: "Mot de passe non défini" },
        { status: 400 }
      );
    }

    // Vérifier le mot de passe
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { message: "Mot de passe incorrect" },
        { status: 400 }
      );
    }

    // Mettre à jour la dernière connexion
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() }
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
      { status: 200 }
    );
    
    // Définir le cookie
    (await cookies()).set("token_bora_vision", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 100 * 365 * 24 * 60 * 60, // 100 ans
    });

    return response;
  } catch (error) {
    console.error("Erreur lors de la connexion:", error);
    return NextResponse.json(
      { message: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
>>>>>>> 313a75d (front login and signup)
}