import { white, grayDarker } from 'grape-theme/dist/base-colors'
import { small } from 'grape-theme/dist/fonts'

export default {
  wrapper: {
    position: 'absolute',
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  main: {
    width: 310,
    display: 'flex',
    flexDirection: 'column',
  },
  logo: {
    display: 'flex',
    justifyContent: 'center',
  },
  image: {
    width: 180,
  },
  text: {
    extend: small,
    marginTop: 20,
    color: grayDarker,
  },
  tabs: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: 10,
  },
  tab: {
    extend: small,
    padding: [7, 10],
    flexGrow: 1,
    border: '1px solid #007cff',
    color: '#007cff',
    backgroundColor: white,
    textAlign: 'center',
    fontWeight: 'bold',
    '&:first-child': {
      borderRight: 0,
      borderRadius: [5, 0, 0, 5],
    },
    '&:last-child': {
      borderRadius: [0, 5, 5, 0],
    },
  },
  activeTab: {
    color: white,
    backgroundColor: '#007cff',
  },
  domain: {
    transition: 'height 0.3s ease-in-out',
    marginTop: 20,
    height: 0,
    overflow: 'hidden',
  },
  domainExpanded: {
    height: 57,
  },
  input: {
    extend: small,
    width: 'calc(100% - 22px)',
    padding: [8, 10],
    borderRadius: 5,
    border: '1px solid #d3d3d3',
    transition: 'all 0.3s ease-in-out',
    '&:focus': {
      outline: 'none',
      borderColor: '#007cff',
    },
  },
  continue: {
    marginTop: 0,
    extend: small,
    padding: [7, 10],
    borderRadius: 5,
    color: white,
    fontWeight: 'bold',
    border: 0,
    width: '100%',
    backgroundColor: '#6ab700',
    transition: 'all 0.3s ease-in-out',
    '&:hover': {
      background: '#9ede45',
    },
  },
  continueExpanded: {
    marginTop: 23,
  },
}
