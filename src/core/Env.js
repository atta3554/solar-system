import { WebGLRenderer, Scene, PerspectiveCamera, Vector3 } from "three";
import { OrbitControls } from "three/examples/jsm/Addons.js";

export default class Env {
  constructor(selector) {
    // initialize app requirements
    this.canvas = document.querySelector(selector);
    this.renderer = new WebGLRenderer({ canvas: this.canvas, antialias: true });
    this.scene = new Scene();
    this.camera = new PerspectiveCamera(35, innerWidth / innerHeight, 0.1, 400);
    this.controls = new OrbitControls(this.camera, this.canvas);

    // store intended camera and it's controls position to use them thourough class
    this.cameraPosition = new Vector3(0, 0, 100);
    this.controlsTarget = new Vector3(0, 0, 0);
  }

  configEnv = (textureLoader) => {
    // config renderer
    this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);
    this.renderer.setPixelRatio(Math.min(devicePixelRatio, 2));

    //set store positions for camera and it's related controls
    this.camera.position.copy(this.cameraPosition);
    this.controls.target.copy(this.controlsTarget);

    // fake friction - make smooth camera rotation
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.02;

    // load scene background and enviroment background
    this.scene.background = textureLoader.cubeTexture;
    this.scene.environment = textureLoader.cubeTexture;
  };

  onResize = () => {
    // update our enviroment when it's size changes
    this.camera.aspect = innerWidth / innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(innerWidth, innerHeight);
  };
}
