import { useContext, useEffect, useState } from "react";
// import { ipcRenderer } from "electron"; // 导入 ipcRenderer
import { AppSettingsProviderContext } from "@/renderer/context";
import { Button } from "@renderer/components/ui";
import { useLogin } from "@renderer/hooks/use-login";

export const GithubLoginButton = () => {
  const { webApi } = useContext(AppSettingsProviderContext);
  const [code, setCode] = useState('');
  const { signIn }  = useLogin();
  const handleLogin = async () => {
    const { csrfToken } = await webApi.getCsrfToken()

    const oauthAddres = await webApi.getGithubOauthAddr({
      redirectUri: encodeURIComponent(window.location.href),
      csrfToken
    });
    // 发送事件以打开 GitHub 登录窗口
    window?.__COPILOT_APP__?.github.login(oauthAddres);
  };
  useEffect(() => {
    window?.__COPILOT_APP__?.github.onData(async (event, data: string) => {
      setCode(data);
    })
  }, [])
  useEffect(() => {
    if (code) {
      signIn("github", {
        code
      })
    }
  }, [code] )
  return (
    <Button
      variant="outline"
      size="icon"
      data-tooltip-id="global-tooltip"
      data-tooltip-content="Github"
      className="w-10 h-10 rounded-full"
      onClick={handleLogin} // 添加点击事件处理程序
    >
      <img
        src="assets/github-mark.png"
        className="w-full h-full"
        alt="github-logo"
      />
    </Button>
  );
};