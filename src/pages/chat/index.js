// eslint-disable-next-line import/no-extraneous-dependencies
import { ipcRenderer } from 'electron'
import React, { Component } from 'react'
import { Helmet } from 'react-helmet'
import withStyles from 'react-jss'

import pkg from '../../../package.json'
import styles from './styles'

class Chat extends Component {
  constructor(props) {
    super(props)
    this.state = { title: pkg.productName }
  }

  componentDidMount() {
    const webview = document.querySelector('webview')

    webview.addEventListener('page-title-updated', ({ title }) => {
      this.setState({
        title,
      })
    })

    webview.addEventListener('will-navigate', ({ url }) => {
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
        <webview className={classes.window} src={url} />
      </div>
    )
  }
}

export default withStyles(styles)(Chat)
