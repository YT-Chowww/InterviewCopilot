import { app, BrowserWindow } from "electron";
import mainWindow from "@main/window";
import ElectronSquirrelStartup from "electron-squirrel-startup";

// If ElectronSquirrelStartup is true, it means the application is started by Squirrel.Windows
// Immediately quit the application
if (ElectronSquirrelStartup) {
  app.quit();
}

// app.on('ready', createWindow);
app.whenReady().then(() => {
  // createWindow()
  mainWindow.init();
  app.on('activate', () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
      // createWindow();
      mainWindow.init();
    }
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on("activate", () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    mainWindow.init();
  }
});

