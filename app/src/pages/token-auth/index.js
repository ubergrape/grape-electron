import React, {Component} from 'react'
import {ipcRenderer} from 'electron'

export default class extends Component {
  constructor(props) {
    super(props)

    this.state = {
      token: '',
      action: ''
    }

    ipcRenderer.on('submitTokenAuth', this.onSubmitTokenAuth)
  }

  onSubmitTokenAuth = (e, {token, action}) => {
    this.setState({token, action}, () => {
      this.form.submit()
    })
  }

  onRefForm = (ref) => {
    this.form = ref
  }

  render() {
    const {action, token} = this.state

    return (
      <form
        action={action}
        method="post"
        ref={this.onRefForm}>
        <input type="hidden" name="token" value={token} />
      </form>
    )
  }
}
