// eslint-disable-next-line import/no-extraneous-dependencies
import { app } from 'electron'
import Store from 'electron-store'
import path from 'path'
import fs from 'fs'

import { isDevelopment } from '../utils'
import env from '../env'

let data = {}

const filePath = isDevelopment
  ? path.join(app.getPath('userData'), '../Grape Dev')
  : app.getPath('userData')

if (!fs.existsSync(path.join(filePath, 'graperc.json'))) data = env

const store = new Store({
  name: 'graperc',
  cwd: filePath,
})

store.onDidAnyChange(() => {
  global.host = store.get('host')
})

if (Object.keys(data)) store.set(data)

export default store
