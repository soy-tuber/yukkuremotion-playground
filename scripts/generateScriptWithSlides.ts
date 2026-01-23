import {GoogleGenerativeAI} from '@google/generative-ai';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';
import {parsePdf} from './pdfParser';

dotenv.config();

const apiKey =
  process.env.GEMINI_API_KEY || process.env.GOOGLE_GENAI_API_KEY;

if (!apiKey) {
  throw new Error('GEMINI_API_KEY or GOOGLE_GENAI_API_KEY is required');
}

const genAI = new GoogleGenerativeAI(apiKey);

export interface ScriptSectionWithSlide {
  title: string;
  script: string;
  slideImage: string;
  duration: number;
}

export interface GeneratedScriptWithSlides {
  title: string;
  sections: ScriptSectionWithSlide[];
}

const PROMPT = `
あなたは人気Vtuberの台本ライターです。視聴者を飽きさせない、エンターテインメント性の高い解説動画の台本を作成してください。

【キャラクター設定】
- 知的でクールだけど、時々お茶目な一面を見せる女性Vtuber
- 投資や経済に詳しく、複雑なことを分かりやすく説明するのが得意
- 視聴者との距離感が近く、フレンドリー

【台本作成の要件】
1. **導入で視聴者を引きつける**: 興味深い問いかけや意外な事実から始める
2. **具体的なエピソードや例え話を多用**: 抽象的な説明だけでなく、身近な例で理解を助ける
3. **感情を込める**: 「これ、めっちゃ大事なんですよ！」「ここ、ちょっと怖い話なんですけど...」など
4. **視聴者への語りかけ**: 「皆さんはどう思います？」「ここまで大丈夫ですか？」
5. **適度なユーモア**: 真面目な話の中にも軽いジョークや自虐ネタを挟む
6. **各セクションの台本は最低150文字以上**: 内容を十分に膨らませる

【スライド割り当てルール - 重要】
- PDFは8ページあります（slide-1.png 〜 slide-8.png）
- 必ず全てのスライドを使用すること（slide-1.png から slide-8.png まで）
- 各スライドに対して1セクションを基本とする
- スライドの順番通りにセクションを作成すること

【重要】
- 1つのセクションにつき、60-90秒程度の台本を作成すること（150-250文字程度）
- 「〜ですね」「〜ます」だけでなく、「〜なんですよ」「〜じゃないですか」など口語的な表現を使う
- 文章を短く切りすぎず、流れるような語りを意識する

出力形式（JSON）：
{
  "title": "動画タイトル（キャッチーなもの）",
  "sections": [
    {
      "title": "セクションタイトル",
      "script": "実際に話す内容（最低150文字以上）",
      "slideImage": "slide-1.png",
      "duration": 推定秒数（60-90秒程度）
    }
  ]
}

PDFの内容：
{pdfContent}

上記のキャラクター設定と要件に沿って、魅力的な台本を作成してください。各セクションの台本は必ず150文字以上確保してください。
`;

export async function generateScriptWithSlides(
  pdfPath: string
): Promise<GeneratedScriptWithSlides> {
  console.log(`Parsing PDF: ${pdfPath}`);
  const pdfContent = await parsePdf(pdfPath);

  console.log(`PDF parsed: ${pdfContent.numpages} pages`);
  console.log('Generating script with Gemini 2.5 Pro (gemini-2.5-pro)...');

  const model = genAI.getGenerativeModel({model: 'gemini-2.5-pro'});

  const prompt = PROMPT.replace('{pdfContent}', pdfContent.text);

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();

  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error('Failed to parse JSON from Gemini response');
  }

  const script: GeneratedScriptWithSlides = JSON.parse(jsonMatch[0]);

  const outputPath = path.join(
    process.cwd(),
    'transcripts',
    'generated-script-with-slides.json'
  );
  fs.writeFileSync(outputPath, JSON.stringify(script, null, 2));

  console.log(`Script generated: ${outputPath}`);
  return script;
}

if (require.main === module) {
  const pdfPath =
    process.argv[2] || '資料/株ミニセミナー：情報の価値と投資を理解する.pdf';

  generateScriptWithSlides(pdfPath)
    .then((script) => {
      console.log('\n=== Generated Script ===');
      console.log(`Title: ${script.title}`);
      console.log(`Sections: ${script.sections.length}`);
      script.sections.forEach((section, i) => {
        console.log(
          `  ${i + 1}. ${section.title} (${section.duration}s) - ${section.slideImage}`
        );
      });
    })
    .catch((error) => {
      console.error('Error:', error);
      process.exit(1);
    });
}
