import React, {Component} from 'react'
import DocumentTitle from 'react-document-title'
import {styled} from 'grape-web/lib/jss'
import {smaller, biggest} from 'grape-theme/dist/fonts'
import {grayLighter} from 'grape-theme/dist/base-colors'

import {icon} from '../../constants/images'
import pkg from '../../../package.json'

const div = styled('div')

const Body = div({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  background: grayLighter,
  position: 'absolute',
  height: '100%',
  width: '100%',
  justifyContent: 'center'
})

const Logo = styled('img')({
  width: '30%'
})

const Product = styled('h1')({
  extend: biggest,
  fontWeight: 'bold',
  margin: 20
})

const Row = div({
  extend: smaller,
  marginBottom: 10
})

const ColumnLeft = div({
  extend: smaller,
  float: 'left',
  marginRight: 10
})
const ColumnRight = styled(ColumnLeft)({
  extend: smaller,
  float: 'left',
  marginRight: 0
})

export default class About extends Component {
  render() {
    return (
      <DocumentTitle title="About Grape">
        <Body>
          <Logo src={icon} />
          <Product>{pkg.productName}</Product>
          <Row>Version {pkg.version} ({pkg.build})</Row>
          <Row>
            <ColumnLeft>
              Electron:<br />
              Chrome:<br />
              Node:<br />
              V8:
            </ColumnLeft>
            <ColumnRight>
              {process.versions.electron}<br />
              {process.versions.chrome}<br />
              {process.versions.node}<br />
              {process.versions.v8}
            </ColumnRight>
          </Row>
          <Row>{pkg.copyright}</Row>
        </Body>
      </DocumentTitle>
    )
  }
}
