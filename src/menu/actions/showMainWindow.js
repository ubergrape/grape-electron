import state from '../../state'

export default () => {
  const { mainWindow } = state
  mainWindow.show()
}
