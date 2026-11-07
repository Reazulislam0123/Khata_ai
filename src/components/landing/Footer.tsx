import Link from "next/link";
import { FileCheck2, Heart, Github, Sparkles, ShieldCheck } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border/80 bg-card/60 backdrop-blur-md py-14 text-xs text-muted-foreground">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand Col */}
          <div className="space-y-3.5">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white shadow-md shadow-emerald-500/20">
                <FileCheck2 className="h-5 w-5" />
              </div>
              <div>
                <span className="font-black text-lg text-foreground tracking-tight">
                  Khata<span className="text-emerald-600">AI</span>
                </span>
                <span className="bengali-font ml-2 rounded-md bg-emerald-50 dark:bg-emerald-950 px-1.5 py-0.5 text-[10px] font-bold text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                  খাতা AI
                </span>
              </div>
            </div>
            <p className="text-xs leading-relaxed text-muted-foreground max-w-sm">
              Next-generation AI examination and script evaluation platform for schools, coaching centers, colleges, and national test takers in Bangladesh and worldwide.
            </p>
            <div className="flex items-center gap-2 pt-1 text-[11px] font-semibold text-emerald-700 dark:text-emerald-400">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              <span>Verified Multimodal AI Grading</span>
            </div>
          </div>

          {/* Curricula */}
          <div>
            <h5 className="font-bold text-foreground mb-3 uppercase tracking-wider text-[11px]">Curricula Supported</h5>
            <ul className="space-y-2.5">
              <li><Link href="/student" className="hover:text-emerald-600 transition-colors">HSC / SSC Creative Questions (সৃজনশীল)</Link></li>
              <li><Link href="/student" className="hover:text-emerald-600 transition-colors">IELTS Academic & General Writing</Link></li>
              <li><Link href="/student" className="hover:text-emerald-600 transition-colors">Dhaka University 'Ka/Kha/Ga' Units</Link></li>
              <li><Link href="/student" className="hover:text-emerald-600 transition-colors">BUET Written Engineering Exams</Link></li>
              <li><Link href="/student" className="hover:text-emerald-600 transition-colors">BCS Preliminary & Written Exams</Link></li>
            </ul>
          </div>

          {/* Platform Suites */}
          <div>
            <h5 className="font-bold text-foreground mb-3 uppercase tracking-wider text-[11px]">Platform Portals</h5>
            <ul className="space-y-2.5">
              <li><Link href="/pricing" className="hover:text-emerald-600 transition-colors">Features & Transparent Pricing</Link></li>
              <li><Link href="/student" className="hover:text-emerald-600 transition-colors">Student Public Exam Arena</Link></li>
              <li><Link href="/portal" className="hover:text-emerald-600 transition-colors">Coaching & Institution Directory</Link></li>
              <li><Link href="/teacher" className="hover:text-emerald-600 transition-colors">Teacher Examination Dashboard</Link></li>
              <li><Link href="/admin/login" className="hover:text-emerald-600 transition-colors font-semibold text-emerald-600">Super Admin Gateway →</Link></li>
            </ul>
          </div>

          {/* Technology & Vercel */}
          <div>
            <h5 className="font-bold text-foreground mb-3 uppercase tracking-wider text-[11px]">Deployment & AI</h5>
            <ul className="space-y-2.5">
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                <span>Google Gemini 3.8 Flash Vision OCR</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-teal-500" />
                <span>Anthropic Claude Opus 5.5</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                <span>NCTB Step-by-Step Scoring Engine</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                <span>MongoDB Atlas & Firebase Auth</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-6 border-t border-border flex flex-wrap items-center justify-between gap-4 text-[11px]">
          <p>© {new Date().getFullYear()} KhataAI Inc. Made with precision for Bangladesh & Global Education.</p>
          <div className="flex items-center gap-3">
            <Link href="/student" className="hover:text-foreground transition-colors">Student Arena</Link>
            <span>•</span>
            <Link href="/portal" className="hover:text-foreground transition-colors">Institution Portals</Link>
            <span>•</span>
            <Link href="/pricing" className="hover:text-foreground transition-colors">Pricing</Link>
            <span>•</span>
            <Link href="/admin/login" className="hover:text-foreground font-bold text-emerald-600 transition-colors">Admin Gateway</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
