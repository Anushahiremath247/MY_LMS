import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));

export const percentage = (value: number) => `${Math.max(0, Math.min(100, value))}%`;

