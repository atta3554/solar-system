import { CubeTextureLoader, TextureLoader, SRGBColorSpace } from 'three'

export default class TextureManager {
  constructor() {
    this.cubeTextureLoader = new CubeTextureLoader()
    this.textureLoader = new TextureLoader()
  }

  async loadEnvTexture() {

    //load static textures - moon and galaxy(specify folder only)
    this.moonTexture = await this.loadPlanetTexture('/static/solar-system-textures/2k_moon.jpg')
    this.cubeTextureLoader.setPath('/static/solar-system-textures/cubeMaps/')

    // load texture as cube for galaxy background
    this.cubeTexture = await this.cubeTextureLoader.loadAsync(['px.png', 'nx.png', 'py.png', 'ny.png', 'pz.png', 'nz.png'])
    this.cubeTexture.colorSpace = SRGBColorSpace
  }
 
  async loadPlanetTexture(path) {
    // load colored texxture
    const texture = await this.textureLoader.loadAsync(path)
    texture.colorSpace = SRGBColorSpace
    return texture;
  }
}