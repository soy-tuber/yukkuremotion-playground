// All configuration options: https://remotion.dev/docs/config
// Each option also is available as a CLI flag: https://remotion.dev/docs/cli
// ! The configuration file does only apply if you render via the CLI !

import {Config} from 'remotion';

Config.Rendering.setImageFormat('jpeg');
Config.Output.setOverwriteOutput(true);


Config.Bundling.overrideWebpackConfig((currentConfiguration) => {
  const rules = currentConfiguration.module?.rules ?? [];
  const newRules = rules.filter((rule) => {
    // Filter out existing css rule to avoid double-processing
    if (rule && typeof rule === 'object' && rule.test && rule.test.toString().includes('.css')) {
      return false;
    }
    return true;
  });

  return {
    ...currentConfiguration,
    module: {
      ...currentConfiguration.module,
      rules: [
        ...newRules,
        {
          test: /\.css$/i,
          use: [
            'style-loader',
            'css-loader',
            'postcss-loader',
          ],
        },
      ],
    },
  };
});

