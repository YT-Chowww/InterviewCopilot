// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';

contextBridge.exposeInMainWorld('__COPILOT_APP__', {
    versions: {
        node: () => process.versions.node,
        chrome: () => process.versions.chrome,
        electron: () => process.versions.electron,
        ping: () => ipcRenderer.invoke('ping')
    },
    system: {
        preferences: {
          mediaAccess: (mediaType: "microphone") => {
            return ipcRenderer.invoke("system-preferences-media-access", mediaType);
          },
        }
    },
    whisper: {
        transcribe: (
            options?: {
              force?: boolean;
              extra?: string[];
              deviceId: string;
            }
          ) => {
            console.log('transcribe starat-------', options);
            
            return ipcRenderer.invoke("whisper-transcribe", options);
        },
        captureDevice: () => {
            return ipcRenderer.invoke("whisper-capture-device");
        },
        onData: (
            callback: (event: IpcRendererEvent, data: string) => void
        ) => ipcRenderer.on("whisper-on-data", callback),
        removeDataListeners: () => {
            ipcRenderer.removeAllListeners("whisper-on-data");
        },
    },
    github: {
        login: (url: string) => {
            console.log('url-------', url);
            return ipcRenderer.invoke("open-github-login", url);
        },
        onData: (
            callback: (event: IpcRendererEvent, data: string) => void
        ) => ipcRenderer.on("github-login-callback", callback),
    }
    // 除函数之外，我们也可以暴露变量
})