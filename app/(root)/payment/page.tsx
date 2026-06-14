"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ArrowLeft, CreditCard, CheckCircle, XCircle, Loader2 } from "lucide-react";
import Button from "@/components/ui/button";
import { fetchAPI } from "@/lib/fetch";
import type { PaystackResponse, PaystackVerification } from "@/types/type";

function PaymentContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const rideId = searchParams.get("ride_id");
  const amount = searchParams.get("amount");
  const email = searchParams.get("email");

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [reference, setReference] = useState("");
  const [message, setMessage] = useState("");

  const handlePaystackPayment = async () => {
    if (!amount || !email || !rideId) return;

    setLoading(true);
    setMessage("");

    try {
      const initData = await fetchAPI<PaystackResponse>("/api/paystack", {
        method: "POST",
        body: JSON.stringify({
          action: "initialize",
          amount: parseFloat(amount),
          email,
          rideData: { ride_id: parseInt(rideId) },
        }),
      });

      setReference(initData.reference);

      const paystackPublicKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY;
      if (!paystackPublicKey) {
        setMessage("Paystack is not configured");
        setLoading(false);
        return;
      }

      const handler = (window as any).PaystackPop.setup({
        key: paystackPublicKey,
        email,
        amount: Math.round(parseFloat(amount) * 100),
        ref: initData.reference,
        onClose: () => {
          setLoading(false);
          setMessage("Payment cancelled");
        },
        callback: async (response: any) => {
          if (response.status === "success") {
            try {
              const verifyData = await fetchAPI<PaystackVerification>("/api/paystack", {
                method: "POST",
                body: JSON.stringify({
                  action: "verify",
                  reference: response.reference,
                }),
              });

              if (verifyData.verified) {
                await fetchAPI("/api/ride", {
                  method: "PATCH",
                  body: JSON.stringify({
                    ride_id: parseInt(rideId),
                    payment_status: "paid",
                  }),
                });

                setStatus("success");
                setMessage("Payment successful!");
              }
            } catch {
              setStatus("error");
              setMessage("Payment verification failed");
            }
          } else {
            setStatus("error");
            setMessage("Payment failed");
          }
          setLoading(false);
        },
      });

      handler.openIframe();
    } catch {
      setMessage("Failed to initialize payment");
      setLoading(false);
    }
  };

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://js.paystack.co/v1/inline.js";
    script.async = true;
    document.body.appendChild(script);
    return () => { document.body.removeChild(script); };
  }, []);

  return (
    <div className="max-w-md mx-auto p-4 md:p-8">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => router.back()} className="p-2 hover:bg-general-500 rounded-full">
          <ArrowLeft className="h-6 w-6 text-secondary-900" />
        </button>
        <h1 className="font-JakartaBold text-2xl text-secondary-900">Payment</h1>
      </div>

      {status === "success" ? (
        <div className="text-center py-12">
          <div className="w-20 h-20 rounded-full bg-success-100 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-10 w-10 text-success-500" />
          </div>
          <h2 className="font-JakartaBold text-xl text-secondary-900 mb-2">
            Payment Successful
          </h2>
          <p className="font-Jakarta text-secondary-500 mb-8">
            {amount ? `GH₵ ${parseFloat(amount).toFixed(2)} paid successfully` : ""}
          </p>
          <Button onClick={() => router.push("/rides")} className="w-full" size="lg">
            View My Rides
          </Button>
        </div>
      ) : status === "error" ? (
        <div className="text-center py-12">
          <div className="w-20 h-20 rounded-full bg-danger-100 flex items-center justify-center mx-auto mb-6">
            <XCircle className="h-10 w-10 text-danger-600" />
          </div>
          <h2 className="font-JakartaBold text-xl text-secondary-900 mb-2">
            Payment Failed
          </h2>
          <p className="font-Jakarta text-secondary-500 mb-8">{message}</p>
          <Button onClick={() => setStatus("idle")} variant="outline" className="w-full" size="lg">
            Try Again
          </Button>
        </div>
      ) : (
        <div className="rounded-2xl bg-white border border-general-100 p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="h-12 w-12 rounded-full bg-primary-100 flex items-center justify-center">
              <CreditCard className="h-6 w-6 text-primary-500" />
            </div>
            <div>
              <p className="font-JakartaSemiBold text-secondary-900">Pay with Paystack</p>
              <p className="font-Jakarta text-sm text-secondary-500">
                Secure payment via Paystack
              </p>
            </div>
          </div>

          {amount && (
            <div className="bg-general-500 rounded-xl p-4 mb-6">
              <p className="font-Jakarta text-sm text-secondary-500">Amount</p>
              <p className="font-JakartaBold text-2xl text-secondary-900">
                GH₵ {parseFloat(amount).toFixed(2)}
              </p>
            </div>
          )}

          {message && (
            <p className="font-Jakarta text-sm text-danger-600 text-center mb-4">{message}</p>
          )}

          <Button
            onClick={handlePaystackPayment}
            loading={loading}
            className="w-full"
            size="lg"
          >
            Pay with Paystack
          </Button>
        </div>
      )}
    </div>
  );
}

export default function PaymentPage() {
  return (
    <Suspense fallback={<div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary-500" /></div>}>
      <PaymentContent />
    </Suspense>
  );
}
