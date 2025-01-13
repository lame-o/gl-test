import { useEffect } from 'react'
import { useThree, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export function MovementControls() {
  const { camera } = useThree()
  const keys = {
    forward: false,
    backward: false,
    left: false,
    right: false,
    shift: false,
  }
  const velocity = new THREE.Vector3()
  const direction = new THREE.Vector3()
  const frontVector = new THREE.Vector3()
  const sideVector = new THREE.Vector3()

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.code) {
        case 'KeyW':
          keys.forward = true
          break
        case 'KeyS':
          keys.backward = true
          break
        case 'KeyA':
          keys.left = true
          break
        case 'KeyD':
          keys.right = true
          break
        case 'ShiftLeft':
          keys.shift = true
          break
      }
    }

    const handleKeyUp = (event: KeyboardEvent) => {
      switch (event.code) {
        case 'KeyW':
          keys.forward = false
          break
        case 'KeyS':
          keys.backward = false
          break
        case 'KeyA':
          keys.left = false
          break
        case 'KeyD':
          keys.right = false
          break
        case 'ShiftLeft':
          keys.shift = false
          break
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('keyup', handleKeyUp)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('keyup', handleKeyUp)
    }
  }, [])

  useFrame(() => {
    if (!document.pointerLockElement) return

    const speed = keys.shift ? 0.5 : 0.2

    frontVector.set(0, 0, Number(keys.backward) - Number(keys.forward))
    sideVector.set(Number(keys.left) - Number(keys.right), 0, 0)
    direction.subVectors(frontVector, sideVector)
      .normalize()
      .multiplyScalar(speed)
      .applyEuler(camera.rotation)

    // Update velocity with smooth acceleration
    velocity.lerp(direction, 0.1)

    // Move the camera
    camera.position.add(velocity)
  })

  return null
}
