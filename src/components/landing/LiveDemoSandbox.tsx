"use client";

import { useState, useRef } from "react";
import {
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Play,
  RotateCcw,
  BookOpen,
  Award,
  FileText,
  Upload,
  Camera,
  ChevronRight,
  Eye,
  PlusCircle,
  Trash2,
  HelpCircle,
  Maximize2,
  X,
  Layers,
  Check,
  Edit3,
  RefreshCw,
  Sliders,
  Key,
  PenTool,
} from "lucide-react";
import { EvaluationResult } from "@/lib/types";

interface CustomRubricItem {
  id: string;
  criterion: string;
  maxPoints: number;
  description: string;
}

interface MockExamDefinition {
  id: string;
  badge: string;
  title: string;
  subject: string;
  curriculum: string;
  totalMarks: number;
  sampleImage: string;
  imageLabel: string;
  stimulus: string;
  prompt: string;
  questionParts: {
    label: string;
    level: string;
    marks: number;
    text: string;
  }[];
  modelAnswer: string;
  rubrics: {
    id: string;
    criterion: string;
    maxPoints: number;
    description: string;
  }[];
}

const mockExams: Record<string, MockExamDefinition> = {
  physics: {
    id: "mock_physics",
    badge: "🇧🇩 HSC Physics CQ",
    title: "HSC Physics: গতিবিদ্যা ও প্রাস সৃজনশীল প্রশ্ন (১০ নম্বর)",
    subject: "পদার্থবিজ্ঞান ১ম পত্র",
    curriculum: "HSC",
    totalMarks: 10,
    sampleImage: "/samples/bengali_cq_script.svg",
    imageLabel: "Bengali HSC Physics CQ Khata (Board Lined Paper)",
    stimulus:
      "২০ মিটার উঁচু একটি দালানের ছাদ থেকে একটি ক্রিকেট বলকে আনুভূমিকের সাথে ৩০° কোণে ৪০ মি./সে. বেগে উপরের দিকে তির্যকভাবে নিক্ষেপ করা হলো। অভিকর্ষজ ত্বরণ g = ৯.৮ মি./সে.²।",
    prompt:
      "২০ মিটার উঁচু একটি দালানের ছাদ থেকে একটি ক্রিকেট বলকে আনুভূমিকের সাথে ৩০° কোণে ৪০ মি./সে. বেগে উপরের দিকে তির্যকভাবে নিক্ষেপ করা হলো। অভিকর্ষজ ত্বরণ g = ৯.৮ মি./সে.²। (ক) প্রাস কী? (খ) চলন্ত বাস থেকে নামলে যাত্রী সামনের দিকে ঝুঁকে পড়ে কেন? (গ) ক্রিকেট বলটির সর্বোচ্চ উচ্চতায় পৌঁছানোর সময় নির্ণয় করো। (ঘ) সর্বোচ্চ বিন্দুতে গতিশক্তি নিক্ষেপণ বিন্দুর গতিশক্তির কত অংশ হবে গাণিতিক বিশ্লেষণ করো।",
    questionParts: [
      { label: "(ক)", level: "জ্ঞানমূলক", marks: 1.0, text: "প্রাস কী?" },
      { label: "(খ)", level: "অনুধাবনমূলক", marks: 2.0, text: "চলন্ত বাস থেকে হঠাৎ নামলে যাত্রী সামনের দিকে ঝুঁকে পড়ে কেন?" },
      { label: "(গ)", level: "প্রয়োগমূলক", marks: 3.0, text: "ক্রিকেট বলটির সর্বোচ্চ উচ্চতায় পৌঁছানোর সময় নির্ণয় করো।" },
      {
        label: "(ঘ)",
        level: "উচ্চতর দক্ষতা",
        marks: 4.0,
        text: "সর্বোচ্চ বিন্দুতে বলটির গতিশক্তি নিক্ষেপণ বিন্দুর গতিশক্তির কত অংশ হবে গাণিতিক বিশ্লেষণ করো।",
      },
    ],
    modelAnswer:
      "(ক) প্রাস: আনুভূমিকের সাথে কোনো কোণে মহাশূন্যে বা বাতাসে নিক্ষিপ্ত বস্তুকে প্রাস বলে।\n(খ) গতিজড়তার কারণে। বাসের সমান গতিবেগ লাভ করে; ভূমিতে পা স্থির হলেও শরীরের ঊর্ধ্বাংশ পূর্বের গতি বজায় রেখে সামনে এগিয়ে যেতে চায়।\n(গ) t = (v₀ sinθ)/g = (40 × sin 30°)/9.8 = 20/9.8 = 2.041 s ≈ 2.04 সেকেন্ড।\n(ঘ) Ek₁ = ½ m v₀² এবং শীর্ষবিন্দুতে অনুভূমিক বেগ vx = v₀ cos 30°। Ek₂ = ½ m (v₀ cos 30°)² = ¾ Ek₁। সর্বোচ্চ বিন্দুতে গতিশক্তি ¾ গুণ।",
    rubrics: [
      {
        id: "r_p_1",
        criterion: "(ক) জ্ঞানমূলক: প্রাসের সঠিক সংজ্ঞা",
        maxPoints: 1.0,
        description: "তির্যকভাবে মহাশূন্যে নিক্ষিপ্ত বস্তুর সংজ্ঞার উল্লেখ থাকলে পূর্ণ ১ নম্বর।",
      },
      {
        id: "r_p_2",
        criterion: "(খ) অনুধাবনমূলক: চলন্ত বাস ও গতিজড়তা ব্যাখ্যা",
        maxPoints: 2.0,
        description: "১ম প্যারায় গতিজড়তার ধারণা (১) + ২য় প্যারায় পা ও ঊর্ধ্বাংশের আপেক্ষিক গতি ব্যাখ্যা (১)।",
      },
      {
        id: "r_p_3",
        criterion: "(গ) প্রয়োগমূলক: সময় সমীকরণ ও ২.০৪ সেকেন্ড মান",
        maxPoints: 3.0,
        description: "প্রাস সমীকরণ t = (v₀ sinθ)/g (১) + মান বসানো (১) + চূড়ান্ত এককসহ মান ২.০৪ s (১)।",
      },
      {
        id: "r_p_4",
        criterion: "(ঘ) উচ্চতর দক্ষতা: গতিশক্তি ¾ গুণ প্রতিপাদন ও সার্বিক সিদ্ধান্ত",
        maxPoints: 4.0,
        description: "আদি গতিশক্তি Ek₁ (১) + বেগ বিশ্লেষণ (১) + Ek₂ = ¾ Ek₁ প্রতিপাদন (১) + সিদ্ধান্ত (১)।",
      },
    ],
  },
  math: {
    id: "mock_math",
    badge: "📐 SSC Higher Math CQ",
    title: "SSC Higher Mathematics: স্থানাঙ্ক জ্যামিতি ও ক্ষেত্রফল (১০ নম্বর)",
    subject: "উচ্চতর গণিত",
    curriculum: "SSC",
    totalMarks: 10,
    sampleImage: "/samples/math_cq_script.svg",
    imageLabel: "SSC Higher Math CQ Khata (Coordinate Geometry)",
    stimulus:
      "একটি ত্রিভুজের তিনটি শীর্ষবিন্দু যথাক্রমে A(1, 2), B(4, 6) এবং C(7, 2)। চতুর্থ একটি বিন্দু D(4, -2)।",
    prompt:
      "একটি ত্রিভুজের তিনটি শীর্ষবিন্দু যথাক্রমে A(1, 2), B(4, 6) এবং C(7, 2)। চতুর্থ একটি বিন্দু D(4, -2)। (ক) মূলবিন্দু O(0, 0) ও P(3, 4) বিন্দুর দূরত্ব নির্ণয় করো। (খ) দুটি সরলরেখা পরস্পর সমান্তরাল হওয়ার জ্যামিতিক শর্ত বিশ্লেষণ করো। (গ) ত্রিভুজ ABC এর ক্ষেত্রফল নির্ণয় করো। (ঘ) চতুর্থ শীর্ষবিন্দু D(4, -2) হলে চতুর্ভুজ ABCD একটি রম্বস না সামান্তরিক—গাণিতিক প্রতিপাদন করো।",
    questionParts: [
      { label: "(ক)", level: "জ্ঞানমূলক", marks: 1.0, text: "মূলবিন্দু O(0, 0) ও P(3, 4) বিন্দুর দূরত্ব নির্ণয় করো।" },
      { label: "(খ)", level: "অনুধাবনমূলক", marks: 2.0, text: "দুটি সরলরেখা পরস্পর সমান্তরাল হওয়ার জ্যামিতিক শর্ত বিশ্লেষণ করো।" },
      { label: "(গ)", level: "প্রয়োগমূলক", marks: 3.0, text: "ত্রিভুজ ABC এর ক্ষেত্রফল নির্ণয় করো।" },
      {
        label: "(ঘ)",
        level: "উচ্চতর দক্ষতা",
        marks: 4.0,
        text: "চতুর্থ শীর্ষবিন্দু D(4, -2) হলে চতুর্ভুজ ABCD একটি রম্বস না সামান্তরিক—গাণিতিক প্রতিপাদন করো।",
      },
    ],
    modelAnswer:
      "(ক) দূরত্ব সূত্র d = √{(x₂-x₁)² + (y₂-y₁)²} = √{(3-0)² + (4-0)²} = √25 = 5 একক।\n(খ) সমীকরণ y = m₁x + c₁ এবং y = m₂x + c₂ হলে রেখা দুটি সমান্তরাল হবে যদি m₁ = m₂ হয়।\n(গ) ΔABC = ½ | (1×6 + 4×2 + 7×2) - (2×4 + 6×7 + 2×1) | = ½ | 28 - 52 | = 12 বর্গ একক।\n(ঘ) বাহুর দৈর্ঘ্য: AB = BC = CD = DA = 5 একক। কর্ণ AC = 6 একক, কর্ণ BD = 8 একক। বাহু সমান ও কর্ণ অসমান (AC ≠ BD), তাই এটি একটি রম্বস।",
    rubrics: [
      {
        id: "r_m_1",
        criterion: "(ক) জ্ঞানমূলক: মূলবিন্দু থেকে দূরত্ব ৫ একক",
        maxPoints: 1.0,
        description: "দূরত্ব সূত্র প্রয়োগ ও চূড়ান্ত মান ৫ একক নির্ণয়।",
      },
      {
        id: "r_m_2",
        criterion: "(খ) অনুধাবনমূলক: সমান্তরাল শর্ত ঢালদ্বয় সমান m₁ = m₂",
        maxPoints: 2.0,
        description: "সমান্তরাল রেখার জ্যামিতিক কোণ ও ঢালের সমতার শর্ত ব্যাখ্যা।",
      },
      {
        id: "r_m_3",
        criterion: "(গ) প্রয়োগমূলক: শীর্ষবিন্দু দিয়ে ত্রিভুজের ক্ষেত্রফল ১২ বর্গ একক",
        maxPoints: 3.0,
        description: "স্থানাঙ্ক পদ্ধতিতে নির্ণায়ক সূত্র সাজানো ও ক্ষেত্রফল ১২ বর্গ একক নির্ণয়।",
      },
      {
        id: "r_m_4",
        criterion: "(ঘ) উচ্চতর দক্ষতা: বাহু ও কর্ণ তুলনা করে রম্বস প্রতিপাদন",
        maxPoints: 4.0,
        description: "চার বাহু সমান (৫ একক) ও কর্ণদ্বয় অসমান (৬ ও ৮ একক) দেখিয়ে রম্বস প্রমাণ।",
      },
    ],
  },
  chemistry: {
    id: "mock_chemistry",
    badge: "🧪 HSC Chemistry CQ",
    title: "HSC Chemistry: তড়িৎ রসায়ন ও ফ্যারাডের সূত্র (১০ নম্বর)",
    subject: "রসায়ন ২য় পত্র",
    curriculum: "HSC",
    totalMarks: 10,
    sampleImage: "/samples/chemistry_cq_script.svg",
    imageLabel: "HSC Chemistry 2nd Paper CQ Khata (Electrochemistry)",
    stimulus:
      "CuSO₄ দ্রবণের মধ্য দিয়ে 2.5 A তড়িৎ প্রবাহ 12 মিনিট ধরে চালনা করা হলো। Cu এর পারমাণবিক ভর = 63.5 g/mol, যোজ্যতা = 2, 1 F = 96500 C।",
    prompt:
      "CuSO₄ দ্রবণের মধ্য দিয়ে 2.5 A তড়িৎ প্রবাহ 12 মিনিট ধরে চালনা করা হলো। Cu এর পারমাণবিক ভর = 63.5 g/mol, যোজ্যতা = 2, 1 F = 96500 C। (ক) তড়িৎ রাসায়নিক তুল্যাঙ্ক (Z) এর সংজ্ঞা দাও। (খ) গ্যালভানিক কোষে লবণ সেতুর অপরিহার্য ভূমিকা ব্যাখ্যা করো। (গ) উদ্দীপক অনুসারে ক্যাথোডে কত গ্রাম তামা (Cu) সঞ্চিত হবে নির্ণয় করো। (ঘ) Zn(s) | Zn²⁺(0.1M) || Cu²⁺(0.01M) | Cu(s) কোষটির EMF ও স্বতঃস্ফূর্ততা গাণিতিকভাবে বিশ্লেষণ করো।",
    questionParts: [
      { label: "(ক)", level: "জ্ঞানমূলক", marks: 1.0, text: "তড়িৎ রাসায়নিক তুল্যাঙ্ক (Z) এর সংজ্ঞা দাও।" },
      { label: "(খ)", level: "অনুধাবনমূলক", marks: 2.0, text: "গ্যালভানিক কোষে লবণ সেতুর অপরিহার্য ভূমিকা ব্যাখ্যা করো।" },
      { label: "(গ)", level: "প্রয়োগমূলক", marks: 3.0, text: "উদ্দীপক অনুসারে ক্যাথোডে কত গ্রাম তামা (Cu) সঞ্চিত হবে নির্ণয় করো।" },
      {
        label: "(ঘ)",
        level: "উচ্চতর দক্ষতা",
        marks: 4.0,
        text: "Zn(s) | Zn²⁺(0.1M) || Cu²⁺(0.01M) | Cu(s) কোষটির EMF ও স্বতঃস্ফূর্ততা গাণিতিকভাবে বিশ্লেষণ করো।",
      },
    ],
    modelAnswer:
      "(ক) তড়িৎ রাসায়নিক তুল্যাঙ্ক: 1 কুলম্ব বিদ্যুৎ চালনা করলে তড়িৎদ্বারে যে পরিমাণ পদার্থ জমা বা দ্রবীভূত হয়।\n(খ) লবণ সেতু দুটি অর্ধকোষে তড়িৎ নিরপেক্ষতা রক্ষা করে এবং বর্তনী সচল রাখে।\n(গ) W = (M·I·t)/(e·F) = (63.5 × 2.5 × 720)/(2 × 96500) = 0.5922 g ≈ 0.59 g।\n(ঘ) E°cell = 0.34 - (-0.76) = +1.10 V। নার্নস্ট সমীকরণ মতে Ecell = 1.10 - (0.0591/2)log(0.1/0.01) = 1.07 V > 0, সুতরাং বিক্রিয়া স্বতঃস্ফূর্ত।",
    rubrics: [
      {
        id: "r_c_1",
        criterion: "(ক) জ্ঞানমূলক: তড়িৎ রাসায়নিক তুল্যাঙ্ক সঠিক সংজ্ঞা",
        maxPoints: 1.0,
        description: "১ কুলম্ব তড়িৎ প্রবাহ ও সঞ্চিত পদার্থের সংজ্ঞার নির্ভুল উল্লেখ।",
      },
      {
        id: "r_c_2",
        criterion: "(খ) অনুধাবনমূলক: লবণ সেতুর সংযোগ ও নিরপেক্ষতা রক্ষা",
        maxPoints: 2.0,
        description: "বর্তনী সচল রাখা ও আয়ন প্রবাহের মাধ্যমে তড়িৎ নিরপেক্ষতা ব্যাখ্যা।",
      },
      {
        id: "r_c_3",
        criterion: "(গ) প্রয়োগমূলক: ফ্যারাডের সূত্রে সঞ্চিত তামা ০.৫৯ গ্রাম",
        maxPoints: 3.0,
        description: "সূত্র W = (M·I·t)/(e·F) লিখে মান বসানো ও সঠিক এককসহ ০.৫৯ গ্রাম হিসাব।",
      },
      {
        id: "r_c_4",
        criterion: "(ঘ) উচ্চতর দক্ষতা: নার্নস্ট সমীকরণে EMF ১.০৭ V ও স্বতঃস্ফূর্ততা",
        maxPoints: 4.0,
        description: "E°cell নির্ণয় (১) + নার্নস্ট সমীকরণ প্রয়োগ (২) + স্বতঃস্ফূর্ততা সিদ্ধান্ত (১)।",
      },
    ],
  },
  english: {
    id: "mock_english",
    badge: "📝 HSC English 1st Paper",
    title: "HSC English 1st Paper: Analytical Composition (১০ নম্বর)",
    subject: "English 1st Paper",
    curriculum: "HSC",
    totalMarks: 10,
    sampleImage: "/samples/handwritten_essay_intro.jpg",
    imageLabel: "Authentic Handwritten English Exam Paper",
    stimulus:
      "Write an analytical composition on 'Climate Change, Disaster Preparedness and Community Resilience'.",
    prompt:
      "Write an analytical composition on 'Climate Change, Disaster Preparedness and Community Resilience'. Include: (1) Strong thesis statement with introductory perspective, (2) Analysis of extreme seasonal climate shifts, and (3) Institutional governance recommendations.",
    questionParts: [
      { label: "1.", level: "Introduction", marks: 2.5, text: "Introduce global climate realities and state a clear analytical thesis." },
      { label: "2.", level: "Analysis", marks: 2.5, text: "Examine seasonal climate shifts and structural infrastructure challenges." },
      { label: "3.", level: "Governance", marks: 2.5, text: "Recommend proactive institutional disaster mitigation mechanisms." },
      { label: "4.", level: "Language", marks: 2.5, text: "Maintain academic vocabulary, coherent paragraph transitions, and syntax." },
    ],
    modelAnswer:
      "In recent decades, escalating global climate disruptions have made recurring natural disasters an unavoidable reality. A comprehensive disaster response framework demands accurate early-warning systems, climate-resilient civil infrastructure, and proactive governance rather than reactive emergency relief.",
    rubrics: [
      {
        id: "r_e_1",
        criterion: "Thesis Statement & Contextual Introduction",
        maxPoints: 2.5,
        description: "Clearly defines thesis and establishes urgency with academic tone.",
      },
      {
        id: "r_e_2",
        criterion: "Analytical Substance & Climate Impact",
        maxPoints: 2.5,
        description: "Coherent development of environmental arguments with cause-and-effect logic.",
      },
      {
        id: "r_e_3",
        criterion: "Policy & Disaster Mitigation Recommendations",
        maxPoints: 2.5,
        description: "Proposes actionable governance solutions and structural preparedness.",
      },
      {
        id: "r_e_4",
        criterion: "Lexical Resource & Grammatical Precision",
        maxPoints: 2.5,
        description: "Rich vocabulary, compound-complex sentences, and high syntactic accuracy.",
      },
    ],
  },
};

export function LiveDemoSandbox() {
  // Main two modes: "mock" (Preset Mock Exams) or "create" (Create Custom Question & Evaluate)
  const [demoMode, setDemoMode] = useState<"mock" | "create">("mock");
  const [selectedMockKey, setSelectedMockKey] = useState<string>("physics");

  // In Create Question mode: choice between uploading an answer photo OR writing/typing the answer
  const [studentInputMode, setStudentInputMode] = useState<"upload" | "write">("upload");
  const [studentWrittenAnswer, setStudentWrittenAnswer] = useState<string>("");
  const [customImageBase64, setCustomImageBase64] = useState<string | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string>("");
  const [inputError, setInputError] = useState<string | null>(null);

  // Optional Gemini API Key
  const [apiKeyInput, setApiKeyInput] = useState<string>("");
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);

  const [isEvaluating, setIsEvaluating] = useState(false);
  const [progressStep, setProgressStep] = useState(0);
  const [evaluationResult, setEvaluationResult] = useState<EvaluationResult | null>(null);
  const [activeResultTab, setActiveResultTab] = useState<"steps" | "ocr" | "model">("steps");
  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [showImageZoomModal, setShowImageZoomModal] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  // Custom Question & Marking Points State (Used in "create" mode)
  const [customQuestionTitle, setCustomQuestionTitle] = useState("Physics Final: গতিবিদ্যা ও বল সংক্রান্ত গাণিতিক সমস্যা");
  const [customCurriculum, setCustomCurriculum] = useState("HSC");
  const [customSubject, setCustomSubject] = useState("পদার্থবিজ্ঞান ১ম পত্র");
  const [customQuestionPrompt, setCustomQuestionPrompt] = useState(
    "একটি গাড়ি স্থির অবস্থান থেকে যাত্রা শুরু করে ২.৫ মি./সে.² সুষম ত্বরণে ৮ সেকেন্ড চলল। এরপর গাড়িটি সমবেগে আরও ১০ সেকেন্ড চলল।\n(১) প্রথম ৮ সেকেন্ডে গাড়ির শেষ বেগ নির্ণয় করো।\n(২) সম্পূর্ণ যাত্রায় মোট অতিক্রান্ত দূরত্ব হিসাব করো এবং বেগ-সময় লেখচিত্রের প্রকৃতি বিশ্লেষণ করো।"
  );
  const [customModelAnswer, setCustomModelAnswer] = useState(
    "১. শেষ বেগ: v = u + at = 0 + (2.5 × 8) = 20 m/s।\n২. ত্বরণকালে দূরত্ব: s₁ = ut + ½ at² = 0 + ½ (2.5)(64) = 80 m।\n৩. সমবেগে দূরত্ব: s₂ = v × t₂ = 20 × 10 = 200 m।\n৪. মোট দূরত্ব = s₁ + s₂ = 80 + 200 = 280 m। লেখচিত্রে প্রথম ৮ সেকেন্ড মূলবিন্দুগামী সরলরেখা ও পরের ১০ সেকেন্ড সময় অক্ষের সমান্তরাল সরলরেখা নির্দেশ করে।"
  );
  const [customRubrics, setCustomRubrics] = useState<CustomRubricItem[]>([
    {
      id: "cr_1",
      criterion: "ধাপ ১: স্থির অবস্থান ও ত্বরণ সূত্র প্রয়োগ করে শেষ বেগ ২০ m/s নির্ণয়",
      maxPoints: 2.0,
      description: "v = u + at সূত্র লিখে u=0, a=2.5, t=8 বসিয়ে v = 20 m/s এককসহ নির্ণয়।",
    },
    {
      id: "cr_2",
      criterion: "ধাপ ২: ত্বরণকালীন অতিক্রান্ত দূরত্ব s₁ = ৮০ মিটার হিসাব",
      maxPoints: 3.0,
      description: "s₁ = ut + ½ at² সূত্রে সঠিক মান বসিয়ে ৮০ মিটার দূরত্ব প্রতিপাদন।",
    },
    {
      id: "cr_3",
      criterion: "ধাপ ৩: সমবেগে অতিক্রান্ত দূরত্ব s₂ = ২০০ মিটার হিসাব",
      maxPoints: 3.0,
      description: "s₂ = vt সূত্রে মান বসিয়ে ২০০ মিটার দূরত্ব প্রতিপাদন।",
    },
    {
      id: "cr_4",
      criterion: "ধাপ ৪: মোট দূরত্ব ২৮০ মিটার ও বেগ-সময় লেখচিত্রের সঠিক ব্যাখ্যা",
      maxPoints: 2.0,
      description: "মোট দূরত্ব s = ২৮০ মিটার এবং উভয় অংশের লেখচিত্রের প্রকৃতি বিশ্লেষণ।",
    },
  ]);

  const activeMock = mockExams[selectedMockKey] || mockExams.physics;

  // Active answer sheet image url: ONLY present if in mock mode OR custom photo uploaded in create mode!
  const activeImageUrl: string | null =
    demoMode === "mock"
      ? (customImageBase64 || activeMock.sampleImage)
      : customImageBase64;

  const steps = [
    "📷 Vision Scanning & Input Ingestion...",
    "🔍 Vision OCR / Text Parsing Extracting Steps, Equations & Units...",
    "📐 Cross-referencing against Model Answer & Point-by-Point Rubrics...",
    "⚖️ Allocating Exact Marks & Generating Teacher-Grade Explanations...",
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadedFileName(file.name);
    setInputError(null);
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setCustomImageBase64(reader.result);
        setEvaluationResult(null);
      }
    };
    reader.readAsDataURL(file);
  };

  const addRubricPoint = () => {
    const newId = `cr_${Date.now()}`;
    setCustomRubrics((prev) => [
      ...prev,
      {
        id: newId,
        criterion: `ধাপ ${prev.length + 1}: প্রধান শর্ত ও গাণিতিক হিসাব`,
        maxPoints: 2.0,
        description: "এই নম্বরের জন্য প্রয়োজনীয় সূত্র, একক, বা ব্যাখ্যার সুনির্দিষ্ট শর্ত উল্লেখ করুন।",
      },
    ]);
  };

  const removeRubricPoint = (id: string) => {
    if (customRubrics.length <= 1) return;
    setCustomRubrics((prev) => prev.filter((r) => r.id !== id));
  };

  const updateRubricPoint = (id: string, field: keyof CustomRubricItem, value: any) => {
    setCustomRubrics((prev) =>
      prev.map((r) => (r.id === id ? { ...r, [field]: value } : r))
    );
  };

  const totalCustomMarks = customRubrics.reduce((sum, r) => sum + Number(r.maxPoints || 0), 0);

  const runEvaluation = async () => {
    setInputError(null);

    // If in Create Question mode, verify an answer photo was uploaded or text was written
    if (demoMode === "create") {
      const hasPhoto = !!customImageBase64;
      const hasText = !!studentWrittenAnswer.trim();

      if (!hasPhoto && !hasText) {
        setInputError("অনুগ্রহ করে মূল্যায়নের পূর্বে শিক্ষার্থীর উত্তরের ছবি আপলোড করুন অথবা উত্তরটি লিখে দিন। (Please upload an answer photo or write an answer first.)");
        return;
      }
    }

    setIsEvaluating(true);
    setEvaluationResult(null);
    setProgressStep(0);

    const stepInterval = setInterval(() => {
      setProgressStep((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
    }, 450);

    try {
      let payload: any = {
        answerSheetImages: activeImageUrl ? [activeImageUrl] : [],
        answerSheetFileName: uploadedFileName,
        typedAnswer: studentWrittenAnswer,
        apiKey: apiKeyInput.trim() || undefined,
      };

      if (demoMode === "mock") {
        // Send the mock exam definition to /api/evaluate
        payload.customExam = {
          id: activeMock.id,
          title: activeMock.title,
          subject: activeMock.subject,
          curriculumCode: activeMock.curriculum,
          totalMarks: activeMock.totalMarks,
          questions: [
            {
              id: `q_${activeMock.id}`,
              type: "DESCRIPTIVE",
              marks: activeMock.totalMarks,
              questionText: activeMock.prompt,
              stimulusText: activeMock.stimulus,
              modelAnswer: activeMock.modelAnswer,
              rubrics: activeMock.rubrics,
            },
          ],
        };
      } else {
        // Send user-created question with exact marking points to real backend AI
        payload.customExam = {
          id: `custom_exam_${Date.now()}`,
          title: customQuestionTitle,
          subject: customSubject,
          curriculumCode: customCurriculum,
          totalMarks: totalCustomMarks,
          questions: [
            {
              id: "q_user_custom_01",
              type: "DESCRIPTIVE",
              marks: totalCustomMarks,
              questionText: customQuestionPrompt,
              modelAnswer: customModelAnswer,
              rubrics: customRubrics.map((r) => ({
                id: r.id,
                criterion: r.criterion,
                maxPoints: Number(r.maxPoints),
                description: r.description,
              })),
            },
          ],
        };
      }

      const res = await fetch("/api/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.evaluation) {
        setEvaluationResult(data.evaluation);
      } else if (data.error) {
        setInputError(`মূল্যায়নে সমস্যা হয়েছে: ${data.error}`);
      }
    } catch (err: any) {
      console.error("Evaluation error:", err);
      setInputError("সার্ভার থেকে উত্তর পেতে সমস্যা হয়েছে। অনুগ্রহ করে পুনরায় চেষ্টা করুন।");
    } finally {
      clearInterval(stepInterval);
      setIsEvaluating(false);
    }
  };

  return (
    <section id="demo" className="py-16 sm:py-24 bg-gradient-to-b from-background via-emerald-950/[0.03] to-background">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 space-y-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-bold shadow-sm">
            <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
            Interactive Real Question & Step-Marking Sandbox
          </div>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-foreground">
            Real Questions, <span className="text-emerald-600">Student Answers</span> & Step Explanations
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Grade standard curriculum mock papers with matching handwritten scripts, or create your own custom question, set exact points per mark, upload an answer photo or write an answer, and let our backend AI evaluate each step.
          </p>
        </div>

        {/* Sandbox Card */}
        <div className="rounded-3xl border border-border bg-card shadow-2xl overflow-hidden">
          {/* Top Control Bar: Mode Selector & Action Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 sm:p-6 border-b border-border bg-muted/40">
            {/* Primary Mode Tabs */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground mr-1">
                Evaluation Mode:
              </span>
              <div className="inline-flex p-1 rounded-2xl bg-background border border-border shadow-inner">
                <button
                  onClick={() => {
                    setDemoMode("mock");
                    setCustomImageBase64(null);
                    setStudentWrittenAnswer("");
                    setInputError(null);
                    setEvaluationResult(null);
                  }}
                  className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1.5 ${
                    demoMode === "mock"
                      ? "bg-emerald-600 text-white shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <BookOpen className="h-3.5 w-3.5" />
                  <span>📋 Mock Exam Evaluation (মক মূল্যায়ন)</span>
                </button>

                <button
                  onClick={() => {
                    setDemoMode("create");
                    setCustomImageBase64(null);
                    setStudentWrittenAnswer("");
                    setInputError(null);
                    setEvaluationResult(null);
                  }}
                  className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1.5 ${
                    demoMode === "create"
                      ? "bg-emerald-600 text-white shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Edit3 className="h-3.5 w-3.5" />
                  <span>✏️ Create Question & Evaluate (প্রশ্ন তৈরি ও মূল্যায়ন)</span>
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2.5">
              <button
                onClick={() => setShowApiKeyModal(true)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-bold transition-all shadow-sm ${
                  apiKeyInput
                    ? "border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
                    : "border-border bg-background hover:bg-accent text-muted-foreground hover:text-foreground"
                }`}
                title="Connect custom Google Gemini API Key"
              >
                <Key className="h-3.5 w-3.5" />
                <span>{apiKeyInput ? "Gemini Key: Active" : "AI Settings"}</span>
              </button>

              <button
                onClick={() => setShowQuestionModal(true)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-border bg-background hover:bg-accent text-xs font-bold text-foreground transition-all shadow-sm"
              >
                <Eye className="h-3.5 w-3.5 text-emerald-600" />
                <span>
                  {demoMode === "mock" ? "View Question & Marks Scheme" : "Edit Question & Rubric Points"}
                </span>
              </button>

              <button
                onClick={runEvaluation}
                disabled={isEvaluating}
                className="flex items-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 px-5 py-2 text-xs sm:text-sm font-bold text-white shadow-md shadow-emerald-600/20 transition-all disabled:opacity-60"
              >
                {isEvaluating ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Evaluating...
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 fill-white" />
                    Run AI Evaluation
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Sub-Header: Mock Question Types or Custom Title Banner */}
          <div className="px-6 py-3.5 border-b border-border bg-background/80 flex flex-wrap items-center justify-between gap-3 text-xs">
            {demoMode === "mock" ? (
              <div className="flex items-center gap-2 flex-wrap w-full sm:w-auto">
                <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mr-1">
                  Select Mock Question:
                </span>
                <div className="inline-flex gap-1.5 flex-wrap">
                  {Object.entries(mockExams).map(([key, mock]) => (
                    <button
                      key={key}
                      onClick={() => {
                        setSelectedMockKey(key);
                        setCustomImageBase64(null);
                        setStudentWrittenAnswer("");
                        setInputError(null);
                        setEvaluationResult(null);
                      }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                        selectedMockKey === key
                          ? "border-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 shadow-sm"
                          : "border-border bg-card hover:bg-accent text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {mock.badge}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-foreground flex items-center gap-1.5">
                  <Edit3 className="h-3.5 w-3.5 text-emerald-600" />
                  <span>{customQuestionTitle}</span>
                  <span className="text-muted-foreground font-normal">({totalCustomMarks} নম্বর)</span>
                </span>
              </div>
            )}

            {/* Quick Status / View Button */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowQuestionModal(true)}
                className="text-xs font-bold text-emerald-600 hover:text-emerald-700 dark:hover:text-emerald-400 hover:underline flex items-center gap-1"
              >
                <HelpCircle className="h-3.5 w-3.5" />
                <span>
                  {demoMode === "mock" ? "See Question, Stimulus & Sub-parts" : "Customize Question & Points"}
                </span>
              </button>
            </div>
          </div>

          {/* Validation Alert if no answer was provided */}
          {inputError && (
            <div className="px-6 py-3 bg-amber-500/10 border-b border-amber-500/20 text-amber-700 dark:text-amber-300 text-xs font-bold flex items-center gap-2 animate-in fade-in">
              <AlertTriangle className="h-4 w-4 shrink-0 text-amber-600" />
              <span>{inputError}</span>
            </div>
          )}

          {/* Sandbox Body: Split Screen */}
          <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[600px]">
            {/* Left: Student Answer Input (Photo or Written Answer) */}
            <div className="lg:col-span-5 p-5 sm:p-6 border-b lg:border-b-0 lg:border-r border-border bg-muted/15 flex flex-col justify-between space-y-5">
              <div className="space-y-4">
                {/* Header with Input Mode Switcher in Create Mode */}
                {demoMode === "create" ? (
                  <div className="space-y-2">
                    <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block">
                      Provide Student Answer:
                    </span>
                    <div className="grid grid-cols-2 gap-1 p-1 bg-background rounded-2xl border border-border">
                      <button
                        onClick={() => setStudentInputMode("upload")}
                        className={`py-1.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                          studentInputMode === "upload"
                            ? "bg-emerald-600 text-white shadow-sm"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        <Upload className="h-3.5 w-3.5" />
                        <span>Upload Answer Photo</span>
                      </button>

                      <button
                        onClick={() => setStudentInputMode("write")}
                        className={`py-1.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                          studentInputMode === "write"
                            ? "bg-emerald-600 text-white shadow-sm"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        <PenTool className="h-3.5 w-3.5" />
                        <span>Write Answer</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-emerald-600" />
                      <span className="text-xs font-bold text-foreground">
                        Student Answer Sheet Photo
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-[11px] font-bold text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 transition-colors flex items-center gap-1 shadow-sm"
                      >
                        <Upload className="h-3 w-3" />
                        <span>Upload Photo</span>
                      </button>
                      <button
                        onClick={() => cameraInputRef.current?.click()}
                        className="px-2.5 py-1 rounded-lg border border-border bg-background hover:bg-accent text-[11px] font-bold text-foreground transition-colors flex items-center gap-1 shadow-sm"
                        title="Capture with camera"
                      >
                        <Camera className="h-3 w-3 text-muted-foreground" />
                        <span className="hidden sm:inline">Camera</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Hidden File Inputs */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <input
                  ref={cameraInputRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handleFileUpload}
                  className="hidden"
                />

                {/* VIEW 1: If Photo Upload Mode or Mock Mode with Active Image */}
                {(demoMode === "mock" || (demoMode === "create" && studentInputMode === "upload")) && (
                  <>
                    {activeImageUrl ? (
                      /* Display Selected / Uploaded Photo */
                      <div className="space-y-3">
                        <div className="relative group rounded-2xl border border-border overflow-hidden bg-slate-950 shadow-lg min-h-[300px] max-h-[380px] flex items-center justify-center">
                          <img
                            src={activeImageUrl}
                            alt="Student Handwritten Answer Sheet"
                            className="w-full h-full object-contain max-h-[380px] transition-transform duration-300 group-hover:scale-[1.02]"
                          />

                          {/* Top-Right Action Buttons */}
                          <div className="absolute top-3 right-3 flex items-center gap-1.5">
                            {customImageBase64 && (
                              <button
                                onClick={() => {
                                  setCustomImageBase64(null);
                                  setUploadedFileName("");
                                  setEvaluationResult(null);
                                }}
                                className="p-2 rounded-xl bg-destructive/80 hover:bg-destructive text-white backdrop-blur transition-all shadow-md text-xs font-bold flex items-center gap-1"
                                title="Remove this photo"
                              >
                                <X className="h-3.5 w-3.5" />
                                <span className="hidden sm:inline text-[10px]">Remove</span>
                              </button>
                            )}

                            <button
                              onClick={() => setShowImageZoomModal(true)}
                              className="p-2 rounded-xl bg-black/60 hover:bg-black/80 text-white backdrop-blur transition-all shadow-md"
                              title="Inspect Full Size Photo"
                            >
                              <Maximize2 className="h-4 w-4" />
                            </button>
                          </div>

                          {/* Bottom Script Caption */}
                          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent p-3 flex items-center justify-between text-[11px] text-white">
                            <span className="font-semibold truncate max-w-[250px]">
                              {customImageBase64
                                ? `Uploaded: ${uploadedFileName || "Handwritten Script"}`
                                : activeMock.imageLabel}
                            </span>
                            <span className="px-2 py-0.5 rounded bg-emerald-600/80 font-bold text-[10px]">
                              Handwritten Script
                            </span>
                          </div>
                        </div>

                        {/* Change / Re-upload bar */}
                        {demoMode === "create" && (
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-muted-foreground text-[11px]">
                              Ready to evaluate this photo against your question.
                            </span>
                            <button
                              onClick={() => fileInputRef.current?.click()}
                              className="text-emerald-600 hover:underline font-bold text-xs flex items-center gap-1"
                            >
                              <Upload className="h-3 w-3" /> Change Photo
                            </button>
                          </div>
                        )}
                      </div>
                    ) : (
                      /* Clean Empty Dropzone when in Create Mode without any preloaded photo */
                      <div className="border-2 border-dashed border-border rounded-3xl p-8 text-center space-y-4 bg-background/50 hover:bg-muted/10 transition-colors flex flex-col items-center justify-center min-h-[300px]">
                        <div className="h-16 w-16 rounded-3xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-600 flex items-center justify-center shadow-sm">
                          <Upload className="h-8 w-8" />
                        </div>
                        <div className="space-y-1.5 max-w-sm">
                          <h5 className="font-extrabold text-sm text-foreground">
                            Upload Student Answer Sheet Photo
                          </h5>
                          <p className="text-xs text-muted-foreground leading-relaxed">
                            No default image is loaded. Select a photo of handwritten exam paper from your phone or computer, or snap with camera.
                          </p>
                        </div>
                        <div className="flex items-center justify-center gap-2.5 pt-2">
                          <button
                            onClick={() => fileInputRef.current?.click()}
                            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-600/20"
                          >
                            <Upload className="h-3.5 w-3.5" /> Upload Photo
                          </button>
                          <button
                            onClick={() => cameraInputRef.current?.click()}
                            className="px-4 py-2.5 rounded-xl border border-border bg-background hover:bg-accent font-bold text-xs text-foreground flex items-center gap-1.5 shadow-sm"
                          >
                            <Camera className="h-3.5 w-3.5 text-muted-foreground" /> Camera
                          </button>
                        </div>
                      </div>
                    )}
                  </>
                )}

                {/* VIEW 2: Write / Type Student Answer Mode in Create Mode */}
                {demoMode === "create" && studentInputMode === "write" && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                        <PenTool className="h-3.5 w-3.5 text-emerald-600" />
                        <span>Write Student Answer:</span>
                      </span>
                      <span className="text-[11px] text-muted-foreground">
                        {studentWrittenAnswer.trim() ? studentWrittenAnswer.trim().split(/\s+/).length : 0} Words
                      </span>
                    </div>

                    <textarea
                      rows={11}
                      value={studentWrittenAnswer}
                      onChange={(e) => {
                        setStudentWrittenAnswer(e.target.value);
                        setInputError(null);
                      }}
                      placeholder="Type or paste the student's solution here (formulas, mathematical derivations, steps, explanations, or essays)...&#10;&#10;Example for kinematics:&#10;v = u + at = 0 + (2.5 * 8) = 20 m/s&#10;s = ut + 0.5*a*t^2 = 80 m&#10;&#10;Tip: If you test typing an unrelated topic (e.g. floods essay), the AI will detect the irrelevance and award 0 marks!"
                      className="w-full p-4 rounded-2xl border border-border bg-background text-xs font-mono leading-relaxed focus:outline-none focus:ring-2 focus:ring-emerald-500/20 shadow-inner"
                    />

                    <div className="flex justify-between items-center text-xs text-muted-foreground">
                      <span>Pure typed text evaluation via backend engine.</span>
                      {studentWrittenAnswer && (
                        <button
                          onClick={() => setStudentWrittenAnswer("")}
                          className="text-destructive hover:underline font-bold text-[11px]"
                        >
                          Clear Text
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {/* View Question Quick Callout in Mock Mode */}
                {demoMode === "mock" && (
                  <div className="p-3.5 rounded-2xl border border-border bg-background space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-foreground text-xs flex items-center gap-1.5">
                        <BookOpen className="h-3.5 w-3.5 text-emerald-600" />
                        <span>{activeMock.title}</span>
                      </span>
                      <button
                        onClick={() => setShowQuestionModal(true)}
                        className="px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-[11px] font-bold text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 transition-colors flex items-center gap-1"
                      >
                        <Eye className="h-3 w-3" />
                        <span>View Question</span>
                      </button>
                    </div>
                    <p className="text-[11px] text-muted-foreground line-clamp-2 leading-relaxed">
                      {activeMock.stimulus || activeMock.prompt}
                    </p>
                  </div>
                )}
              </div>

              {/* Handwriting Legibility Confidence Meter */}
              <div className="pt-3 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                  <span>AI Engine Status:</span>
                </span>
                <span className="font-bold text-emerald-600">
                  {apiKeyInput ? "Google Gemini Vision Cloud" : "Backend AI Evaluator Active"}
                </span>
              </div>
            </div>

            {/* Right: AI Evaluation Output & Step-by-Step Explanations OR Custom Question Editor */}
            <div className="lg:col-span-7 p-5 sm:p-6 flex flex-col justify-between bg-card space-y-6">
              {isEvaluating ? (
                /* Scanning Animation */
                <div className="h-full min-h-[400px] flex flex-col items-center justify-center py-16 text-center space-y-5">
                  <div className="relative">
                    <div className="h-20 w-20 rounded-full border-4 border-emerald-200 dark:border-emerald-800 border-t-emerald-600 animate-spin" />
                    <Sparkles className="absolute inset-0 m-auto h-7 w-7 text-emerald-600" />
                  </div>
                  <div className="space-y-1.5 max-w-sm">
                    <h4 className="text-base font-extrabold text-foreground animate-pulse">
                      {steps[progressStep]}
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      Executing Multimodal Vision OCR and cross-referencing against model answers and step marking points
                    </p>
                  </div>
                  <div className="w-72 bg-muted rounded-full h-2 overflow-hidden shadow-inner">
                    <div
                      className="bg-emerald-600 h-full transition-all duration-300 rounded-full"
                      style={{ width: `${((progressStep + 1) / steps.length) * 100}%` }}
                    />
                  </div>
                </div>
              ) : evaluationResult ? (
                /* Full Evaluation Results View */
                <div className="space-y-5 animate-in fade-in duration-300">
                  {/* Irrelevant Alert Banner if mismatch caught */}
                  {evaluationResult.totalScore === 0 && evaluationResult.overallFeedback.includes("Irrelevant") && (
                    <div className="p-4 rounded-2xl bg-destructive/10 border border-destructive/30 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-destructive font-black text-xs">
                          <AlertTriangle className="h-4 w-4 shrink-0" />
                          <span>❌ IRRELEVANT ANSWER DETECTED — 0 MARKS AWARDED</span>
                        </div>
                        <span className="px-2 py-0.5 rounded bg-destructive text-white text-[10px] font-black uppercase">
                          Failed (0%)
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {evaluationResult.overallFeedback}
                      </p>
                    </div>
                  )}

                  {/* Top Score Banner */}
                  <div
                    className={`p-4 sm:p-5 rounded-2xl border flex flex-wrap items-center justify-between gap-4 shadow-sm ${
                      evaluationResult.totalScore === 0
                        ? "bg-destructive/10 border-destructive/30"
                        : "bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/40 dark:to-teal-950/20 border-emerald-200 dark:border-emerald-800"
                    }`}
                  >
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                        Evaluated Score & Performance
                      </span>
                      <div className="text-2xl sm:text-3xl font-black text-foreground mt-0.5">
                        {evaluationResult.totalScore} / {evaluationResult.maxScore}{" "}
                        <span className="text-base sm:text-lg font-bold text-muted-foreground">
                          ({evaluationResult.percentage}%)
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="text-[11px] text-muted-foreground font-semibold">Grade Awarded:</div>
                        <div className="text-lg font-black text-foreground">
                          {evaluationResult.grade}
                        </div>
                      </div>
                      <div
                        className={`h-11 w-11 rounded-2xl text-white flex items-center justify-center font-bold text-sm shadow-md ${
                          evaluationResult.totalScore === 0 ? "bg-destructive" : "bg-emerald-600"
                        }`}
                      >
                        {evaluationResult.gpa > 0 ? `GPA ${evaluationResult.gpa.toFixed(1)}` : evaluationResult.grade}
                      </div>
                    </div>
                  </div>

                  {/* Overall Feedback Rationale */}
                  <div className="p-4 rounded-2xl border border-border bg-muted/20 space-y-1.5">
                    <div className="text-xs font-bold text-foreground flex items-center gap-2">
                      <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
                      <span>AI Examiner Summary & Handwriting Assessment:</span>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {evaluationResult.overallFeedback}
                    </p>
                  </div>

                  {/* Tabs: Step Breakdown / OCR Extraction / Model Answer */}
                  <div className="flex items-center gap-1.5 border-b border-border pb-1">
                    <button
                      onClick={() => setActiveResultTab("steps")}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                        activeResultTab === "steps"
                          ? "bg-emerald-600 text-white shadow-sm"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      Step-by-Step Mark Breakdown
                    </button>
                    <button
                      onClick={() => setActiveResultTab("ocr")}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                        activeResultTab === "ocr"
                          ? "bg-emerald-600 text-white shadow-sm"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      Vision OCR Recognized Text
                    </button>
                    <button
                      onClick={() => setActiveResultTab("model")}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                        activeResultTab === "model"
                          ? "bg-emerald-600 text-white shadow-sm"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      Expected Model Answer
                    </button>
                  </div>

                  {/* Tab 1: Step Breakdown */}
                  {activeResultTab === "steps" && (
                    <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
                      {evaluationResult.questionEvaluations.map((qe) => (
                        <div key={qe.questionId} className="space-y-2.5">
                          {/* If CQ Sub-Parts */}
                          {qe.cqPartEvaluations && qe.cqPartEvaluations.length > 0 ? (
                            qe.cqPartEvaluations.map((part) => (
                              <div
                                key={part.part}
                                className="p-3.5 rounded-2xl border border-border bg-card space-y-2 shadow-sm"
                              >
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <span className="font-extrabold text-foreground text-xs">
                                      {part.bengaliLabel} ({part.maxMarks} নম্বর)
                                    </span>
                                  </div>
                                  <span
                                    className={`px-2.5 py-0.5 rounded-full text-[11px] font-black ${
                                      part.awardedMarks === part.maxMarks
                                        ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300"
                                        : part.awardedMarks > 0
                                        ? "bg-amber-500/15 text-amber-700 dark:text-amber-300"
                                        : "bg-destructive/15 text-destructive"
                                    }`}
                                  >
                                    {part.awardedMarks} / {part.maxMarks} Marks
                                  </span>
                                </div>
                                <p className="text-xs text-muted-foreground leading-relaxed">
                                  {part.feedback}
                                </p>
                              </div>
                            ))
                          ) : qe.rubricScores && qe.rubricScores.length > 0 ? (
                            /* Point-by-point rubric list */
                            qe.rubricScores.map((rubric) => (
                              <div
                                key={rubric.rubricId}
                                className="p-3.5 rounded-2xl border border-border bg-card space-y-2 shadow-sm"
                              >
                                <div className="flex items-center justify-between">
                                  <span className="font-extrabold text-foreground text-xs">
                                    {rubric.criterion}
                                  </span>
                                  <span
                                    className={`px-2.5 py-0.5 rounded-full text-[11px] font-black ${
                                      rubric.awardedPoints === rubric.maxPoints
                                        ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300"
                                        : rubric.awardedPoints > 0
                                        ? "bg-amber-500/15 text-amber-700 dark:text-amber-300"
                                        : "bg-destructive/15 text-destructive"
                                    }`}
                                  >
                                    {rubric.awardedPoints} / {rubric.maxPoints} Marks
                                  </span>
                                </div>
                                <p className="text-xs text-muted-foreground leading-relaxed">
                                  {rubric.justification}
                                </p>
                              </div>
                            ))
                          ) : (
                            <div className="p-3.5 rounded-2xl border border-border bg-card">
                              <p className="text-xs text-muted-foreground">{qe.feedback}</p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Tab 2: OCR Extracted Text */}
                  {activeResultTab === "ocr" && (
                    <div className="p-4 rounded-2xl border border-border bg-muted/20 font-mono text-xs text-foreground space-y-2 max-h-[380px] overflow-y-auto">
                      <div className="text-[11px] font-bold text-muted-foreground uppercase font-sans flex items-center justify-between">
                        <span>Recognized Student Text (Vision OCR):</span>
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 font-bold text-[10px]">
                          OCR Processed
                        </span>
                      </div>
                      <div className="whitespace-pre-wrap leading-relaxed text-foreground bg-background/60 p-3 rounded-xl border border-border/80">
                        {evaluationResult?.ocrRecognizedText ||
                          evaluationResult?.questionEvaluations?.[0]?.extractedText ||
                          studentWrittenAnswer ||
                          "⚠️ কোনো হস্তাক্ষর বা টেক্সট সনাক্ত করা যায়নি।"}
                      </div>
                    </div>
                  )}

                  {/* Tab 3: Model Answer Comparison */}
                  {activeResultTab === "model" && (
                    <div className="p-4 rounded-2xl border border-border bg-muted/20 text-xs space-y-2 max-h-[380px] overflow-y-auto">
                      <div className="text-[11px] font-bold text-muted-foreground uppercase flex items-center justify-between">
                        <span>Teacher Official Expected Model Answer:</span>
                        <span className="text-emerald-600 font-bold">Full Credit Benchmark</span>
                      </div>
                      <div className="whitespace-pre-wrap leading-relaxed text-foreground">
                        {demoMode === "mock"
                          ? activeMock.modelAnswer
                          : customModelAnswer}
                      </div>
                    </div>
                  )}
                </div>
              ) : demoMode === "create" ? (
                /* Mode 2 Idle State: Custom Question & Marking Points Form */
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-extrabold text-foreground flex items-center gap-1.5">
                        <Edit3 className="h-4 w-4 text-emerald-600" />
                        <span>Create Your Exam Question & Marking Points</span>
                      </h4>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Define your custom question, expected answer, and the exact points for each mark.
                      </p>
                    </div>
                    <span className="px-2.5 py-1 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-black">
                      Total: {totalCustomMarks} Marks
                    </span>
                  </div>

                  <div className="space-y-3 text-xs">
                    <div>
                      <label className="font-bold text-foreground block mb-1">
                        Exam Title & Subject:
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <input
                          type="text"
                          value={customQuestionTitle}
                          onChange={(e) => setCustomQuestionTitle(e.target.value)}
                          placeholder="e.g. Physics Final: Kinematics & Laws of Motion"
                          className="px-3 py-2 rounded-xl border border-border bg-background font-bold text-xs"
                        />
                        <input
                          type="text"
                          value={customSubject}
                          onChange={(e) => setCustomSubject(e.target.value)}
                          placeholder="Subject (e.g. পদার্থবিজ্ঞান ১ম পত্র)"
                          className="px-3 py-2 rounded-xl border border-border bg-background text-xs"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="font-bold text-foreground block mb-1">
                        Question / Problem Statement:
                      </label>
                      <textarea
                        rows={3}
                        value={customQuestionPrompt}
                        onChange={(e) => setCustomQuestionPrompt(e.target.value)}
                        placeholder="Type your question or stimulus..."
                        className="w-full px-3 py-2 rounded-xl border border-border bg-background text-xs"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-foreground block mb-1">
                        Expected Model Answer:
                      </label>
                      <textarea
                        rows={2}
                        value={customModelAnswer}
                        onChange={(e) => setCustomModelAnswer(e.target.value)}
                        placeholder="Write the correct steps or expected answer..."
                        className="w-full px-3 py-2 rounded-xl border border-border bg-background text-xs"
                      />
                    </div>

                    {/* Marking Points Scheme */}
                    <div className="space-y-2 pt-2 border-t border-border">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-foreground">
                          Marking Points & Criteria ({customRubrics.length} Criteria)
                        </span>
                        <button
                          onClick={addRubricPoint}
                          className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold flex items-center gap-1 shadow-sm"
                        >
                          <PlusCircle className="h-3 w-3" /> + Add Point
                        </button>
                      </div>

                      <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1">
                        {customRubrics.map((r) => (
                          <div
                            key={r.id}
                            className="p-2.5 rounded-xl border border-border bg-muted/20 space-y-1.5"
                          >
                            <div className="flex items-center justify-between gap-2">
                              <input
                                type="text"
                                value={r.criterion}
                                onChange={(e) => updateRubricPoint(r.id, "criterion", e.target.value)}
                                placeholder="Criterion name"
                                className="flex-1 px-2 py-1 rounded-lg border border-border bg-background font-bold text-xs"
                              />
                              <div className="flex items-center gap-1 shrink-0">
                                <input
                                  type="number"
                                  min={0.5}
                                  step={0.5}
                                  value={r.maxPoints}
                                  onChange={(e) =>
                                    updateRubricPoint(r.id, "maxPoints", parseFloat(e.target.value) || 1)
                                  }
                                  className="w-14 px-1.5 py-1 rounded-lg border border-border bg-background font-bold text-xs text-center"
                                />
                                <span className="text-[11px] font-bold text-emerald-600">Marks</span>
                                {customRubrics.length > 1 && (
                                  <button
                                    onClick={() => removeRubricPoint(r.id)}
                                    className="p-1 text-muted-foreground hover:text-destructive"
                                  >
                                    <Trash2 className="h-3 w-3" />
                                  </button>
                                )}
                              </div>
                            </div>
                            <input
                              type="text"
                              value={r.description}
                              onChange={(e) => updateRubricPoint(r.id, "description", e.target.value)}
                              placeholder="Requirement description for awarding this mark"
                              className="w-full px-2 py-0.5 rounded-lg border border-border bg-background text-[11px] text-muted-foreground"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      onClick={runEvaluation}
                      className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-emerald-600/20"
                    >
                      <Play className="h-4 w-4 fill-white" />
                      Evaluate Student Answer with Real Backend AI
                    </button>
                  </div>
                </div>
              ) : (
                /* Mode 1 Idle State: Mock Evaluation Welcome */
                <div className="h-full min-h-[380px] flex flex-col items-center justify-center py-12 text-center space-y-4">
                  <div className="h-16 w-16 rounded-3xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center text-emerald-600 shadow-sm">
                    <Award className="h-8 w-8" />
                  </div>
                  <div className="space-y-1.5 max-w-sm">
                    <h4 className="text-lg font-black text-foreground">
                      Ready for AI Evaluation
                    </h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Click the <strong>&quot;Run AI Evaluation&quot;</strong> button to execute vision handwriting recognition on this authentic script, verify against the marking scheme, and inspect exact step-by-step marks with explanations.
                    </p>
                  </div>
                  <div className="flex items-center gap-2.5 pt-2">
                    <button
                      onClick={runEvaluation}
                      className="flex items-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-emerald-600/20 transition-all"
                    >
                      <Play className="h-3.5 w-3.5 fill-white" />
                      Start AI Evaluation Now
                    </button>
                    <button
                      onClick={() => setShowQuestionModal(true)}
                      className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-border bg-background hover:bg-accent text-xs font-bold text-foreground transition-all"
                    >
                      <Eye className="h-3.5 w-3.5 text-emerald-600" />
                      View Marking Points
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* MODAL 1: Question, Stimulus & Marking Scheme Modal */}
      {showQuestionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in">
          <div className="relative max-w-2xl w-full max-h-[90vh] overflow-y-auto rounded-3xl border border-border bg-card p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-emerald-600" />
                <h3 className="font-extrabold text-foreground text-sm">
                  {demoMode === "mock"
                    ? activeMock.title
                    : `Edit Question: ${customQuestionTitle}`}
                </h3>
              </div>
              <button
                onClick={() => setShowQuestionModal(false)}
                className="p-1 rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {demoMode === "mock" ? (
              /* Pre-set Question & Rubrics Viewer */
              <div className="space-y-4 text-xs">
                {activeMock.stimulus && (
                  <div className="p-3.5 rounded-2xl bg-muted/30 border border-border space-y-1.5">
                    <span className="font-extrabold text-foreground text-xs">উদ্দীপক (Stimulus / Context):</span>
                    <p className="text-muted-foreground leading-relaxed italic">
                      {activeMock.stimulus}
                    </p>
                  </div>
                )}

                <div className="space-y-2">
                  <span className="font-extrabold text-foreground text-xs block">
                    প্রশ্ন ও ধাপভিত্তিক নম্বর বণ্টন ({activeMock.totalMarks} নম্বর মোট):
                  </span>
                  <div className="space-y-2">
                    {activeMock.questionParts.map((p, idx) => (
                      <div key={idx} className="p-3 rounded-xl border border-border bg-background">
                        <div className="flex justify-between font-bold text-foreground">
                          <span>
                            {p.label} {p.level && `(${p.level})`}: {p.text}
                          </span>
                          <span className="text-emerald-600 font-extrabold">{p.marks} নম্বর</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <span className="font-extrabold text-foreground text-xs block">
                    অফিসিয়াল আদর্শ উত্তর (Teacher Model Answer):
                  </span>
                  <div className="p-3.5 rounded-xl border border-border bg-muted/20 text-muted-foreground whitespace-pre-wrap leading-relaxed">
                    {activeMock.modelAnswer}
                  </div>
                </div>

                <div className="space-y-2">
                  <span className="font-extrabold text-foreground text-xs block">
                    রুব্রিক নির্দেশিকা ও পয়েন্টভিত্তিক মূল্যায়ন শর্ত:
                  </span>
                  <div className="space-y-2">
                    {activeMock.rubrics.map((r) => (
                      <div
                        key={r.id}
                        className="p-3 rounded-xl border border-border bg-background flex justify-between gap-2"
                      >
                        <div>
                          <span className="font-bold text-foreground">{r.criterion}</span>
                          <p className="text-[11px] text-muted-foreground mt-0.5">{r.description}</p>
                        </div>
                        <span className="font-extrabold text-emerald-600 shrink-0">
                          {r.maxPoints} নম্বর
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end pt-3 border-t border-border">
                  <button
                    onClick={() => setShowQuestionModal(false)}
                    className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md"
                  >
                    Close Scheme
                  </button>
                </div>
              </div>
            ) : (
              /* Custom Question Editor Inside Modal */
              <div className="space-y-4 text-xs">
                <p className="text-muted-foreground">
                  You can edit your question title, prompt, model answer, and marking criteria below.
                </p>
                <div>
                  <label className="font-bold text-foreground block mb-1">Question Title:</label>
                  <input
                    type="text"
                    value={customQuestionTitle}
                    onChange={(e) => setCustomQuestionTitle(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-border bg-background font-bold text-xs"
                  />
                </div>
                <div>
                  <label className="font-bold text-foreground block mb-1">Question Text:</label>
                  <textarea
                    rows={3}
                    value={customQuestionPrompt}
                    onChange={(e) => setCustomQuestionPrompt(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-border bg-background text-xs"
                  />
                </div>
                <div>
                  <label className="font-bold text-foreground block mb-1">Model Answer:</label>
                  <textarea
                    rows={3}
                    value={customModelAnswer}
                    onChange={(e) => setCustomModelAnswer(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-border bg-background text-xs"
                  />
                </div>

                <div className="flex justify-end pt-3 border-t border-border">
                  <button
                    onClick={() => setShowQuestionModal(false)}
                    className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md"
                  >
                    Save & Close
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODAL 2: Fullscreen Answer Sheet Photo Zoom Modal */}
      {showImageZoomModal && activeImageUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/90 backdrop-blur-md animate-in fade-in">
          <div className="relative max-w-4xl w-full max-h-[95vh] rounded-3xl overflow-hidden border border-border bg-card p-3 shadow-2xl flex flex-col">
            <div className="flex items-center justify-between p-2 border-b border-border">
              <span className="text-xs font-bold text-foreground flex items-center gap-2">
                <FileText className="h-4 w-4 text-emerald-600" />
                <span>Handwritten Script Full Resolution Inspector</span>
              </span>
              <button
                onClick={() => setShowImageZoomModal(false)}
                className="p-1 rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex-1 overflow-auto p-2 flex items-center justify-center bg-slate-950 rounded-2xl my-2">
              <img
                src={activeImageUrl}
                alt="Enlarged Answer Sheet"
                className="max-h-[80vh] w-auto object-contain rounded-lg"
              />
            </div>
            <div className="p-2 text-center text-xs text-muted-foreground">
              Tip: AI Vision OCR analyzes ruled lines, marginal notes, formulas, and teacher ink strokes directly from this image.
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: Gemini API Key Modal */}
      {showApiKeyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in">
          <div className="relative max-w-md w-full rounded-3xl border border-border bg-card p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-border">
              <div className="flex items-center gap-2">
                <Key className="h-4 w-4 text-emerald-600" />
                <h3 className="font-extrabold text-foreground text-sm">
                  Google Gemini Cloud Vision API Key
                </h3>
              </div>
              <button
                onClick={() => setShowApiKeyModal(false)}
                className="p-1 rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <p className="text-xs text-muted-foreground leading-relaxed">
              KhataAI operates in zero-config mode by default using its intelligent handwriting and rubric evaluation core. If you wish to connect your own free Google Gemini API key for live multimodal cloud vision, enter it below:
            </p>

            <div className="space-y-1.5 text-xs">
              <label className="font-bold text-foreground">Google Gemini API Key:</label>
              <input
                type="password"
                value={apiKeyInput}
                onChange={(e) => setApiKeyInput(e.target.value)}
                placeholder="AIzaSy..."
                className="w-full px-3 py-2 rounded-xl border border-border bg-background font-mono text-xs"
              />
              <p className="text-[10px] text-muted-foreground">
                Get a free key from <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer" className="text-emerald-600 underline">Google AI Studio</a>. Keys are never saved permanently and only used for your evaluation session.
              </p>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-border">
              {apiKeyInput && (
                <button
                  onClick={() => setApiKeyInput("")}
                  className="px-3 py-1.5 rounded-xl border border-border text-xs text-muted-foreground hover:text-destructive"
                >
                  Clear Key
                </button>
              )}
              <button
                onClick={() => setShowApiKeyModal(false)}
                className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
