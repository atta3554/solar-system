import PlanetManager from './planet/PlanetManager'
import Env from './core/Env'
import LightManager from "./light/LightManager"
import InteractionManager from './interaction/InteractionManager'
import AssetManager from './utils/AssetLoader'
import PreLoader from './UI/PreLoader'

export default class App {
  
  constructor( selector ) {

    // initialize modules
    this.env = new Env(selector)
    this.preLoader = new PreLoader()
    this.assetManager = new AssetManager();
    this.lightManager = new LightManager(this.env.scene);
    this.planetManager = new PlanetManager(this.env.cameraPosition, this.env.controlsTarget);
    this.interactionManager = new InteractionManager();
  }

  config = async () => {

    // load enviroment related textures
    await this.assetManager.textureManager.loadEnvTexture()

    // load world and planet textures, create planets and add them to world
    this.env.configEnv(this.assetManager.textureManager)
    await this.planetManager.createPlanets(this.env.scene, this.assetManager)

    window.addEventListener('resize', this.env.onResize)
    this.env.canvas.addEventListener('click',(event)=> this.interactionManager.onClick(event, this.planetManager, this.env.camera))
    this.preLoader.startButton.addEventListener('click',()=> this.preLoader.showApp())
  }

  run = () => {

    // set each planet on it's own orbit
    this.planetManager.planetsMeshes.forEach(mesh=> this.planetManager.animateMesh(mesh, this.planetManager.planets));

    // handle zoom in - zoom out and following planet on zoom in
    if(this.planetManager.selectedPlanet || this.planetManager.isZooming) {
      this.planetManager.followSelectedPlanet(this.env.camera, this.env.controls)
    } 

    // render animation
    this.env.controls.update()
    this.env.renderer.render(this.env.scene, this.env.camera)
    requestAnimationFrame(this.run)
  }
}