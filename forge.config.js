import { MakerSquirrel } from '@electron-forge/maker-squirrel';
import { MakerZIP } from '@electron-forge/maker-zip';
import { MakerDeb } from '@electron-forge/maker-deb';
import { MakerRpm } from '@electron-forge/maker-rpm';
import { VitePlugin } from '@electron-forge/plugin-vite';
import { FusesPlugin } from '@electron-forge/plugin-fuses';
import { FuseV1Options, FuseVersion } from '@electron/fuses';
import dotenv from 'dotenv';
dotenv.config();

const config = {
  packagerConfig: {
    asar: {
      // Binary files won't work in asar, so we need to unpack them
      unpackDir:
        "{.vite/build/lib,}",
    },
    icon: "./assets/icon",
    name: "InterviewCopilot",
    executableName: "InterviewCopilot",
    // extraResource: [
    //   //todo 需要自动获取路径
    //   '/opt/homebrew/opt/libsndfile/lib/libsndfile.1.0.37.dylib',
    //   "/opt/homebrew/opt/sdl2/lib/libSDL2-2.0.0.dylib"
    // ]
  },
  rebuildConfig: {},
  publishers: [],
  makers: [    {
    name: "@electron-forge/maker-dmg",
    config: {
      icon: "./assets/icon.png",
    },
  }, new MakerSquirrel({
    name: "InterviewCopilot",
    setupIcon: "./assets/icon.ico",
  }), new MakerZIP({}, ['darwin'])],
  plugins: [
    new VitePlugin({
      // `build` can specify multiple entry builds, which can be Main process, Preload scripts, Worker process, etc.
      // If you are familiar with Vite configuration, it will look really familiar.
      build: [
        {
          // `entry` is just an alias for `build.lib.entry` in the corresponding file of `config`.
          entry: 'src/main.ts',
          config: 'vite.main.config.ts',
        },
        {
          entry: 'src/preload.ts',
          config: 'vite.preload.config.ts',
        },
      ],
      renderer: [
        {
          name: 'main_window',
          config: 'vite.renderer.config.ts',
        },
      ],
    }),
    {
      name: "@electron-forge/plugin-auto-unpack-natives",
      config: {},
    },
    // Fuses are used to enable/disable various Electron functionality
    // at package time, before code signing the application
    // new FusesPlugin({
    //   version: FuseVersion.V1,
    //   [FuseV1Options.RunAsNode]: false,
    //   [FuseV1Options.EnableCookieEncryption]: true,
    //   [FuseV1Options.EnableNodeOptionsEnvironmentVariable]: false,
    //   [FuseV1Options.EnableNodeCliInspectArguments]: false,
    //   [FuseV1Options.EnableEmbeddedAsarIntegrityValidation]: true,
    //   [FuseV1Options.OnlyLoadAppFromAsar]: true,
    // }),
  ],
};
console.log('GITHUB_TOKEN--------',process.env.GITHUB_TOKEN);

if (process.env.GITHUB_TOKEN) {
  config.publishers = [
    ...config.publishers,
    {
      name: "@electron-forge/publisher-github",
      config: {
        repository: {
          owner: "YutaoChow",
          name: "interview-copilot",
        },
        authToken: process.env.GITHUB_TOKEN,
        generateReleaseNotes: true,
        draft: true,
      },
    },
  ];
}

export default config;
