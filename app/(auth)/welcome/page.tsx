"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Button from "@/components/ui/button";

const slides = [
  {
    id: 1,
    title: "Welcome to Celer",
    description:
      "Your reliable ride-hailing partner. Fast, safe, and affordable rides across Ghana.",
    image: "/onboarding1.png",
  },
  {
    id: 2,
    title: "Fast & Reliable",
    description:
      "Get matched with nearby drivers in seconds. Track your ride in real-time.",
    image: "/onboarding2.png",
  },
  {
    id: 3,
    title: "Safe & Secure",
    description:
      "All drivers are verified. Share your trip with trusted contacts for added safety.",
    image: "/onboarding3.png",
  },
];

export default function WelcomePage() {
  const [current, setCurrent] = useState(0);
  const router = useRouter();

  const slide = slides[current];

  return (
    <div className="flex min-h-screen flex-col items-center justify-between px-6 py-12">
      <div className="flex-1 flex flex-col items-center justify-center max-w-md mx-auto w-full">
        <div className="relative w-64 h-64 mb-12">
          <Image
            src={slide.image}
            alt={slide.title}
            fill
            className="object-contain"
            priority
          />
        </div>

        <div className="flex gap-2 mb-8">
          {slides.map((_, idx) => (
            <div
              key={idx}
              className={`h-2 w-2 rounded-full transition-all duration-300 ${
                idx === current
                  ? "bg-primary-500 w-8"
                  : "bg-primary-300"
              }`}
            />
          ))}
        </div>

        <h1 className="font-JakartaBold text-3xl text-secondary-900 text-center mb-4">
          {slide.title}
        </h1>
        <p className="font-Jakarta text-base text-secondary-500 text-center leading-relaxed">
          {slide.description}
        </p>
      </div>

      <div className="flex items-center justify-between w-full max-w-md mt-8">
        {current > 0 ? (
          <button
            onClick={() => setCurrent(current - 1)}
            className="flex items-center gap-2 font-JakartaSemiBold text-secondary-500"
          >
            <ChevronLeft className="h-5 w-5" /> Previous
          </button>
        ) : (
          <div />
        )}

        {current < slides.length - 1 ? (
          <button
            onClick={() => setCurrent(current + 1)}
            className="flex items-center gap-2 font-JakartaSemiBold text-primary-500"
          >
            Next <ChevronRight className="h-5 w-5" />
          </button>
        ) : (
          <Button onClick={() => router.push("/sign-up")}>
            Get Started
          </Button>
        )}
      </div>

      <p className="mt-6 font-Jakarta text-sm text-secondary-500">
        Already have an account?{" "}
        <button
          onClick={() => router.push("/sign-in")}
          className="font-JakartaSemiBold text-primary-500"
        >
          Sign In
        </button>
      </p>
    </div>
  );
}
