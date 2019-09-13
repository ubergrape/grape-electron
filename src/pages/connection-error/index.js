import React from 'react'
import { Helmet } from 'react-helmet'
import { withStyles } from 'react-jss'

import pkg from '../../../package.json'
import styles from './styles'

const ConnectionError = () => (
  <div>
    <Helmet>
      <title>{pkg.productName}: Lost connection</title>
    </Helmet>
    <h1>Connection error</h1>
  </div>
)

export default withStyles(styles)(ConnectionError)
