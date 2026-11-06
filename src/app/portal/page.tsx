"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Building2,
  ExternalLink,
  PlusCircle,
  Copy,
  CheckCircle2,
  BookOpen,
  MapPin,
  Sparkles,
  Users,
  Search,
} from "lucide-react";
import { InstitutionProfile } from "@/lib/types";

export default function InstitutionDirectoryPage() {
  const [institutions, setInstitutions] = useState<InstitutionProfile[]>([]);
  const [filterType, setFilterType] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);

  // Add Institution Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [type, setType] = useState<"COACHING" | "SCHOOL" | "COLLEGE" | "VARSITY" | "INDIVIDUAL">("COACHING");
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetch("/api/institutions")
      .then((r) => r.json())
      .then((data) => {
        if (data.institutions) setInstitutions(data.institutions);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleCopyLink = (s: string) => {
    const url = `${window.location.origin}/portal/${s}`;
    navigator.clipboard.writeText(url);
    setCopiedSlug(s);
    setTimeout(() => setCopiedSlug(null), 2000);
  };

  const handleCreateInstitution = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSubmitting(true);
    const generatedSlug = slug.trim() || name.toLowerCase().replace(/[^a-z0-9]+/g, "-");

    try {
      const res = await fetch("/api/institutions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          slug: generatedSlug,
          type,
          description,
          address: address || "Bangladesh",
        }),
      });
      const data = await res.json();
      if (data.institution) {
        setInstitutions([data.institution, ...institutions]);
        setShowAddModal(false);
        setName("");
        setSlug("");
        setDescription("");
        setAddress("");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const types = [
    { id: "ALL", label: "All Institutions" },
    { id: "COACHING", label: "Coaching Centers" },
    { id: "COLLEGE", label: "Colleges" },
    { id: "SCHOOL", label: "High Schools" },
    { id: "VARSITY", label: "Universities" },
    { id: "INDIVIDUAL", label: "Private Tutors / Batches" },
  ];

  const filtered = institutions.filter((inst) => {
    const matchesType = filterType === "ALL" || inst.type === filterType;
    const matchesSearch =
      inst.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inst.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inst.slug.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  return (
    <div className="container mx-auto max-w-7xl px-4 sm:px-6 py-8 space-y-8">
      {/* Header Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white p-6 sm:p-10 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-bold">
              <Building2 className="h-3.5 w-3.5 text-emerald-400" />
              Verified Educational Institutions
            </div>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight">
              Coaching & Institution Portals
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
              Explore official examination portals for Bangladesh's leading coaching centers (Udvash, Saifur's), colleges (Notre Dame), and private tutor batches. Students can access institution tests and receive AI graded results.
            </p>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-5 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs sm:text-sm shadow-xl shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 shrink-0 self-start md:self-center"
          >
            <PlusCircle className="h-4 w-4" />
            Register Your Institution
          </button>
        </div>
      </div>

      {/* Register Institution Modal / Dropdown */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <h3 className="font-extrabold text-base text-foreground flex items-center gap-2">
                <Building2 className="h-5 w-5 text-emerald-600" />
                Register New Institution Portal
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-xs font-bold text-muted-foreground hover:text-foreground p-1"
              >
                ✕ Close
              </button>
            </div>

            <form onSubmit={handleCreateInstitution} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground">Institution Name:</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (!slug) {
                      setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-"));
                    }
                  }}
                  placeholder="e.g. UCC Admission Care / Dhaka Residential Model"
                  className="w-full px-3.5 py-2 rounded-xl border border-border bg-background text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground">Institution Type:</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as any)}
                  className="w-full px-3.5 py-2 rounded-xl border border-border bg-background text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                >
                  <option value="COACHING">Coaching Center (কোচিং সেন্টার)</option>
                  <option value="SCHOOL">High School (মাধ্যমিক বিদ্যালয়)</option>
                  <option value="COLLEGE">Higher Secondary College (কলেজ)</option>
                  <option value="VARSITY">University / Varsity (বিশ্ববিদ্যালয়)</option>
                  <option value="INDIVIDUAL">Private Tutor / Batch (প্রাইভেট শিক্ষক)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground">Portal URL Slug:</label>
                <div className="flex items-center">
                  <span className="px-3 py-2 rounded-l-xl border border-r-0 border-border bg-muted text-xs text-muted-foreground font-mono">
                    khata.ai/portal/
                  </span>
                  <input
                    type="text"
                    required
                    value={slug}
                    onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-_]/g, ""))}
                    placeholder="ucc-admission"
                    className="w-full px-3.5 py-2 rounded-r-xl border border-border bg-background text-sm font-mono focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground">Location / Branch:</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="e.g. Farmgate, Dhaka"
                  className="w-full px-3.5 py-2 rounded-xl border border-border bg-background text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground">Description:</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Specialized model tests and AI-evaluated CQ answer sheets."
                  className="w-full px-3.5 py-2 rounded-xl border border-border bg-background text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl border border-border bg-card text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 disabled:opacity-60"
                >
                  {isSubmitting ? "Creating..." : "Save & Open Portal"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Type Filter Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {types.map((t) => (
            <button
              key={t.id}
              onClick={() => setFilterType(t.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                filterType === t.id
                  ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
                  : "bg-card border border-border text-muted-foreground hover:text-foreground hover:bg-accent"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-64">
          <Search className="h-4 w-4 absolute left-3 top-2.5 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search institutions..."
            className="w-full pl-9 pr-3.5 py-1.5 rounded-xl border border-border bg-card text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Institutions Directory Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-extrabold text-foreground">
            Registered Institutions ({filtered.length})
          </h2>
          <span className="text-xs text-muted-foreground">Showing active portals</span>
        </div>

        {loading ? (
          <div className="p-16 text-center text-xs text-muted-foreground">
            Loading institution portals...
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center rounded-3xl border border-dashed border-border bg-card space-y-2">
            <p className="text-sm font-bold text-foreground">No institutions match your search.</p>
            <p className="text-xs text-muted-foreground">Try clearing filters or search keywords.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((inst) => (
              <div
                key={inst.id}
                className="p-6 rounded-3xl border border-border bg-card shadow-sm hover:border-emerald-300 hover:shadow-lg transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                      {inst.type}
                    </span>
                    {inst.address && (
                      <span className="text-[11px] text-muted-foreground flex items-center gap-1 truncate max-w-[150px]">
                        <MapPin className="h-3 w-3" /> {inst.address}
                      </span>
                    )}
                  </div>

                  <div>
                    <h3 className="font-bold text-base text-foreground leading-snug">{inst.name}</h3>
                    {inst.nameBn && (
                      <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 bengali-font mt-0.5">
                        {inst.nameBn}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground mt-2 line-clamp-2 leading-relaxed">
                      {inst.description}
                    </p>
                  </div>
                </div>

                <div className="space-y-3 pt-3 border-t border-border text-xs">
                  <div className="p-2 rounded-xl bg-muted/40 border border-border flex items-center justify-between text-[11px]">
                    <span className="text-muted-foreground font-mono truncate">
                      khata.ai/portal/<strong>{inst.slug}</strong>
                    </span>
                    <button
                      onClick={() => handleCopyLink(inst.slug)}
                      className="px-2 py-0.5 rounded-lg bg-card border border-border hover:bg-accent font-semibold flex items-center gap-1 shrink-0"
                    >
                      {copiedSlug === inst.slug ? (
                        <>
                          <CheckCircle2 className="h-3 w-3 text-emerald-600" /> Copied
                        </>
                      ) : (
                        <>
                          <Copy className="h-3 w-3" /> Copy
                        </>
                      )}
                    </button>
                  </div>

                  <Link
                    href={`/portal/${inst.slug}`}
                    className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-emerald-600/20 transition-all"
                  >
                    <span>Enter Student Portal</span>
                    <ExternalLink className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
