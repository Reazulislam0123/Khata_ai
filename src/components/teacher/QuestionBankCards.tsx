"use client";

import { useEffect, useState } from "react";
import {
  Sparkles,
  PlusCircle,
  Search,
  Filter,
  Trash2,
  Edit3,
  Copy,
  CheckCircle2,
  BookOpen,
  Layers,
  HelpCircle,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  X,
  Tag,
  Check,
  FileText,
  Sliders,
} from "lucide-react";

export interface RubricPoint {
  criterion: string;
  maxPoints: number;
  description?: string;
  keywords?: string[];
}

export interface CQPart {
  part: "ka" | "kha" | "ga" | "gha";
  bengaliLabel: string;
  marks: number;
  questionText: string;
  modelAnswer: string;
  rubrics?: RubricPoint[];
}

export interface MCQOption {
  label: "A" | "B" | "C" | "D";
  text: string;
}

export interface QuestionCardData {
  id: string;
  _id?: string;
  type: "CQ" | "MCQ" | "WRITTEN" | "DESCRIPTIVE";
  questionText: string;
  stimulusText?: string;
  marks: number;
  difficulty: "EASY" | "MEDIUM" | "HARD";
  curriculumCode?: string;
  tags?: string[];
  mcqOptions?: MCQOption[];
  correctOption?: "A" | "B" | "C" | "D";
  cqParts?: CQPart[];
  modelAnswer?: string;
  rubrics?: RubricPoint[];
  createdAt?: string;
}

