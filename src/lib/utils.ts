import { type ClassValue, clsx } from "clsx";
import { Platform } from "react-native";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export const OS = Platform.OS;
// export const OS = "ios";
