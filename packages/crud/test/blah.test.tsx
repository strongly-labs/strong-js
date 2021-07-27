import React from 'react'
import * as ReactDOM from 'react-dom'
import { Default as Thing } from '../stories/Thing.stories'

describe('@strongly/crud', () => {
  it('renders without crashing', () => {
    const div = document.createElement('div')
    ReactDOM.render(<Thing />, div)
    ReactDOM.unmountComponentAtNode(div)
  })
})