const {ipcRenderer, remote} = window.require('electron')
import css from 'raw!./index.css'
import {urls} from '../../constants'

function render() {
  document.title = 'Grape: Lost Connection'
  document.body.innerHTML = `
    <style type="text/css">
      ${css}
    </style>
    <h1>The app could not connect to the Grape server</h1>
    <h2>Please check if your internet connection is working properly.</h2>
    <p>Try to <button id="load">load Grape</button> again.</p>
  `

  const button = document.querySelector('#load')
  const domain = remote.getGlobal('host').domain
  const grapeDomain = remote.getGlobal('grapeHost').domain

  if (domain !== grapeDomain) {
    const p = document.createElement('p')
    p.innerHTML = `Or try to <a href="${urls.domain}">change On Premise domain</a>.`
    document.body.appendChild(p)
  }

  button.addEventListener('click', () => {
    ipcRenderer.send('loadChat')
    button.classList.add('loading')
    button.parentNode.textContent = 'Loading…'
  })
}

if (location.search === '?page=lostConnection') render()
