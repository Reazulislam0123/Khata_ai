import Link from "next/link";
import {
  FileCheck2,
  GraduationCap,
  Sparkles,
  Target,
  BrainCircuit,
  Award,
  Users2,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";

export const metadata = {
  title: "About Us | KhataAI (খাতা AI)",
  description:
    "Learn about Khata AI's mission to revolutionize examination grading across schools, colleges, universities, and coaching centers in Bangladesh with cutting-edge AI.",
};

export default function AboutPage() {
  const values = [
    {
      icon: BrainCircuit,
      title: "Handwritten Script Intelligence",
      description:
        "Trained specifically on handwritten Bengali and English scripts to evaluate complex math derivations, formulas, creative questions (CQ), and essays.",
    },
    {
      icon: Target,
      title: "Strict Rubric Fidelity",
      description:
        "Every mark given is justified down to individual rubric criteria, keywords, and cognitive steps, preventing subjective teacher grading variance.",
    },
    {
      icon: Award,
      title: "Bangladeshi Curriculum Aligned",
      description:
        "Native support for National Curriculum (SSC, HSC, JSC), Varsity Admission (DU, BUET, Medical), Job Recruitment (BCS), and International standards (IELTS).",
    },
    {
      icon: Users2,
      title: "Teacher Empowerment",
      description:
        "Not replacing teachers, but eliminating the 20+ hours spent each week grading papers so educators can focus on mentorship and teaching.",
    },
  ];

  const milestones = [
    {
      year: "Phase 1: 2026",
      title: "Multi-Model AI Examination Engine",
      description: "Integration of Google Gemini 3.8 Flash, GPT-4o, and Vision OCR with real-time rubric evaluation.",
    },
    {
      year: "Phase 2: 2026 Q3",
      title: "Institution SaaS Rollout",
      description: "Empowering 500+ coaching centers, schools, and varsity batches with automated student portals.",
    },
    {
      year: "Phase 3: 2027",
      title: "Proprietary Bangla On-Prem Models",
      description: "Self-hosted, fine-tuned Bengali LLMs for secure, zero-cloud governmental and board examinations.",
    },
  ];

  return (
    <div className="min-h-screen py-10 space-y-16">
      <div className="container mx-auto max-w-6xl px-4 sm:px-6 space-y-16">
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold">
            <Sparkles className="h-3.5 w-3.5" />
            Revolutionizing Examination In Bangladesh
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-foreground tracking-tight leading-tight">
            Built for Bangladeshi Exams, Driven by World-Class AI
          </h1>
          <p className="text-base text-muted-foreground leading-relaxed">
            Khata AI (খাতা AI) is an intelligent assessment platform built to evaluate handwritten test scripts, creative questions (CQ), and multi-choice papers in seconds with verifiable accuracy and point-by-point rubric breakdowns.
          </p>
        </div>

        {/* Mission Card */}
        <div className="rounded-3xl bg-gradient-to-tr from-emerald-950 via-teal-900 to-slate-900 text-white p-8 sm:p-12 shadow-2xl relative overflow-hidden border border-emerald-800/40">
          <div className="max-w-2xl space-y-4 relative z-10">
            <h2 className="text-2xl sm:text-3xl font-black">Our Core Mission</h2>
            <p className="text-emerald-100/90 leading-relaxed text-sm sm:text-base">
              Every year, over 2.5 million students in Bangladesh sit for board and competitive examinations. Educators spend hundreds of grueling hours grading paper answer sheets by hand, leading to evaluation delays, subjective marks variance, and fatigue.
            </p>
            <p className="text-emerald-100/90 leading-relaxed text-sm sm:text-base">
              Khata AI transforms handwritten exam papers into actionable learning diagnostics. Teachers upload photos of student answer sheets, and our AI grades each section step-by-step according to exact marking schemes.
            </p>
            <div className="pt-2 flex flex-wrap gap-4 text-xs font-semibold text-emerald-200">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" /> 95%+ Grading Alignment with Senior Board Examiners
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" /> Instant Results & Cognitive Step Feedback
              </span>
            </div>
          </div>
        </div>

        {/* Core Pillars */}
        <div className="space-y-6">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <h2 className="text-2xl sm:text-3xl font-black text-foreground">Why Khata AI is Different</h2>
            <p className="text-xs text-muted-foreground">
              Engineered specifically for the nuances of South Asian educational handwriting and complex creative question schemas.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {values.map((val, idx) => {
              const Icon = val.icon;
              return (
                <div
                  key={idx}
                  className="rounded-2xl border border-border bg-card p-6 space-y-3 hover:border-emerald-500/50 hover:shadow-lg transition-all"
                >
                  <div className="h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-base font-bold text-foreground">{val.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{val.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Roadmap & Milestones */}
        <div className="space-y-6">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <h2 className="text-2xl sm:text-3xl font-black text-foreground">Engineering Roadmap</h2>
            <p className="text-xs text-muted-foreground">
              From immediate commercial VC-ready architecture to proprietary self-hosted models.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {milestones.map((m, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-border bg-card p-6 space-y-2.5 relative hover:border-emerald-500/40 transition-all"
              >
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-600">
                  {m.year}
                </span>
                <h4 className="text-sm font-bold text-foreground">{m.title}</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">{m.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="rounded-3xl border border-border bg-muted/40 p-8 sm:p-10 text-center space-y-6">
          <h2 className="text-2xl sm:text-3xl font-black text-foreground">
            Ready to experience the future of AI grading?
          </h2>
          <p className="text-xs text-muted-foreground max-w-md mx-auto">
            Create an institution portal in less than 2 minutes or test handwritten script evaluation in our live sandbox.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/signup"
              className="py-3 px-6 rounded-xl bg-emerald-600 font-bold text-xs text-white shadow-md hover:bg-emerald-700 transition-all flex items-center gap-2"
            >
              Get Started for Free <ArrowRight className="h-3.5 w-3.5" />
            </Link>
            <Link
              href="/contact"
              className="py-3 px-6 rounded-xl border border-border bg-card hover:bg-accent font-bold text-xs text-foreground transition-all"
            >
              Contact Sales
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

