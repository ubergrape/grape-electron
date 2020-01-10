import React, { Component } from 'react'
// eslint-disable-next-line import/no-extraneous-dependencies
import { ipcRenderer, remote } from 'electron'
import { Helmet } from 'react-helmet'
import { withStyles } from 'react-jss'
import { FormattedMessage, injectIntl } from 'react-intl'
import { parse } from 'url'

import { images } from '../../constants'
import pkg from '../../../package.json'
import styles from './styles'

const { host, currentDomainType } = remote.getGlobal('store')
const {
  cloudProtocol,
  onPremisesProtocol,
  cloudDomain,
  onPremisesDomain,
} = host

const { logo } = images

class Domain extends Component {
  constructor(props) {
    super(props)
    this.state = {
      tab: currentDomainType || 'cloud',
      value: `${
        onPremisesProtocol ? `${onPremisesProtocol}//` : ''
      }${onPremisesDomain || ''}`,
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

  onSubmit = () => {
    const {
      state: { tab, value },
    } = this

    let domain = cloudDomain
    let protocol = cloudProtocol

    if (tab === 'onPremises') {
      // Valid input can be an URL or a domain with optional custom port.
      // We try to parse the input as URL first.
      let parsed = parse(value)

      protocol = parsed.protocol ? parsed.protocol : ''

      // Invalid urls don't have double slashes after the protocol.
      if (!parsed.slashes) {
        // Because of that we strip out any potential leading `:` and `/` character
        // and re parse as url. This is to fix things like `//foo.com`, `://foo.com` and so on.
        parsed = parse(
          `${protocol || 'http:'}//${value.replace(/^[:/]*/g, '')}`,
        )
      }

      // Host contains hostname and optionally the port.
      domain = parsed.host
    }

    ipcRenderer.send('domainChange', {
      type: tab,
      domain,
      protocol,
    })
  }

  render() {
    const {
      classes,
      intl: { formatMessage },
    } = this.props
    const { tab, value } = this.state
    return (
      <div className={classes.wrapper}>
        <Helmet>
          <title>
            {pkg.productName}:{' '}
            {formatMessage({
              id: 'chooseDomainTitle',
              defaultMessage: 'Choose domain',
            })}
          </title>
        </Helmet>
        <div className={classes.logo}>
          <img alt={pkg.productName} className={classes.image} src={logo} />
        </div>
        <form className={classes.main} onSubmit={this.onSubmit}>
          <div className={classes.text}>
            <FormattedMessage
              id="whereToConnectTitle"
              defaultMessage="Where do you want to connect?"
            />
          </div>
          <div className={classes.tabs}>
            <button
              type="button"
              name="cloud"
              onClick={this.onTabClick}
              className={`${classes.tab} ${
                tab === 'cloud' ? classes.activeTab : ''
              }`}
            >
              <FormattedMessage id="grapeTab" defaultMessage="Grape Cloud" />
            </button>
            <button
              type="button"
              name="onPremises"
              onClick={this.onTabClick}
              className={`${classes.tab} ${
                tab === 'onPremises' ? classes.activeTab : ''
              }`}
            >
              <FormattedMessage
                id="onPremisesTab"
                defaultMessage="On-Premises"
              />
            </button>
          </div>
          <div
            className={`${classes.domain} ${
              tab === 'onPremises' ? classes.domainExpanded : ''
            }`}
          >
            <span className={classes.text}>
              <FormattedMessage
                id="serverDomainOrUrl"
                defaultMessage="Server Domain or URL"
              />
            </span>
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
            type="submit"
            className={`${classes.continue} ${
              tab === 'onPremises' ? classes.continueExpanded : ''
            }`}
          >
            <FormattedMessage id="continue" defaultMessage="Continue" />
          </button>
        </form>
      </div>
    )
  }
}

export default withStyles(styles)(injectIntl(Domain))
