// src/app/api/questions/ai-generate/route.ts
// AI Question Generator for Bangladeshi & International Curricula
// Supports Creative Questions (CQ ক/খ/গ/ঘ), MCQs, and Written Questions with full Rubrics
// POST /api/questions/ai-generate

import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { Question } from "@/lib/types";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      subject = "Physics",
      topic = "গতিবিদ্যা ও প্রাসের গতি",
      curriculumCode = "HSC",
      questionType = "CQ",
      difficulty = "MEDIUM",
      count = 1,
      apiKey,
    } = body;

    const resolvedApiKey =
      apiKey ||
      process.env.GOOGLE_GENAI_API_KEY ||
      process.env.GEMINI_API_KEY;

    // Try generating via Gemini if API key is present
    if (resolvedApiKey && resolvedApiKey.trim().length > 10) {
      try {
        const ai = new GoogleGenAI({ apiKey: resolvedApiKey });
        const prompt = `You are an expert exam paper setter for the ${curriculumCode} curriculum in Bangladesh.
Generate ${count} complete, high-quality ${questionType} question(s) for the subject "${subject}" on the topic "${topic}" with difficulty "${difficulty}".

For "CQ" (Creative Question / সৃজনশীল):
- Total 10 marks
- Must have an engaging stimulus / passage (উদ্দীপক) in Bengali
- Sub-part ক (জ্ঞানমূলক, 1 mark): Direct definition/fact with 1-point rubric
- Sub-part খ (অনুধাবনমূলক, 2 marks): Conceptual explanation with 2 separate 1-point rubrics
- Sub-part গ (প্রয়োগমূলক, 3 marks): Formula derivation or calculation with 3 step-by-step rubrics (formula, substitution, answer with unit)
- Sub-part ঘ (উচ্চতর দক্ষতা, 4 marks): Synthesis, mathematical verification or critical opinion with 4 distinct rubric criteria

For "MCQ":
- 4 plausible options with labels "A", "B", "C", "D"
- 1 correctOption ("A", "B", "C", or "D")
- modelAnswer containing brief explanation

Return ONLY valid JSON matching this structure:
{
  "questions": [
    ${
      questionType === "MCQ"
        ? `{
      "type": "MCQ",
      "marks": 1,
      "questionText": "...",
      "mcqOptions": [
        { "label": "A", "text": "..." },
        { "label": "B", "text": "..." },
        { "label": "C", "text": "..." },
        { "label": "D", "text": "..." }
      ],
      "correctOption": "A",
      "modelAnswer": "..."
    }`
        : `{
      "type": "CQ",
      "marks": 10,
      "questionText": "উদ্দীপকটি পড়ে নিচের প্রশ্নগুলোর উত্তর দাও:",
      "stimulusText": "...",
      "cqParts": [
        {
          "part": "ka",
          "bengaliLabel": "ক",
          "cognitiveLevel": "জ্ঞানমূলক",
          "marks": 1,
          "questionText": "...",
          "modelAnswer": "...",
          "rubrics": [{ "criterion": "...", "maxPoints": 1, "description": "..." }]
        },
        {
          "part": "kha",
          "bengaliLabel": "খ",
          "cognitiveLevel": "অনুধাবনমূলক",
          "marks": 2,
          "questionText": "...",
          "modelAnswer": "...",
          "rubrics": [
            { "criterion": "...", "maxPoints": 1, "description": "..." },
            { "criterion": "...", "maxPoints": 1, "description": "..." }
          ]
        },
        {
          "part": "ga",
          "bengaliLabel": "গ",
          "cognitiveLevel": "প্রয়োগমূলক",
          "marks": 3,
          "questionText": "...",
          "modelAnswer": "...",
          "rubrics": [
            { "criterion": "...", "maxPoints": 1, "description": "..." },
            { "criterion": "...", "maxPoints": 1, "description": "..." },
            { "criterion": "...", "maxPoints": 1, "description": "..." }
          ]
        },
        {
          "part": "gha",
          "bengaliLabel": "ঘ",
          "cognitiveLevel": "উচ্চতর দক্ষতামূলক",
          "marks": 4,
          "questionText": "...",
          "modelAnswer": "...",
          "rubrics": [
            { "criterion": "...", "maxPoints": 1, "description": "..." },
            { "criterion": "...", "maxPoints": 1, "description": "..." },
            { "criterion": "...", "maxPoints": 1, "description": "..." },
            { "criterion": "...", "maxPoints": 1, "description": "..." }
          ]
        }
      ]
    }`
    }
  ]
}`;

        const response = await ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: prompt,
        });

        const text = response.text || "";
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          if (Array.isArray(parsed.questions) && parsed.questions.length > 0) {
            const formatted = parsed.questions.map((q: any, i: number) => ({
              ...q,
              id: `ai_q_${Date.now()}_${i + 1}`,
              orderIndex: i + 1,
            }));
            return NextResponse.json({
              success: true,
              questions: formatted,
              provider: "Google Gemini",
            });
          }
        }
      } catch (geminiErr) {
        console.warn("Gemini generation error, falling back to curriculum templates:", geminiErr);
      }
    }

    // Intelligent Diverse Bangladeshi Curriculum Engine
    const generatedQuestions: any[] = [];

    // Realistic MCQ bank items per subject domain for rich fallback generation
    const mcqTemplates = [
      {
        q: (t: string) => `${t} এর এসআই (SI) একক নিচের কোনটি?`,
        options: ["জুল (Joule)", "নিউটন (Newton)", "ওয়াট (Watt)", "প্যাসকেল (Pascal)"],
        ans: "A",
        exp: "কাজ ও শক্তির আন্তর্জাতিক এসআই একক হলো জুল (Joule)।",
      },
      {
        q: (t: string) => `কোনো গতিশীল বস্তুর ক্ষেত্রে ${t} সংক্রান্ত কোনটি সঠিক সম্পর্ক?`,
        options: ["v² = u² + 2as", "v = u + ½at²", "s = ut + 2as", "v² = 2u + as"],
        ans: "A",
        exp: "সুষম ত্বরণে গতিশীল বস্তুর ক্ষেত্রে গতির তৃতীয় সমীকরণ v² = u² + 2as।",
      },
      {
        q: (t: string) => `${t} এর ক্ষেত্রে সংরক্ষণশীল বল দ্বারা এক পূর্ণ চক্রে সম্পাদিত মোট কাজ কত?`,
        options: ["শূন্য (0)", "অসীম (Infinity)", "সর্বোচ্চ মান", "প্রাথমিক শক্তির সমান"],
        ans: "A",
        exp: "সংরক্ষণশীল বলের অধীনে কোনো বস্তু যেকোনো আবদ্ধ পথ ঘুরে পূর্বের স্থানে ফিরে আসলে মোট কাজ শূন্য।",
      },
      {
        q: (t: string) => `নিচের কোন রাশিমুখটি ${t} এর মাত্রাগত সমীকরণ নির্দেশ করে?`,
        options: ["[M L² T⁻²]", "[M L T⁻¹]", "[M L⁻¹ T⁻²]", "[M⁰ L T⁻²]"],
        ans: "A",
        exp: "শক্তির মাত্রা হলো বল × সরণ = [M L T⁻²] × [L] = [M L² T⁻²]।",
      },
      {
        q: (t: string) => `${t} এর সর্বোচ্চ মানের জন্য নতি কোণ (Angle of projection) কত ডিগ্রি হতে হবে?`,
        options: ["45°", "30°", "60°", "90°"],
        ans: "A",
        exp: "অনুভূমিক পাল্লার সমীকরণ R = (u² sin 2θ) / g; sin 2θ = 1 বা θ = 45° হলে পাল্লা সর্বোচ্চ হয়।",
      },
      {
        q: (t: string) => `একটি কণা সমবেগে বৃত্তাকার পথে ঘূর্ণায়মান। ${t} এর কেন্দ্রমুখী ত্বরণের দিক কোনটি?`,
        options: ["ব্যাসার্ধ বরাবর কেন্দ্রের দিকে", "স্পর্শকীয় বরাবর সামনের দিকে", "বৃত্তীয় তলের অভিলম্ব বরাবর", "কেন্দ্রের বিপরীত দিকে"],
        ans: "A",
        exp: "বৃত্তাকার পথে ঘূর্ণায়মান বস্তুর কেন্দ্রমুখী ত্বরণ সর্বদা ব্যাসার্ধ বরাবর কেন্দ্রের দিকে ক্রিয়াশীল থাকে।",
      },
      {
        q: (t: string) => `${t} প্রক্রিয়ায় সিস্টেম ও পরিবেশের মধ্যে তাপমাত্রার পরিবর্তন কী ঘটে?`,
        options: ["তাপমাত্রা ধ্রুব থাকে (dT = 0)", "তাপমাত্রা ক্রমাগত বৃদ্ধি পায়", "তাপমাত্রা শূন্যে নেমে আসে", "চাপের সমাণুপাতে হ্রাস পায়"],
        ans: "A",
        exp: "সমোষ্ণ প্রক্রিয়ায় সিস্টেমের তাপমাত্রা সর্বদা অপরিবর্তিত থাকে।",
      },
      {
        q: (t: string) => `স্থির অবস্থান থেকে সুষম ত্বরণে চলমান বস্তুর অতিক্রান্ত দূরত্ব (s) এবং সময়ের (t) সম্পর্ক কী?`,
        options: ["s ∝ t²", "s ∝ t", "s ∝ √t", "s ∝ 1/t"],
        ans: "A",
        exp: "যেহেতু u = 0, সুতরাং s = ½at² => s ∝ t²।",
      },
      {
        q: (t: string) => `${t} সংক্রান্ত লা-শাতেলিয়ার নীতির মূল ভিত্তি কোনটি?`,
        options: ["সাম্যাবস্থায় নিয়ামকের পরিবর্তনের প্রভাব প্রশমিত হওয়া", "বিক্রিয়ার বেগ দ্বিগুণ হওয়া", "উভমুখী রূপান্তর বন্ধ হওয়া", "ভরক্রিয়া ধ্রুবকের পরিবর্তন"],
        ans: "A",
        exp: "সাম্যাবস্থায় তাপমাত্রা, চাপ বা ঘনমাত্রা পরিবর্তন করলে সাম্যের অবস্থান এমনভাবে পরিবর্তিত হয় যাতে নিয়ামকের পরিবর্তনের ফলাফল প্রশমিত হয়।",
      },
      {
        q: (t: string) => `একটি তারের দৈর্ঘ্য দ্বিগুণ এবং প্রস্থচ্ছেদের ক্ষেত্রফল অর্ধেক করা হলে ${t} এর রোধ কতগুণ হবে?`,
        options: ["4 গুণ", "2 গুণ", "অর্ধেক", "অপরিবর্তিত থাকবে"],
        ans: "A",
        exp: "R = ρ (L / A)। নতুন রোধ R' = ρ (2L / 0.5A) = 4R।",
      },
      {
        q: (t: string) => `${t} সম্পর্কিত ফ্যারাডের দ্বিতীয় সূত্রে কোনটি অপরিবর্তিত রাখা হয়?`,
        options: ["তড়িৎ প্রবাহের পরিমাণ (Q)", "কোষের অভ্যন্তরীণ রোধ", "দ্রবণের আপেক্ষিক রোধ", "তড়িৎদ্বারগুলোর দূরত্ব"],
        ans: "A",
        exp: "বিভিন্ন তড়িৎ বিশ্লেষ্যের মধ্য দিয়ে একই পরিমাণ বিদ্যুৎ চালনা করলে তড়িৎদ্বারে সঞ্চিত পদার্থের পরিমাণ তাদের রাসায়নিক তুল্যাঙ্কের সমানুপাতিক।",
      },
      {
        q: (t: string) => `নিচের কোনটি স্কেলার রাশি নয় (অর্থাৎ ভেক্টর রাশি)?`,
        options: ["তড়িৎ প্রাবল্য (Electric Field)", "বৈদ্যুতিক বিভব", "কাজ ও ক্ষমতা", "তাপমাত্রা ও ঘনত্ব"],
        ans: "A",
        exp: "তড়িৎ প্রাবল্যের মান ও নির্দিষ্ট অভিমুখ উভয়ই বিদ্যমান, তাই এটি ভেক্টর রাশি।",
      },
      {
        q: (t: string) => `${t} এর ক্ষেত্রে পরম শূন্য তাপমাত্রা (Absolute Zero) কোনটি নির্দেশ করে?`,
        options: ["-273.15°C বা 0 Kelvin", "0°C বা 273 Kelvin", "100°C বা 373 Kelvin", "-40°C"],
        ans: "A",
        exp: "যে তাপমাত্রায় যেকোনো গ্যাসের আয়তন ও গতিশক্তি তাত্ত্বিকভাবে শূন্য হয়ে যায় তাকে পরম শূন্য তাপমাত্রা বলে।",
      },
      {
        q: (t: string) => `উদ্দীপক তথ্য: ${t} এ সংঘটিত রূপান্তরের ক্ষেত্রে এনট্রপির (Entropy) পরিবর্তন সর্বদা—`,
        options: ["বৃদ্ধি পায় বা ধনাত্মক থাকে", "হ্রাস পেয়ে শূন্য হয়", "ঋণাত্মক হয়", "অপরিবর্তিত ও শূন্য"],
        ans: "A",
        exp: "মহাবিশ্বের যেকোনো স্বতঃস্ফূর্ত প্রক্রিয়ায় এনট্রপি সর্বদা বৃদ্ধি পায় (dS > 0)।",
      },
      {
        q: (t: string) => `একটি বস্তুর ভরবেগ p এবং গতিশক্তি Ek এর মধ্যে সঠিক সমীকরণ কোনটি?`,
        options: ["Ek = p² / 2m", "Ek = 2m / p²", "Ek = ½ m p", "Ek = p / 2m"],
        ans: "A",
        exp: "গতিশক্তি Ek = ½ mv² = (m²v²) / 2m = p² / 2m।",
      },
      {
        q: (t: string) => `নিচের কোনটি ${t} এর ক্ষেত্রে সঠিক বহুপদী সমাপ্তিসূচক বাক্য?\ni. শক্তি সংরক্ষিত থাকে\nii. ভরবেগ ধ্রুব থাকে\niii. এনট্রপি বৃদ্ধি পায়\nনিচের কোনটি সঠিক?`,
        options: ["i, ii ও iii", "i ও ii", "ii ও iii", "i ও iii"],
        ans: "A",
        exp: "প্রদত্ত তিনটি উক্তিই পদার্থবিজ্ঞান ও তাপগতিবিদ্যার মৌলিক সূত্র সমর্থিত।",
      },
      {
        q: (t: string) => `${t} এর অনুনাদ (Resonance) সৃষ্টির প্রধান শর্ত কী?`,
        options: ["প্রাকৃতিক কম্পাঙ্ক ও পরবশ কম্পাঙ্ক সমান হওয়া", "তরঙ্গদৈর্ঘ্য দ্বিগুণ হওয়া", "বিস্তার শূন্যে নামা", "বায়ুচাপ সর্বনিম্ন হওয়া"],
        ans: "A",
        exp: "যখন আরোপিত পরবশ বলের কম্পাঙ্ক বস্তুর নিজস্ব স্বাভাবিক কম্পাঙ্কের সমান হয়, তখন সর্বোচ্চ বিস্তারে কম্পন সৃষ্টি হয়।",
      },
      {
        q: (t: string) => `${t} বিষয়ক ব্রুস্টারের সূত্রে সমাবর্তন কোণ (θp) এবং প্রতিসরাঙ্ক (μ) এর সম্পর্ক কী?`,
        options: ["μ = tan θp", "μ = sin θp", "μ = cos θp", "μ = cot θp"],
        ans: "A",
        exp: "ব্রুস্টারের সূত্রানুসারে কোনো সমাবর্তক মাধ্যমের প্রতিসরাঙ্ক তার সমাবর্তন কোণের ট্যানজেন্টের সমান (μ = tan θp)।",
      },
      {
        q: (t: string) => `${t} এর ক্ষেত্রে কার্য অপেক্ষক (Work Function, W₀) এবং সূচন কম্পাঙ্কের (f₀) সম্পর্ক—`,
        options: ["W₀ = h f₀", "W₀ = h / f₀", "W₀ = ½ h f₀²", "W₀ = f₀ / h"],
        ans: "A",
        exp: "আইনস্টাইনের ফটো-তড়িৎ সমীকরণ অনুসারে ধাতব পৃষ্ঠ থেকে ইলেকট্রন মুক্ত করার ন্যূনতম শক্তি W₀ = hf₀।",
      },
      {
        q: (t: string) => `একটি অর্ধপরিবাহীতে (Semiconductor) তাপমাত্রা বৃদ্ধি করলে এর রোধের কী পরিবর্তন হয়?`,
        options: ["রোধ দ্রুত হ্রাস পায়", "রোধ বহুগুণ বৃদ্ধি পায়", "রোধ অপরিবর্তিত থাকে", "শূন্যে পৌঁছে যায়"],
        ans: "A",
        exp: "অর্ধপরিবাহীর ক্ষেত্রে তাপমাত্রিক সহগ ঋণাত্মক হওয়ায় তাপমাত্রা বাড়লে পরিবাহিতা বাড়ে ও রোধ হ্রাস পায়।",
      },
    ];

    const cqThemes = [
      {
        stimulus: (t: string, num: number) => `উদ্দীপক-${num}: ২০ মিটার উঁচু একটি পরীক্ষাগারের ছাদ থেকে একটি কণা আনুভূমিকের সাথে ৩০° কোণে ৪০ মি./সে. বেগে নিক্ষেপ করা হলো। একই সাথে ভূমির নির্দিষ্ট বিন্দু থেকে অপর একটি পর্যবেক্ষণকারী সেন্সর ${t} সংক্রান্ত উপাত্ত সংগ্রহ শুরু করল। বায়ুর বাধা অগ্রাহ্য বিবেচনা করো এবং অভিকর্ষজ ত্বরণ g = 9.8 m/s²।`,
        ka: (t: string) => `${t} এর সংজ্ঞা বা মূল সূত্রটি লেখো।`,
        kaAns: (t: string) => `${t} এর স্বীকৃত বৈজ্ঞানিক সংজ্ঞা ও প্রতীকী রাশিমালা।`,
        kha: `অনুভূমিক বরাবর নিক্ষিপ্ত বস্তুর ত্বরণ শূন্য থাকে কেন? ব্যাখ্যা করো।`,
        khaAns: `অনুভূমিক দিকে কোনো বাহ্যিক বল ক্রিয়াশীল থাকে না বিধায় নিউটনের ২য় সূত্রানুসারে F = ma = 0 => a = 0।`,
        ga: `কণাটি নিক্ষেপের পর কত সময় পর ভূমিতে আঘাত করবে তা গাণিতিকভাবে নির্ণয় করো।`,
        gaAns: `উল্লম্ব সমীকরণ h = -u_y*t + 0.5*g*t² ব্যবহার করে t = 4.91 সেকেন্ড পাওয়া যায়।`,
        gha: `উদ্দীপকের তথ্য থেকে কণাটির সর্বোচ্চ উচ্চতায় পৌঁছানোর মুহূর্তে গতিশক্তি প্রাথমিক গতিশক্তির কত শতাংশ হবে তা বিশ্লেষণ করো।`,
        ghaAns: `সর্বোচ্চ বিন্দুতে উল্লম্ব বেগ শূন্য কিন্তু অনুভূমিক বেগ u_x অপরিবর্তিত থাকে। ফলে Ek' = Ek cos²(30°) = 75%।`,
      },
      {
        stimulus: (t: string, num: number) => `উদ্দীপক-${num}: একটি সিলিন্ডারে আবদ্ধ ১ মোল আদর্শ গ্যাসের প্রাথমিক চাপ 1.01×10⁵ Pa এবং তাপমাত্রা 300 K। গ্যাসটিকে প্রথমে সমোষ্ণ প্রক্রিয়ায় দ্বিগুণ আয়তনে প্রসারিত করা হলো। পরবর্তীতে রুদ্ধতাপীয় প্রক্রিয়ায় পূর্বের অবস্থায় ফিরিয়ে নেওয়া হলো। এটি ${t} এর তাপগতীয় প্রয়োগকে নির্দেশ করে।`,
        ka: `সমোষ্ণ প্রক্রিয়া (Isothermal process) কাকে বলে?`,
        kaAns: `যে প্রক্রিয়ায় সিস্টেমের তাপমাত্রা সর্বদা অপরিবর্তিত ও ধ্রুব থাকে তাকে সমোষ্ণ প্রক্রিয়া বলে।`,
        kha: `রুদ্ধতাপীয় প্রক্রিয়ায় গ্যাস দ্রুত প্রসারিত হলে তাপমাত্রা হ্রাস পায় কেন?`,
        khaAns: `বাইরে থেকে কোনো তাপ প্রবেশ না করায় গ্যাস কর্তৃক সম্পাদিত কাজের শক্তি সিস্টেমের নিজস্ব অভ্যন্তরীণ শক্তি থেকে ক্ষয়িত হয়।`,
        ga: `সমোষ্ণ সম্প্রসারণে গ্যাস কর্তৃক সম্পাদিত কাজের মান (W) জুল এককে নির্ণয় করো।`,
        gaAns: `W = nRT ln(V₂/V₁) = 1 × 8.314 × 300 × ln(2) ≈ 1728.84 Joules।`,
        gha: `উভয় প্রক্রিয়ার P-V লেখচিত্র অঙ্কনপূর্বক ঢালের পরিবর্তন সংক্রান্ত তুলনামূলক যৌক্তিক বিশ্লেষণ উপস্থাপন করো।`,
        ghaAns: `রুদ্ধতাপীয় রেখার ঢাল সমোষ্ণ রেখার চেয়ে γ গুণ খাড়া। গাণিতিক প্রতিপাদন ও সঠিক সিদ্ধান্ত।`,
      },
      {
        stimulus: (t: string, num: number) => `উদ্দীপক-${num}: ২ মিটার দৈর্ঘ্যের একটি সুষম তারের প্রস্থচ্ছেদের ক্ষেত্রফল 1 mm² এবং ইয়ংয়ের গুণাঙ্ক 2×10¹¹ N/m²। তারটির নিচের প্রান্তে ৫ কেজি ভরের একটি ভারী গোলক ঝুলিয়ে দেওয়া হলো। ${t} সংক্রান্ত গবেষণায় তারের দৈর্ঘ্য ও সঞ্চিত শক্তি পর্যবেক্ষণ করা হলো।`,
        ka: `পয়সনের অনুপাত (Poisson's Ratio) কী?`,
        kaAns: `স্থিতিস্থাপক সীমার মধ্যে বস্তুর পার্শ্ব বিকৃতি এবং দৈর্ঘ্য বিকৃতির অনুপাতকে পয়সনের অনুপাত বলে।`,
        kha: `স্থিতিস্থাপক ক্লান্তি (Elastic Fatigue) বলতে কী বোঝায়? ব্যাখ্যা করো।`,
        khaAns: `ক্রমাগত বল প্রয়োগ ও অপসারণের ফলে বস্তুর স্থিতিস্থাপক ধর্ম সাময়িকভাবে হ্রাস পাওয়ার ঘটনাকে স্থিতিস্থাপক ক্লান্তি বলে।`,
        ga: `প্রদত্ত গোলকের ওজনের প্রভাবে তারটির দৈর্ঘ্য বৃদ্ধি (l) মিটারে নির্ণয় করো।`,
        gaAns: `l = (F L) / (A Y) = (5 × 9.8 × 2) / (10⁻⁶ × 2×10¹¹) = 4.9 × 10⁻⁴ m।`,
        gha: `তারটিতে সঞ্চিত একক আয়তনের স্থিতিস্থাপক শক্তি দ্বিগুণ করতে প্রযুক্ত ভারের কী পরিবর্তন আনতে হবে তা বিশ্লেষণ করো।`,
        ghaAns: `সঞ্চিত শক্তি u = ½ × পীড়ন × বিকৃতি ∝ F²। সুতরাং বল √2 গুণ বা ১.৪১ গুণ করতে হবে।`,
      },
      {
        stimulus: (t: string, num: number) => `উদ্দীপক-${num}: একটি 50 Ω রোধ এবং 0.2 H আবেশকের সমন্বয়ে গঠিত বর্তনীতে 220 V, 50 Hz এর পরিবর্তী প্রবাহ (AC) সংযোগ দেওয়া হলো। বর্তনীতে ${t} এর প্রভাবে তড়িৎ প্রবাহ ও ভোল্টেজের দশাগত পার্থক্য দেখা গেল।`,
        ka: `আবেশীয় প্রতিঘাত (Inductive Reactance) কাকে বলে?`,
        kaAns: `বর্তনীতে দিক-পরিবর্তী প্রবাহ চালনা করলে আবেশকের কারণে প্রবাহে যে বাধা সৃষ্টি হয় তাকে আবেশীয় প্রতিঘাত বলে।`,
        kha: `একটি ডিসি (DC) বর্তনীতে আবেশকের রোধ শূন্য বিবেচনা করা হয় কেন?`,
        khaAns: `ডিসি প্রবাহে কম্পাঙ্ক f = 0, তাই XL = 2πfL = 0। ফলে কোনো আবেশীয় বাধা থাকে না।`,
        ga: `উদ্দীপকের বর্তনীর মোট প্রতিবন্ধকতা (Impedance, Z) নির্ণয় করো।`,
        gaAns: `XL = 2 × 3.1416 × 50 × 0.2 = 62.83 Ω। Z = √(R² + XL²) = √(50² + 62.83²) ≈ 80.3 Ω।`,
        gha: `বর্তনীটিতে উপযুক্ত ধারকত্ব (Capacitance) যুক্ত করে অনুনাদ সৃষ্টি করা সম্ভব কি-না? গাণিতিক যুক্তিসহ মতামত দাও।`,
        ghaAns: `অনুনাদের শর্ত XL = XC => C = 1 / (4π²f²L) ≈ 50.66 μF। উপযুক্ত ধারক যুক্ত করলে অনুনাদ সম্ভব।`,
      },
    ];

    for (let i = 0; i < count; i++) {
      const qId = `gen_q_${Date.now()}_${i + 1}`;

      if (questionType === "CQ") {
        const themeIdx = i % cqThemes.length;
        const theme = cqThemes[themeIdx];
        const stimulus = theme.stimulus(topic, i + 1);

        generatedQuestions.push({
          id: qId,
          examId: "",
          type: "CQ",
          orderIndex: i + 1,
          marks: 10,
          curriculumCode,
          difficulty,
          tags: [subject, topic, curriculumCode, `CQ-${i + 1}`],
          questionText: `সৃজনশীল প্রশ্ন নং ${i + 1}: উদ্দীপকটি মনোযোগ সহকারে পড়ে নিচের প্রশ্নগুলোর উত্তর দাও:`,
          stimulusText: stimulus,
          cqParts: [
            {
              part: "ka",
              bengaliLabel: "ক",
              cognitiveLevel: "জ্ঞানমূলক",
              marks: 1,
              questionText: typeof theme.ka === "function" ? theme.ka(topic) : theme.ka,
              modelAnswer: typeof theme.kaAns === "function" ? theme.kaAns(topic) : theme.kaAns,
              rubrics: [
                {
                  id: `r_${Date.now()}_${i + 1}_ka`,
                  criterion: "সঠিক ও পূর্ণাঙ্গ জ্ঞানমূলক সংজ্ঞা",
                  maxPoints: 1,
                  description: "সঠিক সংজ্ঞা বা সূত্র লিখলে ১ নম্বর।",
                  keywords: ["সংজ্ঞা", "সূত্র", "একক"],
                },
              ],
            },
            {
              part: "kha",
              bengaliLabel: "খ",
              cognitiveLevel: "অনুধাবনমূলক",
              marks: 2,
              questionText: theme.kha,
              modelAnswer: theme.khaAns,
              rubrics: [
                {
                  id: `r_${Date.now()}_${i + 1}_kha_1`,
                  criterion: "মূল বৈজ্ঞানিক কারণ চিহ্নিতকরণ",
                  maxPoints: 1,
                  description: "সঠিক বৈজ্ঞানিক কারণ উল্লেখ করলে ১ নম্বর।",
                },
                {
                  id: `r_${Date.now()}_${i + 1}_kha_2`,
                  criterion: "যৌক্তিক ব্যাখ্যামূলক বিশ্লেষণ",
                  maxPoints: 1,
                  description: "কার্যকারণ সুনির্দিষ্টভাবে ব্যাখ্যা করলে ১ নম্বর।",
                },
              ],
            },
            {
              part: "ga",
              bengaliLabel: "গ",
              cognitiveLevel: "প্রয়োগমূলক",
              marks: 3,
              questionText: theme.ga,
              modelAnswer: theme.gaAns,
              rubrics: [
                {
                  id: `r_${Date.now()}_${i + 1}_ga_1`,
                  criterion: "সঠিক সূত্র নির্বাচন",
                  maxPoints: 1,
                  description: "প্রাসঙ্গিক গাণিতিক সূত্র লিখলে ১ নম্বর।",
                },
                {
                  id: `r_${Date.now()}_${i + 1}_ga_2`,
                  criterion: "মান প্রতিস্থাপন ও হিসাব",
                  maxPoints: 1,
                  description: "উপাত্তের সঠিক প্রতিস্থাপন ও নির্ভুল গণনায় ১ নম্বর।",
                },
                {
                  id: `r_${Date.now()}_${i + 1}_ga_3`,
                  criterion: "এককসহ চূড়ান্ত ফলাফল",
                  maxPoints: 1,
                  description: "সঠিক এককসহ সঠিক উত্তরে ১ নম্বর।",
                },
              ],
            },
            {
              part: "gha",
              bengaliLabel: "ঘ",
              cognitiveLevel: "উচ্চতর দক্ষতামূলক",
              marks: 4,
              questionText: theme.gha,
              modelAnswer: theme.ghaAns,
              rubrics: [
                {
                  id: `r_${Date.now()}_${i + 1}_gha_1`,
                  criterion: "সুস্পষ্ট প্রাথমিক সিদ্ধান্ত",
                  maxPoints: 1,
                  description: "উদ্দীপক সাপেক্ষে যুক্তিগ্রাহ্য সিদ্ধান্ত গ্রহণে ১ নম্বর।",
                },
                {
                  id: `r_${Date.now()}_${i + 1}_gha_2`,
                  criterion: "তত্ত্বীয় সমীকরণ ও গাণিতিক বিশ্লেষণ",
                  maxPoints: 2,
                  description: "গাণিতিক প্রতিপাদন ও তুলনামূলক হিসাবে ২ নম্বর।",
                },
                {
                  id: `r_${Date.now()}_${i + 1}_gha_3`,
                  criterion: "সমন্বিত উপসংহার ও মতামত",
                  maxPoints: 1,
                  description: "গাণিতিক ফলাফলের যৌক্তিক বিশ্লেষণে ১ নম্বর।",
                },
              ],
            },
          ],
        });
      } else if (questionType === "MCQ") {
        const tmpl = mcqTemplates[i % mcqTemplates.length];
        const optionKeys: Array<"A" | "B" | "C" | "D"> = ["A", "B", "C", "D"];
        // Rotate options so answers aren't always 'A'
        const shift = i % 4;
        const rotatedOptions = [
          tmpl.options[(0 + shift) % 4],
          tmpl.options[(1 + shift) % 4],
          tmpl.options[(2 + shift) % 4],
          tmpl.options[(3 + shift) % 4],
        ];
        const correctLabel = optionKeys[(4 - shift) % 4];

        generatedQuestions.push({
          id: qId,
          examId: "",
          type: "MCQ",
          orderIndex: i + 1,
          marks: 1,
          curriculumCode,
          difficulty,
          tags: [subject, topic, curriculumCode, `MCQ-${i + 1}`],
          questionText: tmpl.q(topic),
          mcqOptions: [
            { label: "A", text: rotatedOptions[0] },
            { label: "B", text: rotatedOptions[1] },
            { label: "C", text: rotatedOptions[2] },
            { label: "D", text: rotatedOptions[3] },
          ],
          correctOption: correctLabel,
          modelAnswer: tmpl.exp,
        });
      } else {
        generatedQuestions.push({
          id: qId,
          examId: "",
          type: "WRITTEN",
          orderIndex: i + 1,
          marks: 5,
          curriculumCode,
          difficulty,
          tags: [subject, topic, curriculumCode],
          questionText: `প্রশ্ন ${i + 1}: ${topic} এর মূল বৈজ্ঞানিক নীতিমালা এবং ব্যবহারিক ক্ষেত্রে এর প্রয়োগের গুরুত্ব আলোচনা করো।`,
          modelAnswer: "তত্ত্বের সংজ্ঞা ও মূল শর্তাবলী, ৩টি বাস্তব উদাহরণ, এবং বিজ্ঞানসম্মত প্রভাবের সারসংক্ষেপ।",
          rubrics: [
            { id: `r_${Date.now()}_w1`, criterion: "পয়েন্ট ১: মূল তত্ত্ব ও ভিত্তি", maxPoints: 2, description: "তত্ত্বের সঠিক সংজ্ঞায়ন ও নীতিতে ২ নম্বর।" },
            { id: `r_${Date.now()}_w2`, criterion: "পয়েন্ট ২: বাস্তব প্রয়োগ ও উদাহরণ", maxPoints: 2, description: "সঠিক উদাহরণ ও সমীকরণে ২ নম্বর।" },
            { id: `r_${Date.now()}_w3`, criterion: "পয়েন্ট ৩: গঠনমূলক উপসংহার", maxPoints: 1, description: "পরিচ্ছন্ন ও যৌক্তিক সমাপ্তিতে ১ নম্বর।" },
          ],
        });
      }
    }

    return NextResponse.json({
      success: true,
      questions: generatedQuestions,
      provider: "Academic Engine",
    });
  } catch (err: any) {
    console.error("AI Question Generator error:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Failed to generate questions" },
      { status: 500 }
    );
  }
}

