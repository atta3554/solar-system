import { GLTFLoader } from "three/examples/jsm/Addons.js";
import { DRACOLoader } from "three/examples/jsm/Addons.js";

export default class ModelManager {
  constructor() {
    this.gltfLoader = new GLTFLoader()
    this.dracoLoader = new DRACOLoader()
    
    this.configLoaders()
  }

  configLoaders() {
    this.dracoLoader.setDecoderPath('/draco/')
    this.gltfLoader.setDRACOLoader(this.dracoLoader)
  }

}