import { SphereGeometry, MeshBasicMaterial, MeshStandardMaterial, Mesh, Vector3 } from "three";

export default class PlanetManager {
  
  constructor() {
    this.sphereGeo = new SphereGeometry(1, 32, 32);

    this.selectedPlanet = null
    this.followDistance = 10

    this.planets = [
      {
        name: 'sun',
        radius: 5,
        distance: 0,
        speed: 0,
        texture: '/static/solar-system-textures/2k_sun.jpg',
        moons: []
      },
      {
        name: 'mercury',
        radius: 0.38,
        distance: 8,
        speed: 0.02,
        texture: '/static/solar-system-textures/2k_mercury.jpg',
        moons: []
      },
      {
        name: 'venus',
        radius: 0.95,
        distance: 12,
        speed: 0.015,
        texture: '/static/solar-system-textures/2k_venus_surface.jpg',
        moons: []
      },
      {
        name: 'earth',
        radius: 1,
        distance: 16,
        speed: 0.01,
        texture: '/static/solar-system-textures/2k_earth_daymap.jpg',
        moons: [
          {
            name: 'moon',
            radius: 0.27,
            distance: 2.5,
            speed: 0.03,
      
          }
        ]
      },
      {
        name: 'mars',
        radius: 0.53,
        distance: 21,
        speed: 0.008,
        texture: '/static/solar-system-textures/2k_mars.jpg',
        moons: [
          {
            name: 'phobos',
            radius: 0.12,
            distance: 1.6,
            speed: 0.04,
      
          },
          {
            name: 'deimos',
            radius: 0.08,
            distance: 2.2,
            speed: 0.03,
      
          }
        ]
      },
      {
        name: 'jupiter',
        radius: 2.8,
        distance: 30,
        speed: 0.004,
        texture: '/static/solar-system-textures/2k_jupiter.jpg',
        moons: [
          {
            name: 'io',
            radius: 0.2,
            distance: 1.5,
            speed: 0.04,
      
          },
          {
            name: 'europa',
            radius: 0.18,
            distance: 2.3,
            speed: 0.032,
      
          },
          {
            name: 'ganymede',
            radius: 0.3,
            distance: 3.2,
            speed: 0.025,
      
          },
          {
            name: 'callisto',
            radius: 0.27,
            distance: 4.3,
            speed: 0.02,
      
          }
        ]
      },
      {
        name: 'saturn',
        radius: 2.4,
        distance: 40,
        speed: 0.003,
        texture: '/static/solar-system-textures/2k_saturn.jpg',
        moons: [
          {
            name: 'titan',
            radius: 0.25,
            distance: 2.6,
            speed: 0.02,
      
          },
          {
            name: 'enceladus',
            radius: 0.1,
            distance: 1.4,
            speed: 0.03,
      
          },
          {
            name: 'rhea',
            radius: 0.14,
            distance: 2,
            speed: 0.024,
      
          }
        ]
      },
      {
        name: 'uranus',
        radius: 1.7,
        distance: 50,
        speed: 0.002,
        texture: '/static/solar-system-textures/2k_uranus.jpg',
        moons: [
          {
            name: 'titania',
            radius: 0.16,
            distance: 2.5,
            speed: 0.02,
      
          },
          {
            name: 'oberon',
            radius: 0.15,
            distance: 3.2,
            speed: 0.017,
      
          },
          {
            name: 'miranda',
            radius: 0.09,
            distance: 1.8,
            speed: 0.03,
      
          }
        ]
      },
      {
        name: 'neptune',
        radius: 1.65,
        distance: 60,
        speed: 0.0015,
        texture: '/static/solar-system-textures/2k_neptune.jpg',
        moons: [
          {
            name: 'triton',
            radius: 0.2,
            distance: 2.5,
            speed: 0.02,
      
          }
        ]
      }
    ]
  }

  createPlanets(scene, textureLoader) {
    this.planetsMeshes = this.planets.map(planet => this.createPlanet(planet, scene, textureLoader))
  }

  createPlanet(planet, scene, textureLoader) {

    const args = {
      map: textureLoader.loadPlanetTexture(planet.texture)
    }

    const planetMaterial = planet.name === 'sun' ? new MeshBasicMaterial(args) : new MeshStandardMaterial(args)
    
    const planetMesh = this.createPlanetMesh(this.sphereGeo, planetMaterial, planet)
    scene.add(planetMesh)

    if(planet.moons.length > 0) planet.moons.forEach(moon=> this.createMoon(moon, planetMesh, textureLoader.moonTexture))
    return planetMesh
  }

  createPlanetMesh(planetGeo, planetMaterial, planet) {
    const planetMesh = new Mesh(planetGeo, planetMaterial);
    planetMesh.scale.setScalar(planet.radius)
    planetMesh.position.x = planet.distance
    planetMesh.name = planet.name
    return planetMesh
  }

  createMoon(moon, mesh, moonTexture) {
    const moonMaterial = new MeshStandardMaterial({
      map: moonTexture
    })

    const planetMoonMesh = this.createPlanetMesh(this.sphereGeo, moonMaterial, moon)
    mesh.add(planetMoonMesh)
  }

  animateMesh(mesh, planetsArr) {
    const planet = planetsArr.find(planet=> planet.name === mesh.name)
    if(!planet) return

    if(planet.speed > 0) mesh.rotation.y += planet.speed

    mesh.position.x = Math.sin(mesh.rotation.y) * planet.distance
    mesh.position.z = Math.cos(mesh.rotation.y) * planet.distance
    
    if(mesh.children) {
      mesh.children.forEach(moon=> this.animateMesh(moon, planet.moons))
    }
  }

  followSelectedPlanet(camera, controls) {
    const target = new Vector3()
    this.selectedPlanet.getWorldPosition(target)

    const direction = new Vector3().subVectors(camera.position, target).normalize()

    const desiredPosition = target.clone().add(direction.multiplyScalar(this.followDistance))

    camera.position.lerp(desiredPosition, 0.05)
    controls.target.lerp(target, 0.05)
  }

  selectPlanet(planetMesh) {
    this.selectedPlanet = planetMesh

    const radius = planetMesh.geometry.boundingSphere ? planetMesh.geometry.boundingSphere.radius * planetMesh.scale.x : 1
    this.followDistance = radius * 2
  }
}