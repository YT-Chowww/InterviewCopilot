import {
  BrowserWindow,
  ipcMain,
  globalShortcut
} from "electron";
import path from "path";
import url from "url";
import whisper from './whisper';
import { systemPreferences } from 'electron';
const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const main = {
  win: null as BrowserWindow | null,
  init: () => {},
};

main.init = () => {
  // ipcMain.handle('ping', () => 'pong');
  whisper.registerIpcHandlers();

  // Create the browser window.
  const mainWindow = main.win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  console.log('MAIN_WINDOW_VITE_DEV_SERVER_URL----', MAIN_WINDOW_VITE_DEV_SERVER_URL);
  

  // 处理打开 GitHub 登录窗口的事件
  ipcMain.handle("open-github-login", (event, url, options) => {
    let githubLoginWindow = new BrowserWindow({
      width: 600,
      height: 800,
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
      },
    });

    // const clientId = "YOUR_CLIENT_ID"; // 替换为您的 GitHub 客户端 ID
    // const redirectUri = "YOUR_REDIRECT_URI"; // 替换为您的重定向 URI
    // const scope = "user"; // 根据需要设置作用域

    // const authUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}`;
    console.log('url-------', url, options);
    
    githubLoginWindow.loadURL(url);

    // 监听窗口关闭事件
    githubLoginWindow.on("closed", () => {
      githubLoginWindow = null;
    });

    // 监听重定向以获取 code
    githubLoginWindow.webContents.on("will-redirect", (cvnt, url) => {
      const urlParams = new URLSearchParams(new URL(url).search);
      const code = urlParams.get("code");
      if (code) {
        // 在这里处理获取到的 code
        event.sender.send("github-login-callback", code)
        console.log("Received code:", code);
        githubLoginWindow.close(); // 关闭登录窗口
      }
    });
  });

  //获取麦克风权限
  ipcMain.handle(
    "system-preferences-media-access",
    async (_event, mediaType: "microphone" | "camera") => {
      if (process.platform === "linux") return true;
      if (process.platform === "win32")
        return systemPreferences.getMediaAccessStatus(mediaType) === "granted";

      if (process.platform === "darwin") {
        const status = systemPreferences.getMediaAccessStatus(mediaType);
        console.debug("system-preferences-media-access", status);
        if (status !== "granted") {
          const result = await systemPreferences.askForMediaAccess(mediaType);
          return result;
        } else {
          return true;
        }
      }
    }
  );

  globalShortcut.register('CommandOrControl+Shift+I', () => {
    mainWindow?.webContents?.openDevTools();
  });

  // and load the index.html of the app.
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
    // Open the DevTools.
    setTimeout(() => {
      mainWindow.webContents.openDevTools();
    }, 100);
  } else {
    mainWindow.loadFile(path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`));
  }

};

export default main;
