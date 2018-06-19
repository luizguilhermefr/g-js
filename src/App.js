import React, { Component } from 'react'
import Title from './components/Title'
import ImageSolver from './components/ImageSolver'

class App extends Component {
  render () {
    return (
      <div>
        <Title/>
        <ImageSolver/>
      </div>
    )
  }
}

export default App
