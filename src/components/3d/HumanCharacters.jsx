import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'

/**
 * 1. NHÂN VẬT CHÚ TƯ (Nông dân Vĩnh Long)
 * Đội nón lá, quàng khăn rằn, áo bà ba nâu, có animation bước đi chân thực khi di chuyển!
 */
export function ChuTuModel({ isMovingRef, walkPhaseRef, isMoving = false, walkPhase = 0 }) {
  const leftLegRef = useRef()
  const rightLegRef = useRef()
  const leftArmRef = useRef()
  const rightArmRef = useRef()

  useFrame(() => {
    const moving = isMovingRef ? isMovingRef.current : isMoving
    const phase = walkPhaseRef ? walkPhaseRef.current : walkPhase

    if (moving) {
      const swing = Math.sin(phase * 10) * 0.45
      if (leftLegRef.current) leftLegRef.current.rotation.x = swing
      if (rightLegRef.current) rightLegRef.current.rotation.x = -swing
      if (leftArmRef.current) leftArmRef.current.rotation.x = -swing * 0.7
      if (rightArmRef.current) rightArmRef.current.rotation.x = swing * 0.7
    } else {
      if (leftLegRef.current) leftLegRef.current.rotation.x = 0
      if (rightLegRef.current) rightLegRef.current.rotation.x = 0
      if (leftArmRef.current) leftArmRef.current.rotation.x = 0
      if (rightArmRef.current) rightArmRef.current.rotation.x = 0
    }
  })

  return (
    <group position={[0, 0, 0]}>
      {/* 1. NÓN LÁ TRUYỀN THỐNG */}
      <mesh position={[0, 1.82, 0]} castShadow>
        <coneGeometry args={[0.55, 0.28, 16]} />
        <meshStandardMaterial color="#EAB308" roughness={0.9} />
      </mesh>
      {/* Chóp nón */}
      <mesh position={[0, 1.96, 0]}>
        <sphereGeometry args={[0.04, 8, 8]} />
        <meshStandardMaterial color="#CA8A04" />
      </mesh>

      {/* 2. ĐẦU VÀ KHUÔN MẶT */}
      <mesh position={[0, 1.55, 0]} castShadow>
        <sphereGeometry args={[0.22, 16, 16]} />
        <meshStandardMaterial color="#E0AC69" roughness={0.6} />
      </mesh>
      {/* Đôi mắt */}
      <mesh position={[-0.07, 1.58, 0.2]}>
        <sphereGeometry args={[0.025, 8, 8]} />
        <meshBasicMaterial color="#1E293B" />
      </mesh>
      <mesh position={[0.07, 1.58, 0.2]}>
        <sphereGeometry args={[0.025, 8, 8]} />
        <meshBasicMaterial color="#1E293B" />
      </mesh>
      {/* Chòm râu mép mộc mạc của Chú Tư */}
      <mesh position={[0, 1.51, 0.21]}>
        <boxGeometry args={[0.12, 0.03, 0.02]} />
        <meshBasicMaterial color="#334155" />
      </mesh>

      {/* 3. KHĂN RẰN NAM BỘ VẮT VAI */}
      <mesh position={[0.08, 1.36, 0.1]} rotation={[0, 0, -0.3]}>
        <boxGeometry args={[0.16, 0.35, 0.08]} />
        <meshStandardMaterial color="#DC2626" />
      </mesh>
      <mesh position={[-0.08, 1.36, -0.1]} rotation={[0, 0, 0.3]}>
        <boxGeometry args={[0.16, 0.35, 0.08]} />
        <meshStandardMaterial color="#FFFFFF" />
      </mesh>

      {/* 4. THÂN MÌNH (Áo bà ba nâu) */}
      <mesh position={[0, 1.05, 0]} castShadow>
        <boxGeometry args={[0.48, 0.65, 0.28]} />
        <meshStandardMaterial color="#78350F" roughness={0.8} />
      </mesh>
      {/* Cúc áo bà ba */}
      <mesh position={[0, 1.15, 0.145]}>
        <sphereGeometry args={[0.02, 6, 6]} />
        <meshBasicMaterial color="#FEF08A" />
      </mesh>
      <mesh position={[0, 1.0, 0.145]}>
        <sphereGeometry args={[0.02, 6, 6]} />
        <meshBasicMaterial color="#FEF08A" />
      </mesh>
      <mesh position={[0, 0.85, 0.145]}>
        <sphereGeometry args={[0.02, 6, 6]} />
        <meshBasicMaterial color="#FEF08A" />
      </mesh>

      {/* 5. TAY TRÁI & TAY PHẢI */}
      <group ref={leftArmRef} position={[-0.32, 1.3, 0]}>
        <mesh position={[0, -0.28, 0]} castShadow>
          <boxGeometry args={[0.12, 0.55, 0.14]} />
          <meshStandardMaterial color="#78350F" />
        </mesh>
        {/* Bàn tay */}
        <mesh position={[0, -0.58, 0]}>
          <sphereGeometry args={[0.06, 8, 8]} />
          <meshStandardMaterial color="#E0AC69" />
        </mesh>
      </group>

      <group ref={rightArmRef} position={[0.32, 1.3, 0]}>
        <mesh position={[0, -0.28, 0]} castShadow>
          <boxGeometry args={[0.12, 0.55, 0.14]} />
          <meshStandardMaterial color="#78350F" />
        </mesh>
        <mesh position={[0, -0.58, 0]}>
          <sphereGeometry args={[0.06, 8, 8]} />
          <meshStandardMaterial color="#E0AC69" />
        </mesh>
      </group>

      {/* 6. CHÂN TRÁI & PHẢI (Quần đen sắn gấu) */}
      <group ref={leftLegRef} position={[-0.14, 0.72, 0]}>
        <mesh position={[0, -0.36, 0]} castShadow>
          <boxGeometry args={[0.16, 0.72, 0.18]} />
          <meshStandardMaterial color="#1E293B" />
        </mesh>
        {/* Dép lào nông dân */}
        <mesh position={[0, -0.73, 0.05]} castShadow>
          <boxGeometry args={[0.17, 0.06, 0.28]} />
          <meshStandardMaterial color="#0F172A" />
        </mesh>
      </group>

      <group ref={rightLegRef} position={[0.14, 0.72, 0]}>
        <mesh position={[0, -0.36, 0]} castShadow>
          <boxGeometry args={[0.16, 0.72, 0.18]} />
          <meshStandardMaterial color="#1E293B" />
        </mesh>
        <mesh position={[0, -0.73, 0.05]} castShadow>
          <boxGeometry args={[0.17, 0.06, 0.28]} />
          <meshStandardMaterial color="#0F172A" />
        </mesh>
      </group>
    </group>
  )
}

/**
 * 2. NHÂN VẬT TRƯỞNG BẢN / GIÁM ĐỐC HTX
 * Sơ mi xanh công sở, đeo kính, đeo thẻ HTX Tấn Đạt
 */
export function TruongBanModel() {
  const groupRef = useRef()

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 1.5) * 0.02
    }
  })

  return (
    <group ref={groupRef}>
      {/* Tóc ngắn chỉn chu */}
      <mesh position={[0, 1.74, 0]}>
        <sphereGeometry args={[0.22, 14, 14]} />
        <meshStandardMaterial color="#18181B" />
      </mesh>
      {/* Khuôn mặt */}
      <mesh position={[0, 1.62, 0.04]} castShadow>
        <sphereGeometry args={[0.21, 14, 14]} />
        <meshStandardMaterial color="#F3C59A" />
      </mesh>
      {/* Mắt kính trí thức */}
      <mesh position={[0, 1.65, 0.24]}>
        <boxGeometry args={[0.28, 0.07, 0.02]} />
        <meshStandardMaterial color="#0F172A" metalness={0.8} />
      </mesh>

      {/* Áo sơ mi xanh dương HTX */}
      <mesh position={[0, 1.15, 0]} castShadow>
        <boxGeometry args={[0.5, 0.7, 0.3]} />
        <meshStandardMaterial color="#2563EB" roughness={0.6} />
      </mesh>
      {/* Thẻ nhân viên HTX đeo cổ */}
      <mesh position={[0, 1.18, 0.16]}>
        <boxGeometry args={[0.12, 0.18, 0.02]} />
        <meshStandardMaterial color="#EF4444" />
      </mesh>

      {/* Tay */}
      <mesh position={[-0.32, 1.05, 0]} castShadow>
        <boxGeometry args={[0.12, 0.6, 0.14]} />
        <meshStandardMaterial color="#2563EB" />
      </mesh>
      <mesh position={[0.32, 1.05, 0]} castShadow>
        <boxGeometry args={[0.12, 0.6, 0.14]} />
        <meshStandardMaterial color="#2563EB" />
      </mesh>

      {/* Quần tây âu đen & Giày da */}
      <mesh position={[-0.14, 0.4, 0]} castShadow>
        <boxGeometry args={[0.17, 0.8, 0.2]} />
        <meshStandardMaterial color="#18181B" />
      </mesh>
      <mesh position={[0.14, 0.4, 0]} castShadow>
        <boxGeometry args={[0.17, 0.8, 0.2]} />
        <meshStandardMaterial color="#18181B" />
      </mesh>
    </group>
  )
}

/**
 * 3. NHÂN VẬT THƯƠNG LÁI (Gạ mua ngoài giá +10%)
 * Áo vest đỏ rượu sang trọng, kính râm đen, xách cặp táp tiền
 */
export function ThuongLaiModel() {
  return (
    <group>
      {/* Đầu & Kính râm cực ngầu */}
      <mesh position={[0, 1.65, 0]} castShadow>
        <sphereGeometry args={[0.22, 14, 14]} />
        <meshStandardMaterial color="#ECC090" />
      </mesh>
      <mesh position={[0, 1.68, 0.21]}>
        <boxGeometry args={[0.26, 0.09, 0.03]} />
        <meshBasicMaterial color="#000000" />
      </mesh>

      {/* Áo vest đỏ đô rượu vang */}
      <mesh position={[0, 1.18, 0]} castShadow>
        <boxGeometry args={[0.52, 0.72, 0.3]} />
        <meshStandardMaterial color="#991B1B" roughness={0.4} />
      </mesh>
      {/* Cà vạt vàng kim bóng loáng */}
      <mesh position={[0, 1.18, 0.16]}>
        <boxGeometry args={[0.07, 0.4, 0.02]} />
        <meshStandardMaterial color="#FBBF24" metalness={0.5} />
      </mesh>

      {/* Tay phải xách vali / cặp táp tiền mặt */}
      <group position={[0.36, 0.9, 0]}>
        <mesh position={[0, -0.15, 0]} castShadow>
          <boxGeometry args={[0.12, 0.5, 0.14]} />
          <meshStandardMaterial color="#991B1B" />
        </mesh>
        {/* Cặp da đựng tiền */}
        <mesh position={[0.05, -0.45, 0]} castShadow>
          <boxGeometry args={[0.12, 0.28, 0.4]} />
          <meshStandardMaterial color="#451A03" />
        </mesh>
      </group>
      <mesh position={[-0.34, 1.05, 0]} castShadow>
        <boxGeometry args={[0.12, 0.6, 0.14]} />
        <meshStandardMaterial color="#991B1B" />
      </mesh>

      {/* Quần tây & Giày bóng lộn */}
      <mesh position={[-0.14, 0.42, 0]} castShadow>
        <boxGeometry args={[0.17, 0.84, 0.2]} />
        <meshStandardMaterial color="#3F3F46" />
      </mesh>
      <mesh position={[0.14, 0.42, 0]} castShadow>
        <boxGeometry args={[0.17, 0.84, 0.2]} />
        <meshStandardMaterial color="#3F3F46" />
      </mesh>
    </group>
  )
}

/**
 * 4. NHÂN VẬT CÁN BỘ NHÀ NƯỚC
 * Bộ vest đen trang nghiêm, cài huy hiệu Quốc kỳ cờ đỏ sao vàng
 */
export function CanBoModel() {
  return (
    <group>
      {/* Khuôn mặt cương trực */}
      <mesh position={[0, 1.68, 0]} castShadow>
        <sphereGeometry args={[0.22, 14, 14]} />
        <meshStandardMaterial color="#ECC090" />
      </mesh>
      <mesh position={[0, 1.82, -0.04]}>
        <sphereGeometry args={[0.22, 14, 14]} />
        <meshStandardMaterial color="#18181B" />
      </mesh>

      {/* Áo complet đen chính quyền */}
      <mesh position={[0, 1.2, 0]} castShadow>
        <boxGeometry args={[0.54, 0.74, 0.32]} />
        <meshStandardMaterial color="#0F172A" roughness={0.5} />
      </mesh>
      {/* Áo sơ mi trắng bên trong & Cà vạt đỏ */}
      <mesh position={[0, 1.35, 0.16]}>
        <boxGeometry args={[0.16, 0.25, 0.02]} />
        <meshBasicMaterial color="#FFFFFF" />
      </mesh>
      <mesh position={[0, 1.2, 0.17]}>
        <boxGeometry args={[0.06, 0.35, 0.02]} />
        <meshBasicMaterial color="#DC2626" />
      </mesh>
      {/* Huy hiệu Cờ Đỏ Sao Vàng trên ngực áo */}
      <mesh position={[-0.16, 1.38, 0.17]}>
        <boxGeometry args={[0.06, 0.045, 0.02]} />
        <meshBasicMaterial color="#EF4444" />
      </mesh>
      <mesh position={[-0.16, 1.38, 0.182]}>
        <sphereGeometry args={[0.012, 6, 6]} />
        <meshBasicMaterial color="#FBBF24" />
      </mesh>

      {/* Hai tay chắp trước trang trọng */}
      <mesh position={[-0.34, 1.1, 0.08]} rotation={[0.4, 0, 0]} castShadow>
        <boxGeometry args={[0.12, 0.58, 0.14]} />
        <meshStandardMaterial color="#0F172A" />
      </mesh>
      <mesh position={[0.34, 1.1, 0.08]} rotation={[0.4, 0, 0]} castShadow>
        <boxGeometry args={[0.12, 0.58, 0.14]} />
        <meshStandardMaterial color="#0F172A" />
      </mesh>

      {/* Quần tây trang nghiêm */}
      <mesh position={[-0.15, 0.44, 0]} castShadow>
        <boxGeometry args={[0.18, 0.88, 0.22]} />
        <meshStandardMaterial color="#0F172A" />
      </mesh>
      <mesh position={[0.15, 0.44, 0]} castShadow>
        <boxGeometry args={[0.18, 0.88, 0.22]} />
        <meshStandardMaterial color="#0F172A" />
      </mesh>
    </group>
  )
}
