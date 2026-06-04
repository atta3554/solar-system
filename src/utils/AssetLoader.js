import ModelManager from "./ModelManager";
import TextureManager from "./TextureManager";
import assetStore from "./AssetStore";

export default class AssetManager {
  constructor() {
    
    this.assetStore = assetStore
    this.instantiateLoaders() 
    
  }

  instantiateLoaders() {
    const modelManager = new ModelManager()

    this.textureManager = new TextureManager()
    this.textureLoader = this.textureManager.textureLoader
    this.cubeTextureLoader = this.textureManager.cubeTextureLoader
    this.gltfLoader = modelManager.gltfLoader
  }

  async load(path, type) {
    if(type === 'texture') {
      return await this.textureManager.loadPlanetTexture(path, type)
    } else if (type === 'model') {
      return await this.gltfLoader.loadAsync(path)
    } else {
      return null;
    }
  }
}