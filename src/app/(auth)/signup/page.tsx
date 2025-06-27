"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import Link from "next/link"; import { useDispatch } from "react-redux";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import axios from 'axios';

const schema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Short password"),
});

type signupFormData = z.infer<typeof schema>;

export default function RegisterForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<signupFormData>({ resolver: zodResolver(schema) });

  const [error, setError] = useState("");

  const onSubmit = async (data: signupFormData) => {
    setError("");
    try {
      const response = await axios.post('/api/signup', data);
      if (!response.data.id) {
        setError("Invalid email or password");
        return;
      }
    } catch (error) {
      console.log("Error connexion :", error);
    }
    redirect("/");
  };

  return (
    <div className="md:w-[400px] w-[90%] bg-[#1a1a1a] shadow-amber-600 shadow-2xs mx-auto p-6">
      <div className="py-4">
        <div className="font-bold text-gray-200 md:text-xl text-lg flex items-center justify-start">welcome</div>
        <h2 className="md:text-2xl text-2xl font-bold mb-4 text-gray-200">signup</h2>
      </div>
      {error && <p className="text-red-500">{error}</p>}
      <form onSubmit={handleSubmit(onSubmit)}>
        <input
          className="text-white"
          type="email"
          placeholder={"Email"}
          {...register("email")}
        />
        <input
          className="text-white"
          type="password"
          placeholder={"Password"}
          {...register("password")}
        />
        <Button className="w-4/12 bg-black">{isSubmitting ? "Loading..." : `signup`}</Button>
      </form>
      <div className="mt-4 flex text-sm justify-center">
        <span className="pr-2 text-gray-300">have Signedup</span>
        <Link href="/login" className="text-blue-500 hover:underline">
          login
        </Link>
      </div>
    </div>
  );
}
