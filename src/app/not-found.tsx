import Link from "next/link";
import { ArrowLeft, FileQuestion } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-4 text-center space-y-4">
      <div className="h-16 w-16 rounded-3xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center border border-emerald-500/20 shadow-inner">
        <FileQuestion className="h-8 w-8" />
      </div>
      <div className="space-y-1">
        <h2 className="text-2xl font-black text-foreground">404 - Page Not Found</h2>
        <p className="text-xs text-muted-foreground max-w-sm">
          The exam, evaluation, or portal page you are looking for does not exist or has been moved.
        </p>
      </div>
      <Link
        href="/"
        className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold inline-flex items-center gap-1.5 shadow-md shadow-emerald-600/20 transition-all"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> Back to KHATA AI Home
      </Link>
    </div>
  );
}

