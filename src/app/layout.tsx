import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/shared/Navbar";
import { AuthProvider } from "@/contexts/AuthContext";

export const metadata: Metadata = {
  title: "KhataAI (খাতা AI) - AI Exam Evaluation & Assessment Platform",
  description:
    "Intelligent handwritten and online exam evaluation platform for Bangladeshi (SSC, HSC, BCS, Varsity) and International (IELTS, SAT) examinations.",
  keywords: [
    "AI Exam Evaluation",
    "Handwritten OCR Grading",
    "HSC CQ Evaluation",
    "SSC Creative Question",
    "IELTS Writing Evaluation",
    "Bangladesh EdTech",
    "খাতা AI",
  ],
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
    apple: "/icon.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="min-h-screen bg-background antialiased flex flex-col">
        <AuthProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}
