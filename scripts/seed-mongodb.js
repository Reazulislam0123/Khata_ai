// scripts/seed-mongodb.js
// Seeds initial institution, batches, subjects, and sample students into MongoDB Atlas

const mongoose = require("mongoose");

const MONGODB_URI =
  process.env.MONGODB_URI ||
  "mongodb+srv://khata_ai:5lkDRsGgCcjLwRNz@cluster0.zqern1c.mongodb.net/khata_ai?retryWrites=true&w=majority&appName=Cluster0";

async function seed() {
  console.log("Connecting to MongoDB Atlas...");
  await mongoose.connect(MONGODB_URI);
  console.log("Connected to MongoDB!");

  const db = mongoose.connection.db;

  // 1. Seed Institution
  const institutionsCol = db.collection("institutions");
  let institution = await institutionsCol.findOne({ slug: "udvash-academic" });
  if (!institution) {
    const res = await institutionsCol.insertOne({
      name: "Udvash Academic & Admission Care",
      nameBn: "উদ্ভাস একাডেমিক অ্যান্ড এডমিশন কেয়ার",
      slug: "udvash-academic",
      type: "COACHING",
      subscriptionPlan: "PRO",
      status: "ACTIVE",
      contactEmail: "info@udvash.com",
      phone: "+880 9666 775566",
      address: "Dhaka, Bangladesh",
      description: "Premier Engineering, Medical and HSC Board Exam Evaluation Portal",
      scriptsQuota: 500,
      scriptsUsed: 42,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    institution = { _id: res.insertedId };
    console.log("✅ Seeded Institution: Udvash Academic & Admission Care");
  }

  // 2. Seed Batches
  const batchesCol = db.collection("batches");
  const existingBatchesCount = await batchesCol.countDocuments();
  if (existingBatchesCount === 0) {
    const sampleBatches = [
      {
        institutionId: institution._id,
        name: "HSC 2026 Engineering Foundation Batch",
        description: "BUET & Medical admission special CQ & MCQ weekly evaluation program.",
        curriculumCode: "HSC",
        enrolledStudentCount: 48,
        isActive: true,
        createdAt: new Date("2026-01-15"),
        updatedAt: new Date(),
      },
      {
        institutionId: institution._id,
        name: "Varsity 'Ka' Rapid Crash Course 2026",
        description: "Dhaka University 'Ka' unit targeted model testing batch.",
        curriculumCode: "DU_A",
        enrolledStudentCount: 35,
        isActive: true,
        createdAt: new Date("2026-02-01"),
        updatedAt: new Date(),
      },
      {
        institutionId: institution._id,
        name: "Class 12 Science Section A (Morning)",
        description: "Physics, Chemistry and Higher Math semester evaluation batch.",
        curriculumCode: "HSC",
        enrolledStudentCount: 60,
        isActive: true,
        createdAt: new Date("2026-01-10"),
        updatedAt: new Date(),
      },
    ];
    await batchesCol.insertMany(sampleBatches);
    console.log(`✅ Seeded ${sampleBatches.length} Batches in MongoDB`);
  }

  // 3. Seed Subjects
  const subjectsCol = db.collection("subjects");
  const existingSubjectsCount = await subjectsCol.countDocuments();
  if (existingSubjectsCount === 0) {
    const sampleSubjects = [
      {
        institutionId: institution._id,
        name: "Physics 1st & 2nd Paper",
        code: "PHY-174",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        institutionId: institution._id,
        name: "Chemistry 1st & 2nd Paper",
        code: "CHEM-176",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        institutionId: institution._id,
        name: "Higher Mathematics",
        code: "MATH-265",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        institutionId: institution._id,
        name: "English 1st & 2nd Paper",
        code: "ENG-107",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
    await subjectsCol.insertMany(sampleSubjects);
    console.log(`✅ Seeded ${sampleSubjects.length} Subjects in MongoDB`);
  }

  // 4. Seed Sample Students
  const usersCol = db.collection("users");
  const existingStudentsCount = await usersCol.countDocuments({ role: "STUDENT" });
  if (existingStudentsCount === 0) {
    const sampleStudents = [
      {
        firebaseUid: "std_tahmid_01",
        email: "tahmid@student.ac.bd",
        name: "Tahmid Hasan (তাহমিদ হাসান)",
        rollNo: "ENG-101",
        phone: "+880 1712 345678",
        role: "STUDENT",
        institutionId: institution._id,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        firebaseUid: "std_samiha_02",
        email: "samiha@student.ac.bd",
        name: "Samiha Rahman (সামিহা রহমান)",
        rollNo: "ENG-102",
        phone: "+880 1819 123456",
        role: "STUDENT",
        institutionId: institution._id,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        firebaseUid: "std_fahim_03",
        email: "fahim@student.ac.bd",
        name: "Fahim Shahriar (ফাহিম শাহরিয়ার)",
        rollNo: "ENG-103",
        phone: "+880 1911 987654",
        role: "STUDENT",
        institutionId: institution._id,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
    await usersCol.insertMany(sampleStudents);
    console.log(`✅ Seeded ${sampleStudents.length} Students in MongoDB`);
  }

  console.log("Seeding completed successfully!");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});

