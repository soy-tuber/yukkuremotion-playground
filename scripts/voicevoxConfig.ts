export const VOICEVOX_SPEAKERS = {
  kurono: 11,
  ritu: 9,
  ritu_queen: 65, // 波音リツ クイーン - ハスキー目な女性の声
  tsumugi: 8,
  zundamon: 3,
  metan_sexy: 4, // 四国めたん セクシー
  sora_sexy: 17, // 九州そら セクシー
} as const;

export type VoicevoxSpeaker = keyof typeof VOICEVOX_SPEAKERS;

export interface VoicevoxParams {
  speaker: VoicevoxSpeaker;
  speed: number;
  pitch: number;
  intonation: number;
  volume: number;
}

export const DEFAULT_VOICE_PARAMS: VoicevoxParams = {
  speaker: 'tsumugi',
  speed: 1.08,
  pitch: 0.0,
  intonation: 1.0,
  volume: 1.0,
};
