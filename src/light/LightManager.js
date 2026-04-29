import { AmbientLight, PointLight } from 'three'

export default class LightManager {
  constructor(scene) {
    this.ambientLight = new AmbientLight(0xffffff, .01);
    this.pointLight = new PointLight(0xffffa0, 1000);

    scene.add(this.ambientLight)
    scene.add(this.pointLight)
  }
}