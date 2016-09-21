import React from 'react'
import {render} from 'react-dom'

import Domain from './domain'
import Loading from './loading'
import LostConnection from './lost-connection'

const pages = {
  '?page=lostConnection': LostConnection,
  '?page=loading': Loading,
  '?page=domain': Domain
}

const Page = pages[location.search]

if (Page) {
  const container = document.body.appendChild(document.createElement('div'))
  container.style.height = '100%'
  render(<Page />, container)
}
