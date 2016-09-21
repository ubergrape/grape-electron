import React, {Component, PropTypes} from 'react'
import DocumentTitle from 'react-document-title'

import css from 'raw!./index.css'

const {ipcRenderer, remote} = window.require('electron')
const {domain} = remote.getGlobal('host')
const {domain: grapeDomain} = remote.getGlobal('grapeHost')

export default class Domain extends Component {
  constructor(props) {
    super(props)
    this.state = {
      tab: 'grape',
      value: domain === grapeDomain ? '' : domain
    }
  }

  onSelectOnPremise = () => {
    this.input.focus()
    this.setState({tab: 'onPremise'})
  }

  onSelectGrape = () => {
    this.setState({
      tab: 'grape',
      value: ''
    })
  }

  onSubmit = (e) => {
    e.preventDefault()
    const value = this.state.tab === 'grape' ? grapeDomain : this.state.value
    ipcRenderer.send('domain', value)
  }

  onRefInput = (ref) => {
    this.input = ref
  }

  onChangeDomain = () => {
    this.setState({value: this.input.value})
  }

  render() {
    const {tab, value} = this.state

    return (
      <DocumentTitle title="Grape: Choose Domain">
        <div className="container">
          <style dangerouslySetInnerHTML={{__html: css}} />
          <header>
            <img className="logo" src="../images/grape-logo.png" alt="Grape" />
          </header>
          <form className="form" onSubmit={this.onSubmit}>
            <h1 className="title">Where do you want to connect?</h1>
            <label
              onClick={this.onSelectGrape}
              className={`tab tab_left ${tab === 'grape' ? 'tab_selected' : ''}`}>
              Grape
            </label>
            <label
              onClick={this.onSelectOnPremise}
              className={`tab tab_right ${tab === 'onPremise' ? 'tab_selected' : ''}`}>
              On Premise
            </label>
            <div className={`host ${tab === 'onPremise' ? 'host_expanded' : ''}`}>
              <label className="host__label" htmlFor="host">Server URL</label>
              <input
                className="input"
                id="host"
                placeholder="example.com"
                value={value}
                ref={this.onRefInput}
                onChange={this.onChangeDomain} />
            </div>
            <div className="submit">
              <button className="submit-btn" type="submit">Continue</button>
            </div>
          </form>
        </div>
      </DocumentTitle>
    )
  }
}
