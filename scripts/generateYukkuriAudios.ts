import * as fs from 'fs';
import * as path from 'path';
import {v4 as uuidv4} from 'uuid';

import {
  SPEAKER,
  SPEAKER_TYPE,
  VideoConfig,
} from '../src/yukkuri/yukkuriVideoConfig';
import AquesTalk10, {gVoice_F1} from 'node-aquestalk10';
import AqKanji2Koe from 'node-aqkanji2koe';
import {AqKanji2KoeSetDevKey, Aquestalk10DevKey} from './aquest-keys';

const isLinux = process.platform === 'linux';

const resolvePath = (p: string) => path.resolve(process.cwd(), p);

const aquestalkPath = isLinux
  ? resolvePath('vendor/aqtk10_lnx/lib64/libAquesTalk10.so.1.1')
  : resolvePath('vendor/AquesTalk.framework/Versions/A/AquesTalk');

const aquestalk = new AquesTalk10(aquestalkPath);
// キーがある場合のみセットする（評価版はセット不要な場合があるため）
if (Aquestalk10DevKey) {
  aquestalk.AquesTalkSetDevKey(Aquestalk10DevKey);
}

const aqKanji2KoePath = isLinux
  ? resolvePath('vendor/aqk2k_lnx/lib/libAqKanji2Koe.so.4.1')
  : resolvePath('vendor/AqKanji2Koe.framework/Versions/A/AqKanji2Koe');
const aqUsrDicPath = isLinux
  ? resolvePath('vendor/aqk2k_lnx/lib/libAqUsrDic.so.4.1')
  : resolvePath('vendor/AqUsrDic.framework/Versions/A/AqUsrDic');
const aqDicPath = isLinux
  ? resolvePath('vendor/aqk2k_lnx/aq_dic')
  : resolvePath('vendor/aq_dic_large');

console.log('--- Debug Info ---');
console.log('CWD:', process.cwd());
console.log('AqKanji2Koe Path:', aqKanji2KoePath, 'Exists:', fs.existsSync(aqKanji2KoePath));
console.log('AqUsrDic Path:', aqUsrDicPath, 'Exists:', fs.existsSync(aqUsrDicPath));
console.log('AqDic Path:', aqDicPath, 'Exists:', fs.existsSync(aqDicPath));
console.log('------------------');

const aqkanji2koe = new AqKanji2Koe(
  aqKanji2KoePath,
  aqUsrDicPath,
  aqDicPath
);
if (AqKanji2KoeSetDevKey) {
  aqkanji2koe.AqKanji2KoeSetDevKey(AqKanji2KoeSetDevKey);
}

const SPEED = 115;

const ReimuVoice = {
  base: 0, // 声種
  volume: 100, // 音量
  pitch: 95, // 高さ
  accent: 80, // アクセント
  lmd: 110, // 声質
  fsc: 103, // 音程
  speed: SPEED,
};
const MarisaVoice = {...gVoice_F1, base: 0, speed: SPEED, lmd: 130, pitch: 75};

function generateYukkuriAudio(text: string, speaker: SPEAKER_TYPE) {
  const id = uuidv4().replaceAll('-', '');
  const result = aquestalk.AquesTalkSyntheUtf16(
    speaker === SPEAKER.reimu ? ReimuVoice : MarisaVoice,
    text
  );
  const filename = `${id}.wav`;
  fs.writeFileSync(`./public/audio/yukkuri/${filename}`, result);

  return id;
}

export function generateYukkuriAudios(
  videoConfig: VideoConfig,
  forceGenerate: boolean
) {
  // Write Yukkuri Voice Files if exists
  videoConfig.sections.forEach((section) => {
    section.talks.forEach((talk) => {
      if ((forceGenerate || !talk.id) && talk.text.length > 0) {
        const text = aqkanji2koe.AqKanji2KoeConvertUtf8(talk.text);

        if (talk.speaker === SPEAKER.reimuAndMarisa) {
          const reimuTalkId = generateYukkuriAudio(text, 'reimu');
          const marisaTalkId = generateYukkuriAudio(text, 'marisa');

          talk.ids = [reimuTalkId, marisaTalkId];
        } else {
          const id = generateYukkuriAudio(text, talk.speaker);
          talk.id = id;
        }
      }
    });
  });
}
