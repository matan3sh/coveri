import { createLogger } from '@/lib/logger'
import { NextRequest, NextResponse } from 'next/server'
import * as pdfParse from 'pdf-parse'
import { CORS_HEADERS, SUPPORTED_FILE_TYPES } from './constants'
import { processPDF, processWord } from './file-processors'
import { ExtractedTextResult, TextExtractionError } from './types'
import { cleanText, findWorkExperienceSection } from './utils'

// Create a logger specific to this module
const logger = createLogger('extract-text')

export async function POST(req: NextRequest) {
  const headers = new Headers(CORS_HEADERS)

  // Handle preflight request
  if (req.method === 'OPTIONS') {
    return new NextResponse(null, { headers })
  }

  try {
    const formData = await req.formData()
    const file = formData.get('file') as File
    const sectionType = formData.get('sectionType') as string

    if (!file) {
      logger.error('No file received in request')
      return createErrorResponse('No file uploaded', 400, headers)
    }

    logger.info('Processing file', {
      type: file.type,
      name: file.name,
      size: file.size,
      sectionType,
    })

    let text = ''

    // Handle different file types
    if (file.type === 'application/pdf') {
      const buffer = await file.arrayBuffer()
      const pdfData = await pdfParse(buffer)
      text = pdfData.text
    } else if (
      file.type === 'text/plain' ||
      file.type === 'application/rtf' ||
      file.type.includes('word')
    ) {
      text = await file.text()
    } else {
      logger.error(`Unsupported file type: ${file.type}`)
      return createErrorResponse('Unsupported file type', 400, headers)
    }

    // Clean and format the extracted text
    text = cleanText(text)

    // Extract work experience section
    const result = extractAndFormatText(text)

    logger.success('Text extracted successfully', {
      extractedLength: result.text.length,
      originalLength: result.originalLength,
      sectionType: result.sectionType,
    })

    return NextResponse.json(result, { headers })
  } catch (error) {
    logger.error('Error processing file', error)
    return createErrorResponse('Error processing file', 500, headers)
  }
}

async function processFileContent(
  fileType: string,
  buffer: Buffer
): Promise<string> {
  switch (fileType) {
    case SUPPORTED_FILE_TYPES.PDF:
      return processPDF(buffer)
    case SUPPORTED_FILE_TYPES.DOC:
    case SUPPORTED_FILE_TYPES.DOCX:
      return processWord(buffer)
    default:
      throw new Error(`Unsupported file type: ${fileType}`)
  }
}

function extractAndFormatText(text: string): ExtractedTextResult {
  let extractedText = findWorkExperienceSection(text)
  const sectionType = extractedText ? 'work_experience' : 'full_text'

  // If no work experience found, use the full text
  if (!extractedText) {
    extractedText = text
  }

  // Truncate text to 1000 characters if longer
  const truncatedText =
    extractedText.length > 1000 ? extractedText.slice(0, 1000) : extractedText

  return {
    text: truncatedText,
    wasTextTruncated: extractedText.length > 1000,
    originalLength: extractedText.length,
    sectionType,
  }
}

function createErrorResponse(
  message: string,
  status: number,
  headers: Headers
): NextResponse<TextExtractionError> {
  return NextResponse.json({ error: message }, { status, headers })
}

function getFileTypeName(mimeType: string): string {
  switch (mimeType) {
    case SUPPORTED_FILE_TYPES.PDF:
      return 'PDF'
    case SUPPORTED_FILE_TYPES.DOC:
    case SUPPORTED_FILE_TYPES.DOCX:
      return 'Word document'
    default:
      return 'file'
  }
}
