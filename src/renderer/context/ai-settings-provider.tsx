import { createContext, useState } from "react";

type AIConfig = {
  //openAI api key
  key: string;
  proxy?: string;
  userProfession: string;
}
type AISettingsProviderState = AIConfig & {
  setAIConfig?: (config: Partial<AIConfig>) => void;
};

const initialState: AISettingsProviderState = {
  key: '',
  proxy: '',
  userProfession: '前端开发'
};

export const AISettingsProviderContext =
  createContext<AISettingsProviderState>(initialState);

export const AISettingsProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [key, setKey] = useState<string>('');
  const [proxy, setProxy] = useState<string>('');
  const [userProfession, setUserProfession] = useState('前端开发');

  const setAIConfig = (cfg: Partial<AISettingsProviderState>) => {
    const value = {
      key,
      proxy,
      userProfession,
      ...cfg
    }
    setKey(value.key);
    setProxy(value.proxy);
    setUserProfession(value.userProfession)
  }
  return (
    <AISettingsProviderContext.Provider
      value={{
        key,
        proxy,
        userProfession,
        setAIConfig
      }}
    >
      {children}
    </AISettingsProviderContext.Provider>
  );
};
