import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import TextEffect from './components/TextEffect';
import './App.css';

function App() {
  const mountRef = useRef<HTMLDivElement>(null);
  const tridentRef = useRef<THREE.Group | null>(null);
  const lastScrollY = useRef(0);
  const mousePosition = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x00248a);
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    mountRef.current.appendChild(renderer.domElement);

    // Add orbit controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.enableZoom = false;
    controls.enablePan = false;
    controls.autoRotate = false;

    // Create particle system
    const particlesGeometry = new THREE.BufferGeometry();
    const particleCount = 2000;
    const posArray = new Float32Array(particleCount * 3);
    const speedArray = new Float32Array(particleCount);
    
    for(let i = 0; i < particleCount * 3; i++) {
      // Position particles in a cube
      posArray[i] = (Math.random() - 0.5) * 50;
      if (i % 3 === 0) {
        // Store speed for each particle
        speedArray[i/3] = Math.random() * 0.02;
      }
    }
    
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    
    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.05,
      color: 0xffffff,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending
    });
    
    const particleSystem = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particleSystem);

    // Create trident
    const tridentGroup = new THREE.Group();
    
    // Material for the entire trident
    const tridentMaterial = new THREE.MeshPhongMaterial({ 
      color: 0xffd700,
      metalness: 1,
      roughness: 0.5,
      emissive: 0x996515,
      emissiveIntensity: 0.2
    });

    // Create handle
    const handleGeometry = new THREE.CylinderGeometry(0.1, 0.1, 6, 32);
    const handle = new THREE.Mesh(handleGeometry, tridentMaterial);
    handle.position.y = -2;
    tridentGroup.add(handle);

    // Create prongs
    const prongGeometry = new THREE.CylinderGeometry(0.08, 0.08, 2, 32);
    
    // Center prong (slightly longer)
    const centerProng = new THREE.Mesh(prongGeometry, tridentMaterial);
    centerProng.position.y = 2;
    tridentGroup.add(centerProng);

    // Left prong
    const leftProng = new THREE.Mesh(prongGeometry, tridentMaterial);
    leftProng.position.set(-0.4, 1.8, 0);
    leftProng.rotation.z = -0.2;
    tridentGroup.add(leftProng);

    // Right prong
    const rightProng = new THREE.Mesh(prongGeometry, tridentMaterial);
    rightProng.position.set(0.4, 1.8, 0);
    rightProng.rotation.z = 0.2;
    tridentGroup.add(rightProng);

    // Create decorative head piece
    const headGeometry = new THREE.TorusGeometry(0.3, 0.08, 16, 100);
    const head = new THREE.Mesh(headGeometry, tridentMaterial);
    head.position.y = 1;
    head.rotation.x = Math.PI / 2;
    tridentGroup.add(head);

    scene.add(tridentGroup);
    tridentRef.current = tridentGroup;

    // Add ambient and directional light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    const pointLight = new THREE.PointLight(0xffd700, 1, 100);
    pointLight.position.set(0, 0, 5);
    scene.add(pointLight);

    camera.position.z = 15;

    // Mouse move event listener
    const handleMouseMove = (event: MouseEvent) => {
      mousePosition.current = {
        x: (event.clientX / window.innerWidth) * 2 - 1,
        y: -(event.clientY / window.innerHeight) * 2 + 1
      };
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Handle window resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    // Handle scroll
    const handleScroll = () => {
      if (!tridentRef.current) return;

      const currentScrollY = window.scrollY;
      const scrollDelta = currentScrollY - lastScrollY.current;
      lastScrollY.current = currentScrollY;

      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = currentScrollY / maxScroll;

      // Move trident based on scroll
      tridentRef.current.position.y = 2 - scrollPercent * 4; // Move from top to bottom
      tridentRef.current.position.x = Math.sin(scrollPercent * Math.PI * 2) * 3; // Side to side movement
      tridentRef.current.position.z = Math.cos(scrollPercent * Math.PI) * 2; // Forward/back movement

      // Rotate trident based on scroll direction and position
      tridentRef.current.rotation.y += scrollDelta * 0.002; // Continuous rotation based on scroll speed
      tridentRef.current.rotation.x = Math.sin(scrollPercent * Math.PI * 2) * 0.3; // Tilt forward/back
      tridentRef.current.rotation.z = Math.cos(scrollPercent * Math.PI * 2) * 0.2; // Side tilt

      console.log('Scroll:', scrollPercent, 'Position:', tridentRef.current.position);
    };
    window.addEventListener('scroll', handleScroll);

    // Animation
    const animate = () => {
      requestAnimationFrame(animate);

      // Update particles
      const positions = particlesGeometry.attributes.position.array as Float32Array;
      for(let i = 0; i < particleCount * 3; i += 3) {
        // Move particles based on their speed
        positions[i + 1] -= speedArray[i/3];
        
        // Reset particles when they go below the screen
        if(positions[i + 1] < -25) {
          positions[i + 1] = 25;
        }

        // Add subtle movement based on mouse position
        positions[i] += mousePosition.current.x * 0.001;
        positions[i + 2] += mousePosition.current.y * 0.001;
      }
      particlesGeometry.attributes.position.needsUpdate = true;

      // Rotate particle system slightly
      particleSystem.rotation.y += 0.0003;
      
      controls.update();
      renderer.render(scene, camera);
    };

    animate();

    // Cleanup
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
      mountRef.current?.removeChild(renderer.domElement);
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          object.geometry.dispose();
          object.material.dispose();
        }
      });
    };
  }, []);

  return (
    <>
      <div className="canvas-container" ref={mountRef} />
      <div className="content">
        <section className="hero">
          <div className="hero-text">
            <TextEffect text="John Triton" fontSize={72} />
            <TextEffect text="Computer Science Student @ UCSD" fontSize={32} />
          </div>
          <div className="scroll-indicator">
            ↓ Scroll to explore
          </div>
        </section>

        <section id="about">
          <div className="about-content">
            <h2>About Me</h2>
            <p>
              Hey there! I'm a junior at UC San Diego, majoring in Computer Science with a focus on Graphics and Vision. 
              When I'm not coding or debugging, you can find me surfing at Black's Beach or contributing to UCSD's VR Club.
            </p>
            <p>
              I'm passionate about combining creativity with technology, especially in the realms of 3D graphics, 
              game development, and interactive web experiences.
            </p>
          </div>
        </section>

        <section id="projects">
          <h2>Projects</h2>
          <div className="projects-grid">
            <div className="project-card">
              <h3>VR Study Spaces</h3>
              <p>A virtual reality application that recreates UCSD's iconic study spots in VR. Built with Unity and Oculus SDK.</p>
            </div>
            <div className="project-card">
              <h3>Triton Navigation</h3>
              <p>An AR wayfinding app that helps new students navigate UCSD's campus. Developed using ARCore and Flutter.</p>
            </div>
            <div className="project-card">
              <h3>Ocean Data Visualization</h3>
              <p>Interactive 3D visualization of Scripps Institution of Oceanography data using Three.js and D3.</p>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

export default App;
