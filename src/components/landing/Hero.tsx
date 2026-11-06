import Link from "next/link";
import { Sparkles, ArrowRight, Camera, CheckCircle2, ShieldCheck, Zap, GraduationCap, Building2 } from "lucide-react";

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-12 pb-20 sm:pt-20 sm:pb-28">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-emerald-500/10 blur-[120px] -z-10 rounded-full pointer-events-none" />

      <div className="container mx-auto max-w-7xl px-4 sm:px-6">
        <div className="text-center max-w-4xl mx-auto space-y-6">
          {/* Top Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold shadow-sm animate-in fade-in">
            <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
            <span>Next-Gen EdTech SaaS • Hosted Free on Vercel</span>
            <span className="h-1 w-1 rounded-full bg-emerald-400" />
            <span className="text-emerald-700 font-bold">2026 AI Ready</span>
          </div>

          {/* Main Title */}
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-foreground leading-[1.15]">
            Evaluate Handwritten & Online Exams with{" "}
            <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 bg-clip-text text-transparent">
              Transparent Multimodal AI
            </span>
          </h1>

          {/* Subtitle with Bengali context */}
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Snap a photo of any student answer sheet or conduct live digital exams.
            KhataAI checks Bengali/English handwriting, evaluates against exact marking rubrics (SSC, HSC, IELTS, BCS, Varsity), and explains every mark awarded.
          </p>

          <p className="bengali-font text-sm sm:text-base font-semibold text-emerald-800 bg-emerald-50/60 border border-emerald-200/60 rounded-xl py-2 px-4 max-w-xl mx-auto shadow-sm">
            খাতা মূল্যায়নে বিপ্লব — কয়েক সেকেন্ডে ক, খ, গ, ঘ ধাপভিত্তিক নির্ভুল মার্কিং ও স্বচ্ছ ব্যাখ্যা!
          </p>

          {/* Call to Actions */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link
              href="#demo"
              className="flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-emerald-600/25 hover:bg-emerald-700 hover:scale-[1.02] transition-all"
            >
              <Sparkles className="h-4 w-4" />
              Try Live Demo Evaluator
            </Link>
            <Link
              href="/student"
              className="flex items-center gap-2 rounded-xl border border-border bg-card px-6 py-3.5 text-sm font-bold text-foreground shadow-sm hover:bg-accent/60 transition-all"
            >
              <GraduationCap className="h-4 w-4 text-emerald-600" />
              Explore Public Exams
            </Link>
            <Link
              href="/portal"
              className="flex items-center gap-2 rounded-xl border border-transparent text-sm font-bold text-muted-foreground hover:text-foreground transition-colors"
            >
              <Building2 className="h-4 w-4 text-emerald-600" />
              Institution Portals <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Feature Highlights Ticker */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-10 max-w-3xl mx-auto text-left">
            <div className="p-3.5 rounded-xl border border-border bg-card/60 backdrop-blur">
              <div className="flex items-center gap-2 text-xs font-bold text-foreground">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                <span>NCTB CQ & IELTS</span>
              </div>
              <p className="text-[11px] text-muted-foreground mt-1">
                ক, খ, গ, ঘ rubrics + 4 IELTS band criteria.
              </p>
            </div>

            <div className="p-3.5 rounded-xl border border-border bg-card/60 backdrop-blur">
              <div className="flex items-center gap-2 text-xs font-bold text-foreground">
                <Camera className="h-4 w-4 text-emerald-600" />
                <span>Instant Camera OCR</span>
              </div>
              <p className="text-[11px] text-muted-foreground mt-1">
                Direct camera capture with client-side compression.
              </p>
            </div>

            <div className="p-3.5 rounded-xl border border-border bg-card/60 backdrop-blur">
              <div className="flex items-center gap-2 text-xs font-bold text-foreground">
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                <span>Legibility Guard</span>
              </div>
              <p className="text-[11px] text-muted-foreground mt-1">
                Flags illegible handwriting for teacher review.
              </p>
            </div>

            <div className="p-3.5 rounded-xl border border-border bg-card/60 backdrop-blur">
              <div className="flex items-center gap-2 text-xs font-bold text-foreground">
                <Zap className="h-4 w-4 text-emerald-600" />
                <span>Multi-AI Fleet</span>
              </div>
              <p className="text-[11px] text-muted-foreground mt-1">
                Gemini 3.8, Claude, Grok, GPT-6 Astra.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
