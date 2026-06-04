import assetStore from "../utils/AssetStore";

export default class PreLoader {
  constructor() {
    this.assetStore = assetStore
    this.overlay = document.querySelector('#overlay')
    this.startButton = this.overlay.querySelector('#start-btn')
    this.loaderContent = this.overlay.querySelector('.percent')
    this.loaderPercent = this.loaderContent.querySelector('.loading-percent')

    this.trackLoader()
  }

  trackLoader() {
    this.assetStore.subscribe(state=> {
      const planetsToLoadCounts = state.planetsToLoad.length
      const loadedPlanetsCounts = state.loadedPlanets.length
      const progress = loadedPlanetsCounts / planetsToLoadCounts
      this.progressPercent = Math.floor(progress * 100)
      this.loaderPercent.innerHTML = this.progressPercent

      if(planetsToLoadCounts === loadedPlanetsCounts) this.hideLoader()
    })
  }

  hideLoader() {
    this.loaderContent.classList.add('transparent')
    setTimeout(() => {
      this.loaderContent.classList.add('hide')
      this.startButton.classList.add('show')
      this.startButton.classList.add('appear')
    }, 2000);
  }

  showApp() {
    this.overlay.classList.add('slide-up')
  }

}