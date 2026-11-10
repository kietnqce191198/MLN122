import React, { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { TruongBanModel } from './HumanCharacters'
import { PlayerController } from './PlayerController'
import { useGameStore } from '../../store/useGameStore'

// Biển 3D định danh Trưởng Bản vẽ trực tiếp trong WebGL Canvas (100% hiển thị, không phụ thuộc DOM)
function TruongBanTag3D({ nearNPC }) {
  const meshRef = useRef()
  const diamondRef = useRef()
  const isInteracting = nearNPC === 'TruongBan'

  const texture = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 512
    canvas.height = 160
    const ctx = canvas.getContext('2d')

    const bgColor = isInteracting ? '#059669' : '#1E3A8A' // Xanh ngọc khi đối thoại, Xanh dương HTX mặc định
    const borderColor = isInteracting ? '#FFFFFF' : '#38BDF8'

    // Vẽ nền hộp bo góc
    ctx.fillStyle = bgColor
    ctx.strokeStyle = borderColor
    ctx.lineWidth = 8

    const r = 28
    const x = 16, y = 12, w = 480, h = 100
    ctx.beginPath()
    ctx.moveTo(x + r, y)
    ctx.lineTo(x + w - r, y)
    ctx.quadraticCurveTo(x + w, y, x + w, y + r)
    ctx.lineTo(x + w, y + h - r)
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
    ctx.lineTo(x + r, y + h)
    ctx.quadraticCurveTo(x, y + h, x, y + h - r)
    ctx.lineTo(x, y + r)
    ctx.quadraticCurveTo(x, y, x + r, y)
    ctx.closePath()
    ctx.fill()
    ctx.stroke()

    // Mũi tên chỉ xuống đầu Trưởng Bản
    ctx.fillStyle = bgColor
    ctx.beginPath()
    ctx.moveTo(236, y + h)
    ctx.lineTo(276, y + h)
    ctx.lineTo(256, y + h + 24)
    ctx.closePath()
    ctx.fill()
    ctx.beginPath()
    ctx.moveTo(236, y + h)
    ctx.lineTo(256, y + h + 24)
    ctx.lineTo(276, y + h)
    ctx.stroke()

    // Chấm tròn phát sáng
    ctx.fillStyle = isInteracting ? '#FFFFFF' : '#38BDF8'
    ctx.beginPath()
    ctx.arc(68, y + h / 2, 16, 0, Math.PI * 2)
    ctx.fill()

    // Chữ TRƯỞNG BẢN in hoa đậm nét
    ctx.fillStyle = '#FFFFFF'
    ctx.font = 'bold 50px Arial, "Segoe UI", sans-serif'
    ctx.textAlign = 'left'
    ctx.textBaseline = 'middle'
    ctx.fillText('TRƯỞNG BẢN', 104, y + h / 2)

    const tex = new THREE.CanvasTexture(canvas)
    tex.needsUpdate = true
    return tex
  }, [isInteracting])

  useFrame((state) => {
    if (meshRef.current) {
      // Quay thẳng về phía camera người chơi
      meshRef.current.quaternion.copy(state.camera.quaternion)
      // Nhấp nhô mượt mà
      meshRef.current.position.y = 2.4 + Math.sin(state.clock.elapsedTime * 2.5) * 0.06
    }
    if (diamondRef.current) {
      diamondRef.current.rotation.y += 0.04
    }
  })

  return (
    <group position={[0, 0, 0]}>
      {/* Viên kim cương phát sáng xoay tròn phía trên biển */}
      <mesh ref={diamondRef} position={[0, 2.78, 0]}>
        <octahedronGeometry args={[0.15, 0]} />
        <meshStandardMaterial
          color={isInteracting ? '#34D399' : '#38BDF8'}
          emissive={isInteracting ? '#10B981' : '#0284C7'}
          emissiveIntensity={0.9}
        />
      </mesh>

      {/* Biển hiệu Billboard 3D luôn nhìn thẳng vào mắt người chơi */}
      <mesh ref={meshRef} position={[0, 2.4, 0]}>
        <planeGeometry args={[1.85, 0.58]} />
        <meshBasicMaterial map={texture} transparent depthTest={false} depthWrite={false} />
      </mesh>
    </group>
  )
}

// Cây bưởi Năm Roi trĩu quả xanh tươi
function LushGrapefruitTree({ position }) {
  return (
    <group position={position}>
      {/* Thân cây gỗ nâu đậm */}
      <mesh position={[0, 1.1, 0]} castShadow>
        <cylinderGeometry args={[0.2, 0.3, 2.2, 8]} />
        <meshStandardMaterial color="#451A03" roughness={0.85} />
      </mesh>
      {/* Tán lá xanh tươi tốt tầng 1 */}
      <mesh position={[0, 2.4, 0]} castShadow>
        <sphereGeometry args={[1.2, 10, 10]} />
        <meshStandardMaterial color="#16A34A" roughness={0.7} />
      </mesh>
      {/* Tán lá tầng 2 */}
      <mesh position={[0, 3.1, 0]} castShadow>
        <sphereGeometry args={[0.85, 8, 8]} />
        <meshStandardMaterial color="#22C55E" roughness={0.7} />
      </mesh>

      {/* Những chùm bưởi Năm Roi vàng óng */}
      <mesh position={[0.5, 2.1, 0.5]} castShadow>
        <sphereGeometry args={[0.16, 8, 8]} />
        <meshStandardMaterial color="#FACC15" roughness={0.35} />
      </mesh>
      <mesh position={[-0.5, 1.9, -0.5]} castShadow>
        <sphereGeometry args={[0.15, 8, 8]} />
        <meshStandardMaterial color="#FACC15" roughness={0.35} />
      </mesh>
      <mesh position={[0.2, 2.3, -0.6]} castShadow>
        <sphereGeometry args={[0.15, 8, 8]} />
        <meshStandardMaterial color="#EAB308" roughness={0.35} />
      </mesh>
    </group>
  )
}

// Chiếc xuồng ba lá Nam Bộ bên bờ kênh
function WoodenSampan({ position, rotation }) {
  return (
    <group position={position} rotation={rotation}>
      <mesh position={[0, 0.15, 0]} castShadow>
        <boxGeometry args={[1.1, 0.22, 3.2]} />
        <meshStandardMaterial color="#78350F" roughness={0.6} />
      </mesh>
      <mesh position={[0, 0.45, 0.2]} castShadow>
        <cylinderGeometry args={[0.5, 0.5, 1.1, 12, 1, false, 0, Math.PI]} rotation={[0, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#D97706" roughness={0.9} />
      </mesh>
    </group>
  )
}

export function SceneFarm() {
  const nearNPC = useGameStore((state) => state.nearNPC)
  const isGameOver = useGameStore((state) => state.isGameOver)
  const isVictory = useGameStore((state) => state.isVictory)
  const show3DLabels = !isGameOver && !isVictory

  return (
    <>
      {/* Bầu trời xanh ban mai tươi sáng, thoáng đãng */}
      <color attach="background" args={['#BAE6FD']} />

      {/* Ánh sáng ban mai rực rỡ, góc chiếu từ trên cao */}
      <ambientLight intensity={0.8} color="#E0F2FE" />
      <directionalLight
        position={[10, 18, 10]}
        intensity={1.4}
        color="#FEF08A"
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      <directionalLight position={[-8, 6, -6]} intensity={0.4} color="#86EFAC" />

      {/* 1. NỀN CỎ VƯỜN BƯỞI XANH MƯỚT TƯƠI SẮC */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[50, 50]} />
        <meshStandardMaterial color="#22C55E" roughness={0.8} />
      </mesh>

      {/* 2. CON ĐƯỜNG MÒN ĐẤT PHÙ SA NỐI TỪ CHÚ TƯ [-2, 0, 3] ĐẾN TRƯỞNG BẢN [3, 0, 0] */}
      <mesh rotation={[-Math.PI / 2, 0, 0.55]} position={[0.5, 0.01, 1.5]} receiveShadow>
        <planeGeometry args={[2.5, 10]} />
        <meshStandardMaterial color="#B45309" roughness={0.95} />
      </mesh>

      {/* 3. DÒNG KÊNH NƯỚC XANH BIẾC MIỀN TÂY (Nằm bên phải, không chắn view) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[7.5, 0.02, 0]} receiveShadow>
        <planeGeometry args={[5, 45]} />
        <meshStandardMaterial color="#0284C7" roughness={0.2} metalness={0.3} />
      </mesh>

      {/* Chiếc xuồng ba lá neo đậu bên bờ kênh */}
      <WoodenSampan position={[6.5, 0, -1]} rotation={[0, 0.2, 0]} />

      {/* 4. RẶNG CÂY BƯỞI CHỈ ĐẶT Ở NGOẠI VI (Không che chắn camera và tầm nhìn nhân vật) */}
      {/* Phía sau xa */}
      <LushGrapefruitTree position={[-5, 0, -6]} />
      <LushGrapefruitTree position={[-1, 0, -6]} />
      <LushGrapefruitTree position={[4, 0, -6]} />

      {/* Rìa bên trái xa */}
      <LushGrapefruitTree position={[-7.5, 0, -2]} />
      <LushGrapefruitTree position={[-7.5, 0, 2.5]} />
      <LushGrapefruitTree position={[-7.5, 0, 6.5]} />

      {/* Rìa sau lưng kênh bên phải */}
      <LushGrapefruitTree position={[9, 0, -4]} />
      <LushGrapefruitTree position={[9, 0, 3]} />

      {/* Hàng rào tre mộc mạc phía xa */}
      <mesh position={[-8.5, 0.5, 0]} castShadow>
        <boxGeometry args={[0.2, 1, 30]} />
        <meshStandardMaterial color="#CA8A04" />
      </mesh>

      {/* 5. NHÂN VẬT CHÚ TƯ ĐƯỢC ĐIỀU KHIỂN (Bắt đầu ở vị trí thoáng [-2, 0, 3]) */}
      <PlayerController initialPosition={[-2, 0, 3]} boundaries={[-6, 5, -5, 5]} />

      {/* 6. NPC TRƯỞNG BẢN ĐỨNG BÊN BỜ KÊNH TẠI [3, 0, 0] */}
      <group position={[3, 0, 0]}>
        {/* Vòng sáng hào quang dưới chân Trưởng Bản */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, 0]}>
          <ringGeometry args={[0.45, 0.85, 32]} />
          <meshBasicMaterial
            color={nearNPC === 'TruongBan' ? '#22C55E' : '#F59E0B'}
            opacity={0.85}
            transparent
          />
        </mesh>

        <TruongBanModel />

        {/* Biển định danh 3D Trưởng Bản trực tiếp trong WebGL */}
        {show3DLabels && <TruongBanTag3D nearNPC={nearNPC} />}
      </group>
    </>
  )
}
