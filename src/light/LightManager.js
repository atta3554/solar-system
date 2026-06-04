import { AmbientLight, PointLight } from 'three'

export default class LightManager {
  constructor(scene) {

    // ambientLight for minimum viewing of dark sides of planets
    this.ambientLight = new AmbientLight(0xffffff, .01);

    // add point light as sun
    this.pointLight = new PointLight(0xffffa0, 1000);

    // add them to scene
    scene.add(this.ambientLight)
    scene.add(this.pointLight)
  }
}