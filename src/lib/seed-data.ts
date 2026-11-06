import { Exam, Submission } from "./types";

export const SEED_EXAMS: Exam[] = [
  {
    id: "exam_hsc_physics_01",
    title: "HSC Physics 1st Paper: Dynamics & Gravitation Model Test",
    subject: "Physics (পদার্থবিজ্ঞান ১ম পত্র)",
    curriculumCode: "HSC",
    creatorId: "usr_teacher_01",
    creatorName: "Prof. Rafiqul Islam",
    totalMarks: 50,
    durationMinutes: 90,
    isOnline: true,
    isPublished: true,
    negativeMarkingRate: 0.0,
    passMarkPercentage: 33,
    createdAt: "2026-09-20T10:00:00Z",
    updatedAt: "2026-09-25T12:00:00Z",
    accessCode: "HSC2026",
    isPublic: true,
    questions: [
      {
        id: "q_hsc_cq_01",
        examId: "exam_hsc_physics_01",
        type: "CQ",
        orderIndex: 1,
        marks: 10,
        questionText: "উদ্দীপকটি পড়ে নিচের ক, খ, গ ও ঘ নম্বর প্রশ্নের উত্তর দাও:",
        stimulusText: "২০ মিটার উঁচু একটি দালানের ছাদ থেকে একটি ক্রিকেট বলকে আনুভূমিকের সাথে ৩০° কোণে ৪০ মি./সে. বেগে উপরের দিকে তির্যকভাবে নিক্ষেপ করা হলো। একই সময়ে অপর একজন ছাত্র ছাদ থেকে সোজা নিচে আরেকটি বল ফেলে দিল। অভিকর্ষজ ত্বরণ g = 9.8 m/s²।",
        cqParts: [
          {
            part: "ka",
            bengaliLabel: "ক",
            cognitiveLevel: "জ্ঞানমূলক",
            marks: 1,
            questionText: "প্রাস (Projectile) কী?",
            modelAnswer: "আনুভূমিকের সাথে কোনো কোণে কোনো বস্তুকে শূন্যে নিক্ষেপ করা হলে তাকে প্রাস বা প্রক্ষেপক বলে।",
            rubrics: [
              {
                id: "r_cq_ka_1",
                criterion: "প্রাসের সঠিক সংজ্ঞা",
                maxPoints: 1,
                description: "আনুভূমিকের সাথে তির্যকভাবে শূন্যে নিক্ষেপিত বস্তুর উল্লেখ থাকলে পূর্ণ ১ নম্বর।",
                keywords: ["তির্যকভাবে", "শূন্যে", "নিক্ষেপ", "প্রাস"],
              },
            ],
          },
          {
            part: "kha",
            bengaliLabel: "খ",
            cognitiveLevel: "অনুধাবনমূলক",
            marks: 2,
            questionText: "চলন্ত বাসের যাত্রী বাস থেকে লাফ দিলে সামনের দিকে ঝুঁকে পড়ে কেন? ব্যাখ্যা করো।",
            modelAnswer: "গতিজড়তার কারণে এমন ঘটে। বাস যখন চলমান থাকে, তখন যাত্রীর সমগ্র শরীর বাসের সমান গতিবেগ লাভ করে। যখন যাত্রী বাস থেকে ভূমিতে পা রাখে, তখন তার পায়ের অংশ ভূমির সংস্পর্শে এসে স্থির হয়ে যায়। কিন্তু শরীরের উপরিভাগ গতিজড়তার কারণে পূর্বের বেগ বজায় রেখে সামনের দিকে অগ্রসর হতে চায়। ফলে যাত্রী সামনের দিকে ঝুঁকে পড়ে।",
            rubrics: [
              {
                id: "r_cq_kha_1",
                criterion: "গতিজড়তার ধারণা চিহ্নিতকরণ",
                maxPoints: 1,
                description: "১ম প্যারায় গতিজড়তার প্রত্যক্ষ উল্লেখ থাকলে ১ নম্বর।",
                keywords: ["গতিজড়তা", "জড়তা"],
              },
              {
                id: "r_cq_kha_2",
                criterion: "শারীরিক বেগ ও স্থায়িত্বের ব্যাখ্যা",
                maxPoints: 1,
                description: "২য় প্যারায় পায়ের স্থায়িত্ব এবং শরীরের ঊর্ধ্বাংশের গতিশীলতার বৈসাদৃশ্য ব্যাখ্যা করলে ১ নম্বর।",
                keywords: ["পায়ের অংশ স্থির", "শরীরের উপরিভাগ", "সামনের দিকে"],
              },
            ],
          },
          {
            part: "ga",
            bengaliLabel: "গ",
            cognitiveLevel: "প্রয়োগমূলক",
            marks: 3,
            questionText: "নিক্ষিপ্ত ক্রিকেট বলটি কত সময় পর ভূমিতে আঘাত করবে নির্ণয় করো।",
            modelAnswer: "এখানে, উল্লম্ব বেগ v₀y = 40 sin(30°) = 20 m/s (উপরের দিকে)। ছাদের উচ্চতা h = -20 m (নিচের দিক ঋণাত্মক ধরলে)।\nআমরা জানি, h = v₀y*t - (1/2)*g*t²\n=> -20 = 20t - 4.9t²\n=> 4.9t² - 20t - 20 = 0\nদ্বিঘাত সমীকরণ সমাধান করে পাই: t = [20 ± √(400 - 4*4.9*(-20))] / (2*4.9) = (20 ± 28.14) / 9.8\nযেহেতু সময় ঋণাত্মক হতে পারে না, t = 48.14 / 9.8 ≈ 4.91 সেকেন্ড।\nউত্তর: বলটি ৪.৯১ সেকেন্ড পর ভূমিতে আঘাত করবে।",
            rubrics: [
              {
                id: "r_cq_ga_1",
                criterion: "উল্লম্ব বেগ ও সমীকরণ নির্ধারণ",
                maxPoints: 1,
                description: "v₀y = 40 sin 30° = 20 m/s এবং h = -20m সমীকরণ সূত্র স্থাপন।",
                keywords: ["v₀y", "h = v₀y t - 1/2 g t²", "20 m/s"],
              },
              {
                id: "r_cq_ga_2",
                criterion: "দ্বিঘাত সমীকরণ গঠন ও গণনা",
                maxPoints: 1,
                description: "4.9t² - 20t - 20 = 0 গঠন করে সঠিক ধাপ অনুসরণ।",
                keywords: ["4.9t² - 20t - 20 = 0"],
              },
              {
                id: "r_cq_ga_3",
                criterion: "সঠিক মান ও এককসহ চূড়ান্ত উত্তর",
                maxPoints: 1,
                description: "t = 4.91 সেকেন্ড (বা 4.9 s) সঠিক এককসহ প্রদান।",
                keywords: ["4.91", "4.9", "সেকেন্ড", "s"],
              },
            ],
          },
          {
            part: "gha",
            bengaliLabel: "ঘ",
            cognitiveLevel: "উচ্চতর দক্ষতামূলক",
            marks: 4,
            questionText: "সর্বোচ্চ উচ্চতায় পৌঁছানোর মুহূর্তে নিক্ষিপ্ত বলটির গতিশক্তি আদি গতিশক্তির কত গুণ হবে? গাণিতিক বিশ্লেষণের মাধ্যমে মতামত দাও।",
            modelAnswer: "১ম ধাপ (সিদ্ধান্ত): সর্বোচ্চ উচ্চতায় নিক্ষিপ্ত বলটির গতিশক্তি তার আদি গতিশক্তির ০.৭৫ বা ৩/৪ গুণ হবে।\n\n২য় ধাপ (তত্ত্বীয় ব্যাখ্যা): প্রাসের গতিপথের সর্বোচ্চ উচ্চতায় উলম্ব বেগ vy = 0 হয়। কিন্তু আনুভূমিক বেগ vx অপরিবর্তিত থাকে কারণ আনুভূমিক দিকে কোনো অভিকর্ষজ ত্বরণ ক্রিয়া করে না (vx = v₀ cosθ)।\n\n৩য় ধাপ (গাণিতিক বিশ্লেষণ):\nআদি গতিশক্তি, Ek₁ = (1/2) * m * v₀²\nসর্বোচ্চ উচ্চতায় গতিশক্তি, Ek₂ = (1/2) * m * vx² = (1/2) * m * (v₀ cos 30°)²\n= (1/2) * m * v₀² * (cos 30°)²\n= Ek₁ * (√3 / 2)² = (3/4) * Ek₁ = 0.75 Ek₁\n\n৪র্থ ধাপ (উপসংহার): দেখা যাচ্ছে যে, গতিশক্তি ভর এবং কোণের বর্গের উপর নির্ভর করে। এখানে সর্বোচ্চ বিন্দুতে গতিশক্তি আদি গতিশক্তির ৭৫% বা ৩/৪ গুণ। অতএব উক্তিটি গাণিতিকভাবে প্রমাণিত।",
            rubrics: [
              {
                id: "r_cq_gha_1",
                criterion: "সিদ্ধান্ত উপস্থাপন (Thesis Statement)",
                maxPoints: 1,
                description: "৩/৪ গুণ বা ৭৫% হওয়ার সুস্পষ্ট সিদ্ধান্ত প্রকাশ।",
                keywords: ["৩/৪ গুণ", "0.75", "৭৫%"],
              },
              {
                id: "r_cq_gha_2",
                criterion: "সর্বোচ্চ উচ্চতায় বেগের বৈশিষ্ট্য ব্যাখ্যা",
                maxPoints: 1,
                description: "vy = 0 এবং vx = v₀ cos 30° ধ্রুবক থাকার কারণ ব্যাখ্যা।",
                keywords: ["vy = 0", "vx = v₀ cos θ", "অনুভূমিক বেগ ধ্রুবক"],
              },
              {
                id: "r_cq_gha_3",
                criterion: "গতিশক্তির অনুপাতের সঠিক গাণিতিক প্রতিপাদন",
                maxPoints: 1,
                description: "Ek₂ / Ek₁ = cos²(30°) = (√3/2)² = 3/4 প্রতিপাদন।",
                keywords: ["cos² 30°", "3/4", "0.75"],
              },
              {
                id: "r_cq_gha_4",
                criterion: "যৌক্তিক মূল্যায়ন ও উপসংহার",
                maxPoints: 1,
                description: "গাণিতিক ফলাফলের সাথে উদ্দীপকের সামঞ্জস্য বিশ্লেষণ করে সমাপনী বাক্য।",
                keywords: ["উপসংহার", "প্রমাণিত"],
              },
            ],
          },
        ],
      },
      {
        id: "q_hsc_mcq_01",
        examId: "exam_hsc_physics_01",
        type: "MCQ",
        orderIndex: 2,
        marks: 1,
        questionText: "মহাকর্ষীয় ধ্রুবক G এর মাত্রা সমীকরণ কোনটি?",
        mcqOptions: [
          { id: "opt_1", text: "M⁻¹ L³ T⁻²", isCorrect: true, explanation: "G = F r² / (m₁ m₂) = [M L T⁻²][L²] / [M²] = M⁻¹ L³ T⁻²" },
          { id: "opt_2", text: "M L³ T⁻²", isCorrect: false },
          { id: "opt_3", text: "M⁻¹ L² T⁻¹", isCorrect: false },
          { id: "opt_4", text: "M⁻² L³ T⁻²", isCorrect: false },
        ],
      },
    ],
  },
  {
    id: "exam_ielts_writing_01",
    title: "IELTS Academic Writing Mock Test: Task 2 Essay",
    subject: "IELTS Academic Writing",
    curriculumCode: "IELTS",
    creatorId: "usr_teacher_01",
    creatorName: "Prof. Rafiqul Islam",
    totalMarks: 9,
    durationMinutes: 40,
    isOnline: true,
    isPublished: true,
    negativeMarkingRate: 0.0,
    passMarkPercentage: 66,
    createdAt: "2026-09-22T14:00:00Z",
    updatedAt: "2026-09-26T09:00:00Z",
    accessCode: "IELTS9",
    isPublic: true,
    questions: [
      {
        id: "q_ielts_01",
        examId: "exam_ielts_writing_01",
        type: "IELTS_TASK",
        orderIndex: 1,
        marks: 9,
        questionText: "Write about the following topic:\n\nSome educational experts believe that community service should be a compulsory part of high school education. To what extent do you agree or disagree?\n\nGive reasons for your answer and include any relevant examples from your own knowledge or experience.\nWrite at least 250 words.",
        ieltsTaskType: "TASK_2",
        ieltsMinWords: 250,
        modelAnswer: "In recent years, integrating voluntary community work into secondary education curriculum has sparked widespread debate...",
        rubrics: [
          {
            id: "r_ielts_ta",
            criterion: "Task Response (TR)",
            maxPoints: 9,
            description: "Addresses all parts of prompt, maintains clear position, develops well-supported ideas.",
          },
          {
            id: "r_ielts_cc",
            criterion: "Coherence & Cohesion (CC)",
            maxPoints: 9,
            description: "Logical paragraphing, clear central topic per paragraph, flexible use of cohesive devices.",
          },
          {
            id: "r_ielts_lr",
            criterion: "Lexical Resource (LR)",
            maxPoints: 9,
            description: "Sophisticated vocabulary, academic collocations, natural paraphrasing, minimal spelling slips.",
          },
          {
            id: "r_ielts_gra",
            criterion: "Grammatical Range & Accuracy (GRA)",
            maxPoints: 9,
            description: "Wide variety of complex sentences, conditionals, passive forms, majority error-free.",
          },
        ],
      },
    ],
  },
  {
    id: "exam_civil_service_essay_01",
    title: "Civil Service & Public Policy: Climate Adaptation & Disaster Governance",
    subject: "Environmental Governance & Public Policy (BCS / CSS)",
    curriculumCode: "BCS",
    creatorId: "usr_teacher_01",
    creatorName: "Dr. K. M. Rahman",
    totalMarks: 20,
    durationMinutes: 45,
    isOnline: true,
    isPublished: true,
    negativeMarkingRate: 0.0,
    passMarkPercentage: 40,
    createdAt: "2026-09-23T10:00:00Z",
    updatedAt: "2026-09-28T14:00:00Z",
    accessCode: "BCS2026",
    isPublic: true,
    questions: [
      {
        id: "q_css_floods_01",
        examId: "exam_civil_service_essay_01",
        type: "DESCRIPTIVE",
        orderIndex: 1,
        marks: 20,
        questionText: "Question No 03: Lessons emerged from 2025 Floods in the context of Climate Adaptation and Disaster Governance. Analyze institutional vulnerabilities, transport infrastructure breaches, and propose strategic resilience mechanisms.",
        modelAnswer: "1. Introduction & Contextualization: Severe recurring floods demonstrate climate change as a permanent reality. Citation of UN Secretary-General Antonio Guterres on climate accountability.\n2. Climate Adaptation Challenges: 2.1 Anticipating unseasonal rainfall with 15-20 days forecast lead time. 2.2 Post-flood drought paradox in water-stressed nations (<1000 m³ water per capita).\n3. Infrastructure Vulnerability: 2.3 Karachi drainage system capacity of 30-40 mm/hr overwhelmed by 300-400 mm/hr downpour. Breakdown of Motorway M-5 national logistics lifeline, isolating M-8 and M-4 corridors.\n4. Disaster Governance: 3.1 Severe shortage of weather monitoring stations (Pakistan operates only 82 stations = 1 per 10,000 km² vs WMO standard of 1 per 100 km²). 3.2 Inadequate rescue boats and flood relief camps (Jalalpur Pirwala case study).",
        rubrics: [
          {
            id: "r_css_1",
            criterion: "Introduction & Antonio Guterres Quote",
            maxPoints: 4,
            description: "Thesis on climate change as the new normalcy, contextualizing 2025 flood disaster and citing UN Secretary-General Antonio Guterres statement.",
          },
          {
            id: "r_css_2",
            criterion: "Climate Adaptation & Water Drought Paradox",
            maxPoints: 4,
            description: "Detailed analysis of meteorological department 15-20 day early rain forecast and subsequent water scarcity (<1000 m³ water per person).",
          },
          {
            id: "r_css_3",
            criterion: "Urban Infrastructure & Karachi Drainage Case Study",
            maxPoints: 4,
            description: "Comparative examination of municipal drainage capacity (30-40 mm/hr) vs actual torrential downpour (300-400 mm/hr).",
          },
          {
            id: "r_css_4",
            criterion: "Motorway M-5 Route Breakdown Map & Transport Severance",
            maxPoints: 4,
            description: "Hand-drawn geographical schematic illustrating M-5 breakage, Karachi port cutoff, and isolation of M-8 and M-4 arteries.",
          },
          {
            id: "r_css_5",
            criterion: "Disaster Governance Deficit & WMO Station Disparity",
            maxPoints: 4,
            description: "Disaster governance analysis citing 82 weather stations across Pakistan (1/10,000 km² vs 1/100 km² standard) and rescue boat shortages.",
          },
        ],
      },
    ],
  },
  {
    id: "exam_ssc_math_01",
    title: "SSC Higher Mathematics: Coordinate Geometry & Trigonometry",
    subject: "Higher Mathematics (উচ্চতর গণিত)",
    curriculumCode: "SSC",
    creatorId: "usr_admin_01",
    creatorName: "KhataAI Academic Board",
    totalMarks: 50,
    durationMinutes: 90,
    isOnline: true,
    isPublished: true,
    negativeMarkingRate: 0.0,
    passMarkPercentage: 33,
    createdAt: "2026-09-24T10:00:00Z",
    updatedAt: "2026-09-27T12:00:00Z",
    accessCode: "SSC2026",
    isPublic: true,
    questions: [
      {
        id: "q_ssc_cq_01",
        examId: "exam_ssc_math_01",
        type: "CQ",
        orderIndex: 1,
        marks: 10,
        questionText: "উদ্দীপকটি পড়ে নিচের প্রশ্নগুলোর উত্তর দাও:",
        stimulusText: "একটি ত্রিভুজের তিনটি শীর্ষবিন্দু যথাক্রমে A(2, 5), B(-1, 1) এবং C(5, -2)। D বিন্দুটি BC এর মধ্যবিন্দু।",
        cqParts: [
          {
            part: "ka",
            bengaliLabel: "ক",
            cognitiveLevel: "জ্ঞানমূলক",
            marks: 1,
            questionText: "A ও B বিন্দুর দূরত্ব নির্ণয় করো।",
            modelAnswer: "AB = √((2 - (-1))² + (5 - 1)²) = √(3² + 4²) = 5 একক।",
            rubrics: [
              { id: "r_ssc_ka_1", criterion: "দূরত্বের সূত্র ও সঠিক মান", maxPoints: 1, description: "দূরত্ব ৫ একক সঠিকভাবে বের করলে ১ নম্বর।" }
            ]
          },
          {
            part: "kha",
            bengaliLabel: "খ",
            cognitiveLevel: "অনুধাবনমূলক",
            marks: 2,
            questionText: "D বিন্দুর স্থানাঙ্ক ও AD মধ্যমার দৈর্ঘ্য নির্ণয় করো।",
            modelAnswer: "D = ((-1+5)/2, (1-2)/2) = (2, -0.5)। AD = √((2-2)² + (5 - (-0.5))²) = 5.5 একক।",
            rubrics: [
              { id: "r_ssc_kha_1", criterion: "মধ্যবিন্দু স্থানাঙ্ক", maxPoints: 1, description: "D(2, -0.5) সঠিকভাবে বের করলে ১ নম্বর।" },
              { id: "r_ssc_kha_2", criterion: "মধ্যমার দৈর্ঘ্য", maxPoints: 1, description: "AD = 5.5 একক গণনা করলে ১ নম্বর।" }
            ]
          },
          {
            part: "ga",
            bengaliLabel: "গ",
            cognitiveLevel: "প্রয়োগমূলক",
            marks: 3,
            questionText: "ABC ত্রিভুজের ক্ষেত্রফল নির্ণয় করো।",
            modelAnswer: "ক্ষেত্রফল = 1/2 * |2(1 - (-2)) + (-1)(-2 - 5) + 5(5 - 1)| = 1/2 * |6 + 7 + 20| = 33/2 = 16.5 বর্গ একক।",
            rubrics: [
              { id: "r_ssc_ga_1", criterion: "ক্ষেত্রফলের সূত্র", maxPoints: 1, description: "সঠিক সূত্রের প্রয়োগ।" },
              { id: "r_ssc_ga_2", criterion: "মান প্রতিস্থাপন ও হিসাব", maxPoints: 2, description: "১৬.৫ বর্গ একক ফলাফল।" }
            ]
          },
          {
            part: "gha",
            bengaliLabel: "ঘ",
            cognitiveLevel: "উচ্চতর দক্ষতামূলক",
            marks: 4,
            questionText: "A বিন্দুগামী এবং BC বাহুর সমান্তরাল সরলরেখার সমীকরণ নির্ণয় করো।",
            modelAnswer: "BC এর ঢাল m = (-2 - 1)/(5 - (-1)) = -3/6 = -1/2। সমান্তরাল রেখার ঢাল m = -1/2। A(2, 5) গামী সমীকরণ: y - 5 = -1/2 (x - 2) => x + 2y - 12 = 0।",
            rubrics: [
              { id: "r_ssc_gha_1", criterion: "ঢাল নির্ণয়", maxPoints: 1, description: "m = -1/2 নির্ণয়।" },
              { id: "r_ssc_gha_2", criterion: "সমান্তরাল রেখার সমীকরণ গঠন", maxPoints: 3, description: "x + 2y - 12 = 0 প্রতিপাদন।" }
            ]
          }
        ]
      }
    ]
  },
  {
    id: "exam_du_ka_01",
    title: "Dhaka University 'Ka' Unit Admission Mock Test: Physics & Chemistry",
    subject: "Physics & Chemistry (DU 'Ka' Unit Admission)",
    curriculumCode: "DU_A",
    creatorId: "usr_admin_01",
    creatorName: "KhataAI Admission Team",
    totalMarks: 50,
    durationMinutes: 60,
    isOnline: true,
    isPublished: true,
    negativeMarkingRate: 0.25,
    passMarkPercentage: 40,
    createdAt: "2026-09-25T08:00:00Z",
    updatedAt: "2026-09-27T10:00:00Z",
    accessCode: "DU-KA-2026",
    isPublic: true,
    questions: [
      {
        id: "q_du_01",
        examId: "exam_du_ka_01",
        type: "MCQ",
        orderIndex: 1,
        marks: 1,
        questionText: "কোনো বস্তুর ভরবেগ ৫০% বৃদ্ধি পেলে তার গতিশক্তি শতকরা কত বৃদ্ধি পাবে?",
        mcqOptions: [
          { id: "du_opt_1", text: "125%", isCorrect: true, explanation: "Ek = p²/(2m)। p' = 1.5p => Ek' = 2.25 Ek => বৃদ্ধি = (2.25 - 1)*100% = 125%" },
          { id: "du_opt_2", text: "50%", isCorrect: false },
          { id: "du_opt_3", text: "100%", isCorrect: false },
          { id: "du_opt_4", text: "75%", isCorrect: false }
        ]
      },
      {
        id: "q_du_02",
        examId: "exam_du_ka_01",
        type: "MCQ",
        orderIndex: 2,
        marks: 1,
        questionText: "কোন যৌগটি ক্যানিজারো বিক্রিয়া দেয়?",
        mcqOptions: [
          { id: "du_opt_2_1", text: "HCHO (ফর্মালডিহাইড)", isCorrect: true, explanation: "আলফা হাইড্রোজেনবিহীন অ্যালডিহাইড ক্যানিজারো বিক্রিয়া দেয়।" },
          { id: "du_opt_2_2", text: "CH3CHO", isCorrect: false },
          { id: "du_opt_2_3", text: "CH3COCH3", isCorrect: false },
          { id: "du_opt_2_4", text: "CH3CH2CHO", isCorrect: false }
        ]
      },
      {
        id: "q_du_03",
        examId: "exam_du_ka_01",
        type: "DESCRIPTIVE",
        orderIndex: 3,
        marks: 10,
        questionText: "একটি আদর্শ গ্যাসের জন্য সমোষ্ণ ও রুদ্ধতাপীয় পরিবর্তনের মধ্যে পার্থক্য লিখো এবং সমোষ্ণ রেখার চেয়ে রুদ্ধতাপ রেখা কেন γ গুণ খাড়া তা প্রমাণ করো।",
        modelAnswer: "সমোষ্ণ প্রক্রিয়ায় তাপমাত্রা ধ্রুবক থাকে (PV = C)। ঢাল dP/dV = -P/V।\nরুদ্ধতাপ প্রক্রিয়ায় তাপ আদান-প্রদান হয় না (PV^γ = C)। ঢাল dP/dV = -γ P/V।\nঅতএব রুদ্ধতাপ রেখার ঢাল = γ * (সমোষ্ণ রেখার ঢাল)। ফলে রুদ্ধতাপ রেখা সমোষ্ণ রেখার চেয়ে γ গুণ খাড়া।",
        rubrics: [
          { id: "r_du_3_1", criterion: "পার্থক্য উপস্থাপন", maxPoints: 4, description: "সংজ্ঞা ও মূল সমীকরণের সঠিক তুলনা।" },
          { id: "r_du_3_2", criterion: "গাণিতিক প্রতিপাদন", maxPoints: 6, description: "অন্তরীকরণ করে γ গুণ খাড়া প্রমাণ।" }
        ]
      }
    ]
  },
  {
    id: "exam_buet_math_01",
    title: "BUET Engineering Written Test: Differential Calculus & Dynamics",
    subject: "Higher Mathematics (BUET Engineering Written)",
    curriculumCode: "BUET",
    creatorId: "usr_admin_01",
    creatorName: "BUET Alumni Academic Board",
    totalMarks: 60,
    durationMinutes: 75,
    isOnline: true,
    isPublished: true,
    negativeMarkingRate: 0.0,
    passMarkPercentage: 40,
    createdAt: "2026-09-25T11:00:00Z",
    updatedAt: "2026-09-28T09:00:00Z",
    accessCode: "BUET-MATH",
    isPublic: true,
    questions: [
      {
        id: "q_buet_01",
        examId: "exam_buet_math_01",
        type: "DESCRIPTIVE",
        orderIndex: 1,
        marks: 20,
        questionText: "যদি y = (sin⁻¹ x)² হয়, তবে প্রমাণ করো যে: (1 - x²) y₂ - x y₁ - 2 = 0। এরপর লিইবনিজ উপপাদ্যের সাহায্যে n-তম অন্তরজ নির্ণয় করো।",
        modelAnswer: "y = (sin⁻¹ x)²\n=> y₁ = 2 sin⁻¹ x * 1/√(1 - x²)\n=> (1 - x²) y₁² = 4 (sin⁻¹ x)² = 4y\nউভয়পক্ষকে x এর সাপেক্ষে অন্তরীকরণ করে পাই:\n(1 - x²)*2y₁ y₂ - 2x y₁² = 4 y₁\n=> 2y₁ দিয়ে ভাগ করে: (1 - x²) y₂ - x y₁ - 2 = 0 (প্রমাণিত)।\nলিইবনিজ সূত্র প্রয়োগ করে n-তম অন্তরজ: (1 - x²) y_{n+2} - (2n + 1)x y_{n+1} - n² y_n = 0।",
        rubrics: [
          { id: "r_buet_1", criterion: "প্রথম ও দ্বিতীয় অন্তরজের সম্পর্ক", maxPoints: 10, description: "(1 - x²) y₂ - x y₁ - 2 = 0 সমীকরণ প্রতিপাদন।" },
          { id: "r_buet_2", criterion: "লিইবনিজ উপপাদ্য প্রয়োগ", maxPoints: 10, description: "সঠিক n-তম অন্তরজের পুনরাবৃত্তি সম্পর্ক স্থাপন।" }
        ]
      }
    ]
  },
  {
    id: "exam_bcs_preli_01",
    title: "47th BCS Preliminary & Written Model Test: Bangladesh & Global Affairs",
    subject: "General Knowledge & Bangladesh Affairs (BCS)",
    curriculumCode: "BCS",
    creatorId: "usr_admin_01",
    creatorName: "BCS Cadre Mentors Board",
    totalMarks: 50,
    durationMinutes: 60,
    isOnline: true,
    isPublished: true,
    negativeMarkingRate: 0.50,
    passMarkPercentage: 50,
    createdAt: "2026-09-26T12:00:00Z",
    updatedAt: "2026-09-28T14:00:00Z",
    accessCode: "BCS-47",
    isPublic: true,
    questions: [
      {
        id: "q_bcs_01",
        examId: "exam_bcs_preli_01",
        type: "MCQ",
        orderIndex: 1,
        marks: 1,
        questionText: "ঐতিহাসিক ৭ই মার্চের ভাষণকে ইউনেস্কো কোন আন্তর্জাতিক স্মৃতি রেজিস্টারে অন্তর্ভুক্ত করেছে?",
        mcqOptions: [
          { id: "bcs_opt_1", text: "মেমোরি অব দ্য ওয়ার্ল্ড ইন্টারন্যাশনাল রেজিস্টার (Memory of the World)", isCorrect: true, explanation: "২০১৭ সালের ৩০ অক্টোবর ইউনেস্কো এটিকে বিশ্ব প্রামাণ্য ঐতিহ্য হিসেবে স্বীকৃতি দেয়।" },
          { id: "bcs_opt_2", text: "ওয়ার্ল্ড হেরিটেজ লিস্ট", isCorrect: false },
          { id: "bcs_opt_3", text: "ইনটেনজিবল কালচারাল হেরিটেজ", isCorrect: false },
          { id: "bcs_opt_4", text: "ডকুমেন্টারি হেরিটেজ অব এশিয়া", isCorrect: false }
        ]
      },
      {
        id: "q_bcs_02",
        examId: "exam_bcs_preli_01",
        type: "DESCRIPTIVE",
        orderIndex: 2,
        marks: 15,
        questionText: "বাংলাদেশের ডেল্টা প্ল্যান ২১০০ (Delta Plan 2100) এর মূল স্তম্ভগুলো সংক্ষেপে আলোচনা করুন এবং জলবায়ু ঝুঁকি মোকাবিলায় এর তাৎপর্য ব্যাখ্যা করুন।",
        modelAnswer: "বাংলাদেশ ব-দ্বীপ পরিকল্পনা ২১০০ হলো একটি সমন্বিত ও দীর্ঘমেয়াদী কৌশলগত পরিকল্পনা। মূল লক্ষ্য:\n১. চরম দারিদ্র্য দূরীকরণ ও ২০৩০ সালের মধ্যে উচ্চ-মধ্যম আয়ের দেশে রূপান্তর।\n২. বন্যা ও জলবায়ু সম্পর্কিত বিপর্যয় থেকে নিরাপত্তা নিশ্চিতকরণ।\n৩. পানি ব্যবহারে সার্বিক দক্ষতা বৃদ্ধি ও টেকসই ব-দ্বীপ বাস্তুতন্ত্র নিশ্চিতকরণ।\nছয়টি হটস্পট: উপকূলীয় অঞ্চল, বরেন্দ্র ও খরা প্রবণ অঞ্চল, হাওর ও নদী মোহনা, পার্বত্য চট্টগ্রাম, এবং নগর অঞ্চল।",
        rubrics: [
          { id: "r_bcs_1", criterion: "পরিকল্পনার পটভূমি ও মূল লক্ষ্য", maxPoints: 6, description: "সুনির্দিষ্ট লক্ষ্য ও রূপকল্প ২১০০ এর ব্যাখ্যা।" },
          { id: "r_bcs_2", criterion: "হটস্পট ও জলবায়ু তাৎপর্য", maxPoints: 9, description: "উপকূলীয় সুরক্ষা, খরা ও বন্যা নিয়ন্ত্রণের সুনির্দিষ্ট কৌশল বিশ্লেষণ।" }
        ]
      }
    ]
  },
];

