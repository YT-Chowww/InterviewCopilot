import { useContext } from 'react';

import * as ScrollArea from '@radix-ui/react-scroll-area';
import { Button, Input } from '@renderer/components/ui';
// import { ThemeProvider } from 'next-themes';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@renderer/components/ui/select';
import { Alert, AlertTitle, AlertDescription } from '@renderer/components/ui/alert';
import { useWhisper } from '@/renderer/hooks/use-whisper';
import { AISettingsProviderContext } from "@/renderer/context";


function Home() {
  const {
    startTranslate, 
    endTranslate,
    generateAnswer,
    refineAnswer,
    isTranscribe,
    answer,
    isLoading,
    transcribeContent,
    captureDevice,
    selectedDevice,
    setSelectedDevice,
    isShowError,
    errorMessage
  } = useWhisper();
  const { userProfession, key, proxy,  setAIConfig } = useContext(AISettingsProviderContext);
  const userChangeHandle = (value: string) => {
    setAIConfig({
      userProfession: value
    })
  }
  const keyChangeHandle = (value: string) => {
    setAIConfig({
      key: value,
    })
  }
  const proxyChangeHandle = (value: string) => {
    setAIConfig({
      proxy: value,
    })
  }
  return (
      <section className="p-4">
        {isShowError && (
          <Alert variant="destructive" className="mb-4">
            <AlertTitle>错误</AlertTitle>
            <AlertDescription>
              {errorMessage}
            </AlertDescription>

          </Alert>
        )}
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div style={{ width: '30%' }}>
          <div className='flex flex-col mb-2'>
            <Select value={selectedDevice} onValueChange={(value) => setSelectedDevice(value)}>
              <SelectTrigger id="device-select" className="w-40 mb-2">
                <SelectValue placeholder="选择设备" />
              </SelectTrigger>
              <SelectContent>
                {captureDevice.map((device, index) => (
                  <SelectItem key={device.id} value={device.id.toString()}>
                    {device.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={userProfession} onValueChange={(value) => userChangeHandle(value)}>
              <SelectTrigger id="profession-select" className="w-40 mb-2">
                <SelectValue placeholder="选择职业" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="前端开发">前端开发</SelectItem>
                <SelectItem value="后端开发">后端开发</SelectItem>
                <SelectItem value="产品经理">产品经理</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={isTranscribe ? endTranslate : startTranslate} className='w-32'>
              {isTranscribe ? '结束转译' : '开始转译'}
            </Button>
          </div>
            <ScrollArea.Root className="ScrollAreaRoot">
              <ScrollArea.Viewport className="ScrollAreaViewport text-base">
                <div style={{ whiteSpace: "pre-wrap" }}>
                  {transcribeContent ? transcribeContent : '待转译...'}
                </div>
              </ScrollArea.Viewport>
              <ScrollArea.Scrollbar className="ScrollAreaScrollbar" orientation="vertical">
                <ScrollArea.Thumb className="ScrollAreaThumb" />
              </ScrollArea.Scrollbar>
            </ScrollArea.Root>
          </div>
          <div style={{ width: '70%' }}>
            <div className='flex flex-row mb-4'>
              {/* <Label htmlFor="openai-key" className='mr-2 leading-7'>OpenAI Key:</Label> */}
              <Input className='w-40' id="openai-key" type="text" placeholder="输入OpenAI Key" value={key} onChange={(e) => keyChangeHandle(e.target.value)} />
            </div>
            <div className='flex flex-row mb-4'>
              {/* <Label htmlFor="proxy-url" className='mr-2 leading-7'>代理地址:</Label> */}
              <Input className='w-40' id="proxy-url" type="text" placeholder="输入代理地址(选填)" value={proxy} onChange={(e) => proxyChangeHandle(e.target.value)} />
            </div>
            <Button onClick={generateAnswer} disabled={isLoading} className='mr-4'>
              {isLoading ? '生成中...' : '生成答案'}
            </Button>
            <Button onClick={refineAnswer} disabled={isLoading}>
              {isLoading ? '生成中...' : '优化答案'}
            </Button>
            <ScrollArea.Root className="ScrollAreaRoot mt-4">
              <ScrollArea.Viewport className="ScrollAreaViewport">
                {answer.answer?.split('\n').map((line, index) => (
                  <div key={index}>{line}</div>
                ))}
                {/* {isLoading ? (
                  <div className="flex justify-center items-center h-32">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                  </div>
                ) : ( */}
                  {/* <table className="w-full border-collapse text-xs	">
                    <thead>
                      <tr>
                        <th className="border p-2">问题</th>
                        <th className="border p-2">答案</th>
                        <th className="border p-2">{isLoading ? '优化中...' : '优化答案'}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {answer.map((item) => (
                        <tr key={item.id}>
                          <td className="border p-2">{item.question}</td>
                          <td className="border p-2" style={{ whiteSpace: "pre-wrap" }}>{item.answer}</td>
                          <td className="border p-2" style={{ whiteSpace: "pre-wrap" }} onClick={() => refineAnswer(item.id)}>优化</td>

                        </tr>
                      ))}
                    </tbody>
                  </table> */}
                {/* )} */}
              </ScrollArea.Viewport>
              <ScrollArea.Scrollbar className="ScrollAreaScrollbar" orientation="vertical">
                <ScrollArea.Thumb className="ScrollAreaThumb" />
              </ScrollArea.Scrollbar>
            </ScrollArea.Root>
          </div>
        </div>
      </section>
  );
}

export default Home;
