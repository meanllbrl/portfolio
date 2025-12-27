import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Calculate age from birth date
 * @param birthDate - Date string in format "YYYY-MM-DD" or Date object
 * @returns Age in years
 */
export function calculateAge(birthDate: Date | string): number {
  const birth = typeof birthDate === 'string' ? new Date(birthDate) : birthDate;
  const today = new Date();

  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();

  // If birthday hasn't occurred this year yet, subtract 1
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }

  return age;
}

export function parseDateRange(dateString?: string): number {
  if (!dateString) return 0;

  try {
    const parts = dateString.split('-').map(s => s.trim());
    const endDate = parts[1] || parts[0]; // Fallback to start date if no range

    if (endDate.toLowerCase().includes('present')) {
      return new Date().getTime() + 10000000000; // Future date to keep at top
    }

    return new Date(endDate).getTime();
  } catch (e) {
    return 0;
  }
}

export function sortProjectsByDate(projects: any[]) {
  return [...projects].sort((a, b) => {
    const dateA = parseDateRange(a.date);
    const dateB = parseDateRange(b.date);
    return dateB - dateA;
  });
}







