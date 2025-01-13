import { Canvas } from '@react-three/fiber'
import { OrbitControls, Stage } from '@react-three/drei'
import { StatueModel } from './StatueModel'

export function ModelViewer() {
  return (
    <div style={{ width: '100%', height: '400px', backgroundColor: '#f0f0f0', borderRadius: '8px', overflow: 'hidden' }}>
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
        <Stage environment="city" intensity={0.5}>
          <StatueModel />
        </Stage>
        <OrbitControls enableZoom={true} autoRotate={true} />
      </Canvas>
    </div>
  )
}
