import * as fs from 'fs';
import * as path from 'path';
import {GeneratedScript} from './generateScriptFromPdf';
import {GeneratedScriptWithSlides} from './generateScriptWithSlides';
import {generateVoicevoxAudio, checkVoicevoxConnection} from './generateVoicevoxAudio';
import {getAudioDurationInSeconds} from 'get-audio-duration';

export async function convertScriptToVideoConfig(
  scriptPath: string,
  fps: number = 5
) {
  const scriptData = JSON.parse(fs.readFileSync(scriptPath, 'utf-8'));
  const script: GeneratedScript | GeneratedScriptWithSlides = scriptData;

  const isVoicevoxAvailable = await checkVoicevoxConnection();
  
  if (!isVoicevoxAvailable) {
    console.warn('VOICEVOX is not available. Audio generation will be skipped.');
  }

  const sections = [];

  for (const section of script.sections) {
    let audioPath: string | undefined;
    let durationFrames = Math.ceil(section.duration * fps);

    if (isVoicevoxAvailable) {
      try {
        const audioId = await generateVoicevoxAudio(section.script, {
          speaker: 'tsumugi',
          speed: 1.08,
        });
        
        audioPath = `audio/voicevox/${audioId}.wav`;
        
        const audioFilePath = path.join(process.cwd(), 'public', audioPath);
        const audioDuration = await getAudioDurationInSeconds(audioFilePath);
        durationFrames = Math.ceil(audioDuration * fps);
        
        console.log(`Generated audio for: ${section.title} (${audioDuration.toFixed(2)}s)`);
      } catch (error) {
        console.error(`Failed to generate audio for section: ${section.title}`, error);
      }
    }

    sections.push({
      ...section,
      audioPath,
      durationFrames,
    });
  }

  const videoConfig = {
    title: script.title,
    sections,
  };

  const outputPath = path.join(
    process.cwd(),
    'transcripts',
    'video-config.json'
  );
  
  fs.writeFileSync(outputPath, JSON.stringify(videoConfig, null, 2));
  
  console.log(`\nVideo config generated: ${outputPath}`);
  console.log(`Total sections: ${sections.length}`);
  console.log(`Total duration: ${(sections.reduce((sum, s) => sum + s.durationFrames, 0) / fps).toFixed(2)}s`);
  
  return videoConfig;
}

if (require.main === module) {
  const scriptPath =
    process.argv[2] ||
    path.join(process.cwd(), 'transcripts', 'generated-script-with-slides.json');

  convertScriptToVideoConfig(scriptPath)
    .then(() => {
      console.log('\nConversion completed successfully!');
    })
    .catch((error) => {
      console.error('Error:', error);
      process.exit(1);
    });
}
