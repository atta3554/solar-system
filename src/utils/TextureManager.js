import { CubeTextureLoader, TextureLoader, SRGBColorSpace } from 'three'

export default class TextureManager {
  constructor(path) {
    this.cubeTextureLoader = new CubeTextureLoader()
    this.textureLoader = new TextureLoader()
    this.moonTexture = this.loadPlanetTexture('/static/solar-system-textures/2k_moon.jpg')

    this.cubeTextureLoader.setPath(path)

    this.loadEnvTexture()
  }

  loadEnvTexture() {
    this.cubeTexture = this.cubeTextureLoader.load(['px.png', 'nx.png', 'py.png', 'ny.png', 'pz.png', 'nz.png'])
    this.cubeTexture.colorSpace = SRGBColorSpace
  }
 
  loadPlanetTexture(path) {
    const texture = this.textureLoader.load(path)
    texture.colorSpace = SRGBColorSpace
    return texture;
  }
}