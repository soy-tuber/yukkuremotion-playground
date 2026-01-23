import {exec} from 'child_process';
import {promisify} from 'util';
import * as path from 'path';
import * as fs from 'fs';

const execAsync = promisify(exec);

export async function convertPdfToImages(
  pdfPath: string,
  outputDir: string
): Promise<string[]> {
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, {recursive: true});
  }

  const outputPattern = path.join(outputDir, 'slide-%d.png');

  try {
    await execAsync(
      `pdftoppm -png -r 150 "${pdfPath}" "${path.join(outputDir, 'slide')}"`
    );

    const files = fs
      .readdirSync(outputDir)
      .filter((f) => f.endsWith('.png'))
      .sort()
      .map((f) => path.join(outputDir, f));

    return files;
  } catch (error) {
    console.error('PDF conversion failed:', error);
    throw error;
  }
}

if (require.main === module) {
  const pdfPath =
    process.argv[2] || '資料/株ミニセミナー：情報の価値と投資を理解する.pdf';
  const outputDir = 'public/slides';

  convertPdfToImages(pdfPath, outputDir)
    .then((files) => {
      console.log(`Converted ${files.length} pages`);
      files.forEach((f, i) => console.log(`  ${i + 1}: ${f}`));
    })
    .catch((error) => {
      console.error('Error:', error);
      process.exit(1);
    });
}
