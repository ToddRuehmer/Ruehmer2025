import * as THREE from 'three';
import VertexShader from '../shaders/vertex.glsl';
import FragmentShader from '../shaders/fragment.glsl';

class Button {
  Camera  :THREE.Camera;
  Mesh    :THREE.Mesh;

  constructor(camera:THREE.Camera) {
    this.Camera = camera;
    this.Mesh = new THREE.Mesh();
    this.init();
  }

  init() {
    var self = this;

    // Create a circular button (flat 2D shape)
    const geometry = new THREE.BoxGeometry(1, .4, .05);
    const material = new THREE.MeshBasicMaterial({ color: 0xf3e600,
      transparent: true });

    // Custom Shader Material
    
    var uniforms = {
      uTime: {
        value: 0
      },
      uTexture: {
        value: self.Mesh
      },
      uOffset: {
        value: 1
      },
      uAlpha: {
        value: 1
      }
    }
    //var material = new THREE.ShaderMaterial({
    //  uniforms: uniforms,
    //  vertexShader: VertexShader,
    //  fragmentShader: FragmentShader,
    //  transparent: true
    //})
    

    self.Mesh = new THREE.Mesh(geometry, material);
    self.Mesh.layers.set(1);
    self.Mesh.renderOrder = 2;
    
    // Position button in the center
    self.Mesh.position.set(0, 0, 0);
    
    // Handle click event
    window.addEventListener("click", (event) => {
      // Convert screen coordinates to Three.js normalized device coordinates
      const mouse = new THREE.Vector2(
        (event.clientX / window.innerWidth) * 2 - 1,
        -(event.clientY / window.innerHeight) * 2 + 1
      );
    
      // Raycaster to detect clicks
      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(mouse, self.Camera);
      if(self.Mesh != null) {
        const intersects = raycaster.intersectObject(self.Mesh);
    
        if (intersects.length > 0) {
          //alert("Button clicked!"); // Replace with your action
        }
      }
    });
  }
} 

export { Button };