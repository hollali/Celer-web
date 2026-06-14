"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSignUp } from "@clerk/nextjs";
import Image from "next/image";
import { Mail, Lock, User, Eye, EyeOff, CheckCircle } from "lucide-react";
import Button from "@/components/ui/button";
import InputField from "@/components/ui/input-field";
import GoogleOAuth from "@/components/ui/oauth";
import { fetchAPI } from "@/lib/fetch";

export default function SignUpPage() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showVerification, setShowVerification] = useState(false);
  const [code, setCode] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded) return;

    setLoading(true);
    setError("");

    try {
      await signUp.create({
        firstName: name,
        emailAddress: email,
        password,
      });

      await signUp.prepareEmailAddressVerification({
        strategy: "email_code",
      });

      setShowVerification(true);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to sign up";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded) return;

    setVerifying(true);
    setError("");

    try {
      const result = await signUp.attemptEmailAddressVerification({
        code,
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });

        await fetchAPI("/api/user", {
          method: "POST",
          body: JSON.stringify({
            name,
            email,
            clerkId: result.createdUserId,
          }),
        });

        setShowVerification(false);
        setShowSuccess(true);
      }
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Verification failed";
      setError(message);
    } finally {
      setVerifying(false);
    }
  };

  if (showSuccess) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center px-6">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 rounded-full bg-success-100 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-10 w-10 text-success-500" />
          </div>
          <h2 className="font-JakartaBold text-2xl text-secondary-900 mb-2">
            Account Created!
          </h2>
          <p className="font-Jakarta text-secondary-500 mb-8">
            Your account has been created successfully.
          </p>
          <Button
            onClick={() => router.push("/home")}
            className="w-full"
            size="lg"
          >
            Continue to Home
          </Button>
        </div>
      </div>
    );
  }

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
            Create Account
          </h1>
          <p className="font-Jakarta text-secondary-500">
            Sign up to get started with Celer
          </p>
        </div>

        {showVerification ? (
          <form onSubmit={handleVerify} className="space-y-4">
            <p className="font-Jakarta text-sm text-secondary-500 text-center mb-4">
              Enter the verification code sent to{" "}
              <span className="font-JakartaSemiBold text-secondary-900">
                {email}
              </span>
            </p>

            <InputField
              label="Verification Code"
              placeholder="Enter 6-digit code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
            />

            {error && (
              <p className="font-Jakarta text-sm text-danger-600 text-center">
                {error}
              </p>
            )}

            <Button
              type="submit"
              loading={verifying}
              className="w-full"
              size="lg"
            >
              Verify Email
            </Button>
          </form>
        ) : (
          <form onSubmit={handleSignUp} className="space-y-4">
            <InputField
              label="Full Name"
              type="text"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              icon={<User className="h-5 w-5" />}
              required
            />

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
                placeholder="Create a password"
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

            <Button
              type="submit"
              loading={loading}
              className="w-full"
              size="lg"
            >
              Create Account
            </Button>
          </form>
        )}

        {!showVerification && (
          <>
            <div className="my-6 flex items-center gap-4">
              <div className="flex-1 h-px bg-general-100 dark:bg-general-100/50" />
              <span className="font-Jakarta text-sm text-secondary-500">
                or
              </span>
              <div className="flex-1 h-px bg-general-100 dark:bg-general-100/50" />
            </div>
            <GoogleOAuth />
          </>
        )}

        <p className="mt-6 text-center font-Jakarta text-sm text-secondary-500">
          Already have an account?{" "}
          <button
            onClick={() => router.push("/sign-in")}
            className="font-JakartaSemiBold text-primary-500"
          >
            Sign In
          </button>
        </p>
      </div>
    </div>
  );
}
