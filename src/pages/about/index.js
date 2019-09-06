import React from 'react'
import injectSheet from 'react-jss'

import styles from './styles'

const About = ({ classes }) => <h1 className={classes.header}>About</h1>

export default injectSheet(styles)(About)
