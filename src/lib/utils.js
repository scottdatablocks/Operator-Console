import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function formatTimestamp(timestamp) {
  if (!timestamp) return "—";
  try {
    return new Date(timestamp).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  } catch {
    return timestamp;
  }
}

export function formatDuration(seconds) {
  if (!seconds) return "—";
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hours > 0) return `${hours}h ${minutes}m`;
  if (minutes > 0) return `${minutes}m ${secs}s`;
  return `${secs}s`;
}

export function getStatusVariant(status) {
  if (!status) return "default";
  const s = status.toLowerCase();
  if (s.includes("ok") || s.includes("pass") || s.includes("success") || s.includes("running")) {
    return "success";
  }
  if (s.includes("warn") || s.includes("pending")) {
    return "warning";
  }
  if (s.includes("fail") || s.includes("error") || s.includes("critical")) {
    return "destructive";
  }
  return "default";
}
