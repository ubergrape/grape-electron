// eslint-disable-next-line import/no-extraneous-dependencies
import { ipcRenderer, remote } from 'electron'
import React, { Component } from 'react'
import { Helmet } from 'react-helmet'
import { withStyles } from 'react-jss'
import { parse } from 'url'

import { images } from '../../constants'
import pkg from '../../../package.json'
import styles from './styles'

const { cloudDomain, onPremisesDomain } = remote.getGlobal('host')

const { logo } = images

class Domain extends Component {
  constructor(props) {
    super(props)
    this.state = {
      tab: onPremisesDomain ? 'onPremises' : 'cloud',
      value: onPremisesDomain || '',
    }
  }

  onRefInput = ref => {
    this.input = ref
  }

  onTabClick = e => {
    const tab = e.currentTarget.name
    this.setState({
      tab,
    })
    if (tab === 'onPremises') this.input.focus()
  }

  onInputChange = e => {
    const {
      currentTarget: { value },
    } = e
    this.setState({
      value,
    })
  }

  onContinueClick = () => {
    const {
      state: { tab, value },
    } = this

    let domain = cloudDomain

    if (tab === 'onPremises') {
      // Valid input can be an URL or a domain with optional custom port.
      // We try to parse the input as URL first.
      let parsed = parse(value)
      // Invalid urls don't have double slashes after the protocol.

      if (!parsed.slashes) {
        // Because of that we strip out any potential leading `:` and `/` character
        // and re parse as url. This is to fix things like `//foo.com`, `://foo.com` and so on.
        parsed = parse(`http://${value.replace(/^[:/]*/g, '')}`)
      }

      // host contains hostname and optionally the port.
      domain = parsed.host
    }

    ipcRenderer.send('domainChange', {
      type: tab,
      domain,
    })
  }

  render() {
    const { classes } = this.props
    const { tab, value } = this.state
    return (
      <div className={classes.wrapper}>
        <Helmet>
          <title>{pkg.productName}: Choose domain</title>
        </Helmet>
        <div className={classes.main}>
          <div className={classes.logo}>
            <img alt={pkg.productName} className={classes.image} src={logo} />
          </div>
          <div className={classes.text}>Where do you want to connect?</div>
          <div className={classes.tabs}>
            <button
              type="button"
              name="cloud"
              onClick={this.onTabClick}
              className={`${classes.tab} ${
                tab === 'cloud' ? classes.activeTab : ''
              }`}
            >
              Grape Cloud
            </button>
            <button
              type="button"
              name="onPremises"
              onClick={this.onTabClick}
              className={`${classes.tab} ${
                tab === 'onPremises' ? classes.activeTab : ''
              }`}
            >
              On-Premises
            </button>
          </div>
          <div
            className={`${classes.domain} ${
              tab === 'onPremises' ? classes.domainExpanded : ''
            }`}
          >
            <span className={classes.text}>Server Domain</span>
            <input
              placeholder="example.com"
              onChange={this.onInputChange}
              value={value}
              ref={this.onRefInput}
              className={classes.input}
              type="text"
            />
          </div>
          <button
            onClick={this.onContinueClick}
            type="button"
            className={`${classes.continue} ${
              tab === 'onPremises' ? classes.continueExpanded : ''
            }`}
          >
            Continue
          </button>
        </div>
      </div>
    )
  }
}

export default withStyles(styles)(Domain)
