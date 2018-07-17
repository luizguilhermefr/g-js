function selectFile () {
  fileInput.click()
}

function onSelectFile () {
  if (fileInput.files && fileInput.files.item(0)) {
    openFile(fileInput)
  }
}

function openFile (file) {
  originalSimpleImage = new SimpleImage(file)
  onReady()
  drawOriginalImage()
  openModalForGenetics()
}

function openModalForGenetics () {
  const instance = M.Modal.getInstance(startModal)
  instance.open()
}

function drawOriginalImage () {
  setCanvasContainerDimensions(canvasOriginal)
  originalSimpleImage.drawTo(canvasOriginal)
}

function onReady () {
  canvasOriginalContainer.style.display = ''
  canvasOriginal.style.display = ''
  runBtn.classList.remove('disabled')
}

function drawGeneticImage (cromossome) {
  setCanvasContainerDimensions(canvasGenetic)
  const context = canvasGenetic.getContext('2d')
  context.clearRect(0, 0, canvasGenetic.width, canvasGenetic.height)
  context.beginPath()
  context.rect(0, 0, canvasGenetic.width, canvasGenetic.height)
  context.fillStyle = 'white'
  context.fill()
  context.lineWidth = 1
  cromossome.genes.forEach((gene) => {
    context.moveTo(gene.from[0], gene.from[1])
    context.lineTo(gene.to[0], gene.to[1])
  })
  context.stroke()
}

function onStartGenetics (e) {
  e.preventDefault()
  const lines = parseInt(linesQuantityInput.value)
  const popSize = parseInt(populationInput.value)
  const generations = parseInt(generationsInput.value)
  onStartLoading()
  new GeneticExecutor(originalSimpleImage, lines, popSize, generations).executeAll((cromossome) => {
    onEndLoading()
    drawGeneticImage(cromossome)
  })
}

function onStartLoading () {
  canvasOriginal.style.display = 'none'
  canvasOriginalContainer.style.display = 'none'
  canvasGenetic.style.display = 'none'
  canvasGeneticContainer.style.display = 'none'
  preloaderSpinner.style.display = ''
}

function onEndLoading () {
  preloaderSpinner.style.display = 'none'
  canvasOriginal.style.display = ''
  canvasOriginalContainer.style.display = ''
  canvasGenetic.style.display = ''
  canvasGeneticContainer.style.display = ''
  downloadBtn.classList.remove('disabled')
}

function downloadResult () {
  downloadAnchor.href = canvasGenetic.toDataURL('image/png')
    .replace('image/png', 'image/octet-stream')
  downloadAnchor.click()
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

  startGenetics = document.getElementById('run-genetics')
  startGenetics.addEventListener('click', onStartGenetics)

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

  //Materialize
  startModal = document.getElementById('modal-start')

  let floatActionEls = document.querySelectorAll('.fixed-action-btn')
  M.FloatingActionButton.init(floatActionEls, {
    direction: 'top',
    hoverEnabled: false,
  })

  let modalEls = document.querySelectorAll('.modal')
  M.Modal.init(modalEls, {
    inDuration: 300,
  })

  let tooltippedEls = document.querySelectorAll('.tooltipped')
  M.Tooltip.init(tooltippedEls, {
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

let startModal = null

// Menu

let uploadBtn = null

let downloadBtn = null

let runBtn = null

let aboutBtn = null

// Img

let originalSimpleImage = null

// File

let fileSelector = null

// Download

let downloadAnchor = null

// Inputs

let populationInput = null

let linesQuantityInput = null

let generationsInput = null

let elitismCheckbox = null
