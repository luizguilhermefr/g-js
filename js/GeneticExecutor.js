function RandomUtils () {
  this.randomInteger = function (min, max) {
    return Math.floor(Math.random() * max) + min
  }
}

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

  this.setPixelGrayScale = function (pixel, scale) {
    pixel.setRed(scale)
    pixel.setGreen(scale)
    pixel.setBlue(scale)
  }

  this.drawLine = function ({matrix, x0, y0, x1, y1}) {
    let xa = x0, ya = y0, xb = x1, yb = y1
    if (x1 > x0) {
      xa = x1
      ya = y1
      xb = x0
      yb = y0
    }
    const dx = xb - xa
    const dy = yb - ya
    const steps = Math.abs(dx) > Math.abs(dy) ? Math.abs(dx) : Math.abs(dy)
    const xinc = dx / steps
    const yinc = dy / steps
    let x = xa
    let y = ya
    for (let i = 0; i <= steps; i++) {
      matrix[Math.round(y)][Math.round(x)] = this.BLACK
      x += xinc           // increment in x at each step
      y += yinc           // increment in y at each step
    }
  }

  this.matrixToSimpleImage = function (matrix) {
    const simpleImage = new SimpleImage(matrix[0].length, matrix.length)
    for (let y = 0; y < matrix.length; y++) {
      for (let x = 0; x < matrix[y].length; x++) {
        const synteticPixel = matrix[y][x]
        const originalPixel = simpleImage.getPixel(x, y)
        this.setPixelGrayScale(originalPixel, synteticPixel)
      }
    }
    return simpleImage
  }

  this.WHITE = 255

  this.BLACK = 0
}

function Gene (imgWidth, imgHeight, start, end) {
  this.mutate = function (rate) {
    const randomUtils = new RandomUtils()
    this.from[0] = randomUtils.randomInteger(this.from[0] - rate, this.from[0] + rate)
    this.from[1] = randomUtils.randomInteger(this.from[1] - rate, this.from[1] + rate)
    this.to[0] = randomUtils.randomInteger(this.to[0] - rate, this.from[0] + rate)
    this.to[1] = randomUtils.randomInteger(this.to[1] - rate, this.from[1] + rate)
    this.from[0] = this.from[0] > (imgWidth - 1) ? (imgWidth - 1) : this.from[0]
    this.from[1] = this.from[1] > (imgHeight - 1) ? (imgHeight - 1) : this.from[1]
    this.from[0] = this.from[0] < 0 ? 0 : this.from[0]
    this.from[1] = this.from[1] < 0 ? 0 : this.from[1]
    this.to[0] = this.to[0] > (imgWidth - 1) ? (imgWidth - 1) : this.to[0]
    this.to[1] = this.to[1] > (imgHeight - 1) ? (imgHeight - 1) : this.to[1]
    this.to[0] = this.to[0] < 0 ? 0 : this.to[0]
    this.to[1] = this.to[1] < 0 ? 0 : this.to[1]
  }

  this.from = start

  this.to = end
}

function Cromossome (genesQuantity, imgWidth, imgHeight, initialGenes = []) {
  this.generateGenes = function () {
    for (let i = 0; i < genesQuantity; ++i) {
      this.genes.push(this.randomGene())
    }
  }

  this.mutate = function (rate) {
    this.genes.forEach((gene) => {
      gene.mutate(rate)
    })
  }

  this.randomGene = function () {
    const randomUtils = new RandomUtils()
    const from = [randomUtils.randomInteger(0, imgWidth - 1), randomUtils.randomInteger(0, imgHeight - 1)]
    const to = [randomUtils.randomInteger(0, imgWidth - 1), randomUtils.randomInteger(0, imgHeight - 1)]
    return new Gene(imgWidth, imgHeight, from, to)
  }

  this.getPartialGenes = function (fromIndex, endIndex) {
    return this.genes.slice(fromIndex, endIndex + 1)
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
      utility.drawLine({matrix, x0: gene.from[0], y0: gene.from[1], x1: gene.to[0], y1: gene.to[1]})
    })
    return matrix
  }

  this.toSimpleImage = function () {
    const matrix = this.toPixelMatrix()
    return (new PictureUtils()).matrixToSimpleImage(matrix)
  }

  this.genes = initialGenes
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
      callback(this.bestCromossomeOfAllTimes.toSimpleImage())
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
    return this.currentIteration <= generations
  }

  this.nextIteration = function () {
    this.calculateFitnessForEveryCromossome()
    const first = this.roulette()
    let second = this.roulette()
    while (first === second) {
      second = this.roulette()
    }
    const firstSon = this.crossover(first, second)
    const secondSon = this.crossover(second, first)
    this.currentPopulation = this.currentPopulation.filter((cromossome) => cromossome !== first && cromossome !== second)
    this.currentPopulation.push(firstSon)
    this.currentPopulation.push(secondSon)
    this.mutateEveryCromossome()
    const bestOfThisIteration = this.bestCromossomeOfCurrentGeneration()
    if (this.bestCromossomeOfAllTimes === null || bestOfThisIteration.latestFitness > this.bestCromossomeOfAllTimes.latestFitness) {
      this.bestCromossomeOfAllTimes = Object.assign(Object.create(Object.getPrototypeOf(bestOfThisIteration)), bestOfThisIteration)
    }
  }

  this.mutateEveryCromossome = function () {
    this.currentPopulation.forEach((cromossome) => {
      cromossome.mutate(this.mutationRate)
    })
  }

  this.crossover = function (male, female) {
    const half = linesQuantity / 2
    const tolerance = linesQuantity / 6
    const crosspoint = Math.floor((Math.random() * (half - tolerance)) + tolerance)
    const halfOfMale = male.getPartialGenes(0, crosspoint)
    const halfOfFemale = female.getPartialGenes(crosspoint + 1, linesQuantity - 1)
    const resultant = [].concat(halfOfFemale).concat(halfOfMale)
    return new Cromossome(linesQuantity, originalImg.width, originalImg.height, resultant)
  }

  this.roulette = function () {
    const fitnessSum = this.currentPopulation.reduce((previousValue, cromossome) => {
      return cromossome.latestFitness + previousValue
    }, 0)
    const rndDrawn = Math.random() * fitnessSum
    let accumulated = 0
    let chosen = null
    this.currentPopulation.every((cromossome) => {
      const accumulatedBeforeSum = accumulated
      accumulated += cromossome.latestFitness
      if (accumulatedBeforeSum <= rndDrawn && accumulated >= rndDrawn) {
        chosen = cromossome
        return false // break
      }
      return true // continue
    })
    return chosen
  }

  this.calculateFitnessForEveryCromossome = function () {
    this.currentPopulation.forEach((cromossome) => {
      const pictureMatrix = cromossome.toPixelMatrix()
      let fitness = 0
      for (let y = 0; y < originalImg.height; y++) {
        for (let x = 0; x < originalImg.width; x++) {
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
    })
  }

  this.bestCromossomeOfCurrentGeneration = function () {
    let bestFitness = Number.MIN_SAFE_INTEGER
    let bestCromossome = null
    this.currentPopulation.forEach((cromossome) => {
      if (cromossome.latestFitness > bestFitness) {
        bestCromossome = cromossome
        bestFitness = cromossome.latestFitness
      }
    })
    return bestCromossome
  }

  this.mutationRate = 5

  this.bestCromossomeOfAllTimes = null

  this.currentPopulation = []

  this.currentIteration = 1

  this.referencePicture = [] // clone
}