import os from 'os'

export default () => {
  let type

  switch (os.type()) {
    case 'Windows_NT':
      type = 'windows'
      break
    case 'Darwin':
      type = 'mac'
      break
    case 'Linux':
      type = 'linux'
      break
    default:
      type = undefined
  }

  return type
}
