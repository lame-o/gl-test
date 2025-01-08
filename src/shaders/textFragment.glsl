uniform float time;
uniform float distortionFreq;
uniform float distortionAmp;
uniform sampler2D textTexture;
varying vec2 vUv;

void main() {
    vec2 uv = vUv;
    
    // Create wave distortion
    float distortion = sin(uv.y * distortionFreq + time) * distortionAmp;
    uv.x += distortion;
    
    // Add chromatic aberration
    vec4 redChannel = texture2D(textTexture, uv + vec2(0.01, 0.0));
    vec4 greenChannel = texture2D(textTexture, uv);
    vec4 blueChannel = texture2D(textTexture, uv - vec2(0.01, 0.0));
    
    gl_FragColor = vec4(redChannel.r, greenChannel.g, blueChannel.b, greenChannel.a);
}
