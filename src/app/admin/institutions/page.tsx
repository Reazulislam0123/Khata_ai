"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Building2,
  Plus,
  Search,
  CheckCircle2,
  XCircle,
  ArrowLeft,
  Users,
  ShieldCheck,
  CreditCard,
  Mail,
  ExternalLink,
} from "lucide-react";
import { AdminGuard } from "@/components/admin/AdminGuard";

interface InstitutionItem {
  id: string;
  name: string;
  slug: string;
  contactEmail?: string;
  subscriptionTier?: string;
  isActive?: boolean;
  studentCount?: number;
  batchCount?: number;
}

export default function InstitutionManagementPage() {
  const [institutions, setInstitutions] = useState<InstitutionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);

  // Form state
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [email, setEmail] = useState("");
  const [tier, setTier] = useState("PRO");

  const loadInstitutions = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/institutions");
      const data = await res.json();
      if (data.success && data.institutions) {
        setInstitutions(data.institutions);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInstitutions();
  }, []);

  const handleCreateInstitution = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/institutions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          slug: slug.toLowerCase().replace(/[^a-z0-9-]/g, "-"),
          contactEmail: email,
          subscriptionTier: tier,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setShowAddModal(false);
        setName("");
        setSlug("");
        setEmail("");
        loadInstitutions();
      } else {
        alert(data.error || "Failed to create institution");
      }
    } catch (err: any) {
      alert(err.message);
    }
  };

  const filtered = institutions.filter(
    (i) =>
      i.name.toLowerCase().includes(search.toLowerCase()) ||
      i.slug.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminGuard>
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 py-8 space-y-6">
        {/* Top Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-border">
          <div className="flex items-center gap-3">
            <Link
              href="/admin"
              className="p-2 rounded-xl border border-border hover:bg-accent transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-foreground flex items-center gap-2">
                <Building2 className="h-6 w-6 text-emerald-600" />
                Institution Management
              </h1>
              <p className="text-xs text-muted-foreground">
                Manage registered universities, colleges, and coaching centers on Khata AI.
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-600/20 transition-all"
          >
            <Plus className="h-4 w-4" />
            Register Institution
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="h-4 w-4 absolute left-3.5 top-3 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search institutions by name or slug..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-card text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          />
        </div>

        {/* Institutions Table */}
        <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-xs text-muted-foreground">
              Loading registered institutions...
            </div>
          ) : filtered.length === 0 ? (
            <div className="p-12 text-center text-xs text-muted-foreground space-y-2">
              <Building2 className="h-8 w-8 text-muted-foreground mx-auto" />
              <p className="font-bold">No institutions found matching your filter.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-muted/40 border-b border-border text-muted-foreground uppercase text-[10px] font-bold">
                  <tr>
                    <th className="px-5 py-3.5">Institution Name</th>
                    <th className="px-5 py-3.5">Slug ID</th>
                    <th className="px-5 py-3.5">Plan Tier</th>
                    <th className="px-5 py-3.5">Contact Email</th>
                    <th className="px-5 py-3.5">Status</th>
                    <th className="px-5 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filtered.map((inst) => (
                    <tr key={inst.id} className="hover:bg-muted/20 transition-colors">
                      <td className="px-5 py-4 font-bold text-foreground">
                        <div className="flex items-center gap-2.5">
                          <div className="h-8 w-8 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center font-bold">
                            {inst.name.charAt(0)}
                          </div>
                          <span>{inst.name}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4 font-mono text-muted-foreground">
                        @{inst.slug}
                      </td>
                      <td className="px-5 py-4">
                        <span className="px-2.5 py-0.5 rounded-full font-bold text-[10px] bg-indigo-50 text-indigo-700 border border-indigo-200">
                          {inst.subscriptionTier || "PRO"}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-muted-foreground">
                        {inst.contactEmail || "admin@" + inst.slug + ".edu.bd"}
                      </td>
                      <td className="px-5 py-4">
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600">
                          <CheckCircle2 className="h-3.5 w-3.5" /> Active
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <Link
                          href={`/teacher`}
                          className="px-3 py-1.5 rounded-lg border border-border bg-card hover:bg-accent text-[11px] font-bold text-foreground inline-flex items-center gap-1"
                        >
                          Launch Portal <ExternalLink className="h-3 w-3" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Modal: Add New Institution */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-card border border-border rounded-3xl p-6 shadow-2xl space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <h3 className="font-extrabold text-sm text-foreground flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-emerald-600" />
                  Register New Institution
                </h3>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="text-xs text-muted-foreground hover:text-foreground font-bold"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleCreateInstitution} className="space-y-4 text-xs">
                <div className="space-y-1">
                  <label className="font-bold text-foreground">Institution Name:</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      if (!slug) {
                        setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]/g, "-"));
                      }
                    }}
                    placeholder="e.g. Dhaka Residential Model College"
                    className="w-full px-3 py-2 rounded-xl border border-border bg-background focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-foreground">Unique Slug Identifier:</label>
                  <input
                    type="text"
                    required
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="e.g. drmc-dhaka"
                    className="w-full px-3 py-2 rounded-xl border border-border bg-background font-mono focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-foreground">Contact Email:</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@drmc.edu.bd"
                    className="w-full px-3 py-2 rounded-xl border border-border bg-background focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-foreground">Subscription Tier:</label>
                  <select
                    value={tier}
                    onChange={(e) => setTier(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-border bg-background focus:ring-2 focus:ring-emerald-500 focus:outline-none font-bold"
                  >
                    <option value="FREE">PILOT / FREE (Up to 50 examinees)</option>
                    <option value="PRO">PRO PLAN (Up to 500 examinees)</option>
                    <option value="ENTERPRISE">ENTERPRISE (Unlimited Examinees)</option>
                  </select>
                </div>

                <div className="pt-2 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 rounded-xl border border-border hover:bg-accent font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-md shadow-emerald-600/20"
                  >
                    Create Institution
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminGuard>
  );
}

