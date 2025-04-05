import mammoth from 'mammoth'
import { NextRequest, NextResponse } from 'next/server'
import PDFParser from 'pdf2json'

// Common job title keywords that often appear in work experience sections
const JOB_TITLE_KEYWORDS = [
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
]

// Date patterns that commonly appear in work experience sections
const DATE_PATTERNS = [
  /(?:jan(?:uary)?|feb(?:ruary)?|mar(?:ch)?|apr(?:il)?|may|jun(?:e)?|jul(?:y)?|aug(?:ust)?|sep(?:tember)?|oct(?:ober)?|nov(?:ember)?|dec(?:ember)?)\s*\d{4}/i,
  /\d{4}\s*(?:-|–|to)\s*(?:\d{4}|present)/i,
  /\d{2}\/\d{4}/i,
  /\d{4}/,
]

function findWorkExperienceSection(text: string): string | null {
  // Strategy 1: Look for date patterns and job titles in proximity
  const lines = text.split(/[.!?]\s+/)
  let bestSection = ''
  let maxScore = 0

  for (let i = 0; i < lines.length; i++) {
    let score = 0
    let sectionText = ''
    let hasJobTitle = false
    let hasDate = false
    let consecutiveDates = 0
    let bulletPoints = 0

    // Look at chunks of 10 lines at a time
    for (let j = 0; j < 10 && i + j < lines.length; j++) {
      const line = lines[i + j]
      sectionText += line + '. '

      // Check for job title keywords
      if (
        JOB_TITLE_KEYWORDS.some((keyword) =>
          line.toLowerCase().includes(keyword)
        )
      ) {
        hasJobTitle = true
        score += 2
      }

      // Check for date patterns
      if (DATE_PATTERNS.some((pattern) => pattern.test(line))) {
        hasDate = true
        consecutiveDates++
        score += 2
      } else {
        consecutiveDates = 0
      }

      // Check for bullet points or numbered lists
      if (/^[•\-\*]|\d+\./.test(line.trim())) {
        bulletPoints++
        score++
      }

      // Bonus for consecutive dates (likely work history)
      if (consecutiveDates > 1) {
        score += 3
      }
    }

    // Bonus if section has both job titles and dates
    if (hasJobTitle && hasDate) {
      score += 5
    }

    // Bonus for having multiple bullet points (common in work experience)
    if (bulletPoints > 2) {
      score += 3
    }

    if (score > maxScore) {
      maxScore = score
      bestSection = sectionText
    }

    // Skip ahead if we found a good section
    if (maxScore > 10) {
      i += 9
    }
  }

  // Only return if we found a section with a good enough score
  if (maxScore > 8 && bestSection.length > 50) {
    return bestSection.trim()
  }

  // Strategy 2: Fallback to traditional header search if strategy 1 fails
  return findSectionByHeaders(text)
}

function findSectionByHeaders(text: string): string | null {
  const HEADERS = [
    'work experience',
    'employment history',
    'professional experience',
    'work history',
    'experience',
    'professional background',
    'career history',
  ]

  const lowerText = text.toLowerCase()

  for (const header of HEADERS) {
    const headerIndex = lowerText.indexOf(header)
    if (headerIndex !== -1) {
      // Find the next major section
      const nextSectionPatterns = [
        /education/i,
        /skills/i,
        /certifications/i,
        /awards/i,
        /interests/i,
        /references/i,
      ]

      let nextSectionIndex = text.length
      for (const pattern of nextSectionPatterns) {
        const match = text.slice(headerIndex + header.length).search(pattern)
        if (
          match !== -1 &&
          match + headerIndex + header.length < nextSectionIndex
        ) {
          nextSectionIndex = match + headerIndex + header.length
        }
      }

      const sectionContent = text
        .slice(headerIndex + header.length, nextSectionIndex)
        .trim()

      if (sectionContent.length > 50) {
        return sectionContent
      }
    }
  }

  return null
}

export async function POST(req: NextRequest) {
  const headers = new Headers({
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
  })

  // Handle preflight request
  if (req.method === 'OPTIONS') {
    return new NextResponse(null, { headers })
  }

  try {
    const formData = await req.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      console.error('No file received in request')
      return NextResponse.json(
        { error: 'No file uploaded' },
        { status: 400, headers }
      )
    }

    console.log('Processing file:', {
      name: file.name,
      type: file.type,
      size: file.size,
    })

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    let text = ''

    if (file.type === 'application/pdf') {
      try {
        // Extract text from PDF using pdf2json
        text = await new Promise((resolve, reject) => {
          const pdfParser = new PDFParser()

          pdfParser.on('pdfParser_dataReady', (pdfData) => {
            try {
              const textContent = pdfData.Pages.map((page) =>
                page.Texts.map((text) => decodeURIComponent(text.R[0].T)).join(
                  ' '
                )
              ).join(' ')
              resolve(textContent)
            } catch {
              reject(new Error('Failed to extract text from PDF structure'))
            }
          })

          pdfParser.on('pdfParser_dataError', (error) => {
            reject(error)
          })

          pdfParser.parseBuffer(buffer)
        })
      } catch (error) {
        console.error('PDF parsing error:', error)
        return NextResponse.json(
          { error: 'Failed to parse PDF file' },
          { status: 500, headers }
        )
      }
    } else if (
      file.type === 'application/msword' ||
      file.type ===
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ) {
      try {
        const result = await mammoth.extractRawText({ buffer })
        text = result.value
      } catch (error) {
        console.error('Word document parsing error:', error)
        return NextResponse.json(
          { error: 'Failed to parse Word document' },
          { status: 500, headers }
        )
      }
    } else {
      console.error('Unsupported file type:', file.type)
      return NextResponse.json(
        { error: `Unsupported file type: ${file.type}` },
        { status: 400, headers }
      )
    }

    // Clean and format the extracted text
    text = text
      .replace(/\n+/g, ' ') // Replace multiple newlines with space
      .replace(/\s+/g, ' ') // Replace multiple spaces with single space
      .trim()

    // Try to find the work experience section using our new approach
    let extractedText = findWorkExperienceSection(text)
    let sectionType = 'work_experience'

    // If no work experience found, use the first 1000 characters
    if (!extractedText) {
      extractedText = text
      sectionType = 'full_text'
    }

    // Truncate text to 1000 characters if longer
    const truncatedText =
      extractedText.length > 1000 ? extractedText.slice(0, 1000) : extractedText
    const wasTextTruncated = extractedText.length > 1000

    console.log('Successfully extracted text length:', extractedText.length)
    console.log('Truncated text length:', truncatedText.length)
    console.log('Section type found:', sectionType)

    return NextResponse.json(
      {
        text: truncatedText,
        wasTextTruncated,
        originalLength: extractedText.length,
        sectionType,
      },
      { headers }
    )
  } catch (error) {
    console.error('Error processing file:', error)
    return NextResponse.json(
      { error: 'Error processing file' },
      { status: 500, headers }
    )
  }
}
