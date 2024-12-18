type CopilotAppType = {
    versions: {
        node: () => string
        chrome: () => string
        electron: () => string
        ping: () => Promise<string>
    }
    system: {
      preferences: {
        mediaAccess: (mediaType: "microphone") => Promise<boolean>;
      };
    },
    whisper: {
        transcribe: (
            options?: {
              force?: boolean;
              extra?: string[];
              deviceId: string;
            }
          ) => Promise<Partial<WhisperOutputType>>;
        onData: (callback: (event, data: string) => void) => void;
        removeProgressListeners: () => Promise<void>;
        captureDevice: () => Promise<string>;
    },
    github: {
      login: (url: string) => void;
      onData: (callback: (event, data: string) => void) => void;
    }
}