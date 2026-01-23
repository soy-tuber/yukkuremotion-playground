import {Composition} from 'remotion';
import {FirstVideoConfig} from '../transcripts/firstvideo';
import {FPS} from './constants';
import {YukkuriVideo} from './YukkuriVideo';
import {VtuberVideo} from './VtuberVideo';
import {loadFont} from './load-fonts';
import {TransitionSpace} from './sozai/TransitionSpace';
import {getTotalVideoFrames} from './utils/getTotalVideoFrames';

let vtuberConfigData: any = null;
try {
  vtuberConfigData = require('../transcripts/video-config.json');
} catch (error) {
  console.warn('video-config.json not found, using default');
}

export const RemotionRoot: React.FC = () => {
  loadFont();

  const vtuberConfig = vtuberConfigData || {title: 'Loading...', sections: []};
  const vtuberDuration = vtuberConfig.sections.reduce(
    (sum: number, s: any) => sum + (s.durationFrames || 0),
    0
  ) || 300;

  return (
    <>
      <Composition
        id="VtuberVideo"
        component={VtuberVideo}
        durationInFrames={vtuberDuration}
        fps={FPS}
        width={1920}
        height={1080}
        defaultProps={{videoConfig: vtuberConfig}}
      />
      <Composition
        id="FirstVideo"
        component={YukkuriVideo}
        durationInFrames={getTotalVideoFrames(FirstVideoConfig)}
        fps={FPS}
        width={1920}
        height={1080}
        defaultProps={{videoConfig: FirstVideoConfig}}
      />
      <Composition
        id="TestEncoding"
        component={YukkuriVideo}
        durationInFrames={FirstVideoConfig.sections[0].totalFrames}
        fps={FPS}
        width={1920}
        height={1080}
        defaultProps={{
          videoConfig: {
            ...FirstVideoConfig,
            sections: [FirstVideoConfig.sections[0]],
          },
        }}
      />
      <Composition
        id="TransitionSpace"
        component={TransitionSpace}
        durationInFrames={180}
        fps={FPS}
        width={1920}
        height={1080}
      />
      <Composition
        id="PreviewVideo"
        component={YukkuriVideo}
        durationInFrames={10 * FPS}
        fps={FPS}
        width={1920}
        height={1080}
        defaultProps={{videoConfig: FirstVideoConfig}}
      />
    </>
  );
};
