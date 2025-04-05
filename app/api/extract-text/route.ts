import { NextRequest, NextResponse } from 'next/server'
import { CORS_HEADERS, SUPPORTED_FILE_TYPES } from './constants'
import { processPDF, processWord } from './file-processors'
import { ExtractedTextResult, TextExtractionError } from './types'
import { cleanText, findWorkExperienceSection } from './utils'

export async function POST(req: NextRequest) {
  const headers = new Headers(CORS_HEADERS)

  // Handle preflight request
  if (req.method === 'OPTIONS') {
    return new NextResponse(null, { headers })
  }

  try {
    const file = await req
      .formData()
      .then((data) => data.get('file') as File | null)

    if (!file) {
      console.error('No file received in request')
      return createErrorResponse('No file uploaded', 400, headers)
    }

    console.log('Processing file:', {
      name: file.name,
      type: file.type,
      size: file.size,
    })

    const buffer = Buffer.from(await file.arrayBuffer())
    let text = ''

    // Process file based on type
    try {
      text = await processFileContent(file.type, buffer)
    } catch (error) {
      console.error(`Error processing ${file.type} file:`, error)
      return createErrorResponse(
        `Failed to parse ${getFileTypeName(file.type)}`,
        500,
        headers
      )
    }

    // Clean and format the extracted text
    text = cleanText(text)

    // Extract work experience section
    const result = extractAndFormatText(text)

    console.log('Successfully extracted text length:', result.originalLength)
    console.log('Truncated text length:', result.text.length)
    console.log('Section type found:', result.sectionType)

    return NextResponse.json(result, { headers })
  } catch (error) {
    console.error('Error processing file:', error)
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
