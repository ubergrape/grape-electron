// eslint-disable-next-line import/no-extraneous-dependencies
import { ipcRenderer } from 'electron'
import contextMenu from 'electron-context-menu'
import React, { Component } from 'react'
import { Helmet } from 'react-helmet'
import withStyles from 'react-jss'
import { injectIntl } from 'react-intl'
import path from 'path'

import pkg from '../../../package.json'
import styles from './styles'

class Chat extends Component {
  constructor(props) {
    super(props)
    this.state = { title: pkg.productName }
  }

  componentDidMount() {
    const {
      intl: { formatMessage },
    } = this.props
    const webview = document.querySelector('webview')

    contextMenu({
      window: webview,
      showSaveImageAs: true,
      saveImage: false,
      labels: {
        saveImageAs: formatMessage({
          id: 'saveImageTo',
          defaultMessage: 'Save Image to…',
        }),
      },
    })

    webview.addEventListener('page-title-updated', ({ title }) => {
      this.setState({
        title,
      })
    })

    webview.addEventListener('new-window', ({ url }) => {
      ipcRenderer.send('openWindow', url)
    })

    webview.addEventListener('load-commit', ({ url }) => {
      const newUrl = `${window.location.protocol}//${window.location.host}${window.location.pathname}?page=chat&url=${url}`
      window.history.pushState({ path: newUrl }, '', newUrl)
      ipcRenderer.send('chatRedirect', newUrl)
    })
  }

  render() {
    const { classes, url } = this.props
    const { title } = this.state
    return (
      <div className={classes.wrapper}>
        <Helmet title={title} />
        <webview
          className={classes.window}
          src={url}
          enableremotemodule="false"
          partition="persist:webview"
          preload={path.join(__dirname, '../../app/preload/mainWindow.js')}
        />
      </div>
    )
  }
}

export default withStyles(styles)(injectIntl(Chat))
