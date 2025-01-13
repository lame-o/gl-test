import { useGLTF } from '@react-three/drei'
import { useRef } from 'react'
import { Group } from 'three'

export function StatueModel() {
  const group = useRef<Group>(null)
  // Replace '/models/statue.glb' with your actual model path once you add it
  const { nodes, materials } = useGLTF('/models/statue.glb')

  return (
    <group ref={group} dispose={null}>
      <primitive object={nodes.Scene} />
    </group>
  )
}

useGLTF.preload('/models/statue.glb')
