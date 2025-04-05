import {
  DATE_PATTERNS,
  JOB_TITLE_KEYWORDS,
  NEXT_SECTION_PATTERNS,
  WORK_EXPERIENCE_HEADERS,
} from './constants'

export function findWorkExperienceSection(text: string): string | null {
  const workExperience = findByPatternMatching(text) ?? findByHeaders(text)
  return workExperience
}

function findByPatternMatching(text: string): string | null {
  const lines = text.split(/[.!?]\s+/)
  let bestSection = ''
  let maxScore = 0

  for (let i = 0; i < lines.length; i++) {
    const { score, sectionText } = analyzeTextChunk(lines, i)

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
  return maxScore > 8 && bestSection.length > 50 ? bestSection.trim() : null
}

function analyzeTextChunk(lines: string[], startIndex: number) {
  let score = 0
  let sectionText = ''
  let hasJobTitle = false
  let hasDate = false
  let consecutiveDates = 0
  let bulletPoints = 0

  // Look at chunks of 10 lines at a time
  for (let j = 0; j < 10 && startIndex + j < lines.length; j++) {
    const line = lines[startIndex + j]
    sectionText += line + '. '

    // Update metrics based on line content
    const metrics = analyzeLineContent(line)

    if (metrics.hasJobTitle) hasJobTitle = true
    if (metrics.hasDate) {
      hasDate = true
      consecutiveDates++
    } else {
      consecutiveDates = 0
    }

    score += metrics.score
    bulletPoints += metrics.bulletPoints

    // Bonus for consecutive dates (likely work history)
    if (consecutiveDates > 1) score += 3
  }

  // Apply final scoring bonuses
  if (hasJobTitle && hasDate) score += 5
  if (bulletPoints > 2) score += 3

  return { score, sectionText }
}

function analyzeLineContent(line: string) {
  const metrics = {
    hasJobTitle: false,
    hasDate: false,
    score: 0,
    bulletPoints: 0,
  }

  // Check for job title keywords
  if (
    JOB_TITLE_KEYWORDS.some((keyword) => line.toLowerCase().includes(keyword))
  ) {
    metrics.hasJobTitle = true
    metrics.score += 2
  }

  // Check for date patterns
  if (DATE_PATTERNS.some((pattern) => pattern.test(line))) {
    metrics.hasDate = true
    metrics.score += 2
  }

  // Check for bullet points or numbered lists
  if (/^[•\-\*]|\d+\./.test(line.trim())) {
    metrics.bulletPoints = 1
    metrics.score += 1
  }

  return metrics
}

function findByHeaders(text: string): string | null {
  const lowerText = text.toLowerCase()

  for (const header of WORK_EXPERIENCE_HEADERS) {
    const headerIndex = lowerText.indexOf(header)
    if (headerIndex === -1) continue

    const nextSectionIndex = findNextSectionIndex(
      text,
      headerIndex + header.length
    )
    const sectionContent = text
      .slice(headerIndex + header.length, nextSectionIndex)
      .trim()

    if (sectionContent.length > 50) {
      return sectionContent
    }
  }

  return null
}

function findNextSectionIndex(text: string, startIndex: number): number {
  let nextSectionIndex = text.length

  for (const pattern of NEXT_SECTION_PATTERNS) {
    const match = text.slice(startIndex).search(pattern)
    if (match !== -1 && match + startIndex < nextSectionIndex) {
      nextSectionIndex = match + startIndex
    }
  }

  return nextSectionIndex
}

export function cleanText(text: string): string {
  return text
    .replace(/\n+/g, ' ') // Replace multiple newlines with space
    .replace(/\s+/g, ' ') // Replace multiple spaces with single space
    .trim()
}
