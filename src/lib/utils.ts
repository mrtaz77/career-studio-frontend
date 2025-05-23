import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const BACK_IMG_URL =
  "https://assets.nflxext.com/ffe/siteui/vlv3/20bf1f4d-1c73-48fd-8689-310d6dd80efc/c189e65a-ee63-4eb2-bf50-a326fa27e2d8/BD-en-20240812-POP_SIGNUP_TWO_WEEKS-perspective_WEB_722e6c5b-1615-42d5-9aa1-7d15a7dda307_large.jpg"
