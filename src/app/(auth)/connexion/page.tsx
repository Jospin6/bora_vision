// app/connexion/page.tsx
"use client";
import { AuthForm } from "@/components/AuthForm";

export default function SignInPage() {
  return (
    <div>
      <h1>Connexion</h1>
      <AuthForm />
    </div>
  );
}