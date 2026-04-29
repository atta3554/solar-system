import { Raycaster, Vector2 } from "three"

export default class InteractionManager {
  constructor() {
      this.rayCaster = new Raycaster();
      this.mouse = new Vector2();
  }

  onClick = (event, planetManager, camera) => {

    if(planetManager.selectedPlanet) {
      planetManager.selectedPlanet = null
      return
    }

    this.mouse.x = (event.clientX / innerWidth) * 2 - 1
    this.mouse.y = -(event.clientY / innerHeight) * 2 + 1

    this.rayCaster.setFromCamera(this.mouse, camera)

    const intersects = this.rayCaster.intersectObjects(planetManager.planetsMeshes, true)
    if(intersects.length === 0) return;

    const clickableObject = intersects[0].object;
    planetManager.selectPlanet(clickableObject)
  }
}