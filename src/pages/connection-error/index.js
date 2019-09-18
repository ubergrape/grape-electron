import React, { Component } from 'react'
// eslint-disable-next-line import/no-extraneous-dependencies
import { ipcRenderer, remote } from 'electron'
import { Helmet } from 'react-helmet'
import { withStyles } from 'react-jss'

import { images, pages } from '../../constants'
import pkg from '../../../package.json'
import styles from './styles'

const { cloudDomain, onPremisesDomain } = remote.getGlobal('store')

const { icon } = images

const errorMessages = (type, url) => {
  switch (type) {
    case 'badSslCert':
      return `The certificate used by instance ${url} seems to be invalid.`
    default:
      return 'Please check if your internet connection is working properly.'
  }
}

class ConnectionError extends Component {
  constructor(props) {
    super(props)
    this.state = { isLoading: false }
  }

  onReload = () => {
    this.setState({ isLoading: true }, () => {
      ipcRenderer.send('loadChat')
    })
  }

  renderButton() {
    const { isLoading } = this.state
    const { classes } = this.props

    if (isLoading) {
      return (
        <button
          type="button"
          onClick={this.onReload}
          className={classes.button}
          disabled={isLoading}
        >
          Loading…
        </button>
      )
    }

    return (
      <button
        type="button"
        onClick={this.onReload}
        className={classes.button}
        disabled={isLoading}
      >
        reload Grape
      </button>
    )
  }

  renderReloadMessage = () => {
    const { isLoading } = this.state
    if (isLoading) {
      return this.renderButton()
    }

    return <span>Try to {this.renderButton()} again.</span>
  }

  render() {
    const { classes, type, url } = this.props
    return (
      <div className={classes.wrapper}>
        <Helmet>
          <title>{pkg.productName}: Lost connection</title>
        </Helmet>
        <div className={classes.content}>
          <img className={classes.icon} alt={pkg.productName} src={icon} />
          <div className={classes.text}>
            <div>The app could not connect to the Grape server.</div>
            <div className={classes.error}>{errorMessages(type, url)}</div>
            <div>{this.renderReloadMessage()}</div>
            {cloudDomain !== onPremisesDomain && (
              <div>
                Or try to{' '}
                <a className={classes.link} href={pages.domain}>
                  change the on-premises domain
                </a>
                .
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }
}

export default withStyles(styles)(ConnectionError)
