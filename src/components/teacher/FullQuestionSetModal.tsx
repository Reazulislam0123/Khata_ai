"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  Sparkles,
  BookOpen,
  Plus,
  Trash2,
  Copy,
  CheckCircle2,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Printer,
  UploadCloud,
  Layers,
  HelpCircle,
  Clock,
  Award,
  FileText,
  Share2,
  ExternalLink,
  Check,
  RefreshCw,
  Send,
} from "lucide-react";

export interface MCQOptionItem {
  label: "A" | "B" | "C" | "D";
  text: string;
}

export interface CQPartItem {
  part: "ka" | "kha" | "ga" | "gha";
  bengaliLabel: string;
  marks: number;
  questionText: string;
  modelAnswer: string;
  rubrics?: Array<{
    criterion: string;
    maxPoints: number;
    description?: string;
  }>;
}

export interface QuestionSetItem {
  id: string;
  type: "MCQ" | "CQ";
  orderIndex: number;
  questionText: string;
  stimulusText?: string;
  marks: number;
  difficulty: "EASY" | "MEDIUM" | "HARD";
  curriculumCode: string;
  tags: string[];
  // MCQ fields
  mcqOptions?: MCQOptionItem[];
  correctOption?: "A" | "B" | "C" | "D";
  modelAnswer?: string;
  // CQ fields
  cqParts?: CQPartItem[];
}

interface FullQuestionSetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  institutionName?: string;
}

export default function FullQuestionSetModal({
  isOpen,
  onClose,
  onSuccess,
  institutionName = "KhataAI Academic Examination",
}: FullQuestionSetModalProps) {
  // Mode & configuration state
  const [setType, setSetType] = useState<"MCQ" | "CQ">("MCQ");
  const [targetCount, setTargetCount] = useState<number>(20);
  const [customCountInput, setCustomCountInput] = useState<string>("20");

  // Metadata
  const [setTitle, setSetTitle] = useState("HSC 2026 Physics 1st Paper - Full Model Test");
  const [subjectName, setSubjectName] = useState("Physics");
  const [topicName, setTopicName] = useState("গতিবিদ্যা, কাজ-শক্তি-ক্ষমতা ও মহাকর্ষ");
  const [curriculumCode, setCurriculumCode] = useState("HSC");
  const [difficulty, setDifficulty] = useState<"EASY" | "MEDIUM" | "HARD">("MEDIUM");
  const [durationMinutes, setDurationMinutes] = useState(25);
  const [negativeMarking, setNegativeMarking] = useState<number>(0.25);

  // Active Tab: "builder" | "ai" | "paste" | "preview"
  const [activeTab, setActiveTab] = useState<"builder" | "ai" | "paste" | "preview">("builder");

  // Questions Array
  const [questions, setQuestions] = useState<QuestionSetItem[]>([]);
  const [activeQuestionIdx, setActiveQuestionIdx] = useState<number>(0);

  // Status & Progress
  const [isLoadingAi, setIsLoadingAi] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishingExam, setIsPublishingExam] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);
  const [publishedExamLink, setPublishedExamLink] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  // Bulk Paste Text State
  const [bulkPasteText, setBulkPasteText] = useState("");
  const [parseNotice, setParseNotice] = useState<string | null>(null);

  // Initialize or re-template questions when setType or targetCount changes
  useEffect(() => {
    if (!isOpen) return;
    if (questions.length === 0) {
      generateInitialSkeleton(setType, targetCount);
    }
  }, [isOpen]);

  const generateInitialSkeleton = (type: "MCQ" | "CQ", count: number) => {
    const list: QuestionSetItem[] = [];
    for (let i = 1; i <= count; i++) {
      if (type === "MCQ") {
        list.push({
          id: `q_init_${Date.now()}_${i}`,
          type: "MCQ",
          orderIndex: i,
          questionText: `প্রশ্ন ${i}: ${topicName} সংক্রান্ত মূল সমীকরণ কোনটি?`,
          stimulusText: "",
          marks: 1,
          difficulty,
          curriculumCode,
          tags: [subjectName, curriculumCode, `MCQ-${i}`],
          mcqOptions: [
            { label: "A", text: "v² = u² + 2as" },
            { label: "B", text: "v = u + ½at²" },
            { label: "C", text: "s = vt + 2as" },
            { label: "D", text: "v² = 2u + as" },
          ],
          correctOption: "A",
          modelAnswer: "সুষম ত্বরণে গতিশীল বস্তুর ক্ষেত্রে সঠিক সম্পর্ক।",
        });
      } else {
        list.push({
          id: `q_init_cq_${Date.now()}_${i}`,
          type: "CQ",
          orderIndex: i,
          questionText: `সৃজনশীল প্রশ্ন নং ${i}: উদ্দীপকটি মনোযোগ সহকারে পড়ে নিচের প্রশ্নগুলোর উত্তর দাও:`,
          stimulusText: `উদ্দীপক-${i}: ${topicName} সংক্রান্ত একটি ব্যবহারিক পরীক্ষায় একটি বস্তুর গতি ও শক্তি পর্যবেক্ষণ করা হলো। পর্যবেক্ষণে বিভিন্ন সময়ে সরণ ও বেগের সুনির্দিষ্ট পরিবর্তন লক্ষ্য করা যায়। অভিকর্ষজ ত্বরণ g = 9.8 m/s²।`,
          marks: 10,
          difficulty,
          curriculumCode,
          tags: [subjectName, curriculumCode, `CQ-${i}`],
          cqParts: [
            {
              part: "ka",
              bengaliLabel: "ক",
              marks: 1,
              questionText: `${topicName} এর মৌলিক সংজ্ঞাটি লেখো।`,
              modelAnswer: `${topicName} এর স্বীকৃত বিজ্ঞানসম্মত সংজ্ঞা।`,
              rubrics: [{ criterion: "সঠিক জ্ঞানমূলক সংজ্ঞা", maxPoints: 1 }],
            },
            {
              part: "kha",
              bengaliLabel: "খ",
              marks: 2,
              questionText: `সংরক্ষণশীল বল দ্বারা কৃতকাজ শূন্য হয় কেন? ব্যাখ্যা করো।`,
              modelAnswer: `পূর্ণ চক্রে বস্তুর প্রাথমিক ও চূড়ান্ত অবস্থান এক হওয়ায় সরণ শূন্য, ফলে মোট কাজ শূন্য।`,
              rubrics: [
                { criterion: "সংরক্ষণশীল বলের বৈশিষ্ট্য", maxPoints: 1 },
                { criterion: "কার্যকারণ সমন্বিত ব্যাখ্যা", maxPoints: 1 },
              ],
            },
            {
              part: "ga",
              bengaliLabel: "গ",
              marks: 3,
              questionText: `উদ্দীপকের উপাত্ত ব্যবহার করে বস্তুটির প্রয়োজনীয় মান গাণিতিকভাবে নির্ণয় করো।`,
              modelAnswer: `সূত্র নির্বাচন -> মান প্রতিস্থাপন -> সঠিক এককসহ ফলাফল।`,
              rubrics: [
                { criterion: "সঠিক সূত্র", maxPoints: 1 },
                { criterion: "মান প্রতিস্থাপন", maxPoints: 1 },
                { criterion: "এককসহ উত্তর", maxPoints: 1 },
              ],
            },
            {
              part: "gha",
              bengaliLabel: "ঘ",
              marks: 4,
              questionText: `উদ্দীপকের আলোকে সংশ্লিষ্ট বৈজ্ঞানিক নীতিটির যথার্থতা গাণিতিকভাবে বিশ্লেষণ করে মতামত দাও।`,
              modelAnswer: `প্রাথমিক সিদ্ধান্ত -> গাণিতিক প্রতিপাদন -> সমন্বিত যৌক্তিক সমাপনী।`,
              rubrics: [
                { criterion: "স্পষ্ট সিদ্ধান্ত", maxPoints: 1 },
                { criterion: "গাণিতিক হিসাব", maxPoints: 2 },
                { criterion: "যৌক্তিক উপসংহার", maxPoints: 1 },
              ],
            },
          ],
        });
      }
    }
    setQuestions(list);
    setActiveQuestionIdx(0);
  };

  // Select Preset Handler
  const handleSelectPreset = (type: "MCQ" | "CQ", count: number, suggestedDuration: number) => {
    setSetType(type);
    setTargetCount(count);
    setCustomCountInput(count.toString());
    setDurationMinutes(suggestedDuration);
    generateInitialSkeleton(type, count);
  };

  // Custom Count Apply
  const handleApplyCustomCount = () => {
    const parsed = parseInt(customCountInput, 10);
    if (!isNaN(parsed) && parsed > 0 && parsed <= 100) {
      setTargetCount(parsed);
      generateInitialSkeleton(setType, parsed);
    }
  };

  // AI 1-Click Generation for Entire Set
  const handleAiGenerateFullSet = async () => {
    setIsLoadingAi(true);
    setSaveSuccessMsg(null);
    try {
      const res = await fetch("/api/questions/ai-generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject: subjectName,
          topic: topicName,
          curriculumCode,
          questionType: setType,
          difficulty,
          count: targetCount,
        }),
      });

      const data = await res.json();
      if (data.success && Array.isArray(data.questions) && data.questions.length > 0) {
        const formatted: QuestionSetItem[] = data.questions.map((q: any, idx: number) => ({
          id: `ai_q_${Date.now()}_${idx + 1}`,
          type: setType,
          orderIndex: idx + 1,
          questionText: q.questionText || `প্রশ্ন ${idx + 1}`,
          stimulusText: q.stimulusText || "",
          marks: q.marks || (setType === "CQ" ? 10 : 1),
          difficulty: q.difficulty || difficulty,
          curriculumCode: q.curriculumCode || curriculumCode,
          tags: q.tags || [subjectName, curriculumCode],
          mcqOptions: q.mcqOptions || [
            { label: "A", text: "Option A" },
            { label: "B", text: "Option B" },
            { label: "C", text: "Option C" },
            { label: "D", text: "Option D" },
          ],
          correctOption: q.correctOption || "A",
          modelAnswer: q.modelAnswer || "",
          cqParts: q.cqParts || undefined,
        }));

        setQuestions(formatted);
        setActiveQuestionIdx(0);
        setActiveTab("builder");
        setSaveSuccessMsg(`⚡ AI Successfully Generated ${formatted.length} ${setType} Questions!`);
      } else {
        alert("Failed to generate questions. Please try again.");
      }
    } catch (err: any) {
      console.error("AI generation failed:", err);
      alert("AI generation error: " + err.message);
    } finally {
      setIsLoadingAi(false);
    }
  };

  // Bulk Paste Parser
  const handleParseBulkText = () => {
    if (!bulkPasteText.trim()) return;

    try {
      const lines = bulkPasteText.split("\n").map((l) => l.trim()).filter(Boolean);
      const parsedItems: QuestionSetItem[] = [];

      if (setType === "MCQ") {
        let currentQ: Partial<QuestionSetItem> | null = null;
        let currentOptions: MCQOptionItem[] = [];

        for (let i = 0; i < lines.length; i++) {
          const line = lines[i];

          // Check if starts with a number e.g. "1.", "1)", "Q1:"
          const qMatch = line.match(/^(\d+)[\.\)]\s*(.+)/i) || line.match(/^Q(\d+)[:\.]\s*(.+)/i);
          if (qMatch) {
            if (currentQ && currentQ.questionText) {
              parsedItems.push({
                id: `bulk_q_${Date.now()}_${parsedItems.length + 1}`,
                type: "MCQ",
                orderIndex: parsedItems.length + 1,
                questionText: currentQ.questionText,
                stimulusText: currentQ.stimulusText || "",
                marks: 1,
                difficulty,
                curriculumCode,
                tags: [subjectName, curriculumCode],
                mcqOptions:
                  currentOptions.length === 4
                    ? currentOptions
                    : [
                        { label: "A", text: currentOptions[0]?.text || "ক" },
                        { label: "B", text: currentOptions[1]?.text || "খ" },
                        { label: "C", text: currentOptions[2]?.text || "গ" },
                        { label: "D", text: currentOptions[3]?.text || "ঘ" },
                      ],
                correctOption: currentQ.correctOption || "A",
                modelAnswer: currentQ.modelAnswer || "",
              });
            }

            currentQ = {
              questionText: qMatch[2].trim(),
              correctOption: "A",
            };
            currentOptions = [];
            continue;
          }

          // Check options A, B, C, D or ক, খ, গ, ঘ
          const optMatch = line.match(/^([A-Da-dক-ঘ])[\.\)\-:]\s*(.+)/);
          if (optMatch) {
            let labelChar = optMatch[1].toUpperCase();
            if (labelChar === "ক") labelChar = "A";
            else if (labelChar === "খ") labelChar = "B";
            else if (labelChar === "গ") labelChar = "C";
            else if (labelChar === "ঘ") labelChar = "D";

            if (["A", "B", "C", "D"].includes(labelChar)) {
              currentOptions.push({
                label: labelChar as any,
                text: optMatch[2].trim(),
              });
            }
            continue;
          }

          // Check answer e.g. "Ans: A", "উত্তর: খ", "Answer: C"
          const ansMatch =
            line.match(/^(?:Ans|Answer|উত্তর|উত্তরঃ)[:\s]+([A-Da-dক-ঘ])/i);
          if (ansMatch && currentQ) {
            let ansChar = ansMatch[1].toUpperCase();
            if (ansChar === "ক") ansChar = "A";
            else if (ansChar === "খ") ansChar = "B";
            else if (ansChar === "গ") ansChar = "C";
            else if (ansChar === "ঘ") ansChar = "D";
            currentQ.correctOption = ansChar as any;
            continue;
          }

          // Append to question text if it's continuing paragraph
          if (currentQ && currentOptions.length === 0) {
            currentQ.questionText += " " + line;
          }
        }

        // Push last question
        if (currentQ && currentQ.questionText) {
          parsedItems.push({
            id: `bulk_q_${Date.now()}_${parsedItems.length + 1}`,
            type: "MCQ",
            orderIndex: parsedItems.length + 1,
            questionText: currentQ.questionText,
            stimulusText: currentQ.stimulusText || "",
            marks: 1,
            difficulty,
            curriculumCode,
            tags: [subjectName, curriculumCode],
            mcqOptions:
              currentOptions.length === 4
                ? currentOptions
                : [
                    { label: "A", text: currentOptions[0]?.text || "Option A" },
                    { label: "B", text: currentOptions[1]?.text || "Option B" },
                    { label: "C", text: currentOptions[2]?.text || "Option C" },
                    { label: "D", text: currentOptions[3]?.text || "Option D" },
                  ],
            correctOption: currentQ.correctOption || "A",
            modelAnswer: currentQ.modelAnswer || "",
          });
        }
      } else {
        // CQ Bulk parsing
        const rawBlocks = bulkPasteText.split(/(?:প্রশ্ন\s*\d+|CQ\s*\d+|উদ্দীপক\s*\d*[:\-])/i).filter(Boolean);
        rawBlocks.forEach((block, idx) => {
          const lines = block.split("\n").map((l) => l.trim()).filter(Boolean);
          let stimulus = "";
          let ka = "জ্ঞানমূলক প্রশ্ন";
          let kha = "অনুধাবনমূলক প্রশ্ন";
          let ga = "প্রয়োগমূলক প্রশ্ন";
          let gha = "উচ্চতর দক্ষতামূলক প্রশ্ন";

          lines.forEach((l) => {
            if (l.startsWith("ক)") || l.startsWith("ক.")) ka = l.replace(/^ক[\.\)]\s*/, "");
            else if (l.startsWith("খ)") || l.startsWith("খ.")) kha = l.replace(/^খ[\.\)]\s*/, "");
            else if (l.startsWith("গ)") || l.startsWith("গ.")) ga = l.replace(/^গ[\.\)]\s*/, "");
            else if (l.startsWith("ঘ)") || l.startsWith("ঘ.")) gha = l.replace(/^ঘ[\.\)]\s*/, "");
            else stimulus += " " + l;
          });

          parsedItems.push({
            id: `bulk_cq_${Date.now()}_${idx + 1}`,
            type: "CQ",
            orderIndex: idx + 1,
            questionText: `সৃজনশীল প্রশ্ন নং ${idx + 1}: উদ্দীপকটি পড়ে নিচের প্রশ্নগুলোর উত্তর দাও:`,
            stimulusText: stimulus.trim() || `উদ্দীপক: ${topicName} সংক্রান্ত পরীক্ষণ।`,
            marks: 10,
            difficulty,
            curriculumCode,
            tags: [subjectName, curriculumCode],
            cqParts: [
              { part: "ka", bengaliLabel: "ক", marks: 1, questionText: ka, modelAnswer: "সঠিক জ্ঞানমূলক উত্তর" },
              { part: "kha", bengaliLabel: "খ", marks: 2, questionText: kha, modelAnswer: "অনুধাবনমূলক ব্যাখ্যা" },
              { part: "ga", bengaliLabel: "গ", marks: 3, questionText: ga, modelAnswer: "গাণিতিক সমাধান" },
              { part: "gha", bengaliLabel: "ঘ", marks: 4, questionText: gha, modelAnswer: "উচ্চতর দক্ষতার মতামত" },
            ],
          });
        });
      }

      if (parsedItems.length > 0) {
        setQuestions(parsedItems);
        setTargetCount(parsedItems.length);
        setCustomCountInput(parsedItems.length.toString());
        setActiveQuestionIdx(0);
        setActiveTab("builder");
        setParseNotice(`✅ Successfully parsed ${parsedItems.length} questions into set!`);
      } else {
        setParseNotice("⚠️ Could not detect questions. Please check numbering format (e.g. 1. Question, A) Option).");
      }
    } catch (err: any) {
      setParseNotice("Error parsing text: " + err.message);
    }
  };

  // Question editing updater
  const updateActiveQuestion = (field: keyof QuestionSetItem, value: any) => {
    setQuestions((prev) => {
      const copy = [...prev];
      copy[activeQuestionIdx] = {
        ...copy[activeQuestionIdx],
        [field]: value,
      };
      return copy;
    });
  };

  // MCQ Option Updater
  const updateMcqOption = (label: "A" | "B" | "C" | "D", text: string) => {
    const activeQ = questions[activeQuestionIdx];
    if (!activeQ || !activeQ.mcqOptions) return;
    const nextOptions = activeQ.mcqOptions.map((opt) =>
      opt.label === label ? { ...opt, text } : opt
    );
    updateActiveQuestion("mcqOptions", nextOptions);
  };

  // CQ Part Updater
  const updateCqPart = (partKey: "ka" | "kha" | "ga" | "gha", field: "questionText" | "modelAnswer", val: string) => {
    const activeQ = questions[activeQuestionIdx];
    if (!activeQ || !activeQ.cqParts) return;
    const nextParts = activeQ.cqParts.map((p) =>
      p.part === partKey ? { ...p, [field]: val } : p
    );
    updateActiveQuestion("cqParts", nextParts);
  };

  // Add Question
  const handleAddQuestion = () => {
    const newIdx = questions.length + 1;
    let newQ: QuestionSetItem;
    if (setType === "MCQ") {
      newQ = {
        id: `q_new_${Date.now()}_${newIdx}`,
        type: "MCQ",
        orderIndex: newIdx,
        questionText: `প্রশ্ন ${newIdx}: নতুন বহুনির্বাচনী প্রশ্ন`,
        stimulusText: "",
        marks: 1,
        difficulty,
        curriculumCode,
        tags: [subjectName, curriculumCode],
        mcqOptions: [
          { label: "A", text: "বিকল্প A" },
          { label: "B", text: "বিকল্প B" },
          { label: "C", text: "বিকল্প C" },
          { label: "D", text: "বিকল্প D" },
        ],
        correctOption: "A",
        modelAnswer: "",
      };
    } else {
      newQ = {
        id: `cq_new_${Date.now()}_${newIdx}`,
        type: "CQ",
        orderIndex: newIdx,
        questionText: `সৃজনশীল প্রশ্ন নং ${newIdx}: উদ্দীপকটি পড়ে প্রশ্নগুলোর উত্তর দাও:`,
        stimulusText: `উদ্দীপক-${newIdx}: নতুন উদ্দীপক তথ্য ও পরীক্ষণের ফলাফল।`,
        marks: 10,
        difficulty,
        curriculumCode,
        tags: [subjectName, curriculumCode],
        cqParts: [
          { part: "ka", bengaliLabel: "ক", marks: 1, questionText: "জ্ঞানমূলক প্রশ্ন", modelAnswer: "" },
          { part: "kha", bengaliLabel: "খ", marks: 2, questionText: "অনুধাবনমূলক প্রশ্ন", modelAnswer: "" },
          { part: "ga", bengaliLabel: "গ", marks: 3, questionText: "প্রয়োগমূলক প্রশ্ন", modelAnswer: "" },
          { part: "gha", bengaliLabel: "ঘ", marks: 4, questionText: "উচ্চতর দক্ষতা প্রশ্ন", modelAnswer: "" },
        ],
      };
    }
    setQuestions((prev) => [...prev, newQ]);
    setActiveQuestionIdx(questions.length);
    setTargetCount((prev) => prev + 1);
  };

  // Delete Question
  const handleDeleteQuestion = (idx: number) => {
    if (questions.length <= 1) {
      alert("At least one question is required.");
      return;
    }
    setQuestions((prev) => {
      const filtered = prev.filter((_, i) => i !== idx);
      return filtered.map((q, i) => ({ ...q, orderIndex: i + 1 }));
    });
    if (activeQuestionIdx >= questions.length - 1) {
      setActiveQuestionIdx(Math.max(0, questions.length - 2));
    }
    setTargetCount((prev) => Math.max(1, prev - 1));
  };

  // Save All to Question Bank
  const handleSaveToQuestionBank = async () => {
    if (questions.length === 0) return;
    setIsSaving(true);
    setSaveSuccessMsg(null);

    try {
      const res = await fetch("/api/questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          questions: questions.map((q, idx) => ({
            ...q,
            orderIndex: idx + 1,
            curriculumCode,
            tags: [subjectName, curriculumCode, q.type],
          })),
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSaveSuccessMsg(`🎉 All ${questions.length} questions successfully saved to Question Bank!`);
        setTimeout(() => {
          onSuccess();
          onClose();
        }, 1200);
      } else {
        alert("Failed to save questions: " + (data.error || "Unknown error"));
      }
    } catch (err: any) {
      console.error("Save error:", err);
      alert("Save failed: " + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  // Save and Publish as Live Exam in Arena
  const handleSaveAndPublishExam = async () => {
    if (questions.length === 0) return;
    setIsPublishingExam(true);
    setSaveSuccessMsg(null);

    const calculatedTotalMarks = questions.reduce((sum, q) => sum + (q.marks || (q.type === "CQ" ? 10 : 1)), 0);

    try {
      // 1. Bulk save to questions bank
      await fetch("/api/questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ questions }),
      });

      // 2. Publish as Live Exam
      const examRes = await fetch("/api/exams", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: setTitle,
          curriculumCode,
          instructions: `সকল প্রশ্নের উত্তর আবশ্যক। বহুনির্বাচনী প্রশ্নের ক্ষেত্রে সঠিক উত্তরের বৃত্ত ভরাট করো। পরীক্ষা শেষে স্বয়ংক্রিয়ভাবে AI মূল্যায়ন সম্পন্ন হবে। নেগেটিভ মার্কিং: ${negativeMarking}।`,
          durationMinutes: Number(durationMinutes) || (setType === "MCQ" ? 25 : 120),
          totalMarks: calculatedTotalMarks,
          negativeMarkingRate: setType === "MCQ" ? negativeMarking : 0,
          passMarkPercentage: 40,
          questions: questions.map((q) => ({
            type: q.type,
            questionText: q.questionText,
            stimulusText: q.stimulusText,
            marks: q.marks,
            mcqOptions: q.mcqOptions,
            cqParts: q.cqParts,
            modelAnswer: q.modelAnswer,
          })),
        }),
      });

      const examData = await examRes.json();
      if (examData.success) {
        const accessCode = examData.exam?.accessCode || examData.mongoExamId || "EXAM_NEW";
        const examUrl = `${window.location.origin}/exam/${accessCode}`;
        setPublishedExamLink(examUrl);
        setSaveSuccessMsg(`🚀 Live Exam Published! Students can now take this ${questions.length}-question exam.`);
        onSuccess();
      } else {
        alert("Failed to publish exam: " + (examData.error || "Unknown error"));
      }
    } catch (err: any) {
      console.error("Publish exam failed:", err);
      alert("Publish error: " + err.message);
    } finally {
      setIsPublishingExam(false);
    }
  };

  const handleCopyExamLink = () => {
    if (!publishedExamLink) return;
    navigator.clipboard.writeText(publishedExamLink);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  // Print Question Paper Handler
  const handlePrintQuestionPaper = () => {
    window.print();
  };

  const currentQ = questions[activeQuestionIdx];
  const totalCalculatedMarks = questions.reduce(
    (acc, q) => acc + (q.marks || (q.type === "CQ" ? 10 : 1)),
    0
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="w-full max-w-6xl max-h-[94vh] rounded-3xl border border-border bg-card shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 my-auto">
        {/* Top Header */}
        <div className="p-4 sm:p-5 border-b border-border bg-muted/40 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <span className="p-2.5 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white shadow-md shadow-emerald-600/30">
              <BookOpen className="h-5 w-5" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-foreground">
                  Full Question Set Builder (সম্পূর্ণ প্রশ্নপত্র নির্মাতা)
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300">
                  {setType} Set • {questions.length} Questions • {totalCalculatedMarks} Marks
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                Build standard 20, 25, 40, 50, 100 MCQ papers or 4, 7, 11 CQ sets with 1-click AI generation, interactive jumping, and bulk paste.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="p-2 rounded-xl border border-border bg-card hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Quick Presets Bar */}
        <div className="px-5 py-3 border-b border-border bg-card/60 flex flex-wrap items-center justify-between gap-3 shrink-0">
          {/* Question Type Switcher */}
          <div className="flex items-center p-1 rounded-xl bg-muted/80 border border-border text-xs font-bold">
            <button
              onClick={() => handleSelectPreset("MCQ", 20, 20)}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                setType === "MCQ"
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              🔘 MCQ Set (বহুনির্বাচনী)
            </button>
            <button
              onClick={() => handleSelectPreset("CQ", 7, 150)}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                setType === "CQ"
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              🔘 CQ Set (সৃজনশীল)
            </button>
          </div>

          {/* Quick Count Badges */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <span className="text-muted-foreground text-[11px] font-semibold mr-1">Presets:</span>
            {setType === "MCQ" ? (
              <>
                <button
                  onClick={() => handleSelectPreset("MCQ", 20, 20)}
                  className={`px-2.5 py-1 rounded-lg border font-bold text-xs transition-all ${
                    targetCount === 20
                      ? "bg-emerald-50 dark:bg-emerald-950 border-emerald-500 text-emerald-700 dark:text-emerald-300"
                      : "border-border hover:bg-accent text-muted-foreground"
                  }`}
                >
                  20 MCQs (20m)
                </button>
                <button
                  onClick={() => handleSelectPreset("MCQ", 25, 25)}
                  className={`px-2.5 py-1 rounded-lg border font-bold text-xs transition-all ${
                    targetCount === 25
                      ? "bg-emerald-50 dark:bg-emerald-950 border-emerald-500 text-emerald-700 dark:text-emerald-300"
                      : "border-border hover:bg-accent text-muted-foreground"
                  }`}
                >
                  25 MCQs (Board Std)
                </button>
                <button
                  onClick={() => handleSelectPreset("MCQ", 40, 40)}
                  className={`px-2.5 py-1 rounded-lg border font-bold text-xs transition-all ${
                    targetCount === 40
                      ? "bg-emerald-50 dark:bg-emerald-950 border-emerald-500 text-emerald-700 dark:text-emerald-300"
                      : "border-border hover:bg-accent text-muted-foreground"
                  }`}
                >
                  40 MCQs (Admission)
                </button>
                <button
                  onClick={() => handleSelectPreset("MCQ", 50, 50)}
                  className={`px-2.5 py-1 rounded-lg border font-bold text-xs transition-all ${
                    targetCount === 50
                      ? "bg-emerald-50 dark:bg-emerald-950 border-emerald-500 text-emerald-700 dark:text-emerald-300"
                      : "border-border hover:bg-accent text-muted-foreground"
                  }`}
                >
                  50 MCQs (Varsity)
                </button>
                <button
                  onClick={() => handleSelectPreset("MCQ", 100, 100)}
                  className={`px-2.5 py-1 rounded-lg border font-bold text-xs transition-all ${
                    targetCount === 100
                      ? "bg-emerald-50 dark:bg-emerald-950 border-emerald-500 text-emerald-700 dark:text-emerald-300"
                      : "border-border hover:bg-accent text-muted-foreground"
                  }`}
                >
                  100 MCQs (100 Marks / BCS)
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => handleSelectPreset("CQ", 4, 90)}
                  className={`px-2.5 py-1 rounded-lg border font-bold text-xs transition-all ${
                    targetCount === 4
                      ? "bg-emerald-50 dark:bg-emerald-950 border-emerald-500 text-emerald-700 dark:text-emerald-300"
                      : "border-border hover:bg-accent text-muted-foreground"
                  }`}
                >
                  4 CQs (40 Marks)
                </button>
                <button
                  onClick={() => handleSelectPreset("CQ", 5, 105)}
                  className={`px-2.5 py-1 rounded-lg border font-bold text-xs transition-all ${
                    targetCount === 5
                      ? "bg-emerald-50 dark:bg-emerald-950 border-emerald-500 text-emerald-700 dark:text-emerald-300"
                      : "border-border hover:bg-accent text-muted-foreground"
                  }`}
                >
                  5 CQs (50 Marks)
                </button>
                <button
                  onClick={() => handleSelectPreset("CQ", 7, 150)}
                  className={`px-2.5 py-1 rounded-lg border font-bold text-xs transition-all ${
                    targetCount === 7
                      ? "bg-emerald-50 dark:bg-emerald-950 border-emerald-500 text-emerald-700 dark:text-emerald-300"
                      : "border-border hover:bg-accent text-muted-foreground"
                  }`}
                >
                  7 CQs (70 Marks - Board Std)
                </button>
                <button
                  onClick={() => handleSelectPreset("CQ", 11, 150)}
                  className={`px-2.5 py-1 rounded-lg border font-bold text-xs transition-all ${
                    targetCount === 11
                      ? "bg-emerald-50 dark:bg-emerald-950 border-emerald-500 text-emerald-700 dark:text-emerald-300"
                      : "border-border hover:bg-accent text-muted-foreground"
                  }`}
                >
                  11 CQs (Full Paper 110m)
                </button>
              </>
            )}

            {/* Custom Count Input */}
            <div className="flex items-center gap-1 pl-2 border-l border-border">
              <input
                type="number"
                min="1"
                max="100"
                value={customCountInput}
                onChange={(e) => setCustomCountInput(e.target.value)}
                className="w-12 px-1.5 py-0.5 rounded border border-border bg-background text-xs font-mono text-center focus:outline-none"
              />
              <button
                onClick={handleApplyCustomCount}
                className="px-2 py-0.5 rounded bg-muted hover:bg-accent text-[11px] font-bold text-foreground"
              >
                Set
              </button>
            </div>
          </div>
        </div>

        {/* Set Configuration Metadata Strip */}
        <div className="px-5 py-2.5 border-b border-border bg-muted/20 grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2 text-xs shrink-0">
          <div>
            <label className="text-[10px] font-bold text-muted-foreground uppercase">Set Title</label>
            <input
              type="text"
              value={setTitle}
              onChange={(e) => setSetTitle(e.target.value)}
              className="w-full px-2 py-1 rounded-lg border border-border bg-background text-xs font-medium focus:ring-1 focus:ring-emerald-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="text-[10px] font-bold text-muted-foreground uppercase">Subject</label>
            <input
              type="text"
              value={subjectName}
              onChange={(e) => setSubjectName(e.target.value)}
              placeholder="e.g. Physics"
              className="w-full px-2 py-1 rounded-lg border border-border bg-background text-xs font-medium focus:ring-1 focus:ring-emerald-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="text-[10px] font-bold text-muted-foreground uppercase">Curriculum</label>
            <select
              value={curriculumCode}
              onChange={(e) => setCurriculumCode(e.target.value)}
              className="w-full px-2 py-1 rounded-lg border border-border bg-background text-xs font-medium focus:outline-none"
            >
              <option value="HSC">HSC (Higher Secondary)</option>
              <option value="SSC">SSC (Secondary)</option>
              <option value="DU_A">DU 'Ka' Unit</option>
              <option value="BUET">BUET Admission</option>
              <option value="Medical">Medical Admission</option>
              <option value="BCS">BCS Preliminary</option>
            </select>
          </div>
          <div>
            <label className="text-[10px] font-bold text-muted-foreground uppercase">Difficulty</label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value as any)}
              className="w-full px-2 py-1 rounded-lg border border-border bg-background text-xs font-medium focus:outline-none"
            >
              <option value="EASY">Easy</option>
              <option value="MEDIUM">Medium (Standard)</option>
              <option value="HARD">Hard (Advanced)</option>
            </select>
          </div>
          <div>
            <label className="text-[10px] font-bold text-muted-foreground uppercase">Duration (Mins)</label>
            <input
              type="number"
              value={durationMinutes}
              onChange={(e) => setDurationMinutes(Number(e.target.value))}
              className="w-full px-2 py-1 rounded-lg border border-border bg-background text-xs font-medium focus:outline-none"
            />
          </div>
          {setType === "MCQ" && (
            <div>
              <label className="text-[10px] font-bold text-muted-foreground uppercase">Negative Marking</label>
              <select
                value={negativeMarking}
                onChange={(e) => setNegativeMarking(Number(e.target.value))}
                className="w-full px-2 py-1 rounded-lg border border-border bg-background text-xs font-medium focus:outline-none"
              >
                <option value={0}>No Negative (0)</option>
                <option value={0.25}>-0.25 Marks (Standard)</option>
                <option value={0.5}>-0.50 Marks</option>
              </select>
            </div>
          )}
        </div>

        {/* View Mode Tabs: Builder | AI Generator | Bulk Paste | Print Preview */}
        <div className="px-5 border-b border-border bg-card flex items-center justify-between gap-2 overflow-x-auto shrink-0">
          <div className="flex items-center gap-1 py-1.5">
            <button
              onClick={() => setActiveTab("builder")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                activeTab === "builder"
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <Layers className="h-3.5 w-3.5" />
              <span>Interactive Editor ({questions.length})</span>
            </button>

            <button
              onClick={() => setActiveTab("ai")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                activeTab === "ai"
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <Sparkles className="h-3.5 w-3.5 text-amber-400" />
              <span>⚡ AI 1-Click Generate Set</span>
            </button>

            <button
              onClick={() => setActiveTab("paste")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                activeTab === "paste"
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <UploadCloud className="h-3.5 w-3.5" />
              <span>Bulk Quick Paste</span>
            </button>

            <button
              onClick={() => setActiveTab("preview")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                activeTab === "preview"
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <Printer className="h-3.5 w-3.5" />
              <span>Print Question Paper</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold text-muted-foreground hidden sm:inline">
              Progress: {questions.length} / {targetCount} Qs
            </span>
          </div>
        </div>

        {/* Modal Body Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {/* Notification Messages */}
          {saveSuccessMsg && (
            <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs font-bold flex items-center justify-between gap-3 shadow-sm">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>{saveSuccessMsg}</span>
              </div>
              {publishedExamLink && (
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={handleCopyExamLink}
                    className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white text-[11px] font-bold flex items-center gap-1 hover:bg-emerald-700"
                  >
                    {copiedLink ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                    {copiedLink ? "Copied" : "Copy Student Link"}
                  </button>
                  <a
                    href={publishedExamLink}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1 rounded-lg bg-card border border-border text-foreground hover:bg-accent"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>
              )}
            </div>
          )}

          {/* TAB 1: INTERACTIVE BUILDER */}
          {activeTab === "builder" && (
            <div className="space-y-4">
              {/* Question Number Jump Grid */}
              <div className="rounded-2xl border border-border bg-muted/30 p-3.5 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-foreground flex items-center gap-1.5">
                    <Layers className="h-3.5 w-3.5 text-emerald-600" />
                    Quick Jump Navigator (Click number to edit question):
                  </span>
                  <button
                    onClick={handleAddQuestion}
                    className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
                  >
                    <Plus className="h-3.5 w-3.5" /> Add Question #{questions.length + 1}
                  </button>
                </div>

                {/* Jump Grid Buttons */}
                <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto p-1">
                  {questions.map((q, idx) => {
                    const isActive = idx === activeQuestionIdx;
                    const isFilled =
                      q.questionText.trim().length > 5 &&
                      (q.type === "MCQ" ? !!q.correctOption : (q.cqParts?.length || 0) > 0);

                    return (
                      <button
                        key={q.id || idx}
                        onClick={() => setActiveQuestionIdx(idx)}
                        className={`h-7 min-w-[28px] px-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1 ${
                          isActive
                            ? "bg-emerald-600 text-white shadow-md ring-2 ring-emerald-400"
                            : isFilled
                            ? "bg-card border border-emerald-300 text-emerald-800 dark:text-emerald-300 hover:bg-accent"
                            : "bg-card border border-border text-muted-foreground hover:bg-accent"
                        }`}
                        title={`Jump to Question ${idx + 1}`}
                      >
                        <span>{idx + 1}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Active Question Editor Card */}
              {currentQ && (
                <div className="rounded-3xl border border-border bg-card p-5 space-y-4 shadow-sm">
                  {/* Question Header & Controls */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-border">
                    <div className="flex items-center gap-2">
                      <span className="h-8 w-8 rounded-xl bg-emerald-600 text-white font-black text-sm flex items-center justify-center shadow-sm">
                        Q{activeQuestionIdx + 1}
                      </span>
                      <div>
                        <div className="text-xs font-extrabold text-foreground">
                          {setType === "MCQ" ? "Multiple Choice Question" : "Creative Question (CQ)"} #{activeQuestionIdx + 1}
                        </div>
                        <div className="text-[11px] text-muted-foreground">
                          Marks: {currentQ.marks} • Difficulty: {currentQ.difficulty}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        disabled={activeQuestionIdx === 0}
                        onClick={() => setActiveQuestionIdx((prev) => Math.max(0, prev - 1))}
                        className="px-2.5 py-1.5 rounded-xl border border-border text-xs font-bold hover:bg-accent disabled:opacity-40 flex items-center gap-1"
                      >
                        <ChevronLeft className="h-3.5 w-3.5" /> Previous
                      </button>

                      <button
                        disabled={activeQuestionIdx >= questions.length - 1}
                        onClick={() => setActiveQuestionIdx((prev) => Math.min(questions.length - 1, prev + 1))}
                        className="px-2.5 py-1.5 rounded-xl border border-border text-xs font-bold hover:bg-accent disabled:opacity-40 flex items-center gap-1"
                      >
                        Next <ChevronRight className="h-3.5 w-3.5" />
                      </button>

                      <button
                        onClick={() => handleDeleteQuestion(activeQuestionIdx)}
                        className="p-1.5 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40"
                        title="Delete Question"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {/* Stimulus / Scenario (Optional for MCQ, Standard for CQ) */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-foreground flex items-center justify-between">
                      <span>উদ্দীপক / Stimulus Scenario {setType === "CQ" ? "(আবশ্যক)" : "(Optional)"}:</span>
                      <span className="text-[10px] text-muted-foreground font-normal">দৃশ্যপট, উপাত্ত বা বৈজ্ঞানিক পরীক্ষণ</span>
                    </label>
                    <textarea
                      rows={setType === "CQ" ? 3 : 2}
                      value={currentQ.stimulusText || ""}
                      onChange={(e) => updateActiveQuestion("stimulusText", e.target.value)}
                      placeholder="উদ্দীপক তথ্য, সমীকরণ, বা পরীক্ষার উপাত্ত..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>

                  {/* Main Question Stem */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-foreground">
                      প্রশ্নের মূল বক্তব্য / Question Stem *
                    </label>
                    <input
                      type="text"
                      value={currentQ.questionText}
                      onChange={(e) => updateActiveQuestion("questionText", e.target.value)}
                      placeholder="প্রশ্নের মূল লাইন..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-xs font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>

                  {/* MCQ OPTIONS BUILDER */}
                  {setType === "MCQ" && currentQ.mcqOptions && (
                    <div className="space-y-3 pt-2">
                      <div className="flex items-center justify-between text-xs font-bold text-foreground">
                        <span>বিকল্পসমূহ (Options A, B, C, D) ও সঠিক উত্তর নির্বাচন:</span>
                        <span className="text-emerald-600 font-extrabold text-[11px]">
                          সঠিক উত্তর: ({currentQ.correctOption})
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {currentQ.mcqOptions.map((opt) => {
                          const isCorrect = currentQ.correctOption === opt.label;
                          return (
                            <div
                              key={opt.label}
                              className={`p-3 rounded-2xl border transition-all flex items-center gap-2.5 ${
                                isCorrect
                                  ? "border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/40 shadow-sm"
                                  : "border-border bg-muted/20"
                              }`}
                            >
                              <button
                                type="button"
                                onClick={() => updateActiveQuestion("correctOption", opt.label)}
                                className={`h-7 w-7 rounded-lg text-xs font-extrabold flex items-center justify-center shrink-0 transition-all ${
                                  isCorrect
                                    ? "bg-emerald-600 text-white shadow-sm ring-2 ring-emerald-300"
                                    : "bg-card border border-border text-muted-foreground hover:bg-accent"
                                }`}
                                title={`Click to mark ${opt.label} as correct answer`}
                              >
                                {opt.label}
                              </button>
                              <input
                                type="text"
                                value={opt.text}
                                onChange={(e) => updateMcqOption(opt.label, e.target.value)}
                                placeholder={`বিকল্প ${opt.label} এর বিবরণ...`}
                                className="w-full px-2.5 py-1.5 rounded-lg border border-border bg-background text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                              />
                            </div>
                          );
                        })}
                      </div>

                      {/* Explanation */}
                      <div className="space-y-1 pt-1">
                        <label className="text-[11px] font-bold text-muted-foreground">
                          নমুনা সমাধান বা সঠিক উত্তরের ব্যাখ্যা (Model Explanation):
                        </label>
                        <input
                          type="text"
                          value={currentQ.modelAnswer || ""}
                          onChange={(e) => updateActiveQuestion("modelAnswer", e.target.value)}
                          placeholder="ব্যাখ্যা বা সমীকরণ সমাধান..."
                          className="w-full px-3 py-1.5 rounded-xl border border-border bg-background text-xs focus:outline-none"
                        />
                      </div>
                    </div>
                  )}

                  {/* CQ SUB-PARTS BUILDER (ক, খ, গ, ঘ) */}
                  {setType === "CQ" && currentQ.cqParts && (
                    <div className="space-y-4 pt-2">
                      <div className="text-xs font-bold text-foreground">
                        সৃজনশীল প্রশ্নের ৪টি অংশ (ক, খ, গ, ঘ) ও মূল্যায়ন রুব্রিক:
                      </div>

                      <div className="space-y-3">
                        {currentQ.cqParts.map((part) => (
                          <div
                            key={part.part}
                            className="p-3.5 rounded-2xl border border-border bg-muted/20 space-y-2.5"
                          >
                            <div className="flex items-center justify-between">
                              <span className="px-2.5 py-0.5 rounded-md bg-emerald-600 text-white font-black text-xs">
                                ({part.bengaliLabel}) {part.part === "ka" ? "জ্ঞানমূলক (১ নম্বর)" : part.part === "kha" ? "অনুধাবনমূলক (২ নম্বর)" : part.part === "ga" ? "প্রয়োগমূলক (৩ নম্বর)" : "উচ্চতর দক্ষতা (৪ নম্বর)"}
                              </span>
                              <span className="text-[11px] font-semibold text-muted-foreground">
                                Marks: {part.marks}
                              </span>
                            </div>

                            <div className="space-y-1">
                              <label className="text-[11px] font-bold text-muted-foreground">
                                প্রশ্ন ({part.bengaliLabel}):
                              </label>
                              <input
                                type="text"
                                value={part.questionText}
                                onChange={(e) => updateCqPart(part.part, "questionText", e.target.value)}
                                className="w-full px-3 py-1.5 rounded-xl border border-border bg-background text-xs font-medium focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                              />
                            </div>

                            <div className="space-y-1">
                              <label className="text-[11px] font-bold text-muted-foreground">
                                সঠিক উত্তর / মূল্যায়ন নির্দেশিকা (Model Answer & Rubric):
                              </label>
                              <textarea
                                rows={2}
                                value={part.modelAnswer}
                                onChange={(e) => updateCqPart(part.part, "modelAnswer", e.target.value)}
                                className="w-full px-3 py-1.5 rounded-xl border border-border bg-background text-xs focus:outline-none"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: AI 1-CLICK GENERATOR */}
          {activeTab === "ai" && (
            <div className="max-w-2xl mx-auto rounded-3xl border border-border bg-card p-6 space-y-5 shadow-sm">
              <div className="text-center space-y-1.5">
                <span className="inline-flex p-3 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 text-white shadow-md">
                  <Sparkles className="h-6 w-6" />
                </span>
                <h3 className="text-base font-extrabold text-foreground">
                  AI 1-Click Full Set Generator (স্বয়ংক্রিয় প্রশ্নমালা তৈরি)
                </h3>
                <p className="text-xs text-muted-foreground">
                  KhataAI will instantly generate all {targetCount} {setType} questions with complete stems, options, verified correct answers, and Bengali grading rubrics.
                </p>
              </div>

              <div className="space-y-3.5">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-foreground">Subject & Paper *</label>
                  <input
                    type="text"
                    value={subjectName}
                    onChange={(e) => setSubjectName(e.target.value)}
                    placeholder="e.g. Physics / রসায়ন / উচ্চতর গণিত / জীববিজ্ঞান"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-xs font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-foreground">Chapters or Specific Topics *</label>
                  <textarea
                    rows={3}
                    value={topicName}
                    onChange={(e) => setTopicName(e.target.value)}
                    placeholder="e.g. গতিবিদ্যা, ভেক্টর, কাজ ক্ষমতা শক্তি, এবং মহাকর্ষ ও অভিকর্ষ"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div className="p-4 rounded-2xl bg-muted/40 border border-border space-y-2 text-xs">
                  <div className="font-bold text-foreground">Generation Summary:</div>
                  <div className="grid grid-cols-2 gap-2 text-muted-foreground text-[11px]">
                    <div>• Format: {setType} Set</div>
                    <div>• Question Count: {targetCount} Items</div>
                    <div>• Curriculum: {curriculumCode} Standard</div>
                    <div>• Total Marks: {setType === "CQ" ? targetCount * 10 : targetCount} Marks</div>
                  </div>
                </div>

                <button
                  type="button"
                  disabled={isLoadingAi}
                  onClick={handleAiGenerateFullSet}
                  className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold text-xs shadow-lg shadow-emerald-600/25 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                >
                  {isLoadingAi ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      <span>Generating Full Set ({targetCount} Questions)...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4" />
                      <span>Generate Full Set ({targetCount} Questions) Now</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: BULK QUICK PASTE */}
          {activeTab === "paste" && (
            <div className="max-w-3xl mx-auto rounded-3xl border border-border bg-card p-6 space-y-4 shadow-sm">
              <div>
                <h3 className="text-base font-extrabold text-foreground flex items-center gap-2">
                  <UploadCloud className="h-4 w-4 text-emerald-600" />
                  Bulk Quick Paste / Import from Word or Notepad
                </h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Copy and paste your questions formatted with numbers and options (A, B, C, D or ক, খ, গ, ঘ) and correct answer keys.
                </p>
              </div>

              {parseNotice && (
                <div className="p-3 rounded-xl bg-muted border border-border text-xs font-bold text-foreground">
                  {parseNotice}
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground">
                  Paste Raw Questions Text Below:
                </label>
                <textarea
                  rows={10}
                  value={bulkPasteText}
                  onChange={(e) => setBulkPasteText(e.target.value)}
                  placeholder={
                    setType === "MCQ"
                      ? `1. আলোর বেগ কত?
A) 3 x 10^8 m/s
B) 2 x 10^8 m/s
C) 3 x 10^6 m/s
D) 1 x 10^8 m/s
Ans: A

2. কাজের এসআই একক কোনটি?
A) জুল
B) নিউটন
C) ওয়াট
D) প্যাসকেল
উত্তর: A`
                      : `প্রশ্ন ১:
উদ্দীপক: ২০ মিটার উঁচু দালানের ছাদ থেকে একটি ক্রিকেট বল নিক্ষেপ করা হলো।
ক) প্রাস কী?
খ) অনুভূমিক ত্বরণ শূন্য হয় কেন?
গ) বলটি কত সময় পর মাটিতে পড়বে?
ঘ) উভয় ক্ষেত্রে শক্তির সংরক্ষণশীলতা নীতি যাচাই করো।`
                  }
                  className="w-full p-3.5 rounded-2xl border border-border bg-background text-xs font-mono focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-[11px] text-muted-foreground">
                  Format recognized: 1., Q1:, A), B), C), D), Ans:
                </span>
                <button
                  type="button"
                  onClick={handleParseBulkText}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
                >
                  <Sparkles className="h-4 w-4" />
                  <span>Parse & Load into Set</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 4: PRINT / OFFICIAL QUESTION PAPER PREVIEW */}
          {activeTab === "preview" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-2xl bg-muted/40 border border-border">
                <span className="text-xs font-bold text-foreground flex items-center gap-2">
                  <Printer className="h-4 w-4 text-emerald-600" />
                  Printable Official Examination Paper Format
                </span>
                <button
                  onClick={handlePrintQuestionPaper}
                  className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm"
                >
                  <Printer className="h-3.5 w-3.5" /> Print / Save as PDF
                </button>
              </div>

              {/* Printable Paper Canvas */}
              <div
                id="printable-question-paper"
                className="bg-white text-black p-8 rounded-2xl border border-gray-300 shadow-md max-w-4xl mx-auto space-y-6 font-serif"
              >
                {/* Paper Header */}
                <div className="text-center space-y-1 border-b-2 border-black pb-4">
                  <h1 className="text-xl font-bold uppercase tracking-wider">{institutionName}</h1>
                  <h2 className="text-base font-bold">{setTitle}</h2>
                  <div className="text-xs font-semibold flex items-center justify-center gap-4 pt-1">
                    <span>বিষয়: {subjectName}</span>
                    <span>•</span>
                    <span>কারিকুলাম: {curriculumCode}</span>
                    <span>•</span>
                    <span>পূর্ণমান: {totalCalculatedMarks}</span>
                    <span>•</span>
                    <span>সময়: {durationMinutes} মিনিট</span>
                  </div>
                </div>

                {/* General Instructions */}
                <div className="text-xs italic bg-gray-50 p-2.5 rounded border border-gray-200">
                  {setType === "MCQ" ? (
                    <p>
                      [বিশেষ দ্রষ্টব্য: সরবরাহকৃত বহুনির্বাচনী অভীক্ষার উত্তরপত্রে প্রশ্নের ক্রমিক নম্বরের বিপরীতে সংশ্লিষ্ট বৃত্ত ভরাট করো। প্রতিটি প্রশ্নের মান ১। সকল প্রশ্নের উত্তর দিতে হবে। {negativeMarking > 0 ? `প্রতিটি ভুল উত্তরের জন্য ${negativeMarking} নম্বর কর্তন করা হবে।` : ""}]
                    </p>
                  ) : (
                    <p>
                      [বিশেষ দ্রষ্টব্য: প্রতিটি সৃজনশীল প্রশ্নের মান ১০ (ক=১, খ=২, গ=৩, ঘ=৪)। উদ্দীপকটি মনোযোগ সহকারে পড়ে সকল প্রশ্নের উত্তর প্রদান করো।]
                    </p>
                  )}
                </div>

                {/* Questions Layout */}
                {setType === "MCQ" ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-xs">
                    {questions.map((q, idx) => (
                      <div key={q.id || idx} className="space-y-1.5 break-inside-avoid">
                        {q.stimulusText && (
                          <div className="text-[11px] text-gray-700 italic border-l-2 border-gray-400 pl-2">
                            {q.stimulusText}
                          </div>
                        )}
                        <div className="font-bold">
                          {idx + 1}. {q.questionText}
                        </div>
                        <div className="grid grid-cols-2 gap-1.5 pl-3">
                          {q.mcqOptions?.map((opt) => (
                            <div key={opt.label} className="flex items-center gap-1.5">
                              <span className="font-semibold">({opt.label})</span>
                              <span>{opt.text}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-6 text-xs">
                    {questions.map((q, idx) => (
                      <div key={q.id || idx} className="space-y-2 border-b border-gray-200 pb-4 break-inside-avoid">
                        <div className="font-bold text-sm">
                          প্রশ্ন নং {idx + 1} :
                        </div>
                        {q.stimulusText && (
                          <div className="p-3 bg-gray-50 rounded border border-gray-200 text-gray-800 leading-relaxed">
                            {q.stimulusText}
                          </div>
                        )}
                        <div className="space-y-2 pl-2">
                          {q.cqParts?.map((part) => (
                            <div key={part.part} className="flex items-start justify-between gap-3">
                              <div>
                                <span className="font-bold mr-1">({part.bengaliLabel})</span>
                                <span>{part.questionText}</span>
                              </div>
                              <span className="font-bold shrink-0">{part.marks}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Modal Bottom Action Bar */}
        <div className="p-4 sm:p-5 border-t border-border bg-muted/40 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="text-xs text-muted-foreground flex items-center gap-2">
            <span className="font-bold text-foreground">Total: {questions.length} Questions</span>
            <span>•</span>
            <span>Marks: {totalCalculatedMarks}</span>
            <span>•</span>
            <span>Time: {durationMinutes} mins</span>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-border bg-card hover:bg-accent text-xs font-bold text-muted-foreground hover:text-foreground transition-colors"
            >
              Cancel
            </button>

            <button
              type="button"
              disabled={isSaving || questions.length === 0}
              onClick={handleSaveToQuestionBank}
              className="px-4 py-2 rounded-xl border border-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-xs font-bold hover:bg-emerald-100 transition-all shadow-sm flex items-center gap-1.5 disabled:opacity-50"
            >
              <Layers className="h-4 w-4" />
              <span>{isSaving ? "Saving..." : `Save All (${questions.length}) to Question Bank`}</span>
            </button>

            <button
              type="button"
              disabled={isPublishingExam || questions.length === 0}
              onClick={handleSaveAndPublishExam}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs font-bold shadow-md shadow-emerald-600/30 transition-all flex items-center gap-1.5 disabled:opacity-50"
            >
              <Send className="h-4 w-4" />
              <span>{isPublishingExam ? "Publishing Live..." : "🚀 Save & Publish Live Exam"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
