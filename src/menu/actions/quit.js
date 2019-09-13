import { app } from 'electron'

export default () => {
  app.quitting = true
  app.quit()
}
