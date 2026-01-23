import {GoogleGenerativeAI} from '@google/generative-ai';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';
import {parsePdf} from './pdfParser';
import {SCRIPT_GENERATION_PROMPT} from './llmPrompts';

dotenv.config();

const apiKey =
  process.env.GEMINI_API_KEY || process.env.GOOGLE_GENAI_API_KEY;

if (!apiKey) {
  throw new Error('GEMINI_API_KEY or GOOGLE_GENAI_API_KEY is required');
}

const genAI = new GoogleGenerativeAI(apiKey);

export interface ScriptSection {
  title: string;
  script: string;
  visualType: 'TITLE' | 'EXPLANATION' | 'DIAGRAM' | 'CHART' | 'CODE';
  visualContent: string;
  duration: number;
}

export interface GeneratedScript {
  title: string;
  sections: ScriptSection[];
}

export async function generateScriptFromPdf(
  pdfPath: string
): Promise<GeneratedScript> {
  console.log(`Parsing PDF: ${pdfPath}`);
  const pdfContent = await parsePdf(pdfPath);

  console.log(`PDF parsed: ${pdfContent.numpages} pages`);
  console.log('Generating script with Gemini 2.5 Pro (gemini-2.5-pro)...');

  const model = genAI.getGenerativeModel({model: 'gemini-2.5-pro'});

  const prompt = SCRIPT_GENERATION_PROMPT.replace(
    '{pdfContent}',
    pdfContent.text
  );

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();

  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error('Failed to parse JSON from Gemini response');
  }

  const script: GeneratedScript = JSON.parse(jsonMatch[0]);

  const outputPath = path.join(
    process.cwd(),
    'transcripts',
    'generated-script.json'
  );
  fs.writeFileSync(outputPath, JSON.stringify(script, null, 2));

  console.log(`Script generated: ${outputPath}`);
  return script;
}

if (require.main === module) {
  const pdfPath =
    process.argv[2] || '資料/株ミニセミナー：情報の価値と投資を理解する.pdf';

  generateScriptFromPdf(pdfPath)
    .then((script) => {
      console.log('\n=== Generated Script ===');
      console.log(`Title: ${script.title}`);
      console.log(`Sections: ${script.sections.length}`);
      script.sections.forEach((section, i) => {
        console.log(`  ${i + 1}. ${section.title} (${section.duration}s)`);
      });
    })
    .catch((error) => {
      console.error('Error:', error);
      process.exit(1);
    });
}
