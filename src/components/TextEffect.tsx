import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import vertexShader from '../shaders/textVertex.glsl';
import fragmentShader from '../shaders/textFragment.glsl';

interface TextEffectProps {
  text: string;
  fontSize?: number;
  color?: string;
}

const TextEffect = ({ text, fontSize = 48, color = '#ffffff' }: TextEffectProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Create canvas for text
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d')!;
    canvas.width = 1024;
    canvas.height = 128;

    // Draw text to canvas
    context.fillStyle = 'white';
    context.font = `${fontSize}px Arial`;
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(text, canvas.width / 2, canvas.height / 2);

    // Create Three.js scene
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    containerRef.current.appendChild(renderer.domElement);

    // Create texture from canvas
    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;

    // Create shader material
    const material = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        distortionFreq: { value: 30.0 },
        distortionAmp: { value: 0.02 },
        textTexture: { value: texture }
      },
      vertexShader,
      fragmentShader,
      transparent: true
    });

    // Create mesh
    const geometry = new THREE.PlaneGeometry(2, 0.25);
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);
    camera.position.z = 1;

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      material.uniforms.time.value += 0.03;
      renderer.render(scene, camera);
    };
    animate();

    // Handle resize
    const handleResize = () => {
      if (!containerRef.current) return;
      renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      containerRef.current?.removeChild(renderer.domElement);
    };
  }, [text, fontSize, color]);

  return <div ref={containerRef} style={{ width: '100%', height: '100px' }} />;
};

export default TextEffect;
