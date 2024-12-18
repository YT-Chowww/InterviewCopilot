import { ipcMain } from "electron";
import path from "path";
import url from "url";
import { spawn } from "child_process";
import { PROCESS_TIMEOUT } from "@/constants";
import { error } from "console";

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path
  .dirname(__filename)
  .replace("app.asar", "app.asar.unpacked");
let commandProcess: any;
class Whisper {
    // private command: any;
    libraryPath: string;
    binPath: string;
    modelPath: string;

    constructor () {
      this.libraryPath = path.join(__dirname, 'lib', 'whisper');
      this.binPath = path.join(__dirname, 'lib', 'whisper');
      this.modelPath = path.join(__dirname, 'lib', 'whisper', 'models', 'ggml-base.bin');
    }

    async transcribe(options?: {
        force?: boolean;
        extra?: string[];
        deviceId: string;
        onData?: (data: string) => void;
      }) {
        
        const commandArguments = [
            // 模型路径
            "--model",
            this.modelPath,
            // 步长
            "--step",
            "0",
            // 音频长度
            "--length",
            "60000",
            // 阈值
            "-vth",
            "0.8",
            //使用哪个设备端口
            "-c",
            options.deviceId,
            // 语言
            "--language",
            "zh",
            // 初始提示
            "--initial-prompt",
            "以下是中文简体内容,请使用中文简体",
          ];
        console.log('commandArguments-----', commandArguments);
        // options.onData('whisper生成的转译数据');
        if (!commandProcess) {
          commandProcess = spawn(path.join(this.binPath, 'stream'), commandArguments, {
            timeout: PROCESS_TIMEOUT,
            env: {
              ...process.env,
              DYLD_LIBRARY_PATH: this.libraryPath,
            },
          }); 
        }
      
        return new Promise((resolve, reject) => {
          commandProcess.stdout.on("data", (data: string) => {
              console.log(`stdout:------ ${data.toString()}`);
              options.onData(data.toString());
              // options.onData(`### Transcription 1 START | t0 = 0 ms | t1 = 9527 ms

              // [00:00.000 --> 00:09.040]   and I fell Americans. Ask not what your country can do for you. Ask what you can do for your country.

              // ### Transcription 1 END`);
              // ### Transcription 1 START | t0 = 0 ms | t1 = 9527 ms

              // [00:00.000 --> 00:09.040]   and I fell Americans. Ask not what your country can do for you. Ask what you can do for your country.

              // ### Transcription 1 END

              // stdout: 


              // ### Transcription 2 START | t0 = 0 ms | t1 = 11598 ms

              // [00:00.000 --> 00:10.000]   and I fell Americans. Ask not what your country can do for you. Ask what you can do for your country.
              // [00:10.000 --> 00:12.036]   [No audio]

              // ### Transcription 2 END
          });
    
          commandProcess.stderr.on("data", (data: string) => {
            const output = data.toString();
            console.log(`stderr: ${output}`);
            options.onData(`stderr: ${output}`);
            reject(output);
          //   if (output.startsWith("whisper_print_progress_callback")) {
          //     const progress = parseInt(output.match(/\d+%/)?.[0] || "0");
          //     if (typeof progress === "number") onProgress(progress);
          //   }
          });
    
          commandProcess.on("exit", (code: number) => {
            options.onData(`transcribe process exited with code ${code}`);
            console.log(`transcribe process exited with code ${code}`);
            reject(new Error(`transcribe process exited with code ${code}`));
          });
    
          commandProcess.on("error", (err: any) => {
              console.log("transcribe error", err.message);
              options.onData(err);
              reject(err);
          });
    
          commandProcess.on("close", () => {
              console.log("transcribe close");
              options.onData('关闭应用');
              resolve('transcribe close')
              // reject(new Error("Transcription failed"));
          //   if (fs.pathExistsSync(outputFile)) {
          //     resolve(fs.readJson(outputFile));
          //   } else {
          //     reject(new Error("Transcription failed"));
          //   }
          });
        });
    }

    async captureDevice() {
      console.log('path----', this.binPath, this.libraryPath);
      const command = spawn(path.join(this.binPath, 'capture'), [], {
        timeout: PROCESS_TIMEOUT,
        env: {
          ...process.env,
          DYLD_LIBRARY_PATH: this.libraryPath,
        },
      });
      return new Promise((resolve, reject) => {
        command.stdout.on("data", (data) => {
          console.log(`stdout:------ ${data.toString()}`);
          resolve(data.toString());
        });
        command.stderr.on("data", (err) => {
          console.log(`stderr: ${err}`);
          reject(err);
        //   if (output.startsWith("whisper_print_progress_callback")) {
        //     const progress = parseInt(output.match(/\d+%/)?.[0] || "0");
        //     if (typeof progress === "number") onProgress(progress);
        //   }
        });
        command.on("error", (err) => {
          console.log("captureDevice error", err.message);
          reject(err);
      });
      });
    }

    registerIpcHandlers() {
      ipcMain.handle("whisper-transcribe", async (event, params, options) => {        
          try {
            return await this.transcribe({
              ...options,
              ...params,
              onData: (data) => {
                event.sender.send("whisper-on-data", data);
              },
            });
          } catch (err) {
              event.sender.send("whisper-on-data", err);
              console.log('err', err);
              return err;
              
          //   event.sender.send("on-notification", {
          //     type: "error",
          //     message: err.message,
          //   });
          }
      });
      ipcMain.handle("whisper-capture-device", async (event, params, options) => {
        try {
          return await this.captureDevice();
        } catch (err) {
          console.log('err', err); 
          return err;
        }
      });
    }
}


export default new Whisper();