"use client";

import { useSignIn } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function GoogleOAuth() {
  const { signIn, isLoaded } = useSignIn();
  const router = useRouter();

  const handleGoogleSignIn = async () => {
    if (!isLoaded) return;

    try {
      const redirectUrl = `${window.location.origin}/home`;

      await signIn.authenticateWithRedirect({
        strategy: "oauth_google",
        redirectUrl,
        redirectUrlComplete: redirectUrl,
      });
    } catch {
      // OAuth flow handles redirects
    }
  };

  return (
    <button
      onClick={handleGoogleSignIn}
      className="flex w-full items-center justify-center gap-3 rounded-full border-2 border-general-100 bg-white dark:bg-general-600 px-6 py-3 font-JakartaSemiBold text-secondary-900 transition-colors hover:bg-general-500 dark:hover:bg-general-700"
    >
      <Image
        src="/google-icon.svg"
        alt="Google"
        width={20}
        height={20}
      />
      Continue with Google
    </button>
  );
}
