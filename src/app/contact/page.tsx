"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Mail,
  Phone,
  MapPin,
  Building2,
  Sparkles,
  Send,
  CheckCircle2,
  Clock,
  ArrowLeft,
  MessageSquare,
} from "lucide-react";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [institution, setInstitution] = useState("");
  const [inquiryType, setInquiryType] = useState("COACHING");
  const [message, setMessage] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulated contact submission
    await new Promise((r) => setTimeout(r, 800));
    setIsLoading(false);
    setIsSubmitted(true);
  };

  return (
    <div className="min-h-screen py-10">
      <div className="container mx-auto max-w-6xl px-4 sm:px-6 space-y-12">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Home
        </Link>

        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold">
            <Sparkles className="h-3.5 w-3.5" />
            We'd Love to Hear From You
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-foreground tracking-tight">
            Contact Khata AI Educational Solutions
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Whether you want to implement AI grading across your coaching branches, request custom rubric models, or schedule a demo for your varsity, our engineering team is here to assist.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Information & Channels */}
          <div className="space-y-6">
            <div className="rounded-2xl border border-border bg-card p-6 space-y-5 shadow-sm">
              <h2 className="text-base font-bold text-foreground">Direct Inquiries</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                    <Mail className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-foreground">Email Support</div>
                    <a
                      href="mailto:support@khata.ai"
                      className="text-xs text-emerald-600 hover:underline"
                    >
                      support@khata.ai
                    </a>
                    <div className="text-[11px] text-muted-foreground">Average reply time: under 2 hours</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                    <Phone className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-foreground">Coaching & Institutional Sales</div>
                    <div className="text-xs text-foreground font-semibold">+880 1711 000000</div>
                    <div className="text-[11px] text-muted-foreground">Sat - Thu, 9:00 AM - 8:00 PM (BST)</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                    <MapPin className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-foreground">Dhaka Innovation Lab</div>
                    <div className="text-xs text-muted-foreground">
                      Banani / Kawran Bazar Tech Hub, Dhaka, Bangladesh
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Feature Pill */}
            <div className="rounded-2xl bg-gradient-to-tr from-emerald-950 to-teal-900 text-white p-6 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-300">
                <Clock className="h-4 w-4" /> Fast-Track Pilot Testing
              </div>
              <p className="text-xs text-emerald-100/90 leading-relaxed">
                Want to evaluate 100 sample handwritten papers from your institution? Send us a message and we'll process them in our sandbox at no cost.
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-xl">
              {isSubmitted ? (
                <div className="py-12 text-center space-y-4">
                  <div className="h-14 w-14 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto shadow-inner">
                    <CheckCircle2 className="h-8 w-8" />
                  </div>
                  <h3 className="text-2xl font-black text-foreground">Message Dispatched!</h3>
                  <p className="text-xs text-muted-foreground max-w-md mx-auto">
                    Thank you for reaching out, <strong>{name}</strong>. Our academic technology representative will contact you at <strong>{email}</strong> within 24 hours.
                  </p>
                  <button
                    onClick={() => {
                      setIsSubmitted(false);
                      setName("");
                      setEmail("");
                      setMessage("");
                    }}
                    className="py-2.5 px-5 rounded-xl border border-border bg-muted hover:bg-accent text-xs font-bold text-foreground transition-all"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                    <MessageSquare className="h-4 w-4 text-emerald-600" /> Send an Inquiry
                  </h2>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-foreground">Your Name *</label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Principal Kabir / Rafiqul Islam"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-foreground">Email Address *</label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="e.g. educator@institution.edu.bd"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-foreground">Phone Number (Optional)</label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="e.g. +880 1712 000000"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-foreground">Institution / Coaching Name</label>
                      <input
                        type="text"
                        value={institution}
                        onChange={(e) => setInstitution(e.target.value)}
                        placeholder="e.g. Apex Academy / Model College"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-foreground">Inquiry Category</label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {[
                        { id: "COACHING", label: "Coaching Center" },
                        { id: "COLLEGE", label: "College / School" },
                        { id: "VARSITY", label: "Varsity / Board" },
                        { id: "API", label: "Custom API / Tech" },
                      ].map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setInquiryType(item.id)}
                          className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all text-center ${
                            inquiryType === item.id
                              ? "border-emerald-600 bg-emerald-50 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                              : "border-border bg-background text-muted-foreground hover:bg-accent"
                          }`}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-foreground">Your Message *</label>
                    <textarea
                      required
                      rows={4}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Tell us about your student volume, curriculum (HSC, SSC, IELTS, etc.), and what you're looking to achieve with automated evaluation..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 rounded-xl bg-emerald-600 font-bold text-sm text-white shadow-md shadow-emerald-600/20 hover:bg-emerald-700 transition-all disabled:opacity-60 flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      "Sending..."
                    ) : (
                      <>
                        <Send className="h-4 w-4" /> Send Message
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

