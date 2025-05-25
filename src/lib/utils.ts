import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Link, StatusType } from "../types";


export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// utils.ts

export const getStatusFromLink = (link: Link): StatusType => {
  if (!link.is_active || link.deleted_at) return "Paused";
  if (link.expires_at && new Date(link.expires_at) < new Date()) return "Expired";
  if (link.max_clicks && link.click_count >= link.max_clicks) return "Expired";
  return "Active";
};

export const getStatusColor = (status: StatusType): string => {
  switch (status) {
    case "Active":
      return "text-green-400 bg-green-400/10";
    case "Expired":
      return "text-red-400 bg-red-400/10";
    case "Paused":
      return "text-yellow-400 bg-yellow-400/10";
    default:
      return "text-gray-400 bg-gray-400/10";
  }
};

export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString();
};

export const formatDateTime = (dateString: string): string => {
  return new Date(dateString).toLocaleString();
};

export const copyToClipboard = async (text: string): Promise<void> => {
  try {
    await navigator.clipboard.writeText(text);
  } catch (err) {
    console.error("Failed to copy:", err);
  }
};