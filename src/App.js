import PlanetManager from './planet/PlanetManager'
import Env from './core/Env'
import LightManager from "./light/LightManager"
import InteractionManager from './interaction/InteractionManager'
import TextureManager from "./utils/TextureManager"

export default class App {
  
  constructor( selector ) {
    this.env = new Env(selector)
    this.textureManager = new TextureManager('static/solar-system-textures/cubeMaps/');
    this.lightManager = new LightManager(this.env.scene);
    this.planetManager = new PlanetManager(this.env.scene);
    this.interactionManager = new InteractionManager();

    this.config();
  } 

  config = () => {
    this.env.configEnv(this.textureManager)
    this.planetManager.createPlanets(this.env.scene, this.textureManager)

    window.addEventListener('resize', this.env.onResize)
    window.addEventListener('click',(event)=> this.interactionManager.onClick(event, this.planetManager, this.env.camera))
  }

  run = () => {
    this.planetManager.planetsMeshes.forEach(mesh=> this.planetManager.animateMesh(mesh, this.planetManager.planets));

    if (this.planetManager.selectedPlanet) {
      this.planetManager.followSelectedPlanet(this.env.camera, this.env.control)
    }

    this.env.control.update()
    this.env.renderer.render(this.env.scene, this.env.camera)
    requestAnimationFrame(this.run)
  }
}