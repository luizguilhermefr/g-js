import React, { Component } from 'react'

export const MAX_WIDTH = 500

export const MAX_HEIGHT = 500

class ImageSolver extends Component {

  constructor (props) {
    super(props)
    this.originalPictureCanvas = React.createRef()
    this.state = {
      file: null,
      originalPictureWidth: 0,
      originalPictureHeight: 0,
    }
  }

  handleChangeFile = (event) => {
    event.preventDefault()
    const {target} = event
    const {files} = target
    if (files && files.item(0)) {
      const reader = new FileReader()
      reader.readAsDataURL(files.item(0))
      reader.onloadend = () => {
        this.setState({file: reader.result})
      }
    }
  }

  drawOriginal = () => {
    const img = new Image()
    const context = this.originalPictureCanvas.current.getContext('2d')
    img.src = this.state.file
    img.onload = () => {
      const originalPictureWidth = img.width > MAX_WIDTH ? img.width * (MAX_WIDTH / img.width) : img.width
      const originalPictureHeight = img.height > MAX_HEIGHT ? img.height * (MAX_HEIGHT / img.height) : img.height
      this.setState({
        originalPictureWidth,
        originalPictureHeight,
      }, () => {
        context.drawImage(img, 0, 0, img.width, img.height, 0, 0, originalPictureWidth, originalPictureHeight)
        img.style.display = 'none'
      })
    }
  }

  executeGenetics = () => {
    this.drawOriginal()
  }

  render () {
    const {originalPictureWidth, originalPictureHeight} = this.state
    return (
      <div>
        <div style={{padding: 20}}>
          <input type="file" accept="image/*" onChange={this.handleChangeFile}/>
          <button onClick={this.executeGenetics}>Run</button>
        </div>
        <div>
          <canvas ref={this.originalPictureCanvas} width={originalPictureWidth} height={originalPictureHeight}></canvas>
        </div>
      </div>
    )
  }
}

export default ImageSolver
