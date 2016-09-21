import React from 'react'
import {render} from 'react-dom'

import './domain'
import './loading'
import LostConnection from './lost-connection'

const pages = {
  '?page=lostConnection': LostConnection
}

const Page = pages[location.search]

if (Page) {
  render(<Page />, document.body.appendChild(document.createElement('div')))
}
