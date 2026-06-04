import { Raycaster, Vector2 } from "three"

export default class InteractionManager {
  constructor() {

    // cast a ray
    this.rayCaster = new Raycaster();

    // prepare mouse clicked position
    this.mouse = new Vector2();
  }

  onClick = (event, planetManager, camera) => {

    // if any planet was selected, leave it and zoom out to origin position
    if(planetManager.selectedPlanet) {
      planetManager.selectedPlanet = null
      return
    }

    // convert DOM based clicked position to WebGL expected format
    this.mouse.x = (event.clientX / innerWidth) * 2 - 1
    this.mouse.y = -(event.clientY / innerHeight) * 2 + 1

    // set casted ray direction from camera to clicked position
    this.rayCaster.setFromCamera(this.mouse, camera)

    // get objects in between
    const intersects = this.rayCaster.intersectObjects(planetManager.planetsMeshes, true)
    if(intersects.length === 0) return;

    // there were an object, so zooming process starts
    planetManager.isZooming = true

    // select clicked object(planet)
    const clickableObject = intersects[0].object;
    planetManager.selectPlanet(clickableObject)
  }
}