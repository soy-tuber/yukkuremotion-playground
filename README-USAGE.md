# 現代Vtuber風動画生成 - 使い方ガイド

## 完了した実装

✅ VOICEVOX音声生成システム
✅ Live2D風アバターコンポーネント
✅ 現代Vtuber風レイアウト
✅ Gemini 2.0 Flash台本生成
✅ UIアニメーション（フェード、スライド、浮遊、瞬き、口パク）

## クイックスタート

### 1. 台本生成

```bash
npm run generate:script
```

`資料/株ミニセミナー：情報の価値と投資を理解する.pdf` から台本を生成
→ `transcripts/generated-script.json`

### 2. 動画設定生成

```bash
npm run generate:video-config
```

台本から動画設定を生成（音声なし）
→ `transcripts/video-config.json`

### 3. プレビュー

```bash
npm start
```

http://localhost:3000 で `VtuberVideo` を選択

### 4. レンダリング

```bash
npm run build:vtuber
```

→ `out/vtuber-video.mp4`

## 現在の状態

- **台本**: ✅ 生成済み（12セクション、450秒）
- **音声**: ⚠️ VOICEVOXなしで実行（音声なし）
- **動画**: ✅ プレビュー可能

## 音声を追加する場合

### VOICEVOXセットアップ

```bash
# Dockerで起動
docker run -d -p 50021:50021 voicevox/voicevox_engine:cpu-ubuntu20.04-latest

# または公式サイトからダウンロード
# https://voicevox.hiroshiba.jp/
```

### 音声付き動画設定を再生成

```bash
npm run generate:video-config
```

VOICEVOXが起動していれば自動で音声生成されます。

## 生成された動画の特徴

- **タイトル**: 【情報強者は勝ち組！】投資で損しないための情報の見抜き方
- **セクション数**: 12
- **総再生時間**: 約7分30秒
- **スタイル**: 現代Vtuber風（右下小アバター、中央コンテンツ、下部字幕）
- **アニメーション**: 
  - アバター浮遊
  - 瞬きアニメーション
  - 口パク（音声連動）
  - コンテンツフェードイン
  - 字幕スライドアップ

## カスタマイズ

### 別のPDFを使う

```bash
npm run generate:script -- path/to/your.pdf
```

### 音声パラメータ変更

`scripts/voicevoxConfig.ts` を編集

### レイアウト変更

`src/VtuberVideo.tsx` を編集

### アバターデザイン変更

`src/vtuber/VtuberAvatar.tsx` を編集
