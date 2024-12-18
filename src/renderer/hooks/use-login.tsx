
import { useContext, useEffect, useState } from "react";
import { AppSettingsProviderContext } from "@/renderer/context";
import { toast } from "@renderer/components/ui";

export const useLogin = () => {
    const { login, webApi } = useContext(AppSettingsProviderContext);
    type ProvierType = "github" | "credentials";
    const ErrorMsg = {
      'params': '请输入正确的邮箱和8~16位密码',
      'password': '密码错误，请重新输入'
    }
    interface LoginOptions {
      email?: string;
      password?: string;
      code?: string;
    }
    const signIn = async (provider: ProvierType, loginOptions?: LoginOptions) => {
      const providers = await webApi.getProviders();
  
      if (!provider || !(provider in providers)) {
        toast.error('不存在的登录方式')
        return
      }
      if (provider === 'credentials') {
        const { csrfToken } = await webApi.getCsrfToken()
        const loginRes = await webApi.login({
            password: loginOptions.password,
            email: loginOptions.email,
            csrfToken
        })
        if (!loginRes.code) {
          const user = await webApi.user();
          login(user);
        } else {
          toast.error(ErrorMsg[loginRes.code as keyof typeof ErrorMsg] || '账号密码有误，请重新输入')
        }
      } else {
        const loginRes = await webApi.githubOauth(loginOptions.code);
        if (!loginRes.code && !loginRes.error) {
          const user = await webApi.user();
          login(user);
        } else {
          toast.error('登录失败，请稍后重试')
        }
      }
    }

    return {
        signIn
    }
}