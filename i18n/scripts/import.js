// eslint-disable-next-line import/no-extraneous-dependencies
import { sync } from 'glob'
import * as fs from 'fs'

const messagesPattern = './i18n/translations/*.json'
const outputDir = './src/i18n/'
const commentRegExp = /\.comment$/

sync(messagesPattern).foeEach(file => {
  const filename = file
    .split('/')
    .pop()
    .split('.')
    .slice(0, -1)
    .join('.')
  const parsed = JSON.parse(fs.readFileSync(file, 'utf8'))
  const messages = Object.keys(parsed).reduce((result, key) => {
    const newResult = result
    if (commentRegExp.test(key)) return result
    const message = parsed[key]
    newResult[key] = message
    return result
  }, {})

  const output = `/* eslint-disable */
/**
 * This is auto-generated file by 'i18n/scripts/import.js'.
 * Details at https://github.com/ubergrape/chatgrape/wiki/Web-client-i18n
 * DON'T EDIT!
 */
export default ${JSON.stringify(messages, null, 2)}`

  fs.writeFileSync(`${outputDir}${filename}.js`, output)
})
