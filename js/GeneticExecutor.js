function PictureUtils () {
  this.calculateNtscY = function (pixel) {
    return 0.299 * pixel.getRed() + 0.587 * pixel.getGreen() + 0.114 * pixel.getBlue()
  }

  this.shouldBlackNotWhite = function (val) {
    return val < 50
  }

  this.setPixelWhite = function (pixel) {
    pixel.setRed(this.WHITE)
    pixel.setGreen(this.WHITE)
    pixel.setBlue(this.WHITE)
  }

  this.setPixelBlack = function (pixel) {
    pixel.setRed(this.BLACK)
    pixel.setGreen(this.BLACK)
    pixel.setBlue(this.BLACK)
  }

  this.drawLine = function ({matrix, x0, y0, x1, y1}) {
    const dx = x1 - x0
    const dy = y1 - y0
    const steps = Math.abs(dx) > Math.abs(dy) ? Math.abs(dx) : Math.abs(dy)
    const xInc = dx / steps
    const yInc = dy / steps
    let x = x0
    let y = y0
    for (let i = 0; i <= steps; i++) {
      matrix[y][x] = this.BLACK
      x += xInc
      y += yInc
    }
  }

  this.WHITE = 255

  this.BLACK = 0
}

function Gene (maxX, maxY, start, end) {
  this.mutate = function (rate) {
    this.from[0] = Math.floor(((Math.random() < 0.5 ? -1 : 1) * Math.random() * rate) + this.from[0])
    this.to[0] = Math.floor(((Math.random() < 0.5 ? -1 : 1) * Math.random() * rate) + this.to[0])
    this.from[1] = Math.floor(((Math.random() < 0.5 ? -1 : 1) * Math.random() * rate) + this.from[1])
    this.to[1] = Math.floor(((Math.random() < 0.5 ? -1 : 1) * Math.random() * rate) + this.to[1])
    this.from[0] = this.from[0] > maxX ? maxX : this.from[0]
    this.to[0] = this.to[0] > maxX ? maxX : this.to[0]
    this.from[1] = this.from[1] > maxY ? maxY : this.from[1]
    this.to[1] = this.to[1] > maxY ? maxY : this.to[1]
  }

  this.from = start
  this.to = end
}

function Cromossome (genesQuantity, imgWidth, imgHeight) {
  this.generateGenes = function () {
    for (let i = 0; i < genesQuantity; ++i) {
      this.genes.push(this.randomGene())
    }
  }

  this.randomGene = function () {
    const from = [Math.floor(Math.random() * imgWidth), Math.floor(Math.random() * imgHeight)]
    const to = [Math.floor(Math.random() * imgWidth), Math.floor(Math.random() * imgHeight)]
    return new Gene(imgWidth, imgHeight, from, to)
  }

  this.equals = function (other) {
    return this.genes === other.genes
  }

  this.toPixelMatrix = function () {
    const utility = new PictureUtils()
    const matrix = []
    for (let y = 0; y < imgHeight; y++) {
      matrix[y] = []
      for (let x = 0; x < imgWidth; x++) {
        matrix[y][x] = utility.WHITE
      }
    }
    this.genes.forEach((gene) => {
      const x0 = gene.from[0]
      const y0 = gene.from[1]
      const x1 = gene.to[0]
      const y1 = gene.to[1]
      utility.drawLine({matrix, x0, y0, x1, y1})
    })
    return matrix
  }

  this.latestFitness = 0

  this.genes = []
}

function GeneticExecutor (originalImg, linesQuantity, populationSize, generations, elitism = false) {
  this.executeAll = function (callback) {
    setTimeout(() => {
      this.prepareInput()
      this.generateInitialPopulation()
      while (this.hasNextIteration()) {
        this.nextIteration()
        this.currentIteration++
      }
      callback(this.referencePicture)
    }, 0)
  }

  this.prepareInput = function () {
    const utility = new PictureUtils()
    for (let y = 0; y < originalImg.height; y++) {
      this.referencePicture[y] = []
      for (let x = 0; x < originalImg.width; x++) {
        const pixel = originalImg.getPixel(x, y)
        const ntscY = utility.calculateNtscY(pixel)
        if (utility.shouldBlackNotWhite(ntscY)) {
          utility.setPixelBlack(pixel)
          this.referencePicture[y][x] = utility.BLACK
        } else {
          this.referencePicture[y][x] = utility.WHITE
        }
      }
    }
  }

  this.generateInitialPopulation = function () {
    for (let i = 0; i < populationSize; ++i) {
      this.currentPopulation.push(this.randomCromossome())
    }
  }

  this.randomCromossome = function () {
    const cromossome = new Cromossome(linesQuantity, originalImg.width, originalImg.height)
    cromossome.generateGenes()
    return cromossome
  }

  this.hasNextIteration = function () {
    return this.currentIteration < generations
  }

  this.nextIteration = function () {
    const first = this.roulette()
    let second = this.roulette()
    while (second.equals(first)) {
      second = this.roulette()
    }
  }

  this.roulette = function () {
    const fitnessSum = this.currentPopulation.reduce((previousValue, cromossome) => {
      return this.calculateFitness(cromossome) + previousValue
    }, 0)
    const rndDrawn = Math.random() * fitnessSum
    let accumulated = 0
    let chosen = null
    this.currentPopulation.every((el) => {
      const accumulatedBeforeSum = accumulated
      accumulated += el.latestFitness
      if (accumulatedBeforeSum <= rndDrawn && accumulated >= rndDrawn) {
        chosen = el
        return false // break
      }
      return true // continue
    })
    return chosen
  }

  this.calculateFitness = function (cromossome) {
    const pictureMatrix = cromossome.toPixelMatrix()
    let fitness = 0
    for (let y = 0; y < this.referencePicture.height; y++) {
      for (let x = 0; x < this.referencePicture.width; x++) {
        const originalPixel = this.referencePicture[y][x]
        const synteticPixel = pictureMatrix[y][x]
        if (originalPixel === synteticPixel) {
          fitness++
        } else {
          fitness--
        }
      }
    }
    cromossome.latestFitness = fitness
    return fitness
  }

  this.target = null

  this.currentPopulation = []

  this.currentIteration = 1

  this.referencePicture = [] // clone
}