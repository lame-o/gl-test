import { useLoader } from '@react-three/fiber'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

export function EnvironmentModel() {
  const gltf = useLoader(GLTFLoader, '/models/submerged_era.glb')

  return (
    <primitive 
      object={gltf.scene} 
      scale={[65, 65, 65]}
      position={[0, -3, 0]}
      rotation={[0, Math.PI / 4, 0]}
    />
  )
}