export const SEED_SUBMISSIONS: Submission[] = [
  {
    id: "sub_hsc_tahmid_01",
    examId: "exam_hsc_physics_01",
    examTitle: "HSC Physics 1st Paper: Dynamics & Gravitation Model Test",
    subject: "Physics (পদার্থবিজ্ঞান ১ম পত্র)",
    curriculumCode: "HSC",
    studentId: "usr_student_01",
    studentName: "Tahmid Hasan",
    studentRoll: "Roll: 1042 (Dhaka College)",
    studentEmail: "student@dhakacollege.edu.bd",
    submittedAt: "2026-09-26T11:45:00Z",
    status: "EVALUATED",
    answerSheetImages: [
      "https://images.unsplash.com/photo-1544717305-2782549b5136?w=1000&auto=format&fit=crop&q=80",
    ],
    answers: {
      q_hsc_cq_01: {
        questionId: "q_hsc_cq_01",
        handwrittenImageUrls: [
          "https://images.unsplash.com/photo-1544717305-2782549b5136?w=1000&auto=format&fit=crop&q=80",
        ],
      },
      q_hsc_mcq_01: {
        questionId: "q_hsc_mcq_01",
        selectedOptionId: "opt_1",
      },
    },
    evaluation: {
      id: "eval_sub_01",
      submissionId: "sub_hsc_tahmid_01",
      evaluatedBy: "Google Gemini 3.8 Flash (Vision Engine)",
      aiModelId: "gemini-3.8-flash",
      aiProvider: "google",
      evaluatedAt: "2026-09-26T11:46:12Z",
      totalScore: 9.5,
      maxScore: 11,
      percentage: 86.4,
      grade: "A+",
      gpa: 5.0,
      overallConfidence: 0.94,
      overallFeedback: "চমৎকার উত্তরপত্র! তাহমিদের সৃজনশীল প্রশ্নের গঠন অসাধারণ এবং বোর্ড মানদণ্ড অনুসারে প্রতিটি প্যারাগ্রাফ স্পষ্টভাবে উপস্থাপিত হয়েছে। শুধুমাত্র 'গ' নম্বরে দশমিকের পর আসন্ন মানের ক্ষেত্রে সামান্য অসঙ্গতি ছিল।",
      hasLegibilityIssues: false,
      teacherRemarks: "খুব ভালো হয়েছে তাহমিদ। বোর্ডে এভাবেই প্যারা স্পষ্ট করে লিখবে।",
      isApprovedByTeacher: true,
      questionEvaluations: [
        {
          questionId: "q_hsc_cq_01",
          questionType: "CQ",
          awardedMarks: 8.5,
          maxMarks: 10,
          legibilityScore: 0.95,
          isIllegible: false,
          feedback: "সৃজনশীল প্রশ্নের চারটি অংশই এনসিটিবি নির্দেশিকা অনুযায়ী চমৎকারভাবে রচিত হয়েছে। ক ও খ তে পূর্ণ নম্বর এবং ঘ তে পূর্ণ নম্বর প্রদান করা হয়েছে। গ অংশে গণনার দশমিক মানে সামান্য ত্রুটির কারণে ০.৫ কাটা গেছে।",
          improvementTips: "দ্বিঘাত সমীকরণ সমাধানের সময় দশমিকের পর কমপক্ষে দুই ঘর পর্যন্ত সুনির্দিষ্ট রাখা বাঞ্ছনীয়।",
          isFlaggedForTeacherReview: false,
          cqPartEvaluations: [
            {
              part: "ka",
              bengaliLabel: "ক",
              awardedMarks: 1,
              maxMarks: 1,
              extractedStudentText: "আনুভূমিকের সাথে তির্যকভাবে কোনো বস্তুকে শূন্যে নিক্ষেপ করা হলে তাকে প্রাস বা প্রক্ষেপক বলে।",
              feedback: "সঠিক ও ত্রুটিহীন সংজ্ঞা। পূর্ণ ১ নম্বর প্রাপ্ত।",
              modelAnswer: "আনুভূমিকের সাথে কোনো কোণে কোনো বস্তুকে শূন্যে নিক্ষেপ করা হলে তাকে প্রাস বা প্রক্ষেপক বলে।",
              rubricScores: [
                {
                  rubricId: "r_cq_ka_1",
                  criterion: "প্রাসের সঠিক সংজ্ঞা",
                  awardedPoints: 1,
                  maxPoints: 1,
                  justification: "তির্যকভাবে শূন্যে নিক্ষেপের শর্ত সঠিকভাবে উল্লেখ করেছে।",
                },
              ],
            },
            {
              part: "kha",
              bengaliLabel: "খ",
              awardedMarks: 2,
              maxMarks: 2,
              extractedStudentText: "চলন্ত বাসের যাত্রী বাস থেকে নামার সময় গতিজড়তার কারণে সামনের দিকে ঝুঁকে পড়ে।\nযখন যাত্রী চলন্ত বাস থেকে নামে, তখন ভূমির সংস্পর্শে এসে পা স্থির হয়, কিন্তু শরীরের বাকি অংশ গতিজড়তার কারণে সামনের দিকে ছুটে চলতে চায়। ফলে যাত্রী সামনে ঝুঁকে পড়ে।",
              feedback: "স্পষ্ট দুই প্যারায় গতিজড়তা এবং শরীরের বেগ ও স্থিরতার বৈসাদৃশ্য ব্যাখ্যা করা হয়েছে। পূর্ণ ২ নম্বর।",
              modelAnswer: "গতিজড়তার কারণে এমন ঘটে...",
              rubricScores: [
                {
                  rubricId: "r_cq_kha_1",
                  criterion: "গতিজড়তার ধারণা চিহ্নিতকরণ",
                  awardedPoints: 1,
                  maxPoints: 1,
                  justification: "১ম প্যারায় গতিজড়তা সঠিকভাবে চিহ্নিত।",
                },
                {
                  rubricId: "r_cq_kha_2",
                  criterion: "শারীরিক বেগ ও স্থায়িত্বের ব্যাখ্যা",
                  awardedPoints: 1,
                  maxPoints: 1,
                  justification: "২য় প্যারায় পা ও শরীরের উপরিভাগের গতিশীলতার সঠিক বৈজ্ঞানিক কারণ দেখানো হয়েছে।",
                },
              ],
            },
            {
              part: "ga",
              bengaliLabel: "গ",
              awardedMarks: 2.5,
              maxMarks: 3,
              extractedStudentText: "এখানে, উল্লম্ব বেগ v₀y = 40 sin 30° = 20 m/s\nআমরা জানি, h = v₀y*t - (1/2)*g*t²\n=> -20 = 20t - 4.9t²\n=> 4.9t² - 20t - 20 = 0\nt = 4.88 s",
              feedback: "সূত্র এবং সমীকরণ গঠন সঠিক, তবে দ্বিঘাত সমীকরণের শেষ গণনায় সামান্য ভুলের কারণে ৪.৯১ এর জায়গায় ৪.৮৮ এসেছে। ০.৫ নম্বর আংশিক কাটা গেছে।",
              modelAnswer: "t ≈ 4.91 সেকেন্ড।",
              rubricScores: [
                {
                  rubricId: "r_cq_ga_1",
                  criterion: "উল্লম্ব বেগ ও সমীকরণ নির্ধারণ",
                  awardedPoints: 1,
                  maxPoints: 1,
                  justification: "v₀y = 20 m/s এবং সঠিক সমীকরণ প্রতিপাদন।",
                },
                {
                  rubricId: "r_cq_ga_2",
                  criterion: "দ্বিঘাত সমীকরণ গঠন ও গণনা",
                  awardedPoints: 1,
                  maxPoints: 1,
                  justification: "দ্বিঘাত সমীকরণ রূপান্তর সঠিক।",
                },
                {
                  rubricId: "r_cq_ga_3",
                  criterion: "সঠিক মান ও এককসহ চূড়ান্ত উত্তর",
                  awardedPoints: 0.5,
                  maxPoints: 1,
                  justification: "আংশিক সঠিক, চূড়ান্ত মানে সামান্য বিচ্যুতি (৪.৮৮ বনাম ৪.৯১)।",
                },
              ],
            },
            {
              part: "gha",
              bengaliLabel: "ঘ",
              awardedMarks: 3,
              maxMarks: 4,
              extractedStudentText: "সর্বোচ্চ উচ্চতায় পৌঁছানোর মুহূর্তে নিক্ষিপ্ত বলটির গতিশক্তি আদি গতিশক্তির ৩/৪ গুণ হবে।\nআমরা জানি সর্বোচ্চ উচ্চতায় উলম্ব বেগ vy = 0 হয়। কিন্তু আনুভূমিক বেগ vx = v₀ cos 30° অপরিবর্তিত থাকে।\nআদি গতিশক্তি E₁ = 1/2 m v₀²\nসর্বোচ্চ উচ্চতায় গতিশক্তি E₂ = 1/2 m (v₀ cos 30°)² = 1/2 m v₀² * (√3/2)² = 3/4 E₁ = 0.75 E₁।\nঅতএব সর্বোচ্চ উচ্চতায় গতিশক্তি আদি গতিশক্তির ৭৫% বা ৩/৪ গুণ হবে।",
              feedback: "উচ্চতর দক্ষতামূলক প্রশ্নে ৪টি ধাপই নিখুঁতভাবে অনুধাবন ও বিশ্লেষণ করা হয়েছে। শিক্ষক যাচাইয়ের পর পূর্ণ ৪ দেওয়া যেতে পারে।",
              modelAnswer: "১ম ধাপ সিদ্ধান্ত, ২য় তত্ত্বীয় ব্যাখ্যা, ৩য় গাণিতিক প্রতিপাদন, ৪র্থ মূল্যায়ন...",
              rubricScores: [
                {
                  rubricId: "r_cq_gha_1",
                  criterion: "সিদ্ধান্ত উপস্থাপন (Thesis Statement)",
                  awardedPoints: 1,
                  maxPoints: 1,
                  justification: "৩/৪ গুণ হওয়ার পরিষ্কার বক্তব্য প্রদান।",
                },
                {
                  rubricId: "r_cq_gha_2",
                  criterion: "সর্বোচ্চ উচ্চতায় বেগের বৈশিষ্ট্য ব্যাখ্যা",
                  awardedPoints: 1,
                  maxPoints: 1,
                  justification: "vy = 0 এবং vx ধ্রুবক থাকার সঠিক ব্যাখ্যা।",
                },
                {
                  rubricId: "r_cq_gha_3",
                  criterion: "গতিশক্তির অনুপাতের সঠিক গাণিতিক প্রতিপাদন",
                  awardedPoints: 1,
                  maxPoints: 1,
                  justification: "Ek₂ / Ek₁ = 3/4 সফল প্রমাণ।",
                },
                {
                  rubricId: "r_cq_gha_4",
                  criterion: "যৌক্তিক মূল্যায়ন ও উপসংহার",
                  awardedPoints: 0,
                  maxPoints: 1,
                  justification: "৪র্থ প্যারায় গভীর বিশ্লেষণাত্মক সমন্বয় আরেকটু বিস্তারিত প্রত্যাশিত।",
                },
              ],
            },
          ],
        },
        {
          questionId: "q_hsc_mcq_01",
          questionType: "MCQ",
          awardedMarks: 1,
          maxMarks: 1,
          legibilityScore: 1.0,
          isIllegible: false,
          feedback: "সঠিক উত্তর নির্বাচন করা হয়েছে। M⁻¹ L³ T⁻²।",
          isFlaggedForTeacherReview: false,
        },
      ],
    },
  },
];
