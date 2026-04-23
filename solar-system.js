import * as THREE from 'three'
import { OrbitControls, plane } from 'three/examples/jsm/Addons.js'
import { Pane } from 'tweakpane'

// initialize enviroment
const canvas = document.querySelector('#three')
const renderer = new THREE.WebGLRenderer({canvas, antialias: true})
renderer.setSize(innerWidth, innerHeight)
renderer.setPixelRatio(Math.min(devicePixelRatio, 2))

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(35, innerWidth/innerHeight, .1, 400)
camera.position.z = 100

const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

const AmbientLight = new THREE.AmbientLight(0xffffff, .01)
scene.add(AmbientLight)

const PointLight = new THREE.PointLight(0xffffa0, 1000)
scene.add(PointLight)

const pane = new Pane()

const textureLoader = new THREE.TextureLoader()
const cubeTextureLoader = new THREE.CubeTextureLoader()
.setPath('static\\solar-system-textures\\cubeMaps\\')
.load(['px.png', 'nx.png', 'py.png', 'ny.png', 'pz.png', 'nz.png',])
cubeTextureLoader.colorSpace = THREE.SRGBColorSpace
scene.background = cubeTextureLoader
scene.environment = cubeTextureLoader



// // initialize objects
const planets = [
  {
    name: 'sun',
    radius: 5,
    distance: 0,
    speed: 0,
    texture: 'static\\solar-system-textures\\2k_sun.jpg',
    moons: []
  },
  {
    name: 'mercury',
    radius: 0.38,
    distance: 8,
    speed: 0.02,
    texture: 'static\\solar-system-textures\\2k_mercury.jpg',
    moons: []
  },
  {
    name: 'venus',
    radius: 0.95,
    distance: 12,
    speed: 0.015,
    texture: 'static\\solar-system-textures\\2k_venus_surface.jpg',
    moons: []
  },
  {
    name: 'earth',
    radius: 1,
    distance: 16,
    speed: 0.01,
    texture: 'static\\solar-system-textures\\2k_earth_daymap.jpg',
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
    texture: 'static\\solar-system-textures\\2k_mars.jpg',
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
    texture: 'static\\solar-system-textures\\2k_jupiter.jpg',
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
    texture: 'static\\solar-system-textures\\2k_saturn.jpg',
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
    texture: 'static\\solar-system-textures\\2k_uranus.jpg',
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
    texture: 'static\\solar-system-textures\\2k_neptune.jpg',
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

const SpehereGeo = new THREE.SphereGeometry(1, 32, 32);

const moonTexture = coloredTextureLoader(textureLoader, 'static\\solar-system-textures\\2k_moon.jpg')
const moonMaterial = new THREE.MeshStandardMaterial({
  map: moonTexture
})

const planetsMeshes = planets.map(planet => createPlanet(planet, textureLoader))



// initialize app
function renderLoop(time = 0) {

  planetsMeshes.forEach(mesh=> animateMesh(mesh, planets));

  controls.update()
  renderer.render(scene, camera)
  requestAnimationFrame(renderLoop)
}
renderLoop();

window.addEventListener('resize', () => {
    camera.aspect = innerWidth / innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(innerWidth, innerHeight)
})

















/****************************************************************** helpers ******************************************************/
function createPlanet(planet, loader) {
  
  const planetTexture = coloredTextureLoader(loader, planet.texture);
  
  const args = {
    map: planetTexture
  }

  const planetMaterial = planet.name === 'sun' ? new THREE.MeshBasicMaterial(args) : new THREE.MeshStandardMaterial(args)
  
  const planetMesh = createPlanetMesh(SpehereGeo, planetMaterial, planet)
  scene.add(planetMesh)

  if(planet.moons.length > 0) planet.moons.forEach(moon=> createMoon(moon, planetMesh))
  return planetMesh
}

function createMoon(moon, planetMesh) {
  const planetMoonMesh = createPlanetMesh(SpehereGeo, moonMaterial, moon)
  planetMesh.add(planetMoonMesh)
}

function animateMesh(mesh, planetsArr) {
  const meshIndex = planetsArr.findIndex(planet=> planet.name === mesh.name)
  const planet = planetsArr[meshIndex]
  const planetSpeed = planet.speed
  const planetDistance = planet.distance
  if(planetSpeed && planetSpeed > 0) mesh.rotation.y += planetSpeed
  mesh.position.x = Math.sin(mesh.rotation.y) * planetDistance
  mesh.position.z = Math.cos(mesh.rotation.y) * planetDistance
  if(mesh.children) {
    mesh.children.forEach(moon=> animateMesh(moon, planet.moons))
  }
}

function coloredTextureLoader(loader, path) {
  const coloredPlanetTexture = loader.load(path)
  coloredPlanetTexture.colorSpace = THREE.SRGBColorSpace
  return coloredPlanetTexture;
}

function createPlanetMesh(planetGeo, planetMaterial, planet) {
  const planetMesh = new THREE.Mesh(planetGeo, planetMaterial);
  planetMesh.scale.setScalar(planet.radius)
  planetMesh.position.x = planet.distance
  planetMesh.name = planet.name
  return planetMesh
}