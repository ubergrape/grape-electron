import * as fs from 'fs'
import {extractFromCode} from 'i18n-extract'

const messagesSrc = './dist/app.js'
const filePath = './i18n/translations/legacy.en.json'
const lastImport = JSON.parse(fs.readFileSync(filePath, 'utf8'))

const keys = extractFromCode(fs.readFileSync(messagesSrc, 'utf8'), {
  marker: '_'
})

const messages = keys.reduce((_messages, message) => {
  // use edited value from last import or create new from source
  _messages[message] = lastImport[message] || message
  return _messages
}, {})

fs.writeFileSync(filePath, JSON.stringify(messages, null, 2))
