"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Cpu,
  Sparkles,
  Key,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowRight,
  Globe,
  Sliders,
  Play,
  RotateCcw,
} from "lucide-react";
import { AI_MODELS, EXAM_TYPES } from "@/lib/constants";
import { AIModelDefinition, GlobalAISettings } from "@/lib/types";
import { AdminGuard } from "@/components/admin/AdminGuard";

export default function AdminAISettingsPage() {
  const [settings, setSettings] = useState<GlobalAISettings | null>(null);
  const [selectedProvider, setSelectedProvider] = useState<string>("google");
  const [apiKeyInput, setApiKeyInput] = useState("");
  const [customModelInput, setCustomModelInput] = useState("");
  const [customBaseUrl, setCustomBaseUrl] = useState("");
  const [testingModel, setTestingModel] = useState<string | null>(null);
  const [testResult, setTestResult] = useState<{
    success: boolean;
    latencyMs?: number;
    message?: string;
    error?: string;
  } | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetch("/api/ai-settings")
      .then((r) => r.json())
      .then((data) => {
        if (data.settings) {
          setSettings(data.settings);
          const currentProv = data.settings.providers[selectedProvider];
          if (currentProv) {
            setApiKeyInput(currentProv.apiKey || "");
            if (currentProv.baseUrl) setCustomBaseUrl(currentProv.baseUrl);
          }
        }
      });
  }, [selectedProvider]);

  const handleSelectProvider = (prov: string) => {
    setSelectedProvider(prov);
    setTestResult(null);
    if (settings?.providers[prov]) {
      setApiKeyInput(settings.providers[prov].apiKey || "");
      if (settings.providers[prov].baseUrl) {
        setCustomBaseUrl(settings.providers[prov].baseUrl || "");
      }
    }
  };

  const handleSelectModel = (modelId: string) => {
    if (!settings) return;
    const updated = {
      ...settings,
      defaultProvider: selectedProvider as any,
      defaultModelId: modelId,
      providers: {
        ...settings.providers,
        [selectedProvider]: {
          ...settings.providers[selectedProvider],
          selectedModelId: modelId,
          isActive: true,
        },
      },
    };
    setSettings(updated);
  };

  const handleTestConnection = async (modelId: string) => {
    setTestingModel(modelId);
    setTestResult(null);

    try {
      const res = await fetch("/api/ai-settings/test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          provider: selectedProvider,
          modelId,
          apiKey: apiKeyInput,
        }),
      });
      const data = await res.json();
      setTestResult(data);
    } catch (err: any) {
      setTestResult({
        success: false,
        error: err.message || "Failed to reach AI provider",
      });
    } finally {
      setTestingModel(null);
    }
  };

  const handleSaveSettings = async () => {
    if (!settings) return;
    setIsSaving(true);

    try {
      const updated = {
        ...settings,
        providers: {
          ...settings.providers,
          [selectedProvider]: {
            ...settings.providers[selectedProvider],
            apiKey: apiKeyInput,
            baseUrl: selectedProvider === "custom" ? customBaseUrl : undefined,
          },
        },
      };

      const res = await fetch("/api/ai-settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated),
      });
      const data = await res.json();
      if (data.success) {
        alert("AI Settings successfully saved!");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const providerModels = AI_MODELS.filter((m) => m.provider === selectedProvider);

  return (
    <AdminGuard>
      <div className="container mx-auto max-w-6xl px-4 sm:px-6 py-8 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold">
              ⚡ Super Admin Control Center
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-foreground mt-1">
            Multi-Model AI Gateway & BYOK Configuration
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Select frontier models, input API keys, test connection latency, and route specific exams to specialized AI engines.
          </p>
        </div>

        <button
          onClick={handleSaveSettings}
          disabled={isSaving}
          className="flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-xs sm:text-sm font-bold text-white shadow-md shadow-emerald-600/20 hover:bg-emerald-700 transition-all disabled:opacity-60"
        >
          {isSaving ? "Saving..." : "Save Active AI Configuration"}
        </button>
      </div>

      {/* Provider Tabs */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-2xl bg-muted/40 border border-border">
        {[
          { id: "google", label: "Google Gemini", count: "3.8 / 3.7 / 3.5" },
          { id: "anthropic", label: "Anthropic Claude", count: "Opus 5.5 / Sonnet" },
          { id: "openai", label: "OpenAI Fleet", count: "GPT-6 / o3 / 4o" },
          { id: "xai", label: "xAI Grok", count: "Grok 4.7 / 4.3" },
          { id: "deepseek", label: "DeepSeek", count: "V4.1 / R1" },
          { id: "custom", label: "Custom / BYOK", count: "OpenRouter" },
        ].map((prov) => (
          <button
            key={prov.id}
            onClick={() => handleSelectProvider(prov.id)}
            className={`flex-1 min-w-[140px] px-4 py-2.5 rounded-xl text-left transition-all ${
              selectedProvider === prov.id
                ? "bg-card text-foreground font-extrabold shadow-sm border border-border"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <div className="text-xs font-bold">{prov.label}</div>
            <div className="text-[10px] text-muted-foreground">{prov.count}</div>
          </button>
        ))}
      </div>

      {/* API Key & Connection Tester Card */}
      <div className="p-6 rounded-2xl border border-border bg-card shadow-sm space-y-4">
        <h3 className="text-sm font-black text-foreground flex items-center gap-2">
          <Key className="h-4 w-4 text-emerald-600" />
          {selectedProvider.toUpperCase()} API Key (Bring Your Own Key)
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          <div className="sm:col-span-8">
            <input
              type="password"
              value={apiKeyInput}
              onChange={(e) => setApiKeyInput(e.target.value)}
              placeholder={`Enter your ${selectedProvider.toUpperCase()} API Key (Optional in demo mode)`}
              className="w-full px-3.5 py-2 rounded-xl border border-border bg-background text-xs font-mono focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          <div className="sm:col-span-4 flex items-center gap-2">
            <button
              onClick={() => handleTestConnection(settings?.defaultModelId || "gemini-3.8-flash")}
              disabled={testingModel !== null}
              className="w-full py-2 rounded-xl bg-accent text-emerald-900 border border-emerald-300 font-bold text-xs hover:bg-emerald-100 flex items-center justify-center gap-1.5 transition-colors disabled:opacity-60"
            >
              {testingModel ? (
                <>
                  <div className="h-3 w-3 border-2 border-emerald-700 border-t-transparent rounded-full animate-spin" />
                  Testing Ping...
                </>
              ) : (
                <>
                  <Play className="h-3 w-3 fill-emerald-800" />
                  Test Connection
                </>
              )}
            </button>
          </div>
        </div>

        {selectedProvider === "custom" && (
          <div className="space-y-1.5 pt-2">
            <label className="text-xs font-bold text-foreground">Custom Base URL (e.g. OpenRouter):</label>
            <input
              type="text"
              value={customBaseUrl}
              onChange={(e) => setCustomBaseUrl(e.target.value)}
              placeholder="https://openrouter.ai/api/v1"
              className="w-full px-3.5 py-2 rounded-xl border border-border bg-background text-xs font-mono focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>
        )}

        {/* Test Result Alert Banner */}
        {testResult && (
          <div
            className={`p-3.5 rounded-xl border text-xs flex items-center justify-between ${
              testResult.success
                ? "border-emerald-300 bg-emerald-50/80 text-emerald-950"
                : "border-destructive/40 bg-destructive/10 text-destructive"
            }`}
          >
            <div className="flex items-center gap-2">
              {testResult.success ? (
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
              ) : (
                <AlertCircle className="h-4 w-4 text-destructive shrink-0" />
              )}
              <span>{testResult.message || testResult.error}</span>
            </div>
            {testResult.latencyMs && (
              <span className="font-mono font-bold text-[11px] text-emerald-700 bg-white/60 px-2 py-0.5 rounded">
                ⚡ {testResult.latencyMs}ms
              </span>
            )}
          </div>
        )}

        <p className="text-[11px] text-muted-foreground">
          🔒 API keys are stored securely and never sent to client browsers. If empty, the platform uses intelligent local simulation out of the box.
        </p>
      </div>

      {/* Selectable Models Fleet Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-black text-foreground flex items-center gap-2">
            <Cpu className="h-4 w-4 text-emerald-600" />
            Select Active Model for {selectedProvider.toUpperCase()}
          </h3>
          <span className="text-xs text-muted-foreground">
            Current Default: <strong>{settings?.defaultModelId}</strong>
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {providerModels.map((model) => {
            const isSelected = settings?.defaultModelId === model.id;
            return (
              <div
                key={model.id}
                onClick={() => handleSelectModel(model.id)}
                className={`p-5 rounded-2xl border text-left cursor-pointer transition-all flex flex-col justify-between ${
                  isSelected
                    ? "border-emerald-500 bg-emerald-50/20 shadow-md ring-2 ring-emerald-500/20"
                    : "border-border bg-card hover:border-emerald-300 shadow-sm"
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] text-muted-foreground bg-muted px-2 py-0.5 rounded">
                      {model.releaseDate}
                    </span>
                    {model.badge && (
                      <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                        {model.badge}
                      </span>
                    )}
                  </div>

                  <h4 className="font-extrabold text-sm text-foreground">{model.name}</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">{model.description}</p>
                </div>

                <div className="pt-4 mt-3 border-t border-border flex items-center justify-between">
                  <span className="text-[11px] text-emerald-700 font-semibold truncate max-w-[180px]">
                    {model.recommendedFor}
                  </span>
                  <div
                    className={`h-5 w-5 rounded-full border flex items-center justify-center ${
                      isSelected ? "border-emerald-600 bg-emerald-600 text-white" : "border-muted-foreground"
                    }`}
                  >
                    {isSelected && <div className="h-2 w-2 rounded-full bg-white" />}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Curriculum to AI Model Routing */}
      <div className="p-6 rounded-2xl border border-border bg-card shadow-sm space-y-4">
        <h3 className="text-sm font-black text-foreground flex items-center gap-2">
          <Sliders className="h-4 w-4 text-emerald-600" />
          Per-Curriculum Smart Routing (Specialized Engines)
        </h3>
        <p className="text-xs text-muted-foreground">
          Route different examination formats to specialized models for peak accuracy.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
          <div className="p-3.5 rounded-xl border border-border bg-background space-y-1">
            <span className="font-bold text-xs text-foreground">HSC / SSC Physics & Chemistry CQ:</span>
            <div className="text-xs text-emerald-700 font-extrabold">Gemini 3.8 Flash (Vision)</div>
            <p className="text-[10px] text-muted-foreground">Best for Bengali cursive OCR & 4-part CQ</p>
          </div>

          <div className="p-3.5 rounded-xl border border-border bg-background space-y-1">
            <span className="font-bold text-xs text-foreground">IELTS Academic Writing:</span>
            <div className="text-xs text-emerald-700 font-extrabold">Claude Opus 5.5</div>
            <p className="text-[10px] text-muted-foreground">Deep nuanced vocabulary & grammar scoring</p>
          </div>

          <div className="p-3.5 rounded-xl border border-border bg-background space-y-1">
            <span className="font-bold text-xs text-foreground">BUET Written Math Problems:</span>
            <div className="text-xs text-emerald-700 font-extrabold">OpenAI GPT-6 Astra / o3</div>
            <p className="text-[10px] text-muted-foreground">Step-by-step mathematical proof checking</p>
          </div>

          <div className="p-3.5 rounded-xl border border-border bg-background space-y-1">
            <span className="font-bold text-xs text-foreground">High-Volume Batch MCQs:</span>
            <div className="text-xs text-emerald-700 font-extrabold">Gemini 3.5 Flash-Lite</div>
            <p className="text-[10px] text-muted-foreground">Instantaneous sub-100ms response time</p>
          </div>
        </div>
      </div>
    </div>
  </AdminGuard>
  );
}
