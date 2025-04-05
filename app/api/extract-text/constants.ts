export const JOB_TITLE_KEYWORDS = [
  'engineer',
  'developer',
  'manager',
  'director',
  'coordinator',
  'specialist',
  'analyst',
  'consultant',
  'lead',
  'senior',
  'junior',
  'associate',
] as const

export const DATE_PATTERNS = [
  /(?:jan(?:uary)?|feb(?:ruary)?|mar(?:ch)?|apr(?:il)?|may|jun(?:e)?|jul(?:y)?|aug(?:ust)?|sep(?:tember)?|oct(?:ober)?|nov(?:ember)?|dec(?:ember)?)\s*\d{4}/i,
  /\d{4}\s*(?:-|–|to)\s*(?:\d{4}|present)/i,
  /\d{2}\/\d{4}/i,
  /\d{4}/,
] as const

export const WORK_EXPERIENCE_HEADERS = [
  'work experience',
  'employment history',
  'professional experience',
  'work history',
  'experience',
  'professional background',
  'career history',
] as const

export const NEXT_SECTION_PATTERNS = [
  /education/i,
  /skills/i,
  /certifications/i,
  /awards/i,
  /interests/i,
  /references/i,
] as const

export const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Content-Type': 'application/json',
} as const

export const SUPPORTED_FILE_TYPES = {
  PDF: 'application/pdf',
  DOC: 'application/msword',
  DOCX: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
} as const
