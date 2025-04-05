import { type CoverLetterFormValues } from '@/lib/schemas/cover-letter'
import { type Control, type UseFormSetValue } from 'react-hook-form'

export interface FormSectionProps {
  control: Control<CoverLetterFormValues>
}

export interface WorkHistorySectionProps extends FormSectionProps {
  setValue: UseFormSetValue<CoverLetterFormValues>
}

export interface CharacterCountProps {
  current: number
  max: number
  warningThreshold?: number
  errorThreshold?: number
}
