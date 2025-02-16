import * as THREE from 'three';

var getScreenPosition = function(position: THREE.Vector3, camera: THREE.Camera, renderer: THREE.WebGLRenderer) {

  position.project(camera);

  const halfWidth = renderer.domElement.width / 2;
  const halfHeight = renderer.domElement.height / 2;

  return {
    x: (position.x * halfWidth) + halfWidth,
    y: (-position.y * halfHeight) + halfHeight
  };
}

var updateCameraAspect = (camera:THREE.Camera, aspect:number) => {
  const frustumSize = 2; // Adjust based on your needs

  if(camera instanceof THREE.PerspectiveCamera) {
    camera.aspect = aspect;
  } else if(camera instanceof THREE.OrthographicCamera) {
    camera.left = -frustumSize * aspect / 2;
    camera.right = frustumSize * aspect / 2;
    camera.top = frustumSize / 2;
    camera.bottom = -frustumSize / 2;
  }
}

export { getScreenPosition, updateCameraAspect };