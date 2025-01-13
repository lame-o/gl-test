import { Canvas } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera } from '@react-three/drei'
import { EnvironmentModel } from './EnvironmentScene'
import { Suspense } from 'react'

export function EnvironmentViewer() {
  return (
    <Canvas style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: '70vh' }}>
      <Suspense fallback={null}>
        <PerspectiveCamera makeDefault position={[0, 2, 12]} fov={90} />
        <ambientLight intensity={0.7} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <hemisphereLight intensity={0.5} />
        <EnvironmentModel />
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
