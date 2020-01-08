// eslint-disable-next-line import/no-extraneous-dependencies
import { app } from 'electron'

export default () => {
  app.quitting = true
  app.quit()
}
