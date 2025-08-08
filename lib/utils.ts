import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}



export const detectBlockchain = (address: string) => {
  if (/^0x[a-fA-F0-9]{40}$/.test(address)) return "Ethereum";

  // Solana addresses are Base58, typically 32-44 characters long
  if (/^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(address)) return "Solana";

  return "Unknown";
};

export const truncate = (str: string, start = 6, end = 4) => {
  if (!str) return "";
  if (str.length <= start + end) return str;
  return `${str.slice(0, start)}...${str.slice(-end)}`;
};