import { useRef, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { ChuTuModel } from './HumanCharacters'
import { useGameStore } from '../../store/useGameStore'

export function PlayerController({ initialPosition = [-2, 0, 3], boundaries = [-8, 6, -6, 6] }) {
  const groupRef = useRef()
  const currentPos = useRef(new THREE.Vector3(...initialPosition))
  const targetRotation = useRef(0)
  const isMovingRef = useRef(false)
  const walkPhaseRef = useRef(0)

  // Phím điều khiển vật lý
  const keys = useRef({
    forward: false,
    backward: false,
    left: false,
    right: false
  })

  // Đọc input ảo từ D-Pad
  const virtualMovement = useGameStore((state) => state.virtualMovement)
  const setPlayerDistanceToNPC = useGameStore((state) => state.setPlayerDistanceToNPC)

  useEffect(() => {
    const handleKeyDown = (e) => {
      const k = e.key.toLowerCase()
      if (k === 'w' || k === 'arrowup') keys.current.forward = true
      if (k === 's' || k === 'arrowdown') keys.current.backward = true
      if (k === 'a' || k === 'arrowleft') keys.current.left = true
      if (k === 'd' || k === 'arrowright') keys.current.right = true
    }

    const handleKeyUp = (e) => {
      const k = e.key.toLowerCase()
      if (k === 'w' || k === 'arrowup') keys.current.forward = false
      if (k === 's' || k === 'arrowdown') keys.current.backward = false
      if (k === 'a' || k === 'arrowleft') keys.current.left = false
      if (k === 'd' || k === 'arrowright') keys.current.right = false
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [])

  useFrame((state, delta) => {
    if (!groupRef.current) return

    const speed = 4.2
    let moveX = 0
    let moveZ = 0

    if (keys.current.forward || virtualMovement.up) moveZ -= 1
    if (keys.current.backward || virtualMovement.down) moveZ += 1
    if (keys.current.left || virtualMovement.left) moveX -= 1
    if (keys.current.right || virtualMovement.right) moveX += 1

    const isMoving = moveX !== 0 || moveZ !== 0
    isMovingRef.current = isMoving

    if (isMoving) {
      walkPhaseRef.current += delta * 1.5

      const moveVec = new THREE.Vector2(moveX, moveZ).normalize()
      currentPos.current.x += moveVec.x * speed * delta
      currentPos.current.y = 0
      currentPos.current.z += moveVec.y * speed * delta

      currentPos.current.x = Math.max(boundaries[0], Math.min(boundaries[1], currentPos.current.x))
      currentPos.current.z = Math.max(boundaries[2], Math.min(boundaries[3], currentPos.current.z))

      targetRotation.current = Math.atan2(moveVec.x, moveVec.y)
    }

    groupRef.current.position.copy(currentPos.current)
    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y,
      targetRotation.current,
      delta * 12
    )

    // Báo vị trí Chú Tư lên Store
    setPlayerDistanceToNPC({
      x: currentPos.current.x,
      z: currentPos.current.z
    })

    // Góc máy camera thoáng đãng, nhìn từ trên cao xuống tránh vật cản và cho khoảng không trên đầu NPC
    const cameraTarget = new THREE.Vector3(
      currentPos.current.x,
      currentPos.current.y + 5.2,
      currentPos.current.z + 7.6
    )
    state.camera.position.lerp(cameraTarget, delta * 3)
    state.camera.lookAt(currentPos.current.x, currentPos.current.y + 0.7, currentPos.current.z)
  })

  return (
    <group ref={groupRef} position={initialPosition}>
      {/* Vòng định vị dưới chân Chú Tư */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <ringGeometry args={[0.3, 0.45, 24]} />
        <meshBasicMaterial color="#EAB308" opacity={0.6} transparent />
      </mesh>

      <ChuTuModel isMoving={isMovingRef.current} walkPhase={walkPhaseRef.current} />
    </group>
  )
}
