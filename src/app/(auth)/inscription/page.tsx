// app/inscription/page.tsx
"use client";
import { AuthForm } from "@/components/AuthForm"

export default function SignUpPage() {
  return (
    <div>
      <h1>Inscription</h1>
      <AuthForm isSignUp />
    </div>
  );
}