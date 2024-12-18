import path from "path";
import react from "@vitejs/plugin-react";
import { viteStaticCopy } from "vite-plugin-static-copy";
import type { ConfigEnv, UserConfig } from "vite";
import { defineConfig } from "vite";
import { pluginExposeRenderer } from "./vite.base.config";

console.log('----renderer config')
// https://vitejs.dev/config
export default defineConfig((env) => {
  const forgeEnv = env as ConfigEnv<"renderer">;
  const { root, mode, forgeConfigSelf } = forgeEnv;
  const name = forgeConfigSelf.name ?? "";

  return {
    root,
    mode,
    base: "./",
    build: {
      outDir: `.vite/renderer/${name}`,
    },
    plugins: [
      pluginExposeRenderer(name),
      react(),
      viteStaticCopy({
        targets: [
          {
            src: "assets/*",
            dest: "assets",
          },
        ],
      }),
    ],
    resolve: {
      preserveSymlinks: true,
      alias: {
        "@": path.resolve(__dirname, "./src"),
        "@renderer": path.resolve(__dirname, "./src/renderer"),
        "@commands": path.resolve(__dirname, "./src/commands"),
      },
    },
    server: {
      proxy: {
        '^(/[\\w-]*)?/auth/api/.*': {
          target: 'https://auth-app-seven-eosin.vercel.app/', // 目标 API 服务器
          // rewrite: (path) => path.replace(/^\/auth/, ''), // 可选：重写路径，去掉 /auth
          // changeOrigin: true, // 修改请求头中的 Origin
        }
      }
    },
    optimizeDeps: {
      // exclude: ["@ffmpeg/ffmpeg", "@ffmpeg/util"],
    },
    clearScreen: false,
  } as UserConfig;
});
