// eslint-disable-next-line import/no-extraneous-dependencies
import { sync as globSync } from 'glob'
import * as fs from 'fs'

const messagesPattern = './i18n/src/**/*.json'
const filePath = './i18n/translations/en.json'
const lastImport = JSON.parse(fs.readFileSync(filePath, 'utf8'))

// Aggregates the default messages that were extracted from the example app's
// React components via the React Intl Babel plugin. An error will be thrown if
// there are messages in different components that use the same `id`. The result
// is a flat collection of `id: message` pairs for the app's default locale.

globSync(messagesPattern)
  .map(filename => fs.readFileSync(filename, 'utf8'))
  .map(file => JSON.parse(file))
  .reduce((collection, descriptors) => {
    const newCollection = collection
    descriptors.forEach(({ id, defaultMessage, description }) => {
      if (
        Object.prototype.hasOwnProperty.call(newCollection, id) &&
        newCollection[id] !== defaultMessage
      ) {
        throw new Error(`Duplicate message id: ${id}`)
      }

      // use edited value from last import or create new from source
      newCollection[id] = lastImport[id] || defaultMessage
      if (description) newCollection[`_${id}.comment`] = description
    })

    return newCollection
  }, {})
