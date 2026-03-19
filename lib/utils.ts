import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"


export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

export const formatError = (error: { code: number, message: string, fix: string }) => {
	return `Error ${error.code}: ${error.message} ${error.fix}`
}