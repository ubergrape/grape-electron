import * as fs from 'fs'
import { sync as globSync } from 'glob'

const messagesPattern = './i18n/src/**/*.json'
const filePath = './i18n/translations/en.json'
const lastImport = JSON.parse(fs.readFileSync(filePath, 'utf8'))

// Aggregates the default messages that were extracted from the example app's
// React components via the React Intl Babel plugin. An error will be thrown if
// there are messages in different components that use the same `id`. The result
// is a flat collection of `id: message` pairs for the app's default locale.
const defaultMessages = globSync(messagesPattern)
  .map(filename => fs.readFileSync(filename, 'utf8'))
  .map(file => JSON.parse(file))
  .reduce((collection, descriptors) => {
    descriptors.forEach(({ id, defaultMessage, description }) => {
      if (collection.hasOwnProperty(id) && collection[id] !== defaultMessage) {
        throw new Error(`Duplicate message id: ${id}`)
      }

      // use edited value from last import or create new from source
      collection[id] = lastImport[id] || defaultMessage
      if (description) collection[`_${id}.comment`] = description
    })

    return collection
  }, {})

fs.writeFileSync(filePath, JSON.stringify(defaultMessages, null, 2))
