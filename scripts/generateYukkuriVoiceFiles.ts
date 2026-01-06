import * as fs from 'fs';
import fsExtra from 'fs-extra';

import {VideoConfig} from '../src/yukkuri/yukkuriVideoConfig';
import {generateYukkuriAudios} from './generateYukkuriAudios';
import {addAudioDurations} from './addAudioDurations';
import {generateFromFramesMap} from './generateFromFramesMap';
import {generateFaceFrameMap} from './generateFaceFrameMap';
import {generateMouthFrameMap} from './generateMouthFrameMap';

const forceGenerate = process.argv[2] === 'force';

if (forceGenerate) {
  fsExtra.emptyDirSync('./public/audio/yukkuri');
}

const jsonPath = './transcripts/nintendo.json';
const rawData = fs.readFileSync(jsonPath, 'utf-8');
let videoConfig: any = JSON.parse(rawData);

// Convert data3.json format (scenes) to VideoConfig format (sections) if needed, or update existing sections with scene data
if (videoConfig.scenes) {
  console.log('Updating sections from scenes...');
  videoConfig.sections = videoConfig.scenes.map((scene: any, index: number) => {
    const existingSection = videoConfig.sections ? videoConfig.sections[index] : null;
    const existingTalk = existingSection?.talks?.[0];

    return {
      title: scene.title,
      talks: [
        {
          ...(existingTalk || {}),
          text: scene.script || existingTalk?.text || '...',
          speaker: existingTalk?.speaker || (index % 2 === 0 ? 'reimu' : 'marisa'), // Alternate speakers if new
          type: scene.type,
          title: scene.title,
          content: scene.content,
        },
      ],
      totalFrames: existingSection?.totalFrames || 0,
      fromFramesMap: existingSection?.fromFramesMap || {},
      beforeMovieFrames: existingSection?.beforeMovieFrames,
    };
  });
}

generateYukkuriAudios(videoConfig, forceGenerate);

(async () => {
  await addAudioDurations(videoConfig);
  await generateFromFramesMap(videoConfig);

  // Write back to JSON to save IDs and durations
  fs.writeFileSync(jsonPath, JSON.stringify(videoConfig, null, 2));

  // Also generate the TSX file for the app to consume
  fs.writeFileSync(
    `./transcripts/firstvideo.tsx`,
    `import {VideoConfig} from '../src/yukkuri/yukkuriVideoConfig';

export const FirstVideoConfig: VideoConfig = ${JSON.stringify(videoConfig)}
        `
  );

  generateFaceFrameMap(videoConfig);
  generateMouthFrameMap(videoConfig);
})();
