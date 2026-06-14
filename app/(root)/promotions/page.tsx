"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, Gift, Ticket, Clock, ChevronRight } from "lucide-react";
import Button from "@/components/ui/button";

const promos = [
  {
    title: "First Ride Free",
    code: "CELERFIRST",
    description: "Get your first ride up to GH₵ 20 free",
    expires: "Expires in 30 days",
    active: true,
  },
  {
    title: "Weekend Special",
    code: "WEEKEND20",
    description: "20% off all weekend rides",
    expires: "Expires in 7 days",
    active: true,
  },
  {
    title: "Refer a Friend",
    code: "REFER50",
    description: "You and your friend get GH₵ 50 each",
    expires: "No expiry",
    active: true,
  },
];

const expiredPromos = [
  {
    title: "New Year Bonus",
    code: "NEWYEAR25",
    description: "GH₵ 25 off your ride",
    expires: "Expired",
    active: false,
  },
];

export default function PromotionsPage() {
  const router = useRouter();

  return (
    <div className="max-w-2xl mx-auto p-4 md:p-8">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => router.back()} className="p-2 hover:bg-general-500 dark:hover:bg-general-700 rounded-full">
          <ArrowLeft className="h-6 w-6 text-secondary-900" />
        </button>
        <h1 className="font-JakartaBold text-2xl text-secondary-900">Promotions</h1>
      </div>

      <div className="space-y-3 mb-8">
        {promos.map((promo) => (
          <div key={promo.code} className="rounded-2xl bg-white dark:bg-general-600 border border-general-100 p-4">
            <div className="flex items-start gap-4">
              <div className="h-12 w-12 rounded-full bg-primary-100 flex items-center justify-center shrink-0">
                <Gift className="h-6 w-6 text-primary-500" />
              </div>
              <div className="flex-1">
                <h3 className="font-JakartaSemiBold text-secondary-900">{promo.title}</h3>
                <p className="font-Jakarta text-sm text-secondary-500 mt-1">{promo.description}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="rounded-lg bg-primary-100 px-3 py-1 font-JakartaBold text-xs text-primary-500">
                    {promo.code}
                  </span>
                  <span className="flex items-center gap-1 font-Jakarta text-xs text-general-200">
                    <Clock className="h-3 w-3" />
                    {promo.expires}
                  </span>
                </div>
              </div>
              <Button size="sm">Apply</Button>
            </div>
          </div>
        ))}
      </div>

      {expiredPromos.length > 0 && (
        <>
          <h2 className="font-JakartaSemiBold text-sm text-secondary-500 mb-3">Expired</h2>
          <div className="space-y-3">
            {expiredPromos.map((promo) => (
              <div key={promo.code} className="rounded-2xl bg-white dark:bg-general-600 border border-general-100 p-4 opacity-60">
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 rounded-full bg-general-300 flex items-center justify-center shrink-0">
                    <Ticket className="h-6 w-6 text-general-200" />
                  </div>
                  <div>
                    <h3 className="font-JakartaSemiBold text-secondary-900">{promo.title}</h3>
                    <p className="font-Jakarta text-sm text-secondary-500 mt-1">{promo.description}</p>
                    <span className="font-Jakarta text-xs text-danger-600 mt-1 block">{promo.expires}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
