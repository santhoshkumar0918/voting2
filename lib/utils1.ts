import { type ClassValue, clsx } from "clsx";

import { twMerge } from "tailwind-merge";

// Utility for combining Tailwind classes

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format remaining time from timestamp

export function formatTimeRemaining(endTime: number): string {
  const now = Math.floor(Date.now() / 1000);

  const timeLeftSeconds = endTime - now;

  if (timeLeftSeconds <= 0) {
    return "Ended";
  }

  const days = Math.floor(timeLeftSeconds / (60 * 60 * 24));

  const hours = Math.floor((timeLeftSeconds % (60 * 60 * 24)) / (60 * 60));

  const minutes = Math.floor((timeLeftSeconds % (60 * 60)) / 60);

  if (days > 0) {
    return `${days}d ${hours}h remaining`;
  } else if (hours > 0) {
    return `${hours}h ${minutes}m remaining`;
  } else {
    return `${minutes}m remaining`;
  }
}
