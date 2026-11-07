"use client";

import { useState, useEffect } from "react";
import confetti from "canvas-confetti";
import { Check, Sparkles, X, Smartphone, ShieldCheck, ArrowRight, Clock, User, Mail, Building2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export function PricingSection() {
  const { firebaseUser, mongoUser } = useAuth();
  const [currency, setCurrency] = useState<"bdt" | "usd">("bdt");
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [paymentStep, setPaymentStep] = useState<"method" | "number" | "success">("method");
  const [paymentProvider, setPaymentProvider] = useState<"bkash" | "nagad" | "card">("bkash");
  const [mobileNumber, setMobileNumber] = useState("");
  const [transactionId, setTransactionId] = useState("");
  const [applicantName, setApplicantName] = useState("");
  const [applicantEmail, setApplicantEmail] = useState("");
  const [applicantRole, setApplicantRole] = useState<"TEACHER" | "STUDENT">("TEACHER");
  const [institutionName, setInstitutionName] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [submittedRequest, setSubmittedRequest] = useState<any>(null);

  // Sync logged-in user data
  useEffect(() => {
    if (firebaseUser || mongoUser) {
      setApplicantName(mongoUser?.name || firebaseUser?.displayName || "");
      setApplicantEmail(mongoUser?.email || firebaseUser?.email || "");
      if (mongoUser?.role === "STUDENT") {
        setApplicantRole("STUDENT");
      } else {
        setApplicantRole("TEACHER");
      }
      if (mongoUser?.phone) {
        setMobileNumber(mongoUser.phone);
      }
    }
  }, [firebaseUser, mongoUser]);

  const plans = [
    {
      id: "free",
      name: "Free Starter (পরীক্ষামূলক)",
      priceBDT: "৳০",
      priceUSD: "$0",
      period: "forever",
      description: "For individual teachers and tutors getting started with AI evaluation.",
      features: [
        "15 Exam scripts evaluated / month",
        "Bangladeshi SSC & HSC CQ support",
        "IELTS Writing Task 2 sample testing",
        "Single-page camera & upload",
        "Instant point-by-point breakdown",
      ],
      popular: false,
      cta: "Get Started Free",
    },
    {
      id: "teacher_pro",
      name: "Teacher Pro (শিক্ষক প্রো)",
      priceBDT: "৳৯৯৯",
      priceUSD: "$9.99",
      period: "per month",
      description: "For school teachers, college professors, and private batch tutors.",
      features: [
        "250 Exam scripts evaluated / month",
        "All exam types (CQ, MCQ, IELTS, Varsity)",
        "Mobile camera batch photo scanner",
        "Handwriting legibility alert & human review",
        "Full student portal access with marks breakdown",
        "CSV & PDF Result Export",
      ],
      popular: true,
      cta: "Upgrade to Teacher Pro",
    },
    {
      id: "coaching_ultra",
      name: "Coaching Ultra (কোচিং সেন্টার)",
      priceBDT: "৳৪,৯৯৯",
      priceUSD: "$49.99",
      period: "per month",
      description: "For coaching centers (Udvash, UCC, Retina, Mentors') & institutions.",
      features: [
        "2,500 Exam scripts evaluated / month",
        "Multi-teacher accounts & batch assignment",
        "High-speed batch processing",
        "Custom institution branding on student sheets",
        "Sub-question step deduction analytics",
        "Priority AI gateway & zero downtime SLA",
      ],
      popular: false,
      cta: "Activate Coaching Plan",
    },
    {
      id: "varsity_enterprise",
      name: "Varsity / School Enterprise",
      priceBDT: "Custom",
      priceUSD: "Custom",
      period: "annual",
      description: "For universities, large school chains, and examination boards.",
      features: [
        "Unlimited script evaluations",
        "On-premise or private cloud AI deployment",
        "Moodle, Canvas & Custom LMS integration",
        "Custom fine-tuned OCR model for Bengali cursive",
        "24/7 dedicated engineering support",
      ],
      popular: false,
      cta: "Contact Enterprise Sales",
    },
  ];

  const handleOpenCheckout = (planId: string) => {
    setSelectedPlan(planId);
    setPaymentStep("method");
    if (!mobileNumber) setMobileNumber("01712345678");
    if (!transactionId) {
      setTransactionId(`TXN${Math.floor(10000000 + Math.random() * 90000000)}`);
    }
  };

  const handleConfirmPayment = async () => {
    setIsProcessing(true);
    const planObj = plans.find((p) => p.id === selectedPlan);
    const priceAmount =
      currency === "bdt"
        ? planObj?.id === "free"
          ? 0
          : planObj?.id === "teacher_pro"
          ? 999
          : 4999
        : planObj?.id === "free"
        ? 0
        : planObj?.id === "teacher_pro"
        ? 9.99
        : 49.99;

    try {
      const res = await fetch("/api/subscription/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          planId: selectedPlan,
          planName: planObj?.name || "Pro Subscription",
          amount: priceAmount,
          currency: currency.toUpperCase(),
          billingCycle: planObj?.period || "monthly",
          paymentMethod: paymentProvider,
          paymentPhone: mobileNumber || "01712345678",
          transactionId: transactionId || `TXN${Date.now().toString().slice(-8)}`,
          userName: applicantName || (applicantRole === "STUDENT" ? "Student Applicant" : "Educator"),
          userEmail: applicantEmail || (applicantRole === "STUDENT" ? "student@example.com" : "teacher@example.com"),
          userRole: applicantRole,
          institutionName: institutionName || "Independent Academy",
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSubmittedRequest(data.request);
        setPaymentStep("success");
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
      } else {
        alert(data.error || "Failed to submit subscription request");
      }
    } catch (err: any) {
      alert("Submission error: " + err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <section id="pricing" className="py-16 sm:py-24 bg-background">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold mb-3">
            <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
            Transparent Commercial Pricing
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            Affordable Plans for <span className="text-emerald-600">Every Educator</span>
          </h2>
          <p className="mt-3 text-base text-muted-foreground">
            Save up to 85% of time spent manually grading scripts. Cut turnaround time from weeks to minutes.
          </p>

          {/* Currency Toggle */}
          <div className="flex items-center justify-center gap-3 mt-6">
            <span className={`text-xs font-bold ${currency === "bdt" ? "text-emerald-700" : "text-muted-foreground"}`}>
              🇧🇩 Bangladeshi Taka (৳ BDT)
            </span>
            <button
              onClick={() => setCurrency(currency === "bdt" ? "usd" : "bdt")}
              className="relative inline-flex h-6 w-11 items-center rounded-full bg-muted border border-border p-0.5 transition-colors"
            >
              <span
                className={`inline-block h-5 w-5 transform rounded-full bg-emerald-600 transition-transform ${
                  currency === "usd" ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
            <span className={`text-xs font-bold ${currency === "usd" ? "text-emerald-700" : "text-muted-foreground"}`}>
              🌍 Global (USD $)
            </span>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map((p) => (
            <div
              key={p.id}
              className={`relative rounded-3xl border p-6 sm:p-7 flex flex-col justify-between card-hover-pro transition-all ${
                p.popular
                  ? "border-emerald-500 bg-card shadow-xl shadow-emerald-500/10 ring-2 ring-emerald-500/30"
                  : "border-border bg-card shadow-sm hover:border-border/80"
              }`}
            >
              {p.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 px-4 py-1 text-[11px] font-extrabold text-white shadow-md shadow-emerald-600/30 flex items-center gap-1.5 whitespace-nowrap">
                  <Sparkles className="h-3 w-3" /> Most Popular for Teachers
                </div>
              )}

              <div>
                <h3 className="font-extrabold text-base text-foreground">{p.name}</h3>
                <p className="text-xs text-muted-foreground mt-1 min-h-[32px]">{p.description}</p>

                <div className="mt-4 mb-6">
                  <span className="text-3xl font-black text-foreground">
                    {currency === "bdt" ? p.priceBDT : p.priceUSD}
                  </span>
                  <span className="text-xs text-muted-foreground ml-1.5 font-medium">/{p.period}</span>
                </div>

                <div className="space-y-2.5 pt-4 border-t border-border">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                    Included Features:
                  </p>
                  {p.features.map((f, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                      <div className="h-4 w-4 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5 border border-emerald-200 dark:border-emerald-800">
                        <Check className="h-2.5 w-2.5" />
                      </div>
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8">
                <button
                  onClick={() => handleOpenCheckout(p.id)}
                  className={`w-full py-3 rounded-2xl text-xs font-bold transition-all shadow-sm active:scale-[0.98] ${
                    p.popular
                      ? "bg-emerald-600 text-white hover:bg-emerald-700 shadow-lg shadow-emerald-600/25"
                      : "bg-muted text-foreground hover:bg-accent border border-border"
                  }`}
                >
                  {p.cta}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Localized Bangladeshi Payment Badges */}
        <div className="mt-12 text-center">
          <p className="text-xs text-muted-foreground font-medium mb-3">
            Instant automatic checkout supported via:
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <span className="px-3 py-1.5 rounded-xl border border-pink-200 bg-pink-50 text-pink-700 text-xs font-bold flex items-center gap-1.5 shadow-sm">
              <span className="h-2 w-2 rounded-full bg-pink-500" />
              বিকাশ (bKash) Merchant
            </span>
            <span className="px-3 py-1.5 rounded-xl border border-orange-200 bg-orange-50 text-orange-700 text-xs font-bold flex items-center gap-1.5 shadow-sm">
              <span className="h-2 w-2 rounded-full bg-orange-500" />
              নগদ (Nagad) Payment
            </span>
            <span className="px-3 py-1.5 rounded-xl border border-blue-200 bg-blue-50 text-blue-700 text-xs font-bold flex items-center gap-1.5 shadow-sm">
              <span className="h-2 w-2 rounded-full bg-blue-500" />
              Visa / Mastercard / Amex
            </span>
          </div>
        </div>

        {/* Interactive Payment Checkout Modal Simulation */}
        {selectedPlan && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
            <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                    ৳
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-foreground">Subscribe to KhataAI</h4>
                    <p className="text-[11px] text-muted-foreground">Direct bKash / Nagad Instant Checkout</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedPlan(null)}
                  className="rounded-lg p-1 text-muted-foreground hover:bg-accent"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {paymentStep === "method" && (
                <div className="space-y-4">
                  <p className="text-xs text-muted-foreground">Select your preferred payment gateway:</p>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => {
                        setPaymentProvider("bkash");
                        setPaymentStep("number");
                      }}
                      className="p-4 rounded-xl border-2 border-pink-400 bg-pink-50/50 hover:bg-pink-50 flex flex-col items-center justify-center gap-2 transition-all"
                    >
                      <div className="h-10 w-10 rounded-full bg-pink-500 text-white flex items-center justify-center font-extrabold text-sm">
                        bK
                      </div>
                      <span className="text-xs font-bold text-pink-900">Pay with bKash</span>
                    </button>

                    <button
                      onClick={() => {
                        setPaymentProvider("nagad");
                        setPaymentStep("number");
                      }}
                      className="p-4 rounded-xl border-2 border-orange-400 bg-orange-50/50 hover:bg-orange-50 flex flex-col items-center justify-center gap-2 transition-all"
                    >
                      <div className="h-10 w-10 rounded-full bg-orange-500 text-white flex items-center justify-center font-extrabold text-sm">
                        ন
                      </div>
                      <span className="text-xs font-bold text-orange-900">Pay with Nagad</span>
                    </button>
                  </div>
                </div>
              )}

              {paymentStep === "number" && (
                <div className="space-y-3.5 text-xs">
                  <div className="p-2.5 rounded-xl bg-muted/40 border border-border flex items-center justify-between">
                    <span>Payment Gateway:</span>
                    <span className="font-bold uppercase text-foreground">
                      {paymentProvider === "bkash" ? "bKash Merchant" : "Nagad Payment"}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    <div className="space-y-1">
                      <label className="font-bold text-foreground">Full Name:</label>
                      <input
                        type="text"
                        required
                        value={applicantName}
                        onChange={(e) => setApplicantName(e.target.value)}
                        placeholder="e.g. Professor Rafiq"
                        className="w-full px-3 py-1.5 rounded-xl border border-border bg-background focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-bold text-foreground">Role:</label>
                      <select
                        value={applicantRole}
                        onChange={(e) => setApplicantRole(e.target.value as any)}
                        className="w-full px-2.5 py-1.5 rounded-xl border border-border bg-background font-bold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      >
                        <option value="TEACHER">Teacher / Faculty</option>
                        <option value="STUDENT">Student</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-foreground">Email Address:</label>
                    <input
                      type="email"
                      required
                      value={applicantEmail}
                      onChange={(e) => setApplicantEmail(e.target.value)}
                      placeholder="teacher@institution.edu.bd"
                      className="w-full px-3 py-1.5 rounded-xl border border-border bg-background focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    <div className="space-y-1">
                      <label className="font-bold text-foreground">Mobile (bKash/Nagad):</label>
                      <input
                        type="tel"
                        required
                        value={mobileNumber}
                        onChange={(e) => setMobileNumber(e.target.value)}
                        placeholder="017XXXXXXXX"
                        className="w-full px-3 py-1.5 rounded-xl border border-border bg-background font-mono focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-bold text-foreground">TrxID Proof:</label>
                      <input
                        type="text"
                        required
                        value={transactionId}
                        onChange={(e) => setTransactionId(e.target.value)}
                        placeholder="e.g. BK8912347"
                        className="w-full px-3 py-1.5 rounded-xl border border-border bg-background font-mono focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-800 dark:text-amber-300 text-[11px] flex items-center gap-2">
                    <Clock className="h-4 w-4 shrink-0 text-amber-600 animate-pulse" />
                    <span>Super Admin will verify this request and activate full access for your account.</span>
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    <button
                      onClick={() => setPaymentStep("method")}
                      className="w-1/3 py-2 rounded-xl border border-border text-xs font-semibold hover:bg-accent"
                    >
                      Back
                    </button>
                    <button
                      onClick={handleConfirmPayment}
                      disabled={isProcessing}
                      className="w-2/3 py-2 rounded-xl bg-emerald-600 text-xs font-bold text-white hover:bg-emerald-700 shadow-sm flex items-center justify-center gap-2"
                    >
                      {isProcessing ? (
                        <>
                          <div className="h-3 w-3 rounded-full border-2 border-white border-t-transparent animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        <>
                          Send Request to Admin <ArrowRight className="h-3.5 w-3.5" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {paymentStep === "success" && (
                <div className="text-center py-5 space-y-3.5">
                  <div className="h-12 w-12 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto ring-8 ring-amber-50">
                    <Clock className="h-6 w-6 animate-pulse" />
                  </div>
                  <div>
                    <h4 className="font-black text-base text-foreground">
                      Subscription Request Dispatched!
                    </h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      Super Admin has received your activation request for{" "}
                      <span className="font-bold text-foreground">
                        {submittedRequest?.planName || "Pro Plan"}
                      </span>.
                    </p>
                  </div>

                  <div className="p-3 rounded-2xl bg-muted/40 border border-border text-xs space-y-1.5 text-left">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Applicant:</span>
                      <span className="font-bold text-foreground">{submittedRequest?.userName || applicantName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Account Email:</span>
                      <span className="font-mono text-foreground">{submittedRequest?.userEmail || applicantEmail}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Transaction ID:</span>
                      <span className="font-mono text-emerald-600 font-bold">{submittedRequest?.transactionId || transactionId}</span>
                    </div>
                    <div className="flex justify-between items-center pt-1 border-t border-border">
                      <span className="text-muted-foreground">Status:</span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-600 border border-amber-500/30 flex items-center gap-1">
                        <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
                        Pending Super Admin Activation
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedPlan(null)}
                    className="w-full py-2.5 rounded-xl bg-emerald-600 text-xs font-bold text-white hover:bg-emerald-700 shadow-sm"
                  >
                    Close & Return to Dashboard
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
