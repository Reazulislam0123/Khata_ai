import Link from "next/link";
import {
  Sparkles,
  ArrowRight,
  Camera,
  CheckCircle2,
  ShieldCheck,
  Zap,
  GraduationCap,
  Building2,
  Award,
  TrendingUp,
  FileCheck2,
} from "lucide-react";

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-12 pb-20 sm:pt-20 sm:pb-32 bg-dot-pattern">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[380px] bg-emerald-500/10 blur-[130px] -z-10 rounded-full pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-[350px] h-[300px] bg-teal-500/10 blur-[100px] -z-10 rounded-full pointer-events-none" />

      <div className="container mx-auto max-w-7xl px-4 sm:px-6">
        <div className="text-center max-w-4xl mx-auto space-y-6">
          {/* Top Pill with live pulse */}
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-emerald-50/90 dark:bg-emerald-950/70 border border-emerald-200/80 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-bold shadow-sm backdrop-blur-sm animate-in fade-in">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span>Bangladesh&apos;s 1st Transparent Multimodal AI Exam Engine</span>
            <span className="h-1 w-1 rounded-full bg-emerald-400/80" />
            <span className="text-emerald-700 dark:text-emerald-400 font-extrabold">2026 Ready</span>
          </div>

          {/* Main Title */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-foreground leading-[1.12]">
            Evaluate Handwritten & Online Exams with{" "}
            <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 bg-clip-text text-transparent">
              Explainable AI
            </span>
          </h1>

          {/* Subtitle with Bengali context */}
          <p className="text-base sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed font-normal">
            Snap a photo of any student answer sheet or conduct live digital exams.
            KhataAI deciphers Bengali & English handwriting, evaluates against exact curriculum rubrics (SSC, HSC, IELTS, BCS, Varsity), and explains every single mark awarded.
          </p>

          <div className="bengali-font text-sm sm:text-base font-semibold text-emerald-900 dark:text-emerald-200 bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800/80 rounded-2xl py-2.5 px-5 max-w-xl mx-auto shadow-sm">
            খাতা মূল্যায়নে বিপ্লব — কয়েক সেকেন্ডে ক, খ, গ, ঘ ধাপভিত্তিক নির্ভুল মার্কিং ও স্বচ্ছ ব্যাখ্যা!
          </div>

          {/* Call to Actions */}
          <div className="flex flex-wrap items-center justify-center gap-3.5 pt-4">
            <Link
              href="#demo"
              className="flex items-center gap-2 rounded-2xl bg-emerald-600 px-7 py-4 text-sm font-bold text-white shadow-xl shadow-emerald-600/25 hover:bg-emerald-700 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <Sparkles className="h-4 w-4" />
              <span>Try Live Demo Evaluator</span>
            </Link>
            <Link
              href="/student"
              className="flex items-center gap-2 rounded-2xl border border-border bg-card/90 px-7 py-4 text-sm font-bold text-foreground shadow-sm hover:bg-accent/70 hover:border-emerald-500/40 active:scale-[0.98] transition-all"
            >
              <GraduationCap className="h-4 w-4 text-emerald-600" />
              <span>Explore Student Arena</span>
            </Link>
            <Link
              href="/portal"
              className="flex items-center gap-2 rounded-2xl border border-transparent px-4 py-4 text-sm font-bold text-muted-foreground hover:text-foreground transition-colors"
            >
              <Building2 className="h-4 w-4 text-emerald-600" />
              <span>Institution Portals</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Stats Bar */}
          <div className="pt-8 grid grid-cols-3 gap-3 max-w-2xl mx-auto">
            <div className="p-3.5 rounded-2xl border border-border/80 bg-card/70 backdrop-blur-sm shadow-sm">
              <div className="text-xl sm:text-2xl font-black text-emerald-600 dark:text-emerald-400">99.4%</div>
              <div className="text-[11px] font-semibold text-muted-foreground mt-0.5">Handwriting Precision</div>
            </div>
            <div className="p-3.5 rounded-2xl border border-border/80 bg-card/70 backdrop-blur-sm shadow-sm">
              <div className="text-xl sm:text-2xl font-black text-emerald-600 dark:text-emerald-400">500K+</div>
              <div className="text-[11px] font-semibold text-muted-foreground mt-0.5">Scripts Graded</div>
            </div>
            <div className="p-3.5 rounded-2xl border border-border/80 bg-card/70 backdrop-blur-sm shadow-sm">
              <div className="text-xl sm:text-2xl font-black text-emerald-600 dark:text-emerald-400">85%</div>
              <div className="text-[11px] font-semibold text-muted-foreground mt-0.5">Teacher Time Saved</div>
            </div>
          </div>

          {/* Feature Highlights Ticker */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 pt-8 max-w-4xl mx-auto text-left">
            <div className="p-4 rounded-2xl border border-border/80 bg-card/80 backdrop-blur card-hover-pro shadow-sm">
              <div className="flex items-center gap-2 text-xs font-bold text-foreground">
                <div className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-600 border border-emerald-200 dark:border-emerald-800">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                </div>
                <span>NCTB CQ & IELTS</span>
              </div>
              <p className="text-[11px] text-muted-foreground mt-2 leading-relaxed">
                ক, খ, গ, ঘ rubrics + 4 IELTS band criteria with step score matching.
              </p>
            </div>

            <div className="p-4 rounded-2xl border border-border/80 bg-card/80 backdrop-blur card-hover-pro shadow-sm">
              <div className="flex items-center gap-2 text-xs font-bold text-foreground">
                <div className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-600 border border-emerald-200 dark:border-emerald-800">
                  <Camera className="h-3.5 w-3.5" />
                </div>
                <span>Instant Camera OCR</span>
              </div>
              <p className="text-[11px] text-muted-foreground mt-2 leading-relaxed">
                Direct camera capture on phone & desktop with instant thumbnail previews.
              </p>
            </div>

            <div className="p-4 rounded-2xl border border-border/80 bg-card/80 backdrop-blur card-hover-pro shadow-sm">
              <div className="flex items-center gap-2 text-xs font-bold text-foreground">
                <div className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-600 border border-emerald-200 dark:border-emerald-800">
                  <ShieldCheck className="h-3.5 w-3.5" />
                </div>
                <span>Legibility Guard</span>
              </div>
              <p className="text-[11px] text-muted-foreground mt-2 leading-relaxed">
                Flags illegible handwriting with confidence scores for teacher verification.
              </p>
            </div>

            <div className="p-4 rounded-2xl border border-border/80 bg-card/80 backdrop-blur card-hover-pro shadow-sm">
              <div className="flex items-center gap-2 text-xs font-bold text-foreground">
                <div className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-600 border border-emerald-200 dark:border-emerald-800">
                  <Zap className="h-3.5 w-3.5" />
                </div>
                <span>Multi-AI Fleet</span>
              </div>
              <p className="text-[11px] text-muted-foreground mt-2 leading-relaxed">
                Powered by Gemini 3.8 Flash, Claude 3.5, and high-speed OCR vision models.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
