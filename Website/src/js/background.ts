import * as THREE from 'three';
import VertexShader from '../shaders/vertex.glsl';
import FragmentShader from '../shaders/fragment.glsl';

class Background {
  Mesh        :THREE.Mesh;
  Texture     :THREE.Texture;

  constructor(texture:THREE.Texture) {
    this.Mesh = new THREE.Mesh();
    this.Texture = texture;

    this.init();
  }

  init() {
    var self = this;
    
    self.Texture.colorSpace = THREE.SRGBColorSpace;
    const skyGeometry = new THREE.SphereGeometry(5, 60, 60);
    const skyMaterial = new THREE.MeshBasicMaterial({
      map: self.Texture,
      side: THREE.BackSide
    });
    self.Mesh = new THREE.Mesh(skyGeometry, skyMaterial);
    self.Mesh.layers.set(0);
    self.Mesh.renderOrder = 1;
  }
} 

export { Background };