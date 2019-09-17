import { grayDarker } from 'grape-theme/dist/base-colors'
import { normal } from 'grape-theme/dist/fonts'

export default {
  wrapper: {
    height: '100%',
    width: '100%',
    background: '#e2e7ef',
  },
  content: {
    extend: normal,
    color: grayDarker,
    display: 'flex',
    padding: 50,
  },
  icon: {
    width: 256,
  },
  text: {
    marginLeft: 94,
  },
  error: {
    margin: [20, 0],
  },
  link: {
    color: '#0080ff',
  },
  button: {
    extend: normal,
    padding: 0,
    color: '#0080ff',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    '&:hover': {
      textDecoration: 'underline',
    },
  },
}
