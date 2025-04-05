import mammoth from 'mammoth'
import PDFParser from 'pdf2json'
import { FileProcessor } from './types'

export const processPDF: FileProcessor = async (
  buffer: Buffer
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const pdfParser = new PDFParser()

    pdfParser.on('pdfParser_dataReady', (pdfData) => {
      try {
        const textContent = pdfData.Pages.map((page) =>
          page.Texts.map((text) => decodeURIComponent(text.R[0].T)).join(' ')
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
}

export const processWord: FileProcessor = async (
  buffer: Buffer
): Promise<string> => {
  const result = await mammoth.extractRawText({ buffer })
  return result.value
}
