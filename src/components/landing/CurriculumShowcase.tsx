"use client";

import { useState } from "react";
import { Check, ShieldAlert, Sparkles, BookOpen, GraduationCap, Globe, CheckCircle } from "lucide-react";

export function CurriculumShowcase() {
  const [activeTab, setActiveTab] = useState<"cq" | "ielts" | "varsity" | "legibility">("cq");

  return (
    <section className="py-16 sm:py-24 border-y border-border/60 bg-muted/20">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold mb-3">
            <BookOpen className="h-3.5 w-3.5 text-emerald-600" />
            Designed for Real Exam Standards
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            Complete Support for <span className="text-emerald-600">Bangladeshi & Global</span> Curricula
          </h2>
          <p className="mt-3 text-base text-muted-foreground">
            Unlike generic text checkers, KhataAI is built with specific educational standards, cognitive taxonomies, and exact point deduction rules.
          </p>
        </div>

        {/* Tab Selector */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
          <button
            onClick={() => setActiveTab("cq")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === "cq"
                ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
                : "bg-card border border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            🇧🇩 National CQ (সৃজনশীল)
          </button>
          <button
            onClick={() => setActiveTab("ielts")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === "ielts"
                ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
                : "bg-card border border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            🌍 IELTS Academic Writing
          </button>
          <button
            onClick={() => setActiveTab("varsity")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === "varsity"
                ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
                : "bg-card border border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            🎓 Varsity & BCS Admission
          </button>
          <button
            onClick={() => setActiveTab("legibility")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === "legibility"
                ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
                : "bg-card border border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            ⚠️ Legibility & Fallback Guard
          </button>
        </div>

        {/* Tab Content Display */}
        <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-sm">
          {activeTab === "cq" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl border border-border bg-background space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-sm text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    ক - জ্ঞানমূলক
                  </span>
                  <span className="text-xs font-bold text-foreground">১ নম্বর</span>
                </div>
                <h4 className="font-bold text-xs text-foreground">Direct Recall & Definition</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  উদ্দীপকের সাহায্য ব্যতীত পাঠ্যপুস্তকের সরাসরি সংজ্ঞা বা তথ্যের নির্ভুলতা যাচাই। বাইনারি মার্কিং (১ অথবা ০)।
                </p>
                <div className="text-[11px] text-emerald-600 font-medium">✓ ১ বাক্যের সঠিক উত্তরে পূর্ণ ১</div>
              </div>

              <div className="p-4 rounded-xl border border-border bg-background space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-sm text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    খ - অনুধাবনমূলক
                  </span>
                  <span className="text-xs font-bold text-foreground">২ নম্বর</span>
                </div>
                <h4 className="font-bold text-xs text-foreground">2-Paragraph Comprehension</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  ১ম প্যারায় মূল কারণ/ধারণা চিহ্নিতকরণ (১ নম্বর) এবং ২য় প্যারায় কারণের সুনির্দিষ্ট বিজ্ঞানসম্মত ব্যাখ্যা (১ নম্বর)।
                </p>
                <div className="text-[11px] text-emerald-600 font-medium">✓ দুই প্যারার সুনির্দিষ্ট বিভাজন আবশ্যক</div>
              </div>

              <div className="p-4 rounded-xl border border-border bg-background space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-sm text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    গ - প্রয়োগমূলক
                  </span>
                  <span className="text-xs font-bold text-foreground">৩ নম্বর</span>
                </div>
                <h4 className="font-bold text-xs text-foreground">3-Tier Formula & Application</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  উদ্দীপকের সাথে পাঠ্যপুস্তকের সূত্রের মেলবন্ধন। ১ নম্বর সূত্র নির্ধারণ, ১ নম্বর মান বসানো ও ১ নম্বর সঠিক এককসহ উত্তর।
                </p>
                <div className="text-[11px] text-emerald-600 font-medium">✓ আংশিক (Partial) মার্কিং সমর্থিত</div>
              </div>

              <div className="p-4 rounded-xl border border-border bg-background space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-sm text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    ঘ - উচ্চতর দক্ষতা
                  </span>
                  <span className="text-xs font-bold text-foreground">৪ নম্বর</span>
                </div>
                <h4 className="font-bold text-xs text-foreground">4-Step Critical Synthesis</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  ১ম ধাপ সিদ্ধান্ত (Thesis), ২য় তত্ত্বীয় ব্যাখ্যা, ৩য় গাণিতিক/তুলনামূলক বিশ্লেষণ, ৪র্থ যৌক্তিক মূল্যায়ন ও উপসংহার।
                </p>
                <div className="text-[11px] text-emerald-600 font-medium">✓ পূর্ণ ৪ ধাপের সমন্বিত মূল্যায়ন</div>
              </div>
            </div>
          )}

          {activeTab === "ielts" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl border border-border bg-background space-y-2">
                <span className="font-extrabold text-xs text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Task Response (TR)
                </span>
                <h4 className="font-bold text-xs text-foreground">25% Weightage</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Evaluates whether all parts of the essay prompt are addressed, clarity of position, and development of main ideas.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-border bg-background space-y-2">
                <span className="font-extrabold text-xs text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Coherence & Cohesion (CC)
                </span>
                <h4 className="font-bold text-xs text-foreground">25% Weightage</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Paragraph organization, logical sequencing, referencing, and natural use of cohesive connectors.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-border bg-background space-y-2">
                <span className="font-extrabold text-xs text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Lexical Resource (LR)
                </span>
                <h4 className="font-bold text-xs text-foreground">25% Weightage</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Vocabulary range, natural collocations, academic phrasing, and precision with spelling slips.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-border bg-background space-y-2">
                <span className="font-extrabold text-xs text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Grammar Range & Accuracy
                </span>
                <h4 className="font-bold text-xs text-foreground">25% Weightage</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Mix of simple and complex sentence structures, conditional clauses, passive voice, and error-free sentence ratio.
                </p>
              </div>
            </div>
          )}

          {activeTab === "varsity" && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-5 rounded-xl border border-border bg-background space-y-2">
                <h4 className="font-bold text-sm text-foreground">Dhaka University (DU 'Ka'/'Kha'/'Ga')</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  60 MCQ marks with strict <strong>-0.25 negative marking</strong> + 40 Written problem-solving marks. KhataAI automatically applies individual sectional cutoffs.
                </p>
              </div>

              <div className="p-5 rounded-xl border border-border bg-background space-y-2">
                <h4 className="font-bold text-sm text-foreground">BUET Written Engineering</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  400 marks multi-step engineering analytical questions. The system checks partial marks for mathematical derivation steps inside standard answer boxes.
                </p>
              </div>

              <div className="p-5 rounded-xl border border-border bg-background space-y-2">
                <h4 className="font-bold text-sm text-foreground">BCS (Civil Service) Preliminary & Written</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Preliminary 200 MCQs with <strong>-0.50 negative marking</strong> per incorrect answer, plus comprehensive rubrics for 900-mark written exams.
                </p>
              </div>
            </div>
          )}

          {activeTab === "legibility" && (
            <div className="flex flex-col md:flex-row items-center gap-6 p-4">
              <div className="h-16 w-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 border border-amber-200">
                <ShieldAlert className="h-8 w-8" />
              </div>
              <div className="space-y-2 text-left">
                <h4 className="font-bold text-sm text-foreground flex items-center gap-2">
                  <span>Smart Handwriting Legibility & Human-in-the-Loop Safeguard</span>
                  <span className="text-xs bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full font-semibold">
                    Fairness Guaranteed
                  </span>
                </h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  If a student's handwriting is blurry, overlapped, or illegible, the AI does <strong>NOT</strong> penalize the student.
                  Instead, it generates a <strong className="text-foreground">"⚠️ Legibility Alert: Manual Review Required"</strong> flag, points out the exact question or line number, and prompts the teacher to inspect and manually assign the mark before publishing results.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
