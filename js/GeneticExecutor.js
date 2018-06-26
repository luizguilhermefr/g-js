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

function GeneticExecutor (originalImg, targetImg, linesQuantity, populationSize, generations, elitism = false) {

  this.nextIteration = function () {

  }

  this.executeAll = function () {
    while (this.hasNextIteration()) {
      this.nextIteration()
      this.currentIteration++
    }
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

  this.currentPopulation = []

  this.currentIteration = 1

  this.generations = generations

  this.generateInitialPopulation()
}