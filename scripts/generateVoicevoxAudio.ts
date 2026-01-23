import axios from 'axios';
import * as fs from 'fs';
import * as path from 'path';
import {v4 as uuidv4} from 'uuid';
import {
  VOICEVOX_SPEAKERS,
  VoicevoxParams,
  DEFAULT_VOICE_PARAMS,
} from './voicevoxConfig';

const VOICEVOX_URL =
  process.env.VOICEVOX_API_URL || 'http://127.0.0.1:50021';

export async function generateVoicevoxAudio(
  text: string,
  params: Partial<VoicevoxParams> = {}
): Promise<string> {
  const voiceParams = {...DEFAULT_VOICE_PARAMS, ...params};
  const speakerId = VOICEVOX_SPEAKERS[voiceParams.speaker];

  try {
    const queryResponse = await axios.post(
      `${VOICEVOX_URL}/audio_query`,
      {},
      {
        params: {
          text,
          speaker: speakerId,
        },
      }
    );

    const query = queryResponse.data;
    query.speedScale = voiceParams.speed;
    query.pitchScale = voiceParams.pitch;
    query.intonationScale = voiceParams.intonation;
    query.volumeScale = voiceParams.volume;
    query.prePhonemeLength = 0.05;
    query.postPhonemeLength = 0.05;
    query.pauseLength = 0.3;
    query.pauseLengthScale = 1.0;

    const synthesisResponse = await axios.post(
      `${VOICEVOX_URL}/synthesis`,
      query,
      {
        params: {speaker: speakerId},
        responseType: 'arraybuffer',
      }
    );

    const id = uuidv4().replaceAll('-', '');
    const filename = `${id}.wav`;
    const outputDir = path.join(process.cwd(), 'public', 'audio', 'voicevox');

    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, {recursive: true});
    }

    fs.writeFileSync(path.join(outputDir, filename), synthesisResponse.data);

    return id;
  } catch (error) {
    console.error('VOICEVOX API Error:', error);
    throw error;
  }
}

export async function checkVoicevoxConnection(): Promise<boolean> {
  try {
    await axios.get(`${VOICEVOX_URL}/version`);
    return true;
  } catch {
    return false;
  }
}
