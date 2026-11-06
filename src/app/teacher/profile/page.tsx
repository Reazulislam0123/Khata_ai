"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Building2,
  Share2,
  Copy,
  CheckCircle2,
  Save,
  ArrowLeft,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  CreditCard,
} from "lucide-react";
import { InstitutionProfile, InstitutionType } from "@/lib/types";

export default function TeacherProfilePage() {
  const [profile, setProfile] = useState<InstitutionProfile | null>(null);
  const [name, setName] = useState("");
  const [nameBn, setNameBn] = useState("");
  const [slug, setSlug] = useState("");
  const [type, setType] = useState<InstitutionType>("COACHING");
  const [description, setDescription] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [address, setAddress] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetch("/api/institutions?userId=usr_teacher_01")
      .then((r) => r.json())
      .then((data) => {
        if (data.institution) {
          const inst = data.institution;
          setProfile(inst);
          setName(inst.name);
          setNameBn(inst.nameBn || "");
          setSlug(inst.slug);
          setType(inst.type);
          setDescription(inst.description || "");
          setContactEmail(inst.contactEmail || "");
          setContactPhone(inst.contactPhone || "");
          setAddress(inst.address || "");
        }
      });
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const res = await fetch("/api/institutions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          nameBn,
          slug,
          type,
          description,
          contactEmail,
          contactPhone,
          address,
        }),
      });
      const data = await res.json();
      if (data.institution) {
        setProfile(data.institution);
        alert("Institution Profile successfully saved!");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const portalUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/portal/${slug}`
      : `/portal/${slug}`;

  const copyLink = () => {
    navigator.clipboard.writeText(portalUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="container mx-auto max-w-4xl px-4 sm:px-6 py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-border">
        <div className="flex items-center gap-3">
          <Link
            href="/teacher"
            className="p-2 rounded-xl border border-border hover:bg-accent transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-foreground">
              Institution & Business Profile
            </h1>
            <p className="text-xs text-muted-foreground">
              Configure your school, coaching, or varsity public portal and shareable student links.
            </p>
          </div>
        </div>

        <Link
          href={`/portal/${slug}`}
          target="_blank"
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-accent text-emerald-900 border border-emerald-300 font-bold text-xs hover:bg-emerald-100 transition-colors"
        >
          View Public Portal <ExternalLink className="h-3.5 w-3.5" />
        </Link>
      </div>

      {/* Shareable Portal Banner */}
      <div className="p-6 rounded-2xl border border-emerald-300 bg-emerald-50/80 shadow-sm space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Share2 className="h-5 w-5 text-emerald-700" />
            <h3 className="font-extrabold text-sm text-emerald-950">
              Your Shareable Student Portal Link:
            </h3>
          </div>
          <span className="text-[11px] font-bold text-emerald-800 bg-white/60 px-2 py-0.5 rounded border border-emerald-200">
            Send this to your students
          </span>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="text"
            readOnly
            value={portalUrl}
            className="flex-1 px-3.5 py-2 rounded-xl border border-emerald-300 bg-white font-mono text-xs text-emerald-900 select-all"
          />
          <button
            onClick={copyLink}
            className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 shadow-sm flex items-center gap-1.5 shrink-0"
          >
            {copied ? (
              <>
                <CheckCircle2 className="h-4 w-4" /> Copied!
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" /> Copy Link
              </>
            )}
          </button>
        </div>
      </div>

      {/* Profile Form */}
      <form onSubmit={handleSave} className="p-6 rounded-2xl border border-border bg-card shadow-sm space-y-6">
        <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
          <Building2 className="h-4 w-4 text-emerald-600" />
          Institution Information
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-foreground">Institution Name (English):</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Udvash Academic & Admission Care"
              className="w-full px-3.5 py-2 rounded-xl border border-border bg-background text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-foreground">নাম (বাংলা):</label>
            <input
              type="text"
              value={nameBn}
              onChange={(e) => setNameBn(e.target.value)}
              placeholder="e.g. উদ্ভাস একাডেমিক কেয়ার"
              className="w-full px-3.5 py-2 rounded-xl border border-border bg-background text-sm bengali-font focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-foreground">Custom URL Slug (হ্যান্ডেল):</label>
            <div className="flex items-center">
              <span className="px-3 py-2 rounded-l-xl bg-muted border border-r-0 border-border text-xs text-muted-foreground font-mono">
                /portal/
              </span>
              <input
                type="text"
                required
                value={slug}
                onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-"))}
                placeholder="udvash-farmgate"
                className="w-full px-3 py-2 rounded-r-xl border border-border bg-background text-sm font-mono focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-foreground">Business / Organization Type:</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as InstitutionType)}
              className="w-full px-3.5 py-2 rounded-xl border border-border bg-background text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            >
              <option value="COACHING">Coaching Center (কোচিং সেন্টার)</option>
              <option value="SCHOOL">School (স্কুল)</option>
              <option value="COLLEGE">College (কলেজ)</option>
              <option value="VARSITY">University / Varsity (বিশ্ববিদ্যালয়)</option>
              <option value="INDIVIDUAL">Individual Tutor / Teacher (ব্যক্তিগত টিউটর)</option>
            </select>
          </div>

          <div className="space-y-1.5 sm:col-span-2">
            <label className="text-xs font-bold text-foreground">Description & Student Instructions:</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Write a welcoming message and instructions for your students..."
              className="w-full px-3.5 py-2 rounded-xl border border-border bg-background text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-foreground">Contact Email:</label>
            <input
              type="email"
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-border bg-background text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-foreground">Contact Phone / WhatsApp:</label>
            <input
              type="text"
              value={contactPhone}
              onChange={(e) => setContactPhone(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-border bg-background text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Subscription Plan Status */}
        <div className="p-4 rounded-xl border border-border bg-muted/20 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-foreground">
                Current Plan: <span className="text-emerald-700">{profile?.subscriptionPlan || "COACHING_ULTRA"}</span>
              </div>
              <div className="text-[11px] text-muted-foreground">
                Quota: <strong>{profile?.scriptsUsed || 184}</strong> / {profile?.scriptsQuota || 2500} scripts evaluated this month
              </div>
            </div>
          </div>

          <Link
            href="/#pricing"
            className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 shadow-sm"
          >
            Upgrade / Buy Service
          </Link>
        </div>

        <button
          type="submit"
          disabled={isSaving}
          className="w-full py-3 rounded-xl bg-emerald-600 font-bold text-sm text-white shadow-md shadow-emerald-600/20 hover:bg-emerald-700 transition-all flex items-center justify-center gap-2"
        >
          {isSaving ? "Saving Changes..." : "Save Profile & Update Portal"}
        </button>
      </form>
    </div>
  );
}
