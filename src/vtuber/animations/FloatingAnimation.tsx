import {interpolate, useCurrentFrame} from 'remotion';

export const useFloatingAnimation = (amplitude = 5, frequency = 30) => {
  const frame = useCurrentFrame();
  return Math.sin(frame / frequency) * amplitude;
};

export const usePulseAnimation = (minScale = 0.95, maxScale = 1.05, frequency = 60) => {
  const frame = useCurrentFrame();
  return interpolate(
    Math.sin((frame * Math.PI) / frequency),
    [-1, 1],
    [minScale, maxScale]
  );
};

export const useBlinkAnimation = (blinkInterval = 180, blinkDuration = 3) => {
  const frame = useCurrentFrame();
  const blinkFrame = frame % blinkInterval;
  return blinkFrame < blinkDuration;
};

export const useMouthAnimation = (isActive: boolean, intensity = 0.3) => {
  const frame = useCurrentFrame();
  if (!isActive) return 0;
  return Math.abs(Math.sin((frame * Math.PI) / 15)) * intensity;
};
