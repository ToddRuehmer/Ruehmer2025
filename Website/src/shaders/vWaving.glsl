uniform float uTime;
uniform float uScale;
varying vec2 vUv;

void main() {
    vUv = uv;

    vec3 newPosition = position;

    float waveStrength = 0.3 * uScale; // Amplitude of wave
    float waveSpeed = 8.0; // Speed of wave movement
    float waveFrequency = 10.0; // Number of waves across the plane

    newPosition.z += sin(newPosition.x * waveFrequency + uTime * waveSpeed) * waveStrength;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
}
