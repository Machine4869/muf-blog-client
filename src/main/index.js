import { app, BrowserWindow, ipcMain,nativeTheme} from 'electron'
import '../renderer/store'

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`

function createWindow () {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    height: 600,
    useContentSize: true,
    width: 1000,
    webPreferences: {
      nodeIntegration: true
    },
    frame: false,
    backgroundColor: '#363b40'
  })

  mainWindow.loadURL(winURL)

  
  // 
  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

// 菜单栏暗黑模式
nativeTheme.themeSource = 'dark'

app.on('ready', createWindow)
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})


const dialog = require('electron').dialog
// 打开本地文件管理器，选择hexo路径
ipcMain.on('select-hexo-path', (event) => {
  dialog.showOpenDialog({
      properties: ['openDirectory']
      },function(result){
          // console.log(result[0])
          event.sender.send('hexo-path', result[0])
      }
  )
})

// 控制主窗口 最小化，最大化，关闭
ipcMain.on('window-close',() => { 
  console.log('window-close')
  mainWindow.close()
  app.quit()
})
ipcMain.on('window-plus',() => { 
  if (mainWindow.isMaximized()) {
      mainWindow.unmaximize()
  } else {
      mainWindow.maximize()
  }
 })
ipcMain.on('window-minus', e=> mainWindow.minimize());
// ipcMain.on('window-close', e=> mainWindow.close());



/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */
