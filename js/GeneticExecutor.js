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
      callback(this.target)
    }, 0)
  }

  this.createTargetOutput = function () {
    this.target = new SimpleImage(originalImg.width, originalImg.height)
    this.target.pixels().forEach((pixel) => {
      pixel.setRed(255)
      pixel.setGreen(255)
      pixel.setBlue(255)
    })
  }

  this.prepareInput = function () {
    // Limiarize etc.
  }

  this.randomCromossome = function () {
    const cromossome = new Cromossome(linesQuantity, originalImg.width, originalImg.height)
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
}