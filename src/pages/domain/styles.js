export default {
  wrapper: {
    position: 'absolute',
    display: 'flex',
    justifyContent: 'center',
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
  title: {
    marginTop: 20,
  },
  tabs: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: 10,
  },
  tab: {
    padding: 10,
    flexGrow: 1,
    border: '1px solid #007cff',
    '&:first-child': {
      isolate: false,
      borderRight: 0,
      borderRadius: [5, 0, 0, 5],
    },
    '&:last-child': {
      isolate: false,
      borderRadius: [0, 5, 5, 0],
    },
  },
}
