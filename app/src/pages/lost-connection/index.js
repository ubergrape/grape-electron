import React, {Component, PropTypes} from 'react'
import DocumentTitle from 'react-document-title'

import css from 'raw!./index.css'
import {urls} from '../../constants/pages'

const {ipcRenderer, remote} = window.require('electron')
const {domain} = remote.getGlobal('host')
const {domain: grapeDomain} = remote.getGlobal('grapeHost')

export default class LostConnection extends Component {
  constructor(props) {
    super(props)
    this.state = {isLoading: false}
  }

  onReload = () => {
    this.setState({isLoading: true}, () => {
      ipcRenderer.send('loadChat')
    })
  }

  renderButton() {
    if (this.state.isLoading) {
      return <button className="loading" onClick={this.onReload}>Loading…</button>
    }

    return <button onClick={this.onReload}>load Grape</button>
  }

  render() {
    return (
      <DocumentTitle title="Grape: Lost Connection">
        <div>
          <style type="text/css" dangerouslySetInnerHTML={{__html: css}} />
          <h1>The app could not connect to the Grape server</h1>
          <h2>Please check if your internet connection is working properly.</h2>
          <p>Try to {this.renderButton()} again.</p>
          {domain !== grapeDomain &&
            <p>Or try to <a href={urls.domain}>change On Premise domain</a>.</p>
          }
        </div>
      </DocumentTitle>
    )
  }
}

