import { createStore } from "zustand/vanilla"

const planetsToLoad = [
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

const assetStore = createStore( (set, get) => ({ 
  planetsToLoad,
  loadedPlanets: [],
  addToLoadedPlanets : (planet) => set(state=> ({loadedPlanets: [...state.loadedPlanets, planet]}))
}))

export default assetStore