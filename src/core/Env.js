import { WebGLRenderer, Scene, PerspectiveCamera } from "three"
import { OrbitControls } from 'three/examples/jsm/Addons.js'

export default class Env {
  constructor(selector) {
    this.canvas = document.querySelector(selector)
    this.renderer = new WebGLRenderer({canvas: this.canvas, antialias: true})
    this.scene = new Scene();
    this.camera = new PerspectiveCamera(35, innerWidth/innerHeight, .1, 400);
    this.control = new OrbitControls(this.camera, this.canvas);
  }

  configEnv = (textureLoader) => {
    this.renderer.setSize(innerWidth, innerHeight)
    this.renderer.setPixelRatio(Math.min(devicePixelRatio, 2))

    this.camera.position.z = 100

    this.control.enableDamping = true

    this.scene.background = textureLoader.cubeTexture 
    this.scene.environment = textureLoader.cubeTexture
  }

  onResize = () => {
    this.camera.aspect = innerWidth / innerHeight
    this.camera.updateProjectionMatrix()
    this.renderer.setSize(innerWidth, innerHeight)
  }
}