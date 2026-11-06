"use client";

import { useState } from "react";
import Link from "next/link";
import { BookOpen, ArrowLeft, CheckCircle2, Sliders, PlusCircle } from "lucide-react";
import { EXAM_TYPES } from "@/lib/constants";
import { AdminGuard } from "@/components/admin/AdminGuard";

export default function AdminCurriculumPage() {
  const [curricula, setCurricula] = useState(EXAM_TYPES);

  return (
    <AdminGuard>
      <div className="container mx-auto max-w-6xl px-4 sm:px-6 py-8 space-y-8">
      <div className="flex items-center justify-between pb-4 border-b border-border">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/ai-settings"
            className="p-2 rounded-xl border border-border hover:bg-accent transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-foreground">
              Curriculum & Examination Types
            </h1>
            <p className="text-xs text-muted-foreground">
              Manage national and international exam structures, pass criteria, and negative marking rates.
            </p>
          </div>
        </div>

        <Link
          href="/admin/ai-settings"
          className="text-xs font-bold text-emerald-600 hover:text-emerald-700"
        >
          Go to AI Gateway →
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {curricula.map((c) => (
          <div
            key={c.id}
            className="p-6 rounded-2xl border border-border bg-card shadow-sm space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-xs text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200">
                {c.code}
              </span>
              <span className="text-[11px] font-bold text-muted-foreground uppercase">
                {c.category}
              </span>
            </div>

            <div>
              <h3 className="font-bold text-sm text-foreground">{c.name}</h3>
              <p className="text-xs text-emerald-700 font-semibold bengali-font mt-0.5">{c.nameBn}</p>
            </div>

            <p className="text-xs text-muted-foreground leading-relaxed">{c.description}</p>

            <div className="pt-3 border-t border-border flex flex-wrap items-center justify-between text-xs text-muted-foreground">
              <span>Negative Mark: <strong>{c.defaultNegativeMarking ? `-${c.defaultNegativeMarking}` : "None"}</strong></span>
              <div className="flex items-center gap-2">
                {c.hasCQ && <span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded font-bold text-[10px]">CQ (সৃজনশীল)</span>}
                {c.hasMCQ && <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded font-bold text-[10px]">MCQ</span>}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </AdminGuard>
  );
}
