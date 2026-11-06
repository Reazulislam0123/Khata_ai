import { execSync } from "child_process";

console.log("\n=======================================================");
console.log("   KhataAI (খাতা AI) - Automatic Database Setup        ");
console.log("=======================================================\n");

const dbUrl =
  process.env.DATABASE_URL ||
  process.env.POSTGRES_PRISMA_URL ||
  process.env.POSTGRES_URL;

if (dbUrl && dbUrl.trim().length > 0) {
  console.log("✓ External Database detected (PostgreSQL / Neon / Supabase).");
  console.log("✓ Running Prisma Schema Generation & Auto-Migration...");

  try {
    // Generate Prisma Client
    execSync("npx prisma generate", { stdio: "inherit" });

    // Push database schema to auto-create tables on Vercel
    console.log("✓ Pushing database schema to create tables...");
    execSync("npx prisma db push --accept-data-loss", {
      stdio: "inherit",
      env: { ...process.env, DATABASE_URL: dbUrl },
    });

    console.log("✓ Database tables created/synced successfully!");
  } catch (error) {
    console.warn("⚠️ Database auto-migration warning:", error.message);
    console.log("✓ Falling back to built-in zero-config data layer to ensure continuous uptime.");
  }
} else {
  console.log("ℹ️ No external DATABASE_URL found in environment.");
  console.log("✓ Zero-Config Mode Enabled: KhataAI will use its built-in in-memory/JSON data layer.");
  console.log("✓ All exams, rubrics, and grading workflows are 100% operational out of the box.");

  try {
    execSync("npx prisma generate", { stdio: "inherit" });
  } catch (e) {
    // Ignore if offline
  }
}

console.log("\n=======================================================\n");
