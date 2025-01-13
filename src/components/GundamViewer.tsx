import { Canvas } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera } from '@react-three/drei'
import { Suspense } from 'react'
import { useLoader } from '@react-three/fiber'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

function GundamModel() {
  const gltf = useLoader(GLTFLoader, '/models/gundam.glb')

  return (
    <primitive 
      object={gltf.scene} 
      scale={[4, 4, 4]}
      position={[0, -2, 0]}
      rotation={[0, Math.PI / 4, 0]}
    />
  )
}

export function GundamViewer() {
  return (
    <Canvas style={{ position: 'relative', width: '100%', height: '100%' }}>
      <Suspense fallback={null}>
        <PerspectiveCamera makeDefault position={[0, 2, 8]} fov={60} />
        <ambientLight intensity={0.7} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <hemisphereLight intensity={0.5} />
        <GundamModel />
        <OrbitControls 
          enableZoom={false}
          enablePan={false}
          enableRotate={true}
          autoRotate={true}
          autoRotateSpeed={0.5}
          minPolarAngle={Math.PI / 3}
          maxPolarAngle={Math.PI / 2}
          dampingFactor={0.05}
          enableDamping={true}
        />
      </Suspense>
    </Canvas>
  )
}
