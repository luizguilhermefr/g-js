function selectFile () {
  fileInput.click()
}

function onSelectFile () {
  if (fileInput.files && fileInput.files.item(0)) {
    openFile(fileInput)
  }
}

function openFile (file) {
  img = new SimpleImage(file)
  onStartLoading()
  setTimeout(onImageOpened, 1000)
}

function drawOriginalImage () {
  setCanvasContainerDimensions(canvasOriginal)
  img.drawTo(canvasOriginal)
}

function drawGeneticImage () {
  setCanvasContainerDimensions(canvasGenetic)
  geneticImg.drawTo(canvasGenetic)
}

function createGeneticImage () {
  geneticImg = new SimpleImage(img.width, img.height)
  geneticImg.pixels().forEach((pixel) => {
    pixel.setRed(255)
    pixel.setGreen(255)
    pixel.setBlue(255)
  })
}

function runGenetics (e) {
  e.preventDefault()

  const lines = parseInt(linesQuantityInput.value)
  const popSize = parseInt(populationInput.value)
  const generations = parseInt(generationsInput.value)
  const elitism = elitismCheckbox.checked

  const executor = new GeneticExecutor(img, geneticImg, lines, popSize, generations, elitism)
  executor.executeAll()
  drawGeneticImage()
}

function onStartLoading () {
  canvasOriginal.style.display = 'none'
  canvasOriginalContainer.style.display = 'none'
  canvasGenetic.style.display = 'none'
  canvasGeneticContainer.style.display = 'none'
  preloaderSpinner.style.display = ''
  downloadBtn.classList.add('disabled')
  runBtn.classList.add('disabled')
}

function onEndLoading () {
  preloaderSpinner.style.display = 'none'
  canvasOriginalContainer.style.display = ''
  canvasOriginal.style.display = ''
  canvasGenetic.style.display = ''
  canvasGeneticContainer.style.display = ''
  downloadBtn.classList.remove('disabled')
  runBtn.classList.remove('disabled')
}

function onImageOpened () {
  drawOriginalImage()
  createGeneticImage()
  drawGeneticImage()
  M.toast({html: 'File opened: ' + img.width + 'x' + img.height})
  onEndLoading()
}

function downloadResult () {
  if (img !== null) {
    downloadAnchor.href = canvasOriginal.toDataURL('image/png')
      .replace('image/png', 'image/octet-stream')
    downloadAnchor.click()
  }
}

function setCanvasContainerDimensions (canvas) {
  const maxWidth = window.innerWidth - 600
  const maxHeight = window.innerHeight - 100
  canvas.style.width = maxWidth + 'px'
  canvas.style.height = maxHeight + 'px'
}

document.addEventListener('DOMContentLoaded', () => {
  preloaderSpinner = document.getElementById('preloader')
  preloaderSpinner.style.display = 'none'

  canvasOriginal = document.getElementById('canvas-original-img')
  canvasOriginal.style.display = 'none'
  canvasOriginalContainer = document.getElementById('canvas-original-container')
  canvasOriginalContainer.style.overflow = 'scroll'
  canvasOriginalContainer.style.display = 'none'
  canvasOriginalContainer.style.backgroundImage = 'url(assets/bg-transp.png)'
  canvasOriginalContainer.style.backgroundRepeat = 'repeat'

  canvasGenetic = document.getElementById('canvas-genetic-img')
  canvasGenetic.style.display = 'none'
  canvasGeneticContainer = document.getElementById('canvas-genetic-container')
  canvasGeneticContainer.style.overflow = 'scroll'
  canvasGeneticContainer.style.display = 'none'
  canvasGeneticContainer.style.backgroundImage = 'url(assets/bg-transp.png)'
  canvasGeneticContainer.style.backgroundRepeat = 'repeat'

  fileSelector = document.getElementById('file-input')
  fileSelector.style.display = 'none'
  fileSelector.addEventListener('change', onSelectFile)

  fileInput = document.getElementById('file-input')

  startGenetics = document.getElementById('confirm-resample')
  startGenetics.addEventListener('click', runGenetics)

  // Menu
  uploadBtn = document.getElementById('upload-btn')
  downloadBtn = document.getElementById('download-btn')
  aboutBtn = document.getElementById('about-btn')
  runBtn = document.getElementById('run-btn')

  // Download
  downloadAnchor = document.getElementById('download')
  downloadAnchor.style.display = 'none'
  downloadBtn.addEventListener('click', downloadResult)

  // Inputs
  populationInput = document.getElementById('pop-size-input')
  linesQuantityInput = document.getElementById('lines-quantity-input')
  generationsInput = document.getElementById('generations-input')
  elitismCheckbox = document.getElementById('elitism-checkbox')
})

// Materialize
document.addEventListener('DOMContentLoaded', () => {
  let elements = document.querySelectorAll('.fixed-action-btn')
  M.FloatingActionButton.init(elements, {
    direction: 'top',
    hoverEnabled: false,
  })
})

document.addEventListener('DOMContentLoaded', () => {
  let elements = document.querySelectorAll('.modal')
  M.Modal.init(elements, {
    inDuration: 300,
  })
})

document.addEventListener('DOMContentLoaded', () => {
  let elements = document.querySelectorAll('.tooltipped')
  M.Tooltip.init(elements, {
    enterDelay: 300,
    delay: 50,
  })
})

// General/UI

let preloaderSpinner = null

let canvasOriginal = null

let canvasOriginalContainer = null

let canvasGenetic = null

let canvasGeneticContainer = null

let startGenetics = null

let fileInput = null

// Menu

let uploadBtn = null

let downloadBtn = null

let runBtn = null

let aboutBtn = null

// Img

let img = null

let geneticImg = null

// File

let fileSelector = null

// Download

let downloadAnchor = null

// Inputs

let populationInput = null

let linesQuantityInput = null

let generationsInput = null

let elitismCheckbox = null
