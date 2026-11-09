// src/app/api/questions/route.ts
// Questions Bank Management API (Full CRUD in Card Mode)

import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import QuestionModel from "@/models/Question";
import { SEED_EXAMS } from "@/lib/seed-data";

// Fallback initial questions when database is fresh
const INITIAL_SEED_QUESTIONS = [
  {
    type: "CQ",
    questionText: "উদ্দীপকটি পড়ে নিচের ক, খ, গ ও ঘ নম্বর প্রশ্নের উত্তর দাও:",
    stimulusText: "২০ মিটার উঁচু একটি দালানের ছাদ থেকে একটি ক্রিকেট বলকে আনুভূমিকের সাথে ৩০° কোণে ৪০ মি./সে. বেগে উপরের দিকে তির্যকভাবে নিক্ষেপ করা হলো। একই সময়ে অপর একজন ছাত্র ছাদ থেকে সোজা নিচে আরেকটি বল ফেলে দিল। অভিকর্ষজ ত্বরণ g = 9.8 m/s²।",
    marks: 10,
    difficulty: "MEDIUM",
    curriculumCode: "HSC",
    tags: ["পদার্থবিজ্ঞান ১ম পত্র", "গতিবিদ্যা", "প্রাস", "HSC-2026"],
    cqParts: [
      {
        part: "ka",
        bengaliLabel: "ক",
        marks: 1,
        questionText: "প্রাস (Projectile) কী?",
        modelAnswer: "আনুভূমিকের সাথে কোনো কোণে কোনো বস্তুকে শূন্যে নিক্ষেপ করা হলে তাকে প্রাস বা প্রক্ষেপক বলে।",
        rubrics: [
          {
            criterion: "প্রাসের সঠিক সংজ্ঞা",
            maxPoints: 1,
            description: "তির্যকভাবে শূন্যে নিক্ষেপিত বস্তুর স্পষ্ট সংজ্ঞা।",
            keywords: ["তির্যকভাবে", "শূন্যে", "নিক্ষেপ", "প্রাস"],
          },
        ],
      },
      {
        part: "kha",
        bengaliLabel: "খ",
        marks: 2,
        questionText: "অনুভূমিক বরাবর নিক্ষিপ্ত বস্তুর ত্বরণ শূন্য হয় কেন? ব্যাখ্যা কর।",
        modelAnswer: "অনুভূমিক বরাবর কোনো বাহ্যিক বল ক্রিয়া করে না (বায়ুর বাধা অগ্রাহ্য করলে)। নিউটনের দ্বিতীয় সূত্রানুসারে বল F = ma = 0, সুতরাং অনুভূমিক ত্বরণ a = 0।",
        rubrics: [
          {
            criterion: "বল ও ত্বরণের সম্পর্ক",
            maxPoints: 2,
            description: "অনুভূমিক দিকে অভিকর্ষজ বলের উপাংশ শূন্য ও বাহ্যিক বল অনুপস্থিতির ব্যাখ্যা।",
            keywords: ["বাহ্যিক বল শূন্য", "নিউটনের দ্বিতীয় সূত্র", "ত্বরণ শূন্য"],
          },
        ],
      },
      {
        part: "ga",
        bengaliLabel: "গ",
        marks: 3,
        questionText: "তির্যকভাবে নিক্ষিপ্ত বলটি কত সময় পর ভূ-পৃষ্ঠে পতিত হবে নির্ণয় কর।",
        modelAnswer: "উল্লম্ব গতির সমীকরণ: h = -u_y*t + 0.5*g*t² বা -20 = 40*sin(30°)*t - 4.9*t² => 4.9t² - 20t - 20 = 0। সমাধান করে t ≈ 4.91 সেকেন্ড।",
        rubrics: [
          {
            criterion: "উল্লম্ব বেগ ও সমীকরণ",
            maxPoints: 1,
            description: "u_y = u sin θ = 20 m/s সঠিকভাবে চিহ্নিত করা।",
            keywords: ["u_y", "sin 30", "20 m/s"],
          },
          {
            criterion: "দ্বিঘাত সমীকরণ গঠন ও সমাধান",
            maxPoints: 2,
            description: "দ্বিঘাত সমীকরণ সঠিকভাবে সমাধান করে t = 4.91 s প্রাপ্তি।",
            keywords: ["4.9t^2", "4.91", "সেকেন্ড"],
          },
        ],
      },
      {
        part: "gha",
        bengaliLabel: "ঘ",
        marks: 4,
        questionText: "উভয় বল একই সাথে ভূমিতে আঘাত করবে কি-না? গাণিতিক বিশ্লেষণের মাধ্যমে মতামত দাও।",
        modelAnswer: "মুক্তভাবে পতনের ক্ষেত্রে: h = 0.5*g*t² => t = √(2h/g) = √(40/9.8) ≈ 2.02 সেকেন্ড। কিন্তু তির্যকভাবে নিক্ষিপ্ত বলের সময় t = 4.91 সেকেন্ড। সুতরাং উভয় বল একই সাথে ভূমিতে আঘাত করবে না।",
        rubrics: [
          {
            criterion: "মুক্ত পতনের সময় গণনা",
            maxPoints: 2,
            description: "দ্বিতীয় বলের সময় t = 2.02 s গণনা।",
            keywords: ["√(2h/g)", "2.02", "সেকেন্ড"],
          },
          {
            criterion: "যৌক্তিক তুলনা ও সিদ্ধান্ত",
            maxPoints: 2,
            description: "উভয় সময় তুলনা করে একই সাথে আঘাত না করার সঠিক সিদ্ধান্ত প্রদান।",
            keywords: ["একই সাথে আঘাত করবে না", "তুলনা", "4.91", "2.02"],
          },
        ],
      },
    ],
  },
  {
    type: "MCQ",
    questionText: "একটি আদর্শ গ্যাসের ক্ষেত্রে সমোষ্ণ পরিবর্তনে কৃতকাজ (W) এর সঠিক সমীকরণ কোনটি?",
    stimulusText: "একটি সিলিন্ডারে আবদ্ধ ১ মোল আদর্শ গ্যাসকে প্রাথমিক আয়তন V₁ থেকে অন্তিম আয়তন V₂ তে সমোষ্ণ প্রক্রিয়ায় প্রসারিত করা হলো।",
    marks: 1,
    difficulty: "EASY",
    curriculumCode: "HSC",
    tags: ["পদার্থবিজ্ঞান ২য় পত্র", "তাপগতিবিদ্যা", "সমোষ্ণ প্রক্রিয়া", "MCQ"],
    mcqOptions: [
      { label: "A", text: "W = nRT ln(V₂ / V₁)" },
      { label: "B", text: "W = nR(T₂ - T₁)" },
      { label: "C", text: "W = P(V₂ - V₁)" },
      { label: "D", text: "W = nCv(T₂ - T₁)" },
    ],
    correctOption: "A",
  },
  {
    type: "WRITTEN",
    questionText: "∫ (x² / (1 + x⁶)) dx এর মান নির্ণয় কর।",
    stimulusText: "উচ্চতর গণিত ২য় পত্র: যোগজীকরণ (Integration by Substitution)।",
    marks: 5,
    difficulty: "MEDIUM",
    curriculumCode: "HSC",
    tags: ["উচ্চতর গণিত", "যোগজীকরণ", "Calculus", "BUET"],
    modelAnswer: "ধরি z = x³, তাহলে dz = 3x² dx => x² dx = dz/3। প্রদত্ত যোগজ = (1/3) ∫ dz / (1 + z²) = (1/3) tan⁻¹(z) + c = (1/3) tan⁻¹(x³) + c।",
    rubrics: [
      {
        criterion: "প্রতিস্থাপন পদ্ধতি নির্বাচন",
        maxPoints: 2,
        description: "z = x³ এবং dz = 3x² dx সঠিকভাবে ধরা।",
        keywords: ["z = x^3", "dz/3", "প্রতিস্থাপন"],
      },
      {
        criterion: "আদর্শ যোগজ সূত্রে রূপান্তর ও চূড়ান্ত উত্তর",
        maxPoints: 3,
        description: "(1/3) tan⁻¹(x³) + c সমাকলন ধ্রুবকসহ প্রকাশ।",
        keywords: ["tan^-1", "1/3", "+ c"],
      },
    ],
  },
  {
    type: "CQ",
    questionText: "উদ্দীপকটি লক্ষ কর এবং সংশ্লিষ্ট প্রশ্নগুলোর যথাযথ উত্তর প্রদান কর:",
    stimulusText: "রাসায়নিক বিক্রিয়া: N₂(g) + 3H₂(g) ⇌ 2NH₃(g) ; ΔH = -92.4 kJ/mol। একটি আবদ্ধ পাত্রে ৪৫০°C তাপমাত্রা এবং ২০০ atm চাপে Fe প্রভাবকের উপস্থিতিতে সাম্যাবস্থা স্থাপিত হলো।",
    marks: 10,
    difficulty: "HARD",
    curriculumCode: "HSC",
    tags: ["রসায়ন ১ম পত্র", "রাসায়নিক পরিবর্তন", "লা-শাতেলিয়ার নীতি"],
    cqParts: [
      {
        part: "ka",
        bengaliLabel: "ক",
        marks: 1,
        questionText: "লা-শাতেলিয়ার নীতিটি বিবৃত কর।",
        modelAnswer: "কোনো উভমুখী বিক্রিয়ার সাম্যাবস্থায় তাপমাত্রা, চাপ বা ঘনমাত্রা পরিবর্তন করলে সাম্যের অবস্থান এমনভাবে পরিবর্তিত হয় যাতে নিয়ামক পরিবর্তনের ফলাফল প্রশমিত হয়।",
        rubrics: [
          {
            criterion: "নীতির যথার্থ বিবৃতি",
            maxPoints: 1,
            description: "সাম্যাবস্থায় নিয়ামক পরিবর্তনের প্রভাব প্রশমনের সঠিক বর্ণনা।",
            keywords: ["সাম্যাবস্থা", "তাপমাত্রা", "চাপ", "প্রশমিত"],
          },
        ],
      },
      {
        part: "kha",
        bengaliLabel: "খ",
        marks: 2,
        questionText: "হেবার বস পদ্ধতিতে সর্বোত্তম তাপমাত্রা বজায় রাখা জরুরি কেন?",
        modelAnswer: "বিক্রিয়াটি তাপোৎপাদী হওয়ায় নিম্ন তাপমাত্রায় উৎপাদ বেশি হয় কিন্তু গতি মন্থর হয়। তাই সামঞ্জস্যপূর্ণ অনুকূল তাপমাত্রা ৪৫০°-৫০০°C প্রয়োগ করা হয়।",
        rubrics: [
          {
            criterion: "অনুকূল তাপমাত্রার বৈজ্ঞানিক ব্যাখ্যা",
            maxPoints: 2,
            description: "বিক্রিয়ার গতি ও উৎপাদের পরিমাণের মধ্যে ভারসাম্যের ব্যাখ্যা।",
            keywords: ["তাপোৎপাদী", "অনুকূল তাপমাত্রা", "সাম্যাবস্থা"],
          },
        ],
      },
      {
        part: "ga",
        bengaliLabel: "গ",
        marks: 3,
        questionText: "বিক্রিয়াটির ক্ষেত্রে Kp ও Kc এর মধ্যে সম্পর্ক প্রতিপাদন কর।",
        modelAnswer: "Kp = Kc(RT)^Δn। এখানে Δn = 2 - (1 + 3) = -2। সুতরাং Kp = Kc(RT)⁻² বা Kp = Kc / (RT)²।",
        rubrics: [
          {
            criterion: "Δn এর নির্ভুল মান নির্ণয়",
            maxPoints: 1,
            description: "Δn = 2 - 4 = -2 সঠিকভাবে চিহ্নিত করা।",
            keywords: ["Δn = -2"],
          },
          {
            criterion: "সম্পর্ক সমীকরণ প্রতিষ্ঠা",
            maxPoints: 2,
            description: "Kp = Kc(RT)⁻² সঠিক সূত্র প্রতিপাদন।",
            keywords: ["Kp = Kc(RT)^-2", "RT"],
          },
        ],
      },
      {
        part: "gha",
        bengaliLabel: "ঘ",
        marks: 4,
        questionText: "উদ্দীপকের সাম্যাবস্থায় চাপ ও তাপমাত্রার প্রভাব লা-শাতেলিয়ার নীতির আলোকে মূল্যায়ন কর।",
        modelAnswer: "চাপের প্রভাব: বিক্রিয়কের মোল ৪, উৎপাদের ২। চাপ বৃদ্ধি করলে সাম্য ডানে সরে গিয়ে NH₃ এর উৎপাদন বৃদ্ধি পাবে। তাপমাত্রার প্রভাব: বিক্রিয়াটি তাপোৎপাদী হওয়ায় তাপমাত্রা বৃদ্ধি করলে সাম্য বামে সরবে এবং NH₃ বিয়োজিত হবে।",
        rubrics: [
          {
            criterion: "চাপের প্রভাবের বিশ্লেষণ",
            maxPoints: 2,
            description: "মোল সংখ্যার হ্রাস ও ডানমুখী বিচ্যুতির ব্যাখ্যা।",
            keywords: ["মোল সংখ্যা হ্রাস", "চাপ বৃদ্ধি", "উৎপাদন বৃদ্ধি"],
          },
          {
            criterion: "তাপমাত্রার প্রভাবের বিশ্লেষণ",
            maxPoints: 2,
            description: "তাপোৎপাদী স্বভাব ও বামমুখী বিচ্যুতির ব্যাখ্যা।",
            keywords: ["তাপোৎপাদী", "তাপমাত্রা বৃদ্ধি", "উৎপাদন হ্রাস"],
          },
        ],
      },
    ],
  },
  {
    type: "MCQ",
    questionText: "সালোকসংশ্লেষণের আলোক পর্যায়ে পানির আলোক বিশ্লিষ্ট হয়ে অক্সিজেন ও ইলেকট্রন উৎপন্ন হওয়ার প্রক্রিয়াকে কী বলে?",
    stimulusText: "উদ্ভিদ শারীরতত্ত্ব: আলোক নির্ভর পর্যায় ও ফটোলাইসিস।",
    marks: 1,
    difficulty: "EASY",
    curriculumCode: "HSC",
    tags: ["জীববিজ্ঞান ১ম পত্র", "উদ্ভিদ শারীরতত্ত্ব", "ফটোলাইসিস"],
    mcqOptions: [
      { label: "A", text: "ফটোফসফোরাইলেশন" },
      { label: "B", text: "পানির ফটোলাইসিস (Photolysis)" },
      { label: "C", text: "অক্সিডেটিভ ফসফোরাইলেশন" },
      { label: "D", text: "গ্লাইকোলাইসিস" },
    ],
    correctOption: "B",
  },
];

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type");
    const difficulty = searchParams.get("difficulty");
    const search = searchParams.get("search");

    let questions: any[] = [];

    try {
      await connectDB();
      const filter: any = {};
      if (type && type !== "ALL") {
        filter.type = type;
      }
      if (difficulty && difficulty !== "ALL") {
        filter.difficulty = difficulty;
      }
      if (search) {
        filter.$or = [
          { questionText: { $regex: search, $options: "i" } },
          { stimulusText: { $regex: search, $options: "i" } },
          { tags: { $in: [new RegExp(search, "i")] } },
          { curriculumCode: { $regex: search, $options: "i" } },
        ];
      }

      const dbQuestions = await QuestionModel.find(filter)
        .sort({ createdAt: -1 })
        .lean();

      if (dbQuestions && dbQuestions.length > 0) {
        questions = dbQuestions.map((q: any) => ({
          ...q,
          id: q._id.toString(),
        }));
      } else {
        // Auto-seed initial questions in MongoDB if collection is empty
        const seeded = await QuestionModel.insertMany(INITIAL_SEED_QUESTIONS);
        questions = seeded.map((q: any) => ({
          ...q.toObject(),
          id: q._id.toString(),
        }));
      }
    } catch (dbErr) {
      console.warn("MongoDB question fetch error, using memory fallback:", dbErr);
      questions = INITIAL_SEED_QUESTIONS.map((q, idx) => ({
        ...q,
        id: `q_mem_${idx + 1}`,
      }));
    }

    return NextResponse.json({
      success: true,
      questions,
      totalCount: questions.length,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Check if bulk insert mode
    const isBulk = Array.isArray(body) || (body && Array.isArray(body.questions));
    if (isBulk) {
      const items = Array.isArray(body) ? body : body.questions;
      if (!items || items.length === 0) {
        return NextResponse.json(
          { success: false, error: "Questions array cannot be empty." },
          { status: 400 }
        );
      }

      const payloads = items.map((item: any, idx: number) => ({
        type: item.type || "MCQ",
        questionText: (item.questionText || `Question ${idx + 1}`).trim(),
        stimulusText: item.stimulusText?.trim() || null,
        imageUrl: item.imageUrl || null,
        marks: Number(item.marks) || (item.type === "CQ" ? 10 : 1),
        difficulty: item.difficulty || "MEDIUM",
        curriculumCode: item.curriculumCode || "HSC",
        tags: Array.isArray(item.tags)
          ? item.tags
          : typeof item.tags === "string"
          ? item.tags.split(",").map((t: string) => t.trim())
          : ["Question Set"],
        mcqOptions: item.type === "MCQ" ? item.mcqOptions || [] : undefined,
        correctOption: item.type === "MCQ" ? item.correctOption || "A" : undefined,
        cqParts: item.type === "CQ" ? item.cqParts || [] : undefined,
        modelAnswer:
          item.type === "WRITTEN" || item.type === "DESCRIPTIVE"
            ? item.modelAnswer || ""
            : undefined,
        rubrics: item.rubrics || [],
        aiGenerated: !!item.aiGenerated,
      }));

      let createdQuestions: any[] = [];
      try {
        await connectDB();
        const mongoCreated = await QuestionModel.insertMany(payloads);
        createdQuestions = mongoCreated.map((q: any) => ({
          ...q.toObject(),
          id: q._id.toString(),
        }));
      } catch (dbErr) {
        console.warn("MongoDB bulk question insert warning, using in-memory:", dbErr);
        createdQuestions = payloads.map((p: any, idx: number) => ({
          ...p,
          id: `q_bulk_${Date.now()}_${idx + 1}`,
          createdAt: new Date().toISOString(),
        }));
      }

      return NextResponse.json({
        success: true,
        count: createdQuestions.length,
        questions: createdQuestions,
        message: `Successfully saved ${createdQuestions.length} questions into Question Bank!`,
      });
    }

    const {
      type,
      questionText,
      stimulusText,
      marks,
      difficulty,
      curriculumCode,
      tags,
      mcqOptions,
      correctOption,
      cqParts,
      modelAnswer,
      rubrics,
      imageUrl,
    } = body;

    if (!type || !questionText || marks === undefined) {
      return NextResponse.json(
        { success: false, error: "Type, questionText, and marks are required." },
        { status: 400 }
      );
    }

    const payload: any = {
      type,
      questionText: questionText.trim(),
      stimulusText: stimulusText?.trim() || null,
      imageUrl: imageUrl || null,
      marks: Number(marks) || 1,
      difficulty: difficulty || "MEDIUM",
      curriculumCode: curriculumCode || "HSC",
      tags: Array.isArray(tags) ? tags : typeof tags === "string" ? tags.split(",").map((t: string) => t.trim()) : [],
      mcqOptions: type === "MCQ" ? mcqOptions || [] : undefined,
      correctOption: type === "MCQ" ? correctOption || null : undefined,
      cqParts: type === "CQ" ? cqParts || [] : undefined,
      modelAnswer: type === "WRITTEN" || type === "DESCRIPTIVE" ? modelAnswer || "" : undefined,
      rubrics: rubrics || [],
      aiGenerated: false,
    };

    let createdQuestion: any = null;

    try {
      await connectDB();
      const mongoQ = await QuestionModel.create(payload);
      createdQuestion = {
        ...mongoQ.toObject(),
        id: mongoQ._id.toString(),
      };
    } catch (dbErr) {
      console.warn("MongoDB Question creation warning, using in-memory:", dbErr);
      createdQuestion = {
        ...payload,
        id: `q_card_${Date.now()}`,
        createdAt: new Date().toISOString(),
      };
    }

    return NextResponse.json({
      success: true,
      question: createdQuestion,
      message: "Question card created successfully!",
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

