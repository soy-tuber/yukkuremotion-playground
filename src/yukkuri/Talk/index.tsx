import {Audio, Img, OffthreadVideo, Sequence, staticFile} from 'remotion';
import {CustomObjects} from '../../../transcripts/CustomObjects';
import {SUBTITLE_HEIGHT_PX, TALK_GAP_FRAMES} from '../../constants';
import {SubtitleWithBackground} from '../../Subtitle/SubtitleBackground';
import {VoiceConfig} from '../yukkuriVideoConfig';

export type TalkProps = {
  voiceConfig: VoiceConfig;
  from?: number;
  meta: {
    talks: VoiceConfig[];
    index: number;
  };
};

const getDurationInFrames = (voiceConfig: VoiceConfig) =>
  voiceConfig.customDuration ||
  voiceConfig.audioDurationFrames + TALK_GAP_FRAMES;

const getBackgroundVideoDuration = (
  currentTalk: VoiceConfig,
  talks: VoiceConfig[],
  index: number
) => {
  const video = currentTalk.backgroundVideo;

  if (!video) {
    return 0;
  }

  let duration = getDurationInFrames(currentTalk);

  if (video.extendTalksCount) {
    for (let i = 1; i <= video.extendTalksCount; i++) {
      duration += getDurationInFrames(talks[index + i]);
    }
  }
  return duration;
};

export const Talk: React.FC<TalkProps> = ({voiceConfig, from, meta}) => {
  const hasAudio = Boolean(voiceConfig.id) || Boolean(voiceConfig.ids);

  const CustomObject = voiceConfig.customObjectKey
    ? CustomObjects[voiceConfig.customObjectKey]
    : null;

  const durationInFrames = getDurationInFrames(voiceConfig);
  const showSubtitle = !voiceConfig.title && !voiceConfig.content;

  return (
    <>
      <Sequence durationInFrames={durationInFrames} from={from}>
        {showSubtitle && (
          <SubtitleWithBackground
            subtitle={voiceConfig.textForDisplay || voiceConfig.text}
            speaker={voiceConfig.speaker}
          />
        )}
        {hasAudio &&
          (voiceConfig.ids && voiceConfig.ids.length > 0 ? (
            voiceConfig.ids.map((id) => {
              return (
                <Audio key={id} src={staticFile(`audio/yukkuri/${id}.wav`)} />
              );
            })
          ) : (
            <Audio src={staticFile(`audio/yukkuri/${voiceConfig.id}.wav`)} />
          ))}
      </Sequence>

      {voiceConfig.image && (
        <Sequence
          durationInFrames={durationInFrames}
          from={(from || 0) + (voiceConfig.image.from || 0)}
        >
          <div
            style={{
              ...imagePosition,
              backgroundColor: voiceConfig.image.backgroundColor,
            }}
          >
            <Img src={staticFile(voiceConfig.image.src)} style={imageStyle} />
          </div>
        </Sequence>
      )}

      {voiceConfig.audio && (
        <Sequence
          durationInFrames={durationInFrames}
          from={(from || 0) + (voiceConfig.audio.from || 0)}
        >
          <Audio
            src={staticFile(voiceConfig.audio.src)}
            // eslint-disable-next-line
            volume={voiceConfig.audio.volume || 1}
          />
        </Sequence>
      )}

      {voiceConfig.backgroundVideo && (
        <Sequence
          durationInFrames={getBackgroundVideoDuration(
            voiceConfig,
            meta.talks,
            meta.index
          )}
          from={(from || 0) + (voiceConfig.backgroundVideo.from || 0)}
        >
          <div
            style={{
              ...imagePosition,
              backgroundColor: voiceConfig.backgroundVideo.backgroundColor,
            }}
          >
            <OffthreadVideo
              muted
              src={staticFile(voiceConfig.backgroundVideo.src)}
              style={{maxHeight: '100%'}}
            />
          </div>
        </Sequence>
      )}

      {(voiceConfig.title || voiceConfig.content) && (
        <Sequence durationInFrames={durationInFrames} from={from || 0}>
          <div className="absolute inset-0 z-[100] flex flex-row items-center font-sans">
            
            {/* Left Side: Avatar */}
            <div className="w-[35%] h-full flex items-center justify-center pl-8 pr-4">
               <Img 
                  src={staticFile('cat_avatar.png')}
                  className="w-full max-h-[70%] object-contain drop-shadow-2xl"
               />
            </div>

            {/* Right Side: Content Card */}
            <div className="w-[65%] h-full relative">
              <div className="absolute top-[60px] bottom-[60px] left-0 right-[40px] flex flex-col bg-white rounded-[32px] shadow-2xl border-4 border-blue-500 overflow-hidden">
                
                {/* Title Area */}
                {voiceConfig.title && (
                  <div className="flex-none px-10 py-6 border-b-2 border-gray-100 bg-white/90 backdrop-blur-sm">
                    {voiceConfig.type === 'TITLE' ? (
                      <h1 className="text-5xl font-black text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500 py-2 drop-shadow-sm">
                        {voiceConfig.title}
                      </h1>
                    ) : (
                      <h2 className="text-[36px] font-bold text-gray-800 border-l-[10px] border-blue-500 pl-6 leading-tight">
                        {voiceConfig.title}
                      </h2>
                    )}
                  </div>
                )}

                {/* Content Area */}
                {voiceConfig.content && (
                  <div className="flex-1 p-8 overflow-y-auto flex flex-col justify-center bg-gradient-to-b from-white to-gray-50/50">
                    {voiceConfig.type === 'CODE' ? (
                      <div className="w-full h-full flex flex-col">
                        {/* Mac Window Header */}
                        <div className="flex items-center gap-2 mb-0 px-4 py-3 bg-[#2D2D2D] rounded-t-xl border-b border-gray-700">
                      <div className="w-3.5 h-3.5 rounded-full bg-[#FF5F56] shadow-sm transform hover:scale-110 transition-transform" />
                      <div className="w-3.5 h-3.5 rounded-full bg-[#FFBD2E] shadow-sm transform hover:scale-110 transition-transform" />
                      <div className="w-3.5 h-3.5 rounded-full bg-[#27C93F] shadow-sm transform hover:scale-110 transition-transform" />
                      <div className="ml-4 text-xs text-gray-400 font-mono opacity-60">code.ts</div>
                    </div>
                    {/* Code Body */}
                    <pre 
                      className="flex-1 bg-[#1E1E1E] text-white p-8 rounded-b-xl font-mono text-2xl leading-relaxed overflow-auto shadow-inner custom-scrollbar"
                      style={{ color: '#ffffff' }}
                    >
                      {voiceConfig.content}
                    </pre>
                  </div>
                ) : (
                  /* Explanation Text */
                  <div className="text-[38px] leading-[1.8] text-gray-700 font-medium whitespace-pre-wrap tracking-wide">
                    {voiceConfig.content}
                  </div>
                )}
              </div>
            )}
              </div>
            </div>
          </div>
        </Sequence>
      )}

      {CustomObject && (
        <Sequence durationInFrames={durationInFrames} from={from || 0}>
          <CustomObject />
        </Sequence>
      )}
    </>
  );
};

const VERTICAL_PADDING_PX = 40;
const HORIZONTAL_PADDING_PX = 320;

const imagePosition: React.CSSProperties = {
  position: 'absolute',
  height: `calc(100% - ${SUBTITLE_HEIGHT_PX}px - ${VERTICAL_PADDING_PX * 2}px)`,
  top: VERTICAL_PADDING_PX,
  left: HORIZONTAL_PADDING_PX,
  width: `calc(100% - ${HORIZONTAL_PADDING_PX * 2}px)`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const imageStyle: React.CSSProperties = {
  objectFit: 'contain',
  padding: '40px',
  width: '100%',
  height: '100%',
};


