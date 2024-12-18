
import { useContext, useEffect, useState } from "react";
import { AISettingsProviderContext } from "@/renderer/context";
// import { toast } from "@renderer/components/ui";
import axios from "axios";

  
export const useWhisper = () => {
    const { key, proxy, userProfession } = useContext(AISettingsProviderContext);
    // 是否转译中
    const [isTranscribe, setIsTranscribe] = useState(false);
    //whisper lib传递的原始转译内容
    const [whisperContent, setWhisperContent] = useState('');
    //格式化后的转译内容
    const [transcribeContent, setTranscribeContent] = useState('');
    //ai生成答案
    const [answer, setAnswer] = useState({
      question: '',
      answer: '待生成...'
    });
    const [isLoading, setIsLoading] = useState(false);
    //可选择的输出设备
    const [captureDevice, setCaptureDevice] = useState([]);
    //选中的输出设备
    const [selectedDevice, setSelectedDevice] = useState('');
    // const [isSelectDevice, setIsSelectDevice] = useState(true);
    // const [isConfigSet, setIsConfigSet] = useState(false);
    const [isShowError, setIsShowError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const askForMediaAccess = () => {
      window.__COPILOT_APP__?.system.preferences.mediaAccess("microphone").then((access) => {
        console.log('microphone access-----', access);
        
        if (!access) {
          console.log('noMicrophoneAccess!!!');
        } else {
          console.log('hasMicrophoneAccess!!!');
        }
      });
    };
    function startTranslate() {
      setIsTranscribe(true);
      
      if (selectedDevice === '') {
        setIsShowError(true);
        setErrorMessage('请选择设备');
        return;
      }else {
        setIsShowError(false);
        setErrorMessage('');
      }
      window.__COPILOT_APP__?.whisper.transcribe({
        deviceId: selectedDevice
      });
      window.__COPILOT_APP__?.whisper.onData((event, data) => {
        console.log('onData-----', data);
        setWhisperContent(data);
      })
    }
  
    function endTranslate() {
      setIsTranscribe(false);
    }
  
    async function generateAnswer() {
      if (!key) {
        setIsShowError(true);
        setErrorMessage('请设置OpenAI Key');
        return;
      }
      if (!transcribeContent) {
        return;
      }
      setIsShowError(false);
      setErrorMessage('');
      setIsLoading(true);
      try {
        const api = axios.create({
            baseURL: proxy || 'https://api.openai.com',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${key}`
            },
            timeout: 20000
        });
        const res = await api.post<{ choices: [{ message: { content: string } }] }>('/v1/chat/completions', {
          "model": "gpt-4o-mini", 
          "messages": [
            {
              "role": "system",
              "content": `你是一位经验丰富的${userProfession}面试官。你需要从面试对话中提取技术问题并给出专业的回答。请严格按照以下格式输出:
              问题：[提取的关键技术问题]
              回答：[包含以下要点的详细回答:
              - 核心概念解释
              - 技术原理分析  
              - 实际应用场景
              - 最佳实践建议
              ]`
            },
            {
              "role": "user", 
              "content": `对话内容是：${transcribeContent}`
            }
          ]
        });

        const content = res?.data?.choices[0].message.content;
        
        // 解析返回的内容
        const questionMatch = content.match(/问题：([\s\S]*?)(?=回答：)/);
        const answerMatch = content.match(/回答：([\s\S]*)/);
        
        let parsedAnswer = {
          question: '',
          answer: '内容为空'
        };
        if (questionMatch && answerMatch) {
          parsedAnswer = {
            question: questionMatch[1].trim(),
            answer: answerMatch[1].trim()
          };
        }
        
        setAnswer(parsedAnswer);
      } catch (error) {
        setIsShowError(true);
        setErrorMessage(`生成答案时出错: ${error}`);
        console.error('生成答案时出错:', error);
        // 可以在这里添加错误处理逻辑
      } finally {
        setIsLoading(false);
      }
    }
    async function refineAnswer() {
      setIsLoading(true);
      try {
        const itemToRefine = answer;
        if (!itemToRefine.question) {
          throw new Error('未找到要优化的答案');
        }
        const api = axios.create({
            baseURL: proxy || 'https://api.openai.com',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${key}`
            },
        });
        const res = await api.post<{ choices: [{ message: { content: string } }] }>('/v1/chat/completions', {
          "model": "gpt-4o-mini",
          "messages": [
            {
              "role": "user",
              "content": `你是一位经验丰富的${userProfession}面试者。你需要针对性优化和完善之前给出的技术问题回答，使其更加深入和细节。`
            },
            {
              "role": "user",
              "content": `请基于最新的转译内容，提取关键的技术问题后，：\n\n原问题：${itemToRefine.question}\n\n最新转译内容：\n${transcribeContent}\n\n请提供优化后的回答，包括深入的技术背景和概念解释、技术相关的实际应用案例、最佳实践和可能的扩展知识点。只需要提供进一步的答案`
            }
          ]
        });
  
        const refinedAnswer = res?.data?.choices[0].message.content;

        setAnswer({
          ...answer,
          answer: refinedAnswer
        })
      } catch (error) {
        console.error('优化答案时出错:', error);
        // 可以在这里添加错误处理逻辑，比如显示错误提示
      } finally {
        setIsLoading(false);
      }
    }
  
    function trimText(str?: string) {
      if (!str) {
        return;
      }
      const regex = /\[\d{2}:\d{2}.\d{3} --> \d{2}:\d{2}.\d{3}\]\s+([^\[###]+)/g;
      const results = str.match(regex)
      ?.map(line => line.replace(/\[\d{2}:\d{2}.\d{3} --> \d{2}:\d{2}.\d{3}\]\s+/, '').trim())
      ?.filter(text => !text.startsWith('###')) // 过滤掉以 "###" 开头的行
      ?.join(' ') || '';
      console.log('results-----', results);
      return results
    }
    useEffect(() => {
      askForMediaAccess();
    }, []);
  
    useEffect(() => {
      if (isTranscribe) {
        setTranscribeContent(trimText(whisperContent));
      }
    }, [whisperContent])
    
    useEffect(() => {
      window.__COPILOT_APP__?.whisper.captureDevice().then((data) => {
        //AudioCaptureDevices:{0,BlackHole 2ch},{1,iMac麦克风},
        console.log('captureDevice---', data);
        const devices = Array.from(data.matchAll(/\{(\d+),(.+?)\}/g)).map(match => ({
          id: parseInt(match[1]),
          name: match[2]
        }));
        console.log('devices---', data, devices);
        if (!devices.length) {
          return;
        }
        setCaptureDevice(devices);
        //默认选中blackHole
        const blackHole = devices.filter(item => item.name.includes('BlackHole'))
        if (blackHole.length) {
          setSelectedDevice(`${blackHole[0].id}`);
        }
      })
    }, [])

    return {
        startTranslate,        
        endTranslate,
        isTranscribe,
        transcribeContent,
        selectedDevice,
        setSelectedDevice,
        isLoading,
        captureDevice,
        generateAnswer,
        refineAnswer,
        answer,
        isShowError,
        errorMessage
    }
}