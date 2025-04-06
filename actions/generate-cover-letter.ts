'use server'

import { CoverLetterFormValues } from '@/lib/schemas/cover-letter'
import { prisma } from '@/prisma/prisma'
import { auth } from '@clerk/nextjs/server'
import OpenAI, { APIError } from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function generateCoverLetter(data: CoverLetterFormValues) {
  try {
    const { userId } = await auth()

    if (!userId) {
      throw new Error('Unauthorized')
    }

    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OpenAI API key is not configured')
    }

    const prompt = `Write a professional cover letter for a ${data.jobTitle} position.
    Company Website: ${data.companyWebsite}
    Job Description: ${data.jobDescription}
    My Work History: ${data.workHistory}
    Writing Style: ${data.writingStyle}
    Keep the response under 255 characters while maintaining professionalism and relevance.`

    try {
      const completion = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content:
              'You are a professional cover letter writer. Write concise, impactful cover letters that highlight relevant experience and enthusiasm for the role. Keep responses brief but meaningful.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        max_tokens: 100,
        temperature: 0.7,
      })

      const coverLetter = completion.choices[0]?.message?.content

      if (!coverLetter) {
        throw new Error('Failed to generate cover letter')
      }

      await prisma.coverLetter.create({
        data: {
          clerkUserId: userId,
          coverLetter,
          ...data,
        },
      })

      return { success: true }
    } catch (openAiError) {
      // Handle specific OpenAI API errors
      if (openAiError instanceof APIError) {
        if (openAiError.status === 429) {
          throw new Error(
            'API rate limit exceeded. Please try again in a few moments.'
          )
        }
        if (openAiError.code === 'insufficient_quota') {
          throw new Error(
            'OpenAI API quota exceeded. Please contact support for assistance.'
          )
        }
      }
      // Re-throw other errors
      throw openAiError
    }
  } catch (error) {
    console.error('Error generating cover letter:', error)
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'Failed to generate cover letter',
    }
  }
}
