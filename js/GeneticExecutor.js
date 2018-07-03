function PictureUtils () {
  this.calculateNtscY = function (pixel) {
    return 0.299 * pixel.getRed() + 0.587 * pixel.getGreen() + 0.114 * pixel.getBlue()
  }

  this.shouldBlackNotWhite = function (val) {
    return val < 50
  }

  this.setPixelWhite = function (pixel) {
    pixel.setRed(255)
    pixel.setGreen(255)
    pixel.setBlue(255)
  }

  this.setPixelBlack = function (pixel) {
    pixel.setRed(0)
    pixel.setGreen(0)
    pixel.setBlue(0)
  }
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

  this.genes = []
}

function Gene (maxX, maxY, start, end) {
}

function GeneticExecutor (originalImg, linesQuantity, populationSize, generations, elitism = false) {
  this.calculateFitness = function () {
    //
  }

  this.nextIteration = function () {
    this.calculateFitness()
  }

  this.executeAll = function (callback) {
    setTimeout(() => {
      this.prepareInput()
      this.createTargetOutput()
      this.generateInitialPopulation()
      while (this.hasNextIteration()) {
        this.nextIteration()
        this.currentIteration++
      }
      callback(this.referencePicture)
    }, 0)
  }

  this.createTargetOutput = function () {
    const utility = new PictureUtils()
    this.target = new SimpleImage(this.referencePicture.width, this.referencePicture.height)
    this.target.pixels().forEach((pixel) => {
      utility.setPixelWhite(pixel)
    })
  }

  this.prepareInput = function () {
    const utility = new PictureUtils()
    this.referencePicture.pixels().forEach((pixel) => {
      const ntscY = utility.calculateNtscY(pixel)
      if (utility.shouldBlackNotWhite(ntscY)) {
        utility.setPixelBlack(pixel)
      } else {
        utility.setPixelWhite(pixel)
      }
    })
  }

  this.randomCromossome = function () {
    const cromossome = new Cromossome(linesQuantity, this.referencePicture.width, this.referencePicture.height)
    cromossome.generateGenes()
    return cromossome
  }

  this.generateInitialPopulation = function () {
    for (let i = 0; i < populationSize; ++i) {
      this.currentPopulation.push(this.randomCromossome())
    }
  }

  this.hasNextIteration = function () {
    return this.currentIteration < this.generations
  }

  this.target = null

  this.currentPopulation = []

  this.currentIteration = 1

  this.generations = generations

  this.referencePicture = Object.assign(Object.create(Object.getPrototypeOf(originalImg)), originalImg) // clone
}