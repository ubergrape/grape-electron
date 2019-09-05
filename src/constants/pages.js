import { normalize, join } from 'path'
import { format } from 'url'

const pathname = normalize(join(__dirname, '../pages/index.html'))

const pages = format({
  protocol: 'file:',
  slashes: true,
  pathname,
})

export default {
  index: `${pages}`,
}
