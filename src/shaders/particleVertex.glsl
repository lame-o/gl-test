uniform float uTime;

attribute float size;
attribute vec3 customColor;

varying vec3 vColor;

void main() {
    vColor = customColor;
    
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    
    // Add some movement based on time
    float displacement = sin(uTime * 2.0 + position.x * 2.0) * 0.3;
    mvPosition.y += displacement;
    
    gl_PointSize = size * (300.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
}
