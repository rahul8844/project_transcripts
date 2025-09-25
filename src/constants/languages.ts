export const LANGUAGES = {
  ENGLISH: 'en',
  HINDI: 'hi',
} as const;

export type Language = typeof LANGUAGES[keyof typeof LANGUAGES];

export const LANGUAGE_NAMES = {
  [LANGUAGES.ENGLISH]: 'English',
  [LANGUAGES.HINDI]: 'हिंदी',
} as const;

export const DEFAULT_LANGUAGE = LANGUAGES.ENGLISH;
