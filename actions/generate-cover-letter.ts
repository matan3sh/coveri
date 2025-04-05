'use server'

import { CoverLetterFormValues } from '@/lib/schemas/cover-letter'
import { prisma } from '@/prisma/prisma'
import { auth } from '@clerk/nextjs/server'
import { OpenAI } from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function generateCoverLetter(data: CoverLetterFormValues) {
  try {
    const { userId } = await auth()

    if (!userId) {
      throw new Error('Unauthorized')
    }

    const prompt = `Write a professional cover letter for a ${data.jobTitle} position.
    Company Website: ${data.companyWebsite}
    Job Description: ${data.jobDescription}
    My Work History: ${data.workHistory}
    Writing Style: ${data.writingStyle}
    Keep the response under 255 characters while maintaining professionalism and relevance.`

    const completion = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'system',
          content:
            'You are a professional cover letter writer. Write concise, impactful cover letters that highlight relevant experience and enthusiasm for the role.',
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

    // Save the cover letter to the database
    await prisma.coverLetter.create({
      data: {
        clerkUserId: userId,
        jobTitle: data.jobTitle,
        companyWebsite: data.companyWebsite,
        jobDescription: data.jobDescription,
        workHistory: data.workHistory,
        writingStyle: data.writingStyle,
      },
    })

    return { success: true }
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
