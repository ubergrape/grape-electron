const {ipcRenderer, remote} = window.require('electron')
import css from 'raw!./index.css'

function render() {
  document.body.innerHTML = `
    <style type="text/css">
      ${css}
    </style>
    <div class="container">
      <header>
        <img class="logo" src="../images/grape-logo.png" alt="Grape">
      </header>
      <form class="form">
        <h1 class="title">Where do you want to connect?</h1>
        <input class="cbox" id="grape-cbox" type="radio" checked name="chooser"
        ><label class="tab tab_left" for="grape-cbox">Grape</label
        ><input class="cbox" id="on-premise-cbox" type="radio" name="chooser"
        ><label class="tab tab_right" for="on-premise-cbox">On Premise</label>

        <div class="host">
          <label class="host__label" for="host">Server URL</label>
           <input class="input" id="host" placeholder="example.com">
        </div>
        <div class="submit">
          <button class="submit-btn" type="submit">Continue</button>
        </div>
      </form>
    </div>
  `

  const form = document.querySelector('.form')
  const input = form.querySelector('#host')
  const grapeCbox = form.querySelector('#grape-cbox')
  const onPremiseCbox = form.querySelector('#on-premise-cbox')
  const domain = remote.getGlobal('host').domain
  const grapeDomain = remote.getGlobal('grapeHost').domain

  if (domain !== grapeDomain) input.value = domain

  onPremiseCbox.addEventListener('click', () => input.focus())
  form.addEventListener('submit', e => {
    e.preventDefault()
    ipcRenderer.send('domain', grapeCbox.checked ? grapeDomain : input.value)
  })
}

if (location.search === '?page=domain') render()
