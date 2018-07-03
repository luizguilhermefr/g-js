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

  this.genes = []
}

function GeneticExecutor (originalImg, linesQuantity, populationSize, generations, elitism = false) {
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

  this.createTargetOutput = function () {
    const utility = new PictureUtils()
    this.target = new SimpleImage(this.referencePicture.width, this.referencePicture.height)
    this.target.pixels().forEach((pixel) => {
      utility.setPixelWhite(pixel)
    })
  }

  this.generateInitialPopulation = function () {
    for (let i = 0; i < populationSize; ++i) {
      this.currentPopulation.push(this.randomCromossome())
    }
  }

  this.randomCromossome = function () {
    const cromossome = new Cromossome(linesQuantity, this.referencePicture.width, this.referencePicture.height)
    cromossome.generateGenes()
    return cromossome
  }

  this.hasNextIteration = function () {
    return this.currentIteration < this.generations
  }

  this.nextIteration = function () {
    this.calculateFitness()
  }

  this.calculateFitness = function () {
    //
  }

  this.target = null

  this.currentPopulation = []

  this.currentIteration = 1

  this.generations = generations

  this.referencePicture = Object.assign(Object.create(Object.getPrototypeOf(originalImg)), originalImg) // clone
}