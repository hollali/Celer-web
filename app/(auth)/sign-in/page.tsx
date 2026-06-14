"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSignIn } from "@clerk/nextjs";
import Image from "next/image";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import Button from "@/components/ui/button";
import InputField from "@/components/ui/input-field";
import GoogleOAuth from "@/components/ui/oauth";

export default function SignInPage() {
  const { isLoaded, signIn, setActive } = useSignIn();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded) return;

    setLoading(true);
    setError("");

    try {
      const result = await signIn.create({
        identifier: email,
        password,
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        router.push("/home");
      }
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to sign in";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <Image
            src="/signup-car.png"
            alt="Celer"
            width={120}
            height={120}
            className="mx-auto mb-6"
          />
          <h1 className="font-JakartaBold text-3xl text-secondary-900 mb-2">
            Welcome Back
          </h1>
          <p className="font-Jakarta text-secondary-500">
            Sign in to continue with Celer
          </p>
        </div>

        <form onSubmit={handleSignIn} className="space-y-4">
          <InputField
            label="Email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            icon={<Mail className="h-5 w-5" />}
            required
          />

          <div className="relative">
            <InputField
              label="Password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              icon={<Lock className="h-5 w-5" />}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-[42px] text-general-200"
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>

          {error && (
            <p className="font-Jakarta text-sm text-danger-600 text-center">
              {error}
            </p>
          )}

          <Button type="submit" loading={loading} className="w-full" size="lg">
            Sign In
          </Button>
        </form>

        <div className="my-6 flex items-center gap-4">
          <div className="flex-1 h-px bg-general-100" />
          <span className="font-Jakarta text-sm text-secondary-500">or</span>
          <div className="flex-1 h-px bg-general-100" />
        </div>

        <GoogleOAuth />

        <p className="mt-6 text-center font-Jakarta text-sm text-secondary-500">
          Don&apos;t have an account?{" "}
          <button
            onClick={() => router.push("/sign-up")}
            className="font-JakartaSemiBold text-primary-500"
          >
            Sign Up
          </button>
        </p>
      </div>
    </div>
  );
}
