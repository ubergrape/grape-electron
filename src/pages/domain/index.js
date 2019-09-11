import React from 'react'
import { Helmet } from 'react-helmet'
import injectSheet from 'react-jss'

import images from '../../constants/images'
import pkg from '../../../package.json'
import styles from './styles'

const { logo } = images

const Domain = ({ classes }) => (
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
        <button type="button" className={classes.tab}>
          Grape Cloud
        </button>
        <button type="button" className={classes.tab}>
          On-Premises
        </button>
      </div>
      <div className={classes.domain}>
        <span className={classes.text}>Server Domain</span>
        <input
          placeholder="example.com"
          className={classes.input}
          type="text"
        />
      </div>
      <button type="button" className={classes.continue}>
        Continue
      </button>
    </div>
  </div>
)

export default injectSheet(styles)(Domain)
