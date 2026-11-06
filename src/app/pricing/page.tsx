import { PricingSection } from "@/components/landing/PricingSection";
import Link from "next/link";
import { ArrowLeft, Building2, CheckCircle2, ShieldCheck, Sparkles } from "lucide-react";

export const metadata = {
  title: "Commercial Plans & Pricing | KhataAI (খাতা AI)",
  description:
    "Affordable AI exam grading subscription plans for coaching centers, schools, colleges, universities, and individual educators in Bangladesh.",
};

export default function PricingPage() {
  return (
    <div className="min-h-screen py-8 space-y-10">
      {/* Top Banner */}
      <div className="container mx-auto max-w-7xl px-4 sm:px-6">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground mb-6"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Home
        </Link>

        <div className="rounded-3xl bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white p-8 sm:p-12 shadow-xl border border-emerald-800/40 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none">
            <Building2 className="w-64 h-64 text-white" />
          </div>

          <div className="max-w-2xl space-y-4 relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-bold">
              <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
              SaaS Solutions for Bangladeshi Education
            </div>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
              Buy Service for Coaching, School, College or Varsity
            </h1>
            <p className="text-sm sm:text-base text-emerald-100/90 leading-relaxed">
              Equip your institution or private coaching center with instant AI-powered exam grading. Create custom student portals, share instant exam links, and process handwritten Bengali and English scripts automatically.
            </p>
            <div className="flex flex-wrap gap-4 pt-2 text-xs font-medium text-emerald-200">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" /> bKash & Nagad Direct Checkout
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" /> Zero Setup Fees
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" /> Free Trial Available
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Embedded Pricing Section */}
      <PricingSection />
    </div>
  );
}
