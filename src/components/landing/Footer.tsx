import Link from "next/link";
import { FileCheck2, Heart, Github } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border bg-card/50 py-12 text-xs text-muted-foreground">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Col */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600 text-white font-bold">
                <FileCheck2 className="h-4 w-4" />
              </div>
              <span className="font-extrabold text-lg text-foreground">
                Khata<span className="text-emerald-600">AI</span>
              </span>
            </div>
            <p className="text-xs leading-relaxed">
              Commercial-grade AI exam evaluation startup platform for schools, coaching centers, colleges, and international test takers in Bangladesh and worldwide.
            </p>
          </div>

          {/* Curricula */}
          <div>
            <h5 className="font-bold text-foreground mb-3 uppercase tracking-wider text-[11px]">Curricula Supported</h5>
            <ul className="space-y-2">
              <li><Link href="/#demo" className="hover:text-foreground">HSC / SSC Creative Questions (সৃজনশীল)</Link></li>
              <li><Link href="/#demo" className="hover:text-foreground">IELTS Academic & General Writing</Link></li>
              <li><Link href="/#demo" className="hover:text-foreground">Dhaka University 'Ka/Kha/Ga' Units</Link></li>
              <li><Link href="/#demo" className="hover:text-foreground">BUET Written Engineering Exams</Link></li>
              <li><Link href="/#demo" className="hover:text-foreground">BCS Preliminary & Written Exams</Link></li>
            </ul>
          </div>

          {/* Platform Suites */}
          <div>
            <h5 className="font-bold text-foreground mb-3 uppercase tracking-wider text-[11px]">Platform Portals</h5>
            <ul className="space-y-2">
              <li><Link href="/about" className="hover:text-foreground">About Us</Link></li>
              <li><Link href="/pricing" className="hover:text-foreground">Features & Pricing</Link></li>
              <li><Link href="/contact" className="hover:text-foreground">Contact Us</Link></li>
              <li><Link href="/student" className="hover:text-foreground">Student Public Exam Arena</Link></li>
              <li><Link href="/portal" className="hover:text-foreground">Coaching & Institution Directory</Link></li>
              <li><Link href="/admin/login" className="hover:text-foreground font-semibold text-emerald-600">Admin Control Gateway</Link></li>
            </ul>
          </div>

          {/* Technology & Vercel */}
          <div>
            <h5 className="font-bold text-foreground mb-3 uppercase tracking-wider text-[11px]">Deployment & AI</h5>
            <ul className="space-y-2">
              <li>Hosted on Vercel Serverless (Zero hosting fee)</li>
              <li>Google Gemini 3.8 Flash Vision OCR</li>
              <li>OpenAI GPT-6 Astra & o3-pro</li>
              <li>Anthropic Claude Opus 5.5</li>
              <li>xAI Grok 4.7 & DeepSeek V4.1 Flash</li>
            </ul>
          </div>
        </div>

        <div className="pt-6 border-t border-border flex flex-wrap items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} KhataAI Inc. Made for Bangladesh & Global Education.</p>
          <div className="flex items-center gap-4">
            <Link href="/admin/login" className="hover:text-foreground font-semibold text-emerald-600">
              Admin Gateway
            </Link>
            <span>•</span>
            <Link href="/portal" className="hover:text-foreground">Institution Portals</Link>
            <span>•</span>
            <Link href="/student" className="hover:text-foreground">Student Arena</Link>
            <span>•</span>
            <Link href="/pricing" className="hover:text-foreground">Pricing</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
