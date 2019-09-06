import React from 'react'
import { render } from 'react-dom'

import About from './about'

const pageComponentMap = {
  about: About,
}

const page = new URL(window.location.href).searchParams.get('page')
const Page = pageComponentMap[page]

render(<Page />, document.getElementById('grape'))
