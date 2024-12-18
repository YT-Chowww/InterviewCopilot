import { createContext, useEffect, useState } from "react";
import { WEB_API_URL } from "@/constants";
import { Client } from "@/api";

type AppSettingsProviderState = {
  webApi: Client;
  apiUrl?: string;
  user: UserType | null;
  // initialized: boolean;
  // version?: string;
  // libraryPath?: string;
  login?: (user: UserType) => void;
  logout?: () => void;
  // setLibraryPath?: (path: string) => Promise<void>;
  // EnjoyApp?: EnjoyAppType;
  // language?: "en" | "zh-CN";
  // switchLanguage?: (language: "en" | "zh-CN") => void;
  // proxy?: ProxyConfigType;
  // setProxy?: (config: ProxyConfigType) => Promise<void>;
  // ahoy?: typeof ahoy;
};

const initialState: AppSettingsProviderState = {
  webApi: null,
  user: null,
  // initialized: false,
};

export const AppSettingsProviderContext =
  createContext<AppSettingsProviderState>(initialState);

export const AppSettingsProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  // const [version, setVersion] = useState<string>("");
  const [apiUrl, setApiUrl] = useState<string>(WEB_API_URL);
  const [webApi, setWebApi] = useState<Client>(null);
  const [user, setUser] = useState<UserType | null>(null);
  
  // useEffect(() => {
  //   if (webApi) {
  //     fetchUser()
  //   }
  // }, [webApi]);

  useEffect(() => {
    if (!apiUrl) return;
    setWebApi(
      new Client({
        baseUrl: apiUrl
      })
    );
  }, [apiUrl]);


  const fetchUser = async () => {
    const user = await webApi.user();
    if (user) {
      login(user)
    }
    console.log('user------', user);
  };

  const login = (user: UserType) => {
    setUser(user);
    // EnjoyApp.settings.setUser(user);
  };

  const logout = () => {
    setUser(null);
    // EnjoyApp.settings.setUser(null);
  };

  return (
    <AppSettingsProviderContext.Provider
      value={{
        webApi,
        apiUrl,
        user,
        login,
        logout,
      }}
    >
      {children}
    </AppSettingsProviderContext.Provider>
  );
};
