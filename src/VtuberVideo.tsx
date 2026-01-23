import {
  Audio,
  Img,
  Sequence,
  staticFile,
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  Loop,
} from 'remotion';
import React from 'react';
import {VtuberAvatar} from './vtuber/VtuberAvatar';

interface VideoSection {
  title: string;
  script: string;
  visualType?: string;
  visualContent?: string;
  slideImage?: string;
  audioPath?: string;
  durationFrames: number;
}

interface VtuberVideoConfig {
  title: string;
  sections: VideoSection[];
}

const SectionContent: React.FC<{section: VideoSection}> = ({section}) => {
  const frame = useCurrentFrame();
  const fadeIn = interpolate(frame, [0, 15], [0, 1], {extrapolateRight: 'clamp'});
  const slideIn = interpolate(frame, [0, 20], [50, 0], {extrapolateRight: 'clamp'});

  const slideImage = section.slideImage || section.visualContent;
  const slideNumber = slideImage.match(/slide-(\d+)/)?.[1];
  const slideImagePath = slideNumber ? `slides/slide-${slideNumber}.png` : null;

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
        padding: '25px',
        paddingRight: '680px',
        opacity: fadeIn,
        transform: `translateY(${slideIn}px) scale(1.275)`,
        transformOrigin: 'left center',
      }}
    >
      {slideImagePath ? (
        <Img
          src={staticFile(slideImagePath)}
          style={{
            width: '100%',
            height: 'auto',
            maxHeight: '100%',
            borderRadius: 20,
            boxShadow: '0 20px 60px rgba(0,0,0,0.6)',
            border: '4px solid rgba(255,255,255,0.6)',
            objectFit: 'contain',
            opacity: 0.75,
          }}
        />
      ) : (
        <div
          style={{
            background: 'rgba(255,255,255,0.97)',
            padding: 45,
            borderRadius: 20,
            width: '100%',
            boxShadow: '0 20px 60px rgba(0,0,0,0.6)',
            border: '1px solid rgba(255,255,255,0.5)',
          }}
        >
          <p
            style={{
              fontSize: 24,
              lineHeight: 1.8,
              color: '#2d3748',
              whiteSpace: 'pre-wrap',
            }}
          >
            {section.visualContent}
          </p>
        </div>
      )}
    </div>
  );
};

const SubtitleBar: React.FC<{text: string}> = ({text}) => {
  const frame = useCurrentFrame();
  const slideUp = interpolate(frame, [0, 10], [20, 0], {extrapolateRight: 'clamp'});
  const fadeIn = interpolate(frame, [0, 10], [0, 1], {extrapolateRight: 'clamp'});

  return (
    <div
      style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 140,
        background: 'linear-gradient(to top, rgba(0,0,0,0.95), rgba(0,0,0,0.85))',
        backdropFilter: 'blur(12px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
        padding: '0 720px 0 60px',
        borderTop: '2px solid rgba(255,255,255,0.1)',
        transform: `translateY(${slideUp}px)`,
        opacity: fadeIn,
      }}
    >
      <p
        style={{
          fontSize: 32,
          color: 'white',
          lineHeight: 1.7,
          textShadow: '0 3px 8px rgba(0,0,0,0.9)',
          fontWeight: 500,
        }}
      >
        {text}
      </p>
    </div>
  );
};

const BGM_PATH = 'audio/Nostalgie.mp3';
const BGM_VOLUME = 0.15;
const SLIDE_GAP_FRAMES = 3;

export const VtuberVideo: React.FC<{
  videoConfig: VtuberVideoConfig;
  bgmPath?: string;
}> = ({videoConfig, bgmPath = BGM_PATH}) => {
  let cumulativeFrames = 0;

  return (
    <AbsoluteFill style={{backgroundColor: '#000'}}>
      <Img
        src={staticFile('private-cafe5.jpg')}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'rgba(0, 0, 0, 0.25)',
        }}
      />

      <Audio src={staticFile(bgmPath)} volume={BGM_VOLUME} loop />

      {videoConfig.sections.map((section, index) => {
        const from = cumulativeFrames;
        const duration = section.durationFrames;
        cumulativeFrames += duration;
        if (index < videoConfig.sections.length - 1) {
          cumulativeFrames += SLIDE_GAP_FRAMES;
        }

        return (
          <Sequence key={index} from={from} durationInFrames={duration}>
            <SectionContent section={section} />
            <VtuberAvatar
              audioSrc={section.audioPath}
              isActive={true}
              emotion="normal"
            />
            {section.audioPath && (
              <Audio src={staticFile(section.audioPath)} volume={0.9} />
            )}
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
