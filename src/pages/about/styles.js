import { grayLighter, grayDark } from 'grape-theme/dist/base-colors'
import { smaller, biggest } from 'grape-theme/dist/fonts'

export default {
  wrapper: {
    position: 'absolute',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    width: '100%',
    background: grayLighter,
  },
  icon: {
    width: 80,
    marginBottom: 20,
  },
  name: {
    color: grayDark,
    extend: biggest,
    fontWeight: 'bold',
  },
  row: {
    color: grayDark,
    extend: smaller,
    marginBottom: 10,
  },
  header: {
    fontStyle: 'italic',
  },
}
