# VOICEVOX セットアップ手順

## 方法1: 公式版をダウンロード

1. https://voicevox.hiroshiba.jp/ にアクセス
2. Linux版をダウンロード
3. 解凍して実行

```bash
# ダウンロードフォルダで
tar xf voicevox-*.tar.gz
cd voicevox
./run
```

## 方法2: VOICEVOX ENGINE (API) をビルド

```bash
git clone https://github.com/VOICEVOX/voicevox_engine
cd voicevox_engine
python -m pip install -r requirements.txt
python run.py
```

## 方法3: Docker（要インストール）

```bash
docker run -d -p 50021:50021 voicevox/voicevox_engine:cpu-ubuntu20.04-latest
```

## 起動確認

```bash
curl http://127.0.0.1:50021/version
```

## 音声生成実行

VOICEVOXが起動したら：

```bash
npm run generate:video-config
```

音声ファイルが `public/audio/voicevox/` に生成されます。
