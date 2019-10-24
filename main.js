const { app, BrowserWindow } = require('electron')

function createWindow () {
  // Create the browser window.
  let win = new BrowserWindow({ width: 1200, height: 765, resizable: false, webPreferences: {
    nodeIntegration: true
  } })
  // win.webContents.openDevTools();
  
  // and load the index.html of the app.
  win.loadFile('index.html')

}

app.on('ready', createWindow)

