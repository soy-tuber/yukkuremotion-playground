# 現代Vtuber風動画生成システム

## セットアップ

### 1. 依存パッケージのインストール

```bash
npm install
```

### 2. 環境変数の設定

`.env`ファイルを作成：

```bash
cp .env.example .env
```

以下の環境変数を設定：

```
GEMINI_API_KEY=your_api_key
VOICEVOX_API_URL=http://127.0.0.1:50021
```

### 3. VOICEVOXのセットアップ

VOICEVOXをローカルで起動：

```bash
docker run -d -p 50021:50021 voicevox/voicevox_engine:cpu-ubuntu20.04-latest
```

または公式サイトからダウンロード：
https://voicevox.hiroshiba.jp/

## 使い方

### 1. PDF→台本生成

```bash
npm run generate:script
```

デフォルトで`資料/株ミニセミナー：情報の価値と投資を理解する.pdf`を処理します。

### 2. 台本→動画設定+音声生成

```bash
npm run generate:video-config
```

VOICEVOX APIを使用して音声ファイルを生成し、`transcripts/video-config.json`を作成します。

### 3. プレビュー

```bash
npm start
```

ブラウザで開き、`VtuberVideo`コンポジションを選択。

### 4. 動画レンダリング

```bash
npx remotion render VtuberVideo out/vtuber-video.mp4
```

## ファイル構成

```
scripts/
  ├── generateScriptFromPdf.ts      # PDF→台本生成
  ├── convertScriptToVideoConfig.ts # 台本→動画設定+音声
  ├── generateVoicevoxAudio.ts      # VOICEVOX音声生成
  ├── voicevoxConfig.ts             # 音声パラメータ設定
  ├── pdfParser.ts                  # PDF解析
  └── llmPrompts.ts                 # Geminiプロンプト

src/
  ├── VtuberVideo.tsx               # メイン動画コンポーネント
  └── vtuber/
      └── VtuberAvatar.tsx          # アバターコンポーネント

transcripts/
  ├── generated-script.json         # 生成された台本
  └── video-config.json             # 動画設定（音声パス含む）

public/audio/voicevox/              # 生成された音声ファイル
```

## カスタマイズ

### 音声パラメータ変更

`scripts/voicevoxConfig.ts`で話者や速度を変更：

```typescript
export const DEFAULT_VOICE_PARAMS = {
  speaker: 'zundamon',  // zundamon, metan, tsumugi, haou
  speed: 1.1,
  pitch: 0.0,
  intonation: 1.0,
  volume: 1.0,
};
```

### アバターデザイン変更

`src/vtuber/VtuberAvatar.tsx`でスタイルをカスタマイズ。

### レイアウト変更

`src/VtuberVideo.tsx`でレイアウトを調整。
