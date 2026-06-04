import { SphereGeometry, MeshBasicMaterial, MeshStandardMaterial, Mesh, Vector3 } from "three";
import assetStore from "../utils/AssetStore";

export default class PlanetManager {
  
  constructor(defaultCameraPosition, defaultControlsTarget) {
    //common Geometry for all planets
    this.sphereGeo = new SphereGeometry(1, 32, 32);

    // prepare for zoom in/out and following planets
    this.selectedPlanet = null
    this.followDistance = 10

    // maintain default positions for zoom out to them back from planets  
    this.defaultCameraPosition = defaultCameraPosition
    this.defaultControlsTarget = defaultControlsTarget

    // determine wether zooming back finished or not
    this.isZooming = false

    // planets objects lists, loaded from central asset loader
    this.planets = assetStore.getState().planetsToLoad
  }

  async createPlanets(scene, assetLoader) {
    this.planetsMeshes = await Promise.all(
      this.planets.map( async planet => await this.createPlanet(planet, scene, assetLoader))
    )
  }

  async createPlanet(planet, scene, assetLoader) {

    // load texture path from planet object
    const map = await assetLoader.load(planet.texture, 'texture');
    const args = {
      map
    }

    // sun shouldn't reflect the light, as it is source of light
    const planetMaterial = planet.name === 'sun' ? new MeshBasicMaterial(args) : new MeshStandardMaterial(args)
    
    // create planet and add to scene
    const planetMesh = this.createPlanetMesh(this.sphereGeo, planetMaterial, planet)
    assetStore.getState().addToLoadedPlanets(planetMesh);
    scene.add(planetMesh)

    // create moons and add them to scene if they are existed
    if(planet.moons.length > 0) planet.moons.forEach(moon=> this.createMoon(moon, planetMesh, assetLoader.textureManager.moonTexture))
    return planetMesh
  }

  createPlanetMesh(planetGeo, planetMaterial, planet) {
    // create and config planet based on given material and it's own object datas
    const planetMesh = new Mesh(planetGeo, planetMaterial);
    planetMesh.scale.setScalar(planet.radius)
    planetMesh.position.x = planet.distance
    planetMesh.name = planet.name
    return planetMesh
  }

  createMoon(moon, mesh, moonTexture) {

    // all moons will have same texture, as moon assumed same look everywhere
    const moonMaterial = new MeshStandardMaterial({
      map: moonTexture
    })

    // create moon and add it to it's own mesh, instead of directly adding to scene, which cause follows it's planet automatically
    const planetMoonMesh = this.createPlanetMesh(this.sphereGeo, moonMaterial, moon)
    mesh.add(planetMoonMesh)
  }

  animateMesh(mesh, planetsArr) {
    // find planet data by mapping it's mesh to it's object from list
    const planet = planetsArr.find(planet=> planet.name === mesh.name)
    if(!planet) return

    // rotate if should. sun doesn't rotates
    if(planet.speed > 0) mesh.rotation.y += planet.speed

    // make circular orbit
    mesh.position.x = Math.sin(mesh.rotation.y) * planet.distance
    mesh.position.z = Math.cos(mesh.rotation.y) * planet.distance
    
    // do the same for moons if they are
    if(mesh.children) {
      mesh.children.forEach(moon=> this.animateMesh(moon, planet.moons))
    }
  }

  followSelectedPlanet(camera, controls) {

    if(this.selectedPlanet === null && this.isZooming) {
      // handle zoomBack
      this.handleZoomBack(camera, controls);
      return;
    }

    //get selectedPlanet position in our world
    const target = new Vector3()
    this.selectedPlanet.getWorldPosition(target)

    // sun position
    const sunPosition = new Vector3().set(0,0,0);
    
    // sun direction related to selected planet
    const lightDirection = new Vector3().subVectors(sunPosition, target).normalize()

    // incline to the center of planet, as light is toward to outer edge of planet
    const desiredDirection = lightDirection.clone().add(new Vector3(0.5, 0, 0)).normalize()

    // maintain a minimum distance from planet
    const desiredPosition = target.clone().add(desiredDirection.multiplyScalar(this.followDistance))

    //set camera position and controls target
    camera.position.lerp(desiredPosition, 0.05)
    controls.target.lerp(target, 0.05)
  }

  handleZoomBack(camera, controls) {

    // is in "zooming out back from zoomed in planet" process, so come back to default position smoothly
    camera.position.lerp(this.defaultCameraPosition, 0.05);
    controls.target.lerp(this.defaultControlsTarget, 0.05);

    // consider as arrived if is near
    const cameraArived = camera.position.distanceTo(this.defaultCameraPosition) < 1
    const controlsArived = controls.target.distanceTo(this.defaultControlsTarget) < 1

    if(cameraArived && controlsArived) {
      // set back to original position strictly if is near
      camera.position.copy(this.defaultCameraPosition)
      controls.target.copy(this.defaultControlsTarget)

      // prevent furthure manipulating, when there is no selectedPlanet
      this.isZooming = false
    }
  }

  selectPlanet(planetMesh) {
    //select planet
    this.selectedPlanet = planetMesh

    // set planet proper distance based on it's radius
    const radius = planetMesh.geometry.boundingSphere ? planetMesh.geometry.boundingSphere.radius * planetMesh.scale.x : 1
    this.followDistance = radius * 4
  }
}