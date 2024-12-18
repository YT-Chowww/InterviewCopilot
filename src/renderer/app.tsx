import { ThemeProvider } from 'next-themes';
import { RouterProvider } from "react-router-dom";
import router from './router';
import { AppSettingsProvider } from "@renderer/context";
import { Toaster } from "@renderer/components/ui";
import { AISettingsProvider } from "@renderer/context";

function App() {
  return (
    <ThemeProvider attribute="class">
      <AppSettingsProvider>
        <AISettingsProvider>
          <RouterProvider router={router}></RouterProvider>
          <Toaster richColors position="top-center" />
        </AISettingsProvider>
      </AppSettingsProvider>
    </ThemeProvider>
  );
}

export default App;
