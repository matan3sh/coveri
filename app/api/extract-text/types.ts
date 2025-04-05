export interface ExtractedTextResult {
  text: string
  wasTextTruncated: boolean
  originalLength: number
  sectionType: 'work_experience' | 'full_text'
}

export interface TextExtractionError {
  error: string
}

export type FileProcessor = (buffer: Buffer) => Promise<string>
