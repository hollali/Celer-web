"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, HelpCircle, ChevronDown, ChevronUp, MessageSquare, Search } from "lucide-react";
import Button from "@/components/ui/button";

const faqs = [
  { q: "How do I book a ride?", a: "Enter your destination in the search bar, select a driver, and confirm your booking. You'll be matched with a nearby driver instantly." },
  { q: "How do I pay for my ride?", a: "You can pay using Paystack with your credit/debit card, mobile money, or bank transfer. Payment is processed securely through Paystack's platform." },
  { q: "Can I cancel a ride?", a: "Yes, you can cancel a ride before the driver arrives. Frequent cancellations may affect your account standing." },
  { q: "How are fares calculated?", a: "Fares are based on distance, time, and demand. You'll see the estimated fare before confirming your booking." },
  { q: "Is my information secure?", a: "Yes, we use industry-standard encryption and security measures to protect your personal and payment information." },
];

export default function HelpPage() {
  const router = useRouter();
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [search, setSearch] = useState("");

  const filteredFaqs = faqs.filter(
    (faq) =>
      faq.q.toLowerCase().includes(search.toLowerCase()) ||
      faq.a.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-2xl mx-auto p-4 md:p-8">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => router.back()} className="p-2 hover:bg-general-500 dark:hover:bg-general-700 rounded-full">
          <ArrowLeft className="h-6 w-6 text-secondary-900" />
        </button>
        <h1 className="font-JakartaBold text-2xl text-secondary-900">Help & Support</h1>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-general-200" />
        <input
          type="text"
          placeholder="Search FAQs..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-full border border-general-100 bg-white dark:bg-general-600 pl-10 pr-4 py-2.5 font-Jakarta text-sm outline-none focus:border-primary-500"
        />
      </div>

      <div className="space-y-2 mb-8">
        {filteredFaqs.map((faq, idx) => (
          <div key={idx} className="rounded-2xl bg-white dark:bg-general-600 border border-general-100 overflow-hidden">
            <button
              onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
              className="flex w-full items-center justify-between p-4 text-left"
            >
              <span className="font-JakartaSemiBold text-sm text-secondary-900">{faq.q}</span>
              {openFaq === idx ? (
                <ChevronUp className="h-5 w-5 text-general-200 shrink-0" />
              ) : (
                <ChevronDown className="h-5 w-5 text-general-200 shrink-0" />
              )}
            </button>
            {openFaq === idx && (
              <div className="px-4 pb-4">
                <p className="font-Jakarta text-sm text-secondary-500">{faq.a}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="rounded-2xl bg-primary-100 dark:bg-primary-100/20 p-6 text-center">
        <MessageSquare className="h-8 w-8 text-primary-500 mx-auto mb-3" />
        <h3 className="font-JakartaSemiBold text-secondary-900 mb-1">Still need help?</h3>
        <p className="font-Jakarta text-sm text-secondary-500 mb-4">
          Contact our support team
        </p>
        <Button variant="outline">Contact Support</Button>
      </div>
    </div>
  );
}
