import React from 'react'
import DocumentTitle from 'react-document-title'

const css = `
  html, body {
    height: 100%
  }
  body {
    background: #fff url("../images/loading.gif") 50% 50% no-repeat;
  }
`
export default () => (
  <DocumentTitle title="Loading Grape">
    <style dangerouslySetInnerHTML={{__html: css}} />
  </DocumentTitle>
)
