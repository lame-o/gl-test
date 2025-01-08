varying vec3 vColor;

void main() {
    // Create a circular particle
    float r = distance(gl_PointCoord, vec2(0.5, 0.5));
    if (r > 0.5) discard;
    
    // Add a glow effect
    float strength = 1.0 - (r * 2.0);
    vec3 glow = vColor * strength;
    
    gl_FragColor = vec4(glow, strength);
}
