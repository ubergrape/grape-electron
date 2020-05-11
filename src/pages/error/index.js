import React, { Component } from 'react'
import { FormattedMessage } from 'react-intl'

class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    // eslint-disable-next-line no-console
    console.log(error, errorInfo)
  }

  render() {
    const { children } = this.props
    const { hasError } = this.state

    if (hasError) {
      return (
        <h1>
          <FormattedMessage
            id="somethingWentWrong"
            defaultMessage="Something went wrong."
          />
        </h1>
      )
    }

    return children
  }
}

export default ErrorBoundary
