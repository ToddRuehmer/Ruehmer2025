import * as THREE from 'three';
import vWaving from '../shaders/vWaving.glsl';
import FragmentShader from '../shaders/fragment.glsl';

class Title {
  Mesh      : THREE.Mesh;
  Texture   : THREE.Texture;
  Material  : THREE.ShaderMaterial;
  Geometry  : THREE.PlaneGeometry = new THREE.PlaneGeometry(1.2, .256, 30, 30);
  Clock     : THREE.Clock = new THREE.Clock();

  constructor(texture:THREE.Texture) {
    this.Mesh = new THREE.Mesh();
    this.Texture = texture;
    this.Material = new THREE.ShaderMaterial({
      vertexShader: vWaving,
      fragmentShader: FragmentShader,
      uniforms: {
        uTexture  : { value: this.Texture },
        uTime     : { value: 0.0 },
        uScale: { value: 0 }
      },
      transparent: true
    });

    this.init();
  }

  init() {
    var self = this;
    
    self.Texture.minFilter = THREE.LinearFilter; // Smooths scaling down
    self.Texture.magFilter = THREE.LinearFilter; // Smooths scaling up
    self.Texture.needsUpdate = true;

    self.Mesh = new THREE.Mesh(self.Geometry, self.Material);
    self.Mesh.layers.set(1);
    self.Mesh.renderOrder = 3;
    
    self.Mesh.position.set(0, 0, .1);
  }
  
  Update(scale:number) {
    const elapsedTime = this.Clock.getElapsedTime();
    this.Material.uniforms.uTime.value = elapsedTime;
    this.Material.uniforms.uScale.value = scale;
  }
} 

export { Title };