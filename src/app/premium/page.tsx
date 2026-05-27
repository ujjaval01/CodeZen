"use client";

import React, { useState, useEffect } from "react";
import { Zap, Shield, Rocket, Check, Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Script from "next/script";

export default function PremiumPage() {
  const { user, refreshUser } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleUpgrade = async () => {
    if (!user) {
      router.push("/login?redirect=/premium");
      return;
    }
    
    if (user.isPremium) {
      alert("You are already a Premium member!");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // 1. Create Razorpay Order
      const res = await fetch("/api/checkout/razorpay", { method: "POST" });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to create order");
      }

      // 2. Open Razorpay Checkout Modal
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "YOUR_TEST_KEY_ID", 
        amount: data.amount,
        currency: data.currency,
        name: "CodeHub Premium",
        description: "Unlock all premium DSA problems and features.",
        order_id: data.orderId,
        handler: async function (response: any) {
          // 3. Verify Payment
          const verifyRes = await fetch("/api/webhooks/razorpay", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              userId: user.id
            })
          });

          const verifyData = await verifyRes.json();
          if (verifyRes.ok) {
            alert("Payment Successful! Welcome to Premium.");
            await refreshUser(); // refresh user state to update isPremium
            router.push("/dashboard");
          } else {
            alert("Payment verification failed. Please contact support.");
          }
        },
        prefill: {
          name: user.name,
          email: user.email,
        },
        theme: {
          color: "#6366f1" // indigo-500
        }
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.on('payment.failed', function (response: any) {
        setError(response.error.description);
      });
      rzp.open();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 w-full bg-[#09090b] relative z-10 py-16">
      {/* Load Razorpay Script */}
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />

      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center space-y-12">
        
        {/* Header */}
        <div className="space-y-4">
          <div className="inline-flex items-center justify-center p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl mb-2">
            <Zap className="h-8 w-8 text-indigo-400" />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white">
            Upgrade to <span className="text-gradient-indigo-cyan">Premium</span>
          </h1>
          <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
            Take your coding skills to the next level. Unlock exclusive company interview questions, faster execution, and premium editorial solutions.
          </p>
        </div>

        {/* Pricing Card */}
        <div className="max-w-md mx-auto glass-panel p-8 rounded-3xl border border-indigo-500/30 relative overflow-hidden text-left">
          <div className="absolute top-0 right-0 p-4">
            <span className="bg-indigo-500 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest shadow-lg shadow-indigo-500/50">
              Most Popular
            </span>
          </div>

          <h2 className="text-2xl font-bold text-white">Pro Plan</h2>
          <div className="mt-4 flex items-baseline text-5xl font-extrabold text-white">
            ₹499
            <span className="ml-1 text-xl font-medium text-zinc-500">/lifetime</span>
          </div>
          <p className="mt-4 text-sm text-zinc-400">
            One-time payment. Lifetime access to all premium algorithms and data structures.
          </p>

          <ul className="mt-8 space-y-4 text-sm text-zinc-300">
            <li className="flex items-start gap-3">
              <Check className="h-5 w-5 text-emerald-400 shrink-0" />
              <span>Unlock 200+ Premium Interview Questions (Google, Meta, Amazon)</span>
            </li>
            <li className="flex items-start gap-3">
              <Check className="h-5 w-5 text-emerald-400 shrink-0" />
              <span>Access to comprehensive Video Editorials and visual explanations</span>
            </li>
            <li className="flex items-start gap-3">
              <Check className="h-5 w-5 text-emerald-400 shrink-0" />
              <span>Priority execution queue in our Judge0 compiler clusters</span>
            </li>
            <li className="flex items-start gap-3">
              <Check className="h-5 w-5 text-emerald-400 shrink-0" />
              <span>Exclusive "Premium" Badge on the global leaderboard</span>
            </li>
          </ul>

          <div className="mt-10">
            {error && (
              <p className="text-red-400 text-sm text-center mb-4">{error}</p>
            )}
            <button
              onClick={handleUpgrade}
              disabled={loading || user?.isPremium}
              className="w-full glow-btn-primary py-3.5 rounded-xl text-white font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : user?.isPremium ? (
                "You are Premium"
              ) : (
                <>
                  <Shield className="h-5 w-5" />
                  Upgrade Now Securely
                </>
              )}
            </button>
            <p className="text-[10px] text-zinc-500 text-center mt-3 flex items-center justify-center gap-1">
              <Shield className="h-3 w-3" /> Secured by Razorpay
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
