import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import LZString from "lz-string";
import { CardConfig } from "../types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function encodeConfig(config: CardConfig): string {
  const jsonString = JSON.stringify(config);
  return LZString.compressToEncodedURIComponent(jsonString);
}

export function decodeConfig(encoded: string): CardConfig | null {
  try {
    const jsonString = LZString.decompressFromEncodedURIComponent(encoded);
    if (!jsonString) return null;
    return JSON.parse(jsonString) as CardConfig;
  } catch (e) {
    console.error("Failed to decode config", e);
    return null;
  }
}
