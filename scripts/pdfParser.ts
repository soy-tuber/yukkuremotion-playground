import * as fs from 'fs';
import * as path from 'path';
// @ts-ignore
import pdfParse from 'pdf-parse';

export interface ParsedPdfContent {
  text: string;
  numpages: number;
  info: any;
}

export async function parsePdf(
  filePath: string
): Promise<ParsedPdfContent> {
  const dataBuffer = fs.readFileSync(path.resolve(filePath));
  const data = await pdfParse(dataBuffer);

  return {
    text: data.text,
    numpages: data.numpages,
    info: data.info,
  };
}
