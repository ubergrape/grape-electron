import React from 'react'
import { Helmet } from 'react-helmet'
import { FormattedMessage, injectIntl } from 'react-intl'
import withStyles from 'react-jss'

import { images } from '../../constants'
import pkg from '../../../package.json'
import styles from './styles'

const { icon } = images
const {
  versions: { electron, chrome, node, v8 },
} = process

const About = ({ classes, intl: { formatMessage } }) => (
  <div className={classes.wrapper}>
    <Helmet>
      <title>
        {pkg.productName}:{' '}
        {formatMessage({
          id: 'about',
          defaultMessage: 'About',
        })}{' '}
        {pkg.productName}
      </title>
    </Helmet>
    <img className={classes.icon} alt={pkg.productName} src={icon} />
    <div className={classes.name}>{pkg.productName}</div>
    <div className={classes.row}>
      <FormattedMessage id="version" defaultMessage="Version" /> {pkg.version} (
      {pkg.build.buildVersion})
    </div>
    <div className={classes.row}>
      <table className={classes.table}>
        <tbody>
          <tr>
            <td>Electron:</td>
            <td>{electron}</td>
          </tr>
          <tr>
            <td>Chrome:</td>
            <td>{chrome}</td>
          </tr>
          <tr>
            <td>Node:</td>
            <td>{node}</td>
          </tr>
          <tr>
            <td>V8:</td>
            <td>{v8}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div className={classes.row}>{pkg.build.copyright}</div>
  </div>
)

export default withStyles(styles)(injectIntl(About))
