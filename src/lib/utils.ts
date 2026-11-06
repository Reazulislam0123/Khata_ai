import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatScore(score: number, maxScore: number): string {
  return `${score.toFixed(1)} / ${maxScore}`;
}

export function formatPercentage(score: number, maxScore: number): string {
  if (maxScore === 0) return "0%";
  return `${Math.round((score / maxScore) * 100)}%`;
}

export function calculateGradeAndGPA(percentage: number, isUniversity: boolean = false): { grade: string; gpa: number } {
  if (percentage >= 80) return { grade: "A+", gpa: isUniversity ? 4.0 : 5.0 };
  if (percentage >= 70) return { grade: "A", gpa: isUniversity ? 3.75 : 4.0 };
  if (percentage >= 60) return { grade: "A-", gpa: isUniversity ? 3.5 : 3.5 };
  if (percentage >= 50) return { grade: "B", gpa: isUniversity ? 3.0 : 3.0 };
  if (percentage >= 40) return { grade: "C", gpa: isUniversity ? 2.5 : 2.0 };
  if (percentage >= 33) return { grade: "D", gpa: isUniversity ? 2.0 : 1.0 };
  return { grade: "F", gpa: 0.0 };
}

export function formatIELTSBand(scoreOutOf100: number): { band: number; descriptor: string } {
  const rawBand = (scoreOutOf100 / 100) * 9;
  // Round to nearest 0.5
  const band = Math.round(rawBand * 2) / 2;
  let descriptor = "Expert User";
  if (band >= 8.5) descriptor = "Expert User";
  else if (band >= 7.5) descriptor = "Very Good User";
  else if (band >= 6.5) descriptor = "Competent User";
  else if (band >= 5.5) descriptor = "Modest User";
  else if (band >= 4.5) descriptor = "Limited User";
  else descriptor = "Extremely Limited User";
  return { band, descriptor };
}