export default function QuestionBankCards() {
  const [questions, setQuestions] = useState<QuestionCardData[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string>("ALL");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("ALL");

  // Modals & Forms
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Form State
  const [formType, setFormType] = useState<"CQ" | "MCQ" | "WRITTEN">("CQ");
  const [formQuestionText, setFormQuestionText] = useState("");
  const [formStimulusText, setFormStimulusText] = useState("");
  const [formMarks, setFormMarks] = useState(10);
  const [formDifficulty, setFormDifficulty] = useState<"EASY" | "MEDIUM" | "HARD">("MEDIUM");
  const [formCurriculum, setFormCurriculum] = useState("HSC");
  const [formTags, setFormTags] = useState("পদার্থবিজ্ঞান, গতিবিদ্যা, HSC-2026");

  // MCQ Form
  const [mcqA, setMcqA] = useState("");
  const [mcqB, setMcqB] = useState("");
  const [mcqC, setMcqC] = useState("");
  const [mcqD, setMcqD] = useState("");
  const [formCorrectOption, setFormCorrectOption] = useState<"A" | "B" | "C" | "D">("A");

  // CQ Form
  const [cqKaText, setCqKaText] = useState("");
  const [cqKaAnswer, setCqKaAnswer] = useState("");
  const [cqKhaText, setCqKhaText] = useState("");
  const [cqKhaAnswer, setCqKhaAnswer] = useState("");
  const [cqGaText, setCqGaText] = useState("");
  const [cqGaAnswer, setCqGaAnswer] = useState("");
  const [cqGhaText, setCqGhaText] = useState("");
  const [cqGhaAnswer, setCqGhaAnswer] = useState("");

  // Written Form
  const [writtenAnswer, setWrittenAnswer] = useState("");

  // AI Modal
  const [showAiModal, setShowAiModal] = useState(false);
  const [aiTopic, setAiTopic] = useState("গতির সমীকরণ ও প্রাসের গতি");
  const [aiType, setAiType] = useState<"CQ" | "MCQ" | "WRITTEN">("CQ");
  const [aiDifficulty, setAiDifficulty] = useState<"EASY" | "MEDIUM" | "HARD">("MEDIUM");
  const [isAiGenerating, setIsAiGenerating] = useState(false);

  // Expanded card parts map
  const [expandedCq, setExpandedCq] = useState<Record<string, boolean>>({});

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/questions");
      const data = await res.json();
      if (data.questions) {
        setQuestions(data.questions);
      }
    } catch (err) {
      console.error("Failed to fetch question cards:", err);
    } finally {
      setLoading(false);
    }
  };

  const toggleExpand = (qId: string) => {
    setExpandedCq((prev) => ({ ...prev, [qId]: !prev[qId] }));
  };

  const openCreateModal = () => {
    setEditingId(null);
    setFormType("CQ");
    setFormQuestionText("উদ্দীপকটি পড়ে নিচের প্রশ্নগুলোর যথাযথ উত্তর দাও:");
    setFormStimulusText("");
    setFormMarks(10);
    setFormDifficulty("MEDIUM");
    setFormCurriculum("HSC");
    setFormTags("পদার্থবিজ্ঞান, গতিবিদ্যা, HSC-2026");

    // MCQ reset
    setMcqA("");
    setMcqB("");
    setMcqC("");
    setMcqD("");
    setFormCorrectOption("A");

    // CQ reset
    setCqKaText("প্রাস (Projectile) কী?");
    setCqKaAnswer("অনুভূমিকের সাথে কোনো কোণে শূন্যে নিক্ষিপ্ত বস্তুকে প্রাস বলে।");
    setCqKhaText("অনুভূমিক বরাবর নিক্ষিপ্ত বস্তুর ত্বরণ শূন্য কেন?");
    setCqKhaAnswer("অনুভূমিক দিকে কোনো বাহ্যিক বল ক্রিয়াশীল থাকে না।");
    setCqGaText("তির্যকভাবে নিক্ষিপ্ত বস্তুর সর্বাধিক উচ্চতা নির্ণয় কর।");
    setCqGaAnswer("H = (u² sin² θ) / (2g)");
    setCqGhaText("উভয় বস্তুর ভূমিতে আঘাতের সময় গাণিতিকভাবে বিশ্লেষণ কর।");
    setCqGhaAnswer("উভয়ের ক্ষেত্রে উল্লম্ব গতির সূত্র প্রয়োগ করে সময় গণনা করা হলো।");

    setWrittenAnswer("");
    setShowModal(true);
  };

  const openEditModal = (q: QuestionCardData) => {
    setEditingId(q.id || q._id || null);
    setFormType(q.type === "MCQ" ? "MCQ" : q.type === "WRITTEN" ? "WRITTEN" : "CQ");
    setFormQuestionText(q.questionText || "");
    setFormStimulusText(q.stimulusText || "");
    setFormMarks(q.marks || (q.type === "MCQ" ? 1 : 10));
    setFormDifficulty(q.difficulty || "MEDIUM");
    setFormCurriculum(q.curriculumCode || "HSC");
    setFormTags(q.tags?.join(", ") || "");

    if (q.type === "MCQ" && q.mcqOptions) {
      setMcqA(q.mcqOptions[0]?.text || "");
      setMcqB(q.mcqOptions[1]?.text || "");
      setMcqC(q.mcqOptions[2]?.text || "");
      setMcqD(q.mcqOptions[3]?.text || "");
      setFormCorrectOption(q.correctOption || "A");
    }

    if (q.type === "CQ" && q.cqParts) {
      const ka = q.cqParts.find((p) => p.part === "ka");
      const kha = q.cqParts.find((p) => p.part === "kha");
      const ga = q.cqParts.find((p) => p.part === "ga");
      const gha = q.cqParts.find((p) => p.part === "gha");

      setCqKaText(ka?.questionText || "");
      setCqKaAnswer(ka?.modelAnswer || "");
      setCqKhaText(kha?.questionText || "");
      setCqKhaAnswer(kha?.modelAnswer || "");
      setCqGaText(ga?.questionText || "");
      setCqGaAnswer(ga?.modelAnswer || "");
      setCqGhaText(gha?.questionText || "");
      setCqGhaAnswer(gha?.modelAnswer || "");
    }

    setWrittenAnswer(q.modelAnswer || "");
    setShowModal(true);
  };

  const handleSaveQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formQuestionText.trim()) return;

    setIsSaving(true);
    try {
      const payload: any = {
        type: formType,
        questionText: formQuestionText.trim(),
        stimulusText: formStimulusText.trim() || undefined,
        marks: Number(formMarks),
        difficulty: formDifficulty,
        curriculumCode: formCurriculum,
        tags: formTags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
      };

      if (formType === "MCQ") {
        payload.mcqOptions = [
          { label: "A", text: mcqA.trim() },
          { label: "B", text: mcqB.trim() },
          { label: "C", text: mcqC.trim() },
          { label: "D", text: mcqD.trim() },
        ];
        payload.correctOption = formCorrectOption;
      } else if (formType === "CQ") {
        payload.cqParts = [
          {
            part: "ka",
            bengaliLabel: "ক",
            marks: 1,
            questionText: cqKaText.trim(),
            modelAnswer: cqKaAnswer.trim(),
          },
          {
            part: "kha",
            bengaliLabel: "খ",
            marks: 2,
            questionText: cqKhaText.trim(),
            modelAnswer: cqKhaAnswer.trim(),
          },
          {
            part: "ga",
            bengaliLabel: "গ",
            marks: 3,
            questionText: cqGaText.trim(),
            modelAnswer: cqGaAnswer.trim(),
          },
          {
            part: "gha",
            bengaliLabel: "ঘ",
            marks: 4,
            questionText: cqGhaText.trim(),
            modelAnswer: cqGhaAnswer.trim(),
          },
        ];
      } else {
        payload.modelAnswer = writtenAnswer.trim();
      }

      if (editingId) {
        // Update existing question
        const res = await fetch(`/api/questions/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (data.success) {
          setShowModal(false);
          fetchQuestions();
        }
      } else {
        // Create new question
        const res = await fetch("/api/questions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (data.success) {
          setShowModal(false);
          fetchQuestions();
        }
      }
    } catch (err) {
      console.error("Save question error:", err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteQuestion = async (id: string) => {
    if (!confirm("Are you sure you want to delete this question card?")) return;

    try {
      const res = await fetch(`/api/questions/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setQuestions((prev) => prev.filter((q) => (q.id || q._id) !== id));
      }
    } catch (err) {
      console.error("Delete question error:", err);
    }
  };

  const handleDuplicateQuestion = async (q: QuestionCardData) => {
    try {
      const { id, _id, ...rest } = q;
      const clone = {
        ...rest,
        questionText: `${q.questionText} (Copy)`,
      };

      const res = await fetch("/api/questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(clone),
      });
      const data = await res.json();
      if (data.success) {
        fetchQuestions();
      }
    } catch (err) {
      console.error("Duplicate question error:", err);
    }
  };

  const handleAiGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiTopic.trim()) return;

    setIsAiGenerating(true);
    try {
      const res = await fetch("/api/questions/ai-generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: aiTopic,
          type: aiType,
          difficulty: aiDifficulty,
          curriculumCode: "HSC",
        }),
      });
      const data = await res.json();
      if (data.question) {
        // Post generated question into questions bank
        await fetch("/api/questions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data.question),
        });
        setShowAiModal(false);
        fetchQuestions();
      }
    } catch (err) {
      console.error("AI generation failed:", err);
    } finally {
      setIsAiGenerating(false);
    }
  };

  // Filtered Questions
  const filteredQuestions = questions.filter((q) => {
    const matchesSearch =
      !searchQuery ||
      q.questionText?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.stimulusText?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.tags?.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesType = selectedType === "ALL" || q.type === selectedType;
    const matchesDiff = selectedDifficulty === "ALL" || q.difficulty === selectedDifficulty;

    return matchesSearch && matchesType && matchesDiff;
  });

  return (
    <div className="space-y-6">
      {/* Top Action Bar */}
      <div className="rounded-3xl border border-border bg-card p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-emerald-600 text-white shadow-sm">
                <Layers className="h-5 w-5" />
              </span>
              <h2 className="text-xl font-extrabold text-foreground">
                Question Bank (Card Mode)
              </h2>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Create, read, update and delete CQ, MCQ and Written question cards with verified Bengali rubrics.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => setShowAiModal(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-xs font-bold hover:bg-emerald-100 transition-all shadow-sm"
            >
              <Sparkles className="h-4 w-4 text-emerald-600" />
              <span>⚡ AI Question Generator</span>
            </button>
            <button
              onClick={openCreateModal}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition-all"
            >
              <PlusCircle className="h-4 w-4" />
              <span>Create Question Card</span>
            </button>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="pt-2 border-t border-border flex flex-col md:flex-row items-center justify-between gap-3">
          {/* Search Bar */}
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search question cards by topic, text, or tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-border bg-background text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          {/* Type & Difficulty Filters */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            {/* Type Filter */}
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-3 py-2 rounded-xl border border-border bg-background text-xs font-semibold focus:outline-none"
            >
              <option value="ALL">All Question Types</option>
              <option value="CQ">Creative (CQ / সৃজনশীল)</option>
              <option value="MCQ">Multiple Choice (MCQ)</option>
              <option value="WRITTEN">Written / Descriptive</option>
            </select>

            {/* Difficulty Filter */}
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="px-3 py-2 rounded-xl border border-border bg-background text-xs font-semibold focus:outline-none"
            >
              <option value="ALL">All Difficulties</option>
              <option value="EASY">🟢 Easy</option>
              <option value="MEDIUM">🟡 Medium</option>
              <option value="HARD">🔴 Hard</option>
            </select>

            <span className="text-xs font-bold text-muted-foreground ml-1">
              Showing {filteredQuestions.length} Cards
            </span>
          </div>
        </div>
      </div>

      {/* Question Cards Grid */}
      {loading ? (
        <div className="p-12 text-center text-xs text-muted-foreground space-y-2">
          <div className="h-8 w-8 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p>Loading Question Bank Cards...</p>
        </div>
      ) : filteredQuestions.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-border bg-card p-12 text-center space-y-3">
          <BookOpen className="h-10 w-10 text-muted-foreground mx-auto opacity-60" />
          <h3 className="text-base font-bold text-foreground">No Question Cards Found</h3>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto">
            No questions match your current search query. Create a new card or click AI Generator.
          </p>
          <button
            onClick={openCreateModal}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold shadow-md shadow-emerald-600/20"
          >
            <PlusCircle className="h-4 w-4" /> Create First Question Card
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {filteredQuestions.map((q, idx) => {
            const cardId = q.id || q._id || `q_${idx}`;
            const isExpanded = expandedCq[cardId];

            return (
              <div
                key={cardId}
                className="rounded-3xl border border-border/80 bg-card/95 hover:border-emerald-500/50 card-hover-pro p-6 sm:p-7 shadow-[0_4px_25px_rgb(0,0,0,0.03)] hover:shadow-xl flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  {/* Card Header Chips */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-border">
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-3 py-1 rounded-xl text-xs font-extrabold shadow-sm ${
                          q.type === "CQ"
                            ? "bg-purple-50 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300 border border-purple-200 dark:border-purple-800"
                            : q.type === "MCQ"
                            ? "bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
                            : "bg-sky-50 text-sky-800 dark:bg-sky-950/60 dark:text-sky-300 border border-sky-200 dark:border-sky-800"
                        }`}
                      >
                        {q.type === "CQ" ? "সৃজনশীল (CQ)" : q.type === "MCQ" ? "বহুনির্বাচনী (MCQ)" : "লিখিত (Written)"}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-lg bg-muted text-foreground text-xs font-bold border border-border/60">
                        {q.marks} Marks
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
                          q.difficulty === "EASY"
                            ? "bg-emerald-50 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800"
                            : q.difficulty === "HARD"
                            ? "bg-rose-50 text-rose-800 dark:bg-rose-950 dark:text-rose-300 border-rose-200 dark:border-rose-800"
                            : "bg-amber-50 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border-amber-200 dark:border-amber-800"
                        }`}
                      >
                        {q.difficulty}
                      </span>
                      <span className="text-[11px] font-bold text-muted-foreground bg-muted px-2 py-0.5 rounded-md">
                        {q.curriculumCode || "HSC"}
                      </span>
                    </div>
                  </div>

                  {/* Stimulus (উদ্দীপক) */}
                  {q.stimulusText && (
                    <div className="p-4 rounded-2xl bg-emerald-50/40 dark:bg-emerald-950/20 border-l-4 border-l-emerald-600 border border-border/80 text-xs bengali-font space-y-1">
                      <div className="font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5 text-xs">
                        <BookOpen className="h-3.5 w-3.5 text-emerald-600" />
                        <span>উদ্দীপক (Stimulus Scenario):</span>
                      </div>
                      <p className="text-foreground/90 leading-relaxed">
                        {q.stimulusText}
                      </p>
                    </div>
                  )}

                  {/* Question Main Prompt */}
                  <div className="space-y-1">
                    <p className="text-xs sm:text-sm font-semibold text-foreground leading-relaxed bengali-font">
                      {q.questionText}
                    </p>
                  </div>

                  {/* MCQ Options Display */}
                  {q.type === "MCQ" && q.mcqOptions && (
                    <div className="grid grid-cols-2 gap-2 pt-1">
                      {q.mcqOptions.map((opt) => {
                        const isCorrect = q.correctOption === opt.label;
                        return (
                          <div
                            key={opt.label}
                            className={`p-2.5 rounded-xl border text-xs flex items-center justify-between transition-all ${
                              isCorrect
                                ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/60 font-bold text-emerald-950 dark:text-emerald-200"
                                : "border-border bg-background/50 text-foreground"
                            }`}
                          >
                            <span className="bengali-font">
                              ({opt.label}) {opt.text}
                            </span>
                            {isCorrect && (
                              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* CQ Subparts (ক, খ, গ, ঘ) Display */}
                  {q.type === "CQ" && q.cqParts && q.cqParts.length > 0 && (
                    <div className="space-y-2 pt-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                          Subparts (ক, খ, গ, ঘ)
                        </span>
                        <button
                          type="button"
                          onClick={() => toggleExpand(cardId)}
                          className="text-[11px] font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
                        >
                          {isExpanded ? "Collapse Rubrics" : "Expand Model Answers"}
                          {isExpanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                        </button>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        {q.cqParts.map((part) => (
                          <div
                            key={part.part}
                            className="p-2.5 rounded-xl border border-border/80 bg-muted/20 text-xs space-y-1"
                          >
                            <div className="flex items-center justify-between font-bold">
                              <span className="text-emerald-800 dark:text-emerald-300">
                                ({part.bengaliLabel}) {part.marks} নম্বর
                              </span>
                            </div>
                            <p className="text-[11px] text-foreground font-medium truncate bengali-font">
                              {part.questionText}
                            </p>
                            {isExpanded && part.modelAnswer && (
                              <div className="pt-1.5 border-t border-border/60 text-[11px] text-muted-foreground bengali-font">
                                <strong>নমুনা উত্তর:</strong> {part.modelAnswer}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Written Answer Display */}
                  {q.type === "WRITTEN" && q.modelAnswer && (
                    <div className="p-3 rounded-xl bg-muted/30 border border-border text-xs bengali-font space-y-1">
                      <span className="font-bold text-foreground">নমুনা সমাধান (Model Answer):</span>
                      <p className="text-muted-foreground line-clamp-2">{q.modelAnswer}</p>
                    </div>
                  )}

                  {/* Tags */}
                  {q.tags && q.tags.length > 0 && (
                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                      {q.tags.map((tag, tIdx) => (
                        <span
                          key={tIdx}
                          className="px-2 py-0.5 rounded-md bg-muted text-muted-foreground text-[10px] font-semibold flex items-center gap-1"
                        >
                          <Tag className="h-2.5 w-2.5" />
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Card Actions Footer */}
                <div className="pt-3 border-t border-border flex items-center justify-between gap-2">
                  <span className="text-[10px] text-muted-foreground">
                    ID: {cardId.slice(-6)}
                  </span>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleDuplicateQuestion(q)}
                      title="Duplicate Card"
                      className="p-2 rounded-xl border border-border hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <Copy className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => openEditModal(q)}
                      title="Edit Question Card"
                      className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-border bg-card hover:bg-accent text-xs font-bold text-foreground transition-colors shadow-sm"
                    >
                      <Edit3 className="h-3.5 w-3.5 text-emerald-600" />
                      <span>Edit</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteQuestion(cardId)}
                      title="Delete Question Card"
                      className="p-2 rounded-xl border border-rose-200 dark:border-rose-900 bg-rose-50/50 dark:bg-rose-950/30 text-rose-600 hover:bg-rose-100 transition-colors"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ────────────────────────────────────────────────────────────────────────── */}
      {/* MODAL: CREATE / EDIT QUESTION CARD */}
      {/* ────────────────────────────────────────────────────────────────────────── */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div>
                <h3 className="text-lg font-black text-foreground">
                  {editingId ? "Edit Question Card" : "Create New Question Card"}
                </h3>
                <p className="text-xs text-muted-foreground">
                  Set question structure, stimulus, and answer keys in interactive card mode.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="p-2 rounded-full hover:bg-accent text-muted-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveQuestion} className="space-y-4">
              {/* Question Type Selection */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-foreground">Question Format / Type *</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: "CQ", label: "Creative (CQ / সৃজনশীল)" },
                    { id: "MCQ", label: "Multiple Choice (MCQ)" },
                    { id: "WRITTEN", label: "Written / Descriptive" },
                  ].map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => {
                        setFormType(t.id as any);
                        if (t.id === "MCQ") setFormMarks(1);
                        else if (t.id === "CQ") setFormMarks(10);
                        else setFormMarks(5);
                      }}
                      className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all text-center ${
                        formType === t.id
                          ? "border-emerald-600 bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
                          : "border-border bg-background hover:bg-accent text-foreground"
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* General Metadata */}
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-foreground">Total Marks *</label>
                  <input
                    type="number"
                    min={1}
                    max={100}
                    value={formMarks}
                    onChange={(e) => setFormMarks(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-border bg-background text-xs font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-foreground">Difficulty</label>
                  <select
                    value={formDifficulty}
                    onChange={(e) => setFormDifficulty(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-border bg-background text-xs font-semibold focus:outline-none"
                  >
                    <option value="EASY">Easy</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HARD">Hard</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-foreground">Curriculum Code</label>
                  <input
                    type="text"
                    value={formCurriculum}
                    onChange={(e) => setFormCurriculum(e.target.value)}
                    placeholder="e.g. HSC"
                    className="w-full px-3 py-2 rounded-xl border border-border bg-background text-xs font-semibold focus:outline-none"
                  />
                </div>
              </div>

              {/* Stimulus Input (Optional) */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-foreground">
                  উদ্দীপক / Stimulus Scenario (Optional)
                </label>
                <textarea
                  rows={3}
                  placeholder="উদ্দীপকের তথ্য, পরীক্ষা বা দৃশ্যপট এখানে লিখুন..."
                  value={formStimulusText}
                  onChange={(e) => setFormStimulusText(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-border bg-background text-xs bengali-font focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              {/* Main Question Text */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-foreground">
                  Question Text / মূল প্রশ্ন *
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="প্রশ্নটি লিখুন..."
                  value={formQuestionText}
                  onChange={(e) => setFormQuestionText(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-border bg-background text-xs bengali-font focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              {/* MCQ Options Config */}
              {formType === "MCQ" && (
                <div className="p-4 rounded-2xl bg-muted/30 border border-border space-y-3">
                  <label className="text-xs font-bold text-foreground">
                    MCQ 4 Options & Select Correct Answer *
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      { label: "A", val: mcqA, setVal: setMcqA },
                      { label: "B", val: mcqB, setVal: setMcqB },
                      { label: "C", val: mcqC, setVal: setMcqC },
                      { label: "D", val: mcqD, setVal: setMcqD },
                    ].map((opt) => (
                      <div key={opt.label} className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setFormCorrectOption(opt.label as any)}
                          className={`h-7 w-7 rounded-lg text-xs font-extrabold flex items-center justify-center shrink-0 border ${
                            formCorrectOption === opt.label
                              ? "bg-emerald-600 text-white border-emerald-600 shadow-sm"
                              : "bg-card text-muted-foreground border-border"
                          }`}
                        >
                          {opt.label}
                        </button>
                        <input
                          type="text"
                          required
                          placeholder={`Option (${opt.label}) text...`}
                          value={opt.val}
                          onChange={(e) => opt.setVal(e.target.value)}
                          className="w-full px-3 py-1.5 rounded-xl border border-border bg-background text-xs bengali-font focus:outline-none"
                        />
                      </div>
                    ))}
                  </div>
                  <p className="text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold">
                    Correct Option Selected: <strong>({formCorrectOption})</strong>
                  </p>
                </div>
              )}

              {/* CQ Subparts Config */}
              {formType === "CQ" && (
                <div className="p-4 rounded-2xl bg-muted/30 border border-border space-y-3">
                  <label className="text-xs font-bold text-foreground">
                    সৃজনশীল ৪টি অংশ (ক, খ, গ, ঘ) ও নমুনা উত্তর
                  </label>

                  <div className="space-y-3">
                    {/* ক */}
                    <div className="p-3 rounded-xl bg-card border border-border space-y-1.5">
                      <div className="flex items-center justify-between text-xs font-bold text-foreground">
                        <span>(ক) জ্ঞানমূলক প্রশ্ন - ১ নম্বর</span>
                      </div>
                      <input
                        type="text"
                        placeholder="প্রশ্ন (ক)..."
                        value={cqKaText}
                        onChange={(e) => setCqKaText(e.target.value)}
                        className="w-full px-3 py-1.5 rounded-lg border border-border bg-background text-xs bengali-font"
                      />
                      <input
                        type="text"
                        placeholder="নমুনা উত্তর (ক)..."
                        value={cqKaAnswer}
                        onChange={(e) => setCqKaAnswer(e.target.value)}
                        className="w-full px-3 py-1.5 rounded-lg border border-border bg-background text-[11px] bengali-font text-muted-foreground"
                      />
                    </div>

                    {/* খ */}
                    <div className="p-3 rounded-xl bg-card border border-border space-y-1.5">
                      <div className="flex items-center justify-between text-xs font-bold text-foreground">
                        <span>(খ) অনুধাবনমূলক প্রশ্ন - ২ নম্বর</span>
                      </div>
                      <input
                        type="text"
                        placeholder="প্রশ্ন (খ)..."
                        value={cqKhaText}
                        onChange={(e) => setCqKhaText(e.target.value)}
                        className="w-full px-3 py-1.5 rounded-lg border border-border bg-background text-xs bengali-font"
                      />
                      <input
                        type="text"
                        placeholder="নমুনা উত্তর (খ)..."
                        value={cqKhaAnswer}
                        onChange={(e) => setCqKhaAnswer(e.target.value)}
                        className="w-full px-3 py-1.5 rounded-lg border border-border bg-background text-[11px] bengali-font text-muted-foreground"
                      />
                    </div>

                    {/* গ */}
                    <div className="p-3 rounded-xl bg-card border border-border space-y-1.5">
                      <div className="flex items-center justify-between text-xs font-bold text-foreground">
                        <span>(গ) প্রয়োগমূলক প্রশ্ন - ৩ নম্বর</span>
                      </div>
                      <input
                        type="text"
                        placeholder="প্রশ্ন (গ)..."
                        value={cqGaText}
                        onChange={(e) => setCqGaText(e.target.value)}
                        className="w-full px-3 py-1.5 rounded-lg border border-border bg-background text-xs bengali-font"
                      />
                      <input
                        type="text"
                        placeholder="নমুনা উত্তর (গ)..."
                        value={cqGaAnswer}
                        onChange={(e) => setCqGaAnswer(e.target.value)}
                        className="w-full px-3 py-1.5 rounded-lg border border-border bg-background text-[11px] bengali-font text-muted-foreground"
                      />
                    </div>

                    {/* ঘ */}
                    <div className="p-3 rounded-xl bg-card border border-border space-y-1.5">
                      <div className="flex items-center justify-between text-xs font-bold text-foreground">
                        <span>(ঘ) উচ্চতর দক্ষতামূলক প্রশ্ন - ৪ নম্বর</span>
                      </div>
                      <input
                        type="text"
                        placeholder="প্রশ্ন (ঘ)..."
                        value={cqGhaText}
                        onChange={(e) => setCqGhaText(e.target.value)}
                        className="w-full px-3 py-1.5 rounded-lg border border-border bg-background text-xs bengali-font"
                      />
                      <input
                        type="text"
                        placeholder="নমুনা উত্তর (ঘ)..."
                        value={cqGhaAnswer}
                        onChange={(e) => setCqGhaAnswer(e.target.value)}
                        className="w-full px-3 py-1.5 rounded-lg border border-border bg-background text-[11px] bengali-font text-muted-foreground"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Written Model Answer */}
              {formType === "WRITTEN" && (
                <div className="space-y-1">
                  <label className="text-xs font-bold text-foreground">
                    Model Answer / নমুনা সমাধান *
                  </label>
                  <textarea
                    rows={3}
                    placeholder="সঠিক উত্তর ও সমাধানের ধাপসমূহ লিখুন..."
                    value={writtenAnswer}
                    onChange={(e) => setWrittenAnswer(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-border bg-background text-xs bengali-font focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              )}

              {/* Tags Input */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-foreground">Tags (Comma-separated)</label>
                <input
                  type="text"
                  placeholder="e.g. পদার্থবিজ্ঞান, গতিবিদ্যা, প্রাস, HSC-2026"
                  value={formTags}
                  onChange={(e) => setFormTags(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-border bg-background text-xs font-medium focus:outline-none"
                />
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-border hover:bg-accent text-xs font-bold text-muted-foreground"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 disabled:opacity-60"
                >
                  {isSaving ? "Saving Card..." : editingId ? "Update Card" : "Save Question Card"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ────────────────────────────────────────────────────────────────────────── */}
      {/* MODAL: AI QUESTION GENERATOR */}
      {/* ────────────────────────────────────────────────────────────────────────── */}
      {showAiModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-3xl border border-border bg-card p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-2 border-b border-border">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-emerald-600 text-white">
                  <Sparkles className="h-4 w-4" />
                </span>
                <h3 className="text-base font-black text-foreground">AI Question Generator</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAiModal(false)}
                className="p-1.5 rounded-full hover:bg-accent text-muted-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleAiGenerate} className="space-y-3.5">
              <div className="space-y-1">
                <label className="text-xs font-bold text-foreground">Subject & Specific Topic *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. গতিবিদ্যা ও প্রাসের গতি / জারণ-বিজারণ"
                  value={aiTopic}
                  onChange={(e) => setAiTopic(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-border bg-background text-xs bengali-font focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-foreground">Question Format</label>
                  <select
                    value={aiType}
                    onChange={(e) => setAiType(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-border bg-background text-xs font-semibold focus:outline-none"
                  >
                    <option value="CQ">Creative (CQ / সৃজনশীল)</option>
                    <option value="MCQ">Multiple Choice (MCQ)</option>
                    <option value="WRITTEN">Written / Descriptive</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-foreground">Difficulty</label>
                  <select
                    value={aiDifficulty}
                    onChange={(e) => setAiDifficulty(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-border bg-background text-xs font-semibold focus:outline-none"
                  >
                    <option value="EASY">Easy</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HARD">Hard</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAiModal(false)}
                  className="px-4 py-2 rounded-xl border border-border hover:bg-accent text-xs font-bold text-muted-foreground"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isAiGenerating}
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 disabled:opacity-60 flex items-center gap-1.5"
                >
                  {isAiGenerating ? (
                    <>
                      <div className="h-3.5 w-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Generating Card...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-3.5 w-3.5" />
                      <span>Generate Card</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

