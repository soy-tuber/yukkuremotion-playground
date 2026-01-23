import React from 'react';
import {
  spring,
  useCurrentFrame,
  useVideoConfig,
  Audio,
  staticFile,
  Img,
  interpolate,
} from 'remotion';
import {
  useFloatingAnimation,
  useBlinkAnimation,
  useMouthAnimation,
  usePulseAnimation,
} from './animations/FloatingAnimation';

interface VtuberAvatarProps {
  audioSrc?: string;
  isActive: boolean;
  emotion?: 'normal' | 'happy' | 'surprised';
}

export const VtuberAvatar: React.FC<VtuberAvatarProps> = ({
  audioSrc,
  isActive,
  emotion = 'normal',
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const floatAnimation = useFloatingAnimation(8, 40);
  const mouthOpenness = useMouthAnimation(isActive, 0.15);
  const pulseScale = usePulseAnimation(0.98, 1.02, 60);

  const scale = isActive
    ? spring({
        frame: frame % 60,
        fps,
        config: {
          damping: 10,
          stiffness: 100,
        },
      })
    : 1;

  const avatarHeight = 950;
  const glowIntensity = isActive ? 20 : 10;

  const breathScale = 1 + Math.sin(frame / 60) * 0.01;

  return (
    <div
      style={{
        position: 'absolute',
        right: 10,
        bottom: 0,
        height: avatarHeight,
        transform: `translateY(${floatAnimation}px) scale(${breathScale})`,
        zIndex: 100,
        filter: `drop-shadow(0 ${glowIntensity}px ${glowIntensity * 2}px rgba(102, 126, 234, 0.3))`,
      }}
    >
      {audioSrc && <Audio src={staticFile(audioSrc)} />}

      <div style={{position: 'relative', height: '100%'}}>
        <Img
          src={staticFile('vtuber/catears_boy2.png')}
          style={{
            height: '100%',
            width: 'auto',
            objectFit: 'contain',
            objectPosition: 'bottom',
          }}
        />

        {isActive && (
          <>
            <div
              style={{
                position: 'absolute',
                top: -15,
                right: -15,
                width: 28,
                height: 28,
                background: '#ff4444',
                borderRadius: '50%',
                border: '3px solid white',
                boxShadow: '0 2px 8px rgba(255,68,68,0.5)',
              }}
            />
            <div
              style={{
                position: 'absolute',
                top: -15,
                right: -15,
                width: 28,
                height: 28,
                background: '#ff4444',
                borderRadius: '50%',
                opacity: 0.5,
                transform: `scale(${pulseScale})`,
              }}
            />
          </>
        )}
      </div>

      {isActive && (
        <>
          <div
            style={{
              position: 'absolute',
              top: -10,
              right: -10,
              width: 24,
              height: 24,
              background: '#ff4444',
              borderRadius: '50%',
              border: '3px solid white',
              boxShadow: '0 2px 8px rgba(255,68,68,0.5)',
            }}
          />
          <div
            style={{
              position: 'absolute',
              top: -10,
              right: -10,
              width: 24,
              height: 24,
              background: '#ff4444',
              borderRadius: '50%',
              opacity: 0.5,
              transform: `scale(${pulseScale})`,
            }}
          />
        </>
      )}
    </div>
  );
};
