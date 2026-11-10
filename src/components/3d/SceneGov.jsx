import { useRef, useMemo } from 'react'
import { Sparkles, Html } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { Coins, Truck, ShieldCheck, Landmark } from 'lucide-react'
import { CanBoModel } from './HumanCharacters'
import { PlayerController } from './PlayerController'
import { useGameStore } from '../../store/useGameStore'

// Biển 3D định danh Cán Bộ Nhà Nước vẽ trực tiếp trong WebGL Canvas (100% hiển thị)
function CanBoTag3D({ nearNPC }) {
  const meshRef = useRef()
  const diamondRef = useRef()
  const isInteracting = nearNPC === 'CanBo'

  const texture = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 512
    canvas.height = 160
    const ctx = canvas.getContext('2d')

    const bgColor = isInteracting ? '#059669' : '#78350F'
    const borderColor = isInteracting ? '#FFFFFF' : '#FBBF24'

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

    // Mũi tên chỉ xuống đầu
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
    ctx.fillStyle = isInteracting ? '#FFFFFF' : '#FBBF24'
    ctx.beginPath()
    ctx.arc(68, y + h / 2, 16, 0, Math.PI * 2)
    ctx.fill()

    ctx.fillStyle = '#FFFFFF'
    ctx.font = 'bold 44px Arial, "Segoe UI", sans-serif'
    ctx.textAlign = 'left'
    ctx.textBaseline = 'middle'
    ctx.fillText('CÁN BỘ NHÀ NƯỚC', 100, y + h / 2)

    const tex = new THREE.CanvasTexture(canvas)
    tex.needsUpdate = true
    return tex
  }, [isInteracting])

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.quaternion.copy(state.camera.quaternion)
      meshRef.current.position.y = 2.45 + Math.sin(state.clock.elapsedTime * 2.5) * 0.06
    }
    if (diamondRef.current) {
      diamondRef.current.rotation.y += 0.04
    }
  })

  return (
    <group position={[0, 0, 0]}>
      <mesh ref={diamondRef} position={[0, 2.82, 0]}>
        <octahedronGeometry args={[0.15, 0]} />
        <meshStandardMaterial
          color={isInteracting ? '#34D399' : '#FDE047'}
          emissive={isInteracting ? '#10B981' : '#CA8A04'}
          emissiveIntensity={0.9}
        />
      </mesh>
      <mesh ref={meshRef} position={[0, 2.45, 0]}>
        <planeGeometry args={[2.0, 0.62]} />
        <meshBasicMaterial map={texture} transparent depthTest={false} depthWrite={false} />
      </mesh>
    </group>
  )
}

// Thẻ bài 3D bay lên theo trục Y thể hiện từng chính sách can thiệp của Nhà nước
function FloatingPolicyCard({ position, icon: Icon, title, desc, delay = 0, isVisible }) {
  const groupRef = useRef()

  useFrame((state) => {
    if (groupRef.current && isVisible) {
      const t = state.clock.elapsedTime + delay
      groupRef.current.position.y = position[1] + Math.sin(t * 1.8) * 0.12
    }
  })

  if (!isVisible) return null

  return (
    <group ref={groupRef} position={position}>
      <Html center distanceFactor={8}>
        <div className="animate-in fade-in zoom-in-75 duration-500 bg-slate-950/90 backdrop-blur-md border-2 border-cyan-400 p-3.5 rounded-2xl shadow-2xl flex items-center gap-3 w-64 text-left pointer-events-none transition-all shadow-cyan-950/80">
          <div className="p-3 bg-cyan-500/20 border border-cyan-400/50 rounded-xl text-cyan-300 shrink-0">
            <Icon size={26} className="stroke-[2.5]" />
          </div>
          <div>
            <h4 className="text-xs font-black uppercase text-cyan-200 tracking-wide">
              {title}
            </h4>
            <p className="text-[10px] text-slate-300 leading-tight mt-1 font-medium">
              {desc}
            </p>
          </div>
        </div>
      </Html>
    </group>
  )
}

// Cột đèn quảng trường Nhà nước tỏa sáng ấm áp
function PlazaLamp({ position }) {
  return (
    <group position={position}>
      <mesh position={[0, 1.5, 0]} castShadow>
        <cylinderGeometry args={[0.07, 0.09, 3, 12]} />
        <meshStandardMaterial color="#1E293B" metalness={0.8} />
      </mesh>
      {/* Hộp đèn */}
      <mesh position={[0, 3.1, 0]}>
        <boxGeometry args={[0.4, 0.45, 0.4]} />
        <meshStandardMaterial color="#FDE047" emissive="#FDE047" emissiveIntensity={0.6} />
      </mesh>
      <pointLight position={[0, 3.1, 0]} intensity={0.9} distance={8} color="#FEF08A" />
    </group>
  )
}

export function SceneGov() {
  const lightningLightRef = useRef()
  const nearNPC = useGameStore((state) => state.nearNPC)
  const isGameOver = useGameStore((state) => state.isGameOver)
  const isVictory = useGameStore((state) => state.isVictory)
  const policyCardsStep = useGameStore((state) => state.policyCardsStep)
  const show3DLabels = !isGameOver && !isVictory

  useFrame(() => {
    // Sấm sét chớp giật nhẹ nhàng trên nền trời
    if (lightningLightRef.current) {
      const rand = Math.random()
      if (rand > 0.95) {
        lightningLightRef.current.intensity = 3.5 + Math.random() * 2
      } else {
        lightningLightRef.current.intensity = THREE.MathUtils.lerp(
          lightningLightRef.current.intensity,
          0.2,
          0.25
        )
      }
    }
  })

  return (
    <>
      {/* 1. BẦU TRỜI XANH THÉP SÁNG SỦA, KHÔNG BỊ TỐI HÙI */}
      <color attach="background" args={['#1E293B']} />
      <fog attach="fog" args={['#1E293B', 20, 50]} />

      {/* 2. HỆ THỐNG ÁNH SÁNG RỰC RỠ, RÕ RÀNG */}
      <ambientLight intensity={1.05} color="#BAE6FD" />
      <directionalLight
        position={[10, 18, 8]}
        intensity={1.6}
        color="#FFFFFF"
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      <directionalLight position={[-8, 12, -6]} intensity={0.7} color="#60A5FA" />

      {/* Đèn sấm sét nền */}
      <pointLight
        ref={lightningLightRef}
        position={[0, 12, 0]}
        intensity={0.2}
        color="#E0F2FE"
        distance={45}
      />

      {/* Hạt mưa rơi nhẹ bằng Sparkles */}
      <Sparkles
        count={500}
        scale={[25, 14, 25]}
        size={2.5}
        speed={4}
        noise={0.3}
        color="#BAE6FD"
      />

      {/* 3. NỀN QUẢNG TRƯỜNG ĐÁ HOA CƯƠNG XANH XÁM SÁNG */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[50, 50]} />
        <meshStandardMaterial color="#475569" roughness={0.5} metalness={0.15} />
      </mesh>

      {/* Thảm đỏ dẫn đường từ vị trí Chú Tư [-2.2, 0, 3] đến Bục Cán Bộ [0, 0, 0] */}
      <mesh rotation={[-Math.PI / 2, 0, 0.6]} position={[-1.1, 0.015, 1.5]} receiveShadow>
        <planeGeometry args={[2.4, 8]} />
        <meshStandardMaterial color="#B91C1C" roughness={0.7} />
      </mesh>

      {/* Hai cột đèn quảng trường soi sáng lối đi */}
      <PlazaLamp position={[-5.2, 0, 1.5]} />
      <PlazaLamp position={[5.2, 0, 1.5]} />

      {/* 4. TÒA NHÀ TRỤ SỞ CƠ QUAN NHÀ NƯỚC UY NGHIÊM PHÍA SAU */}
      <group position={[0, 0, -4.5]}>
        {/* Khối nhà chính */}
        <mesh position={[0, 3.5, 0]} castShadow receiveShadow>
          <boxGeometry args={[18, 7, 2.5]} />
          <meshStandardMaterial color="#334155" roughness={0.5} />
        </mesh>

        {/* 4 Cột trụ đá trắng biểu trưng cho thể chế vững chắc */}
        <mesh position={[-5, 3, 1.3]} castShadow>
          <cylinderGeometry args={[0.28, 0.32, 6, 16]} />
          <meshStandardMaterial color="#CBD5E1" roughness={0.4} />
        </mesh>
        <mesh position={[-2, 3, 1.3]} castShadow>
          <cylinderGeometry args={[0.28, 0.32, 6, 16]} />
          <meshStandardMaterial color="#CBD5E1" roughness={0.4} />
        </mesh>
        <mesh position={[2, 3, 1.3]} castShadow>
          <cylinderGeometry args={[0.28, 0.32, 6, 16]} />
          <meshStandardMaterial color="#CBD5E1" roughness={0.4} />
        </mesh>
        <mesh position={[5, 3, 1.3]} castShadow>
          <cylinderGeometry args={[0.28, 0.32, 6, 16]} />
          <meshStandardMaterial color="#CBD5E1" roughness={0.4} />
        </mesh>

        {/* Biển hiệu cơ quan quản lý Nhà nước */}
        {show3DLabels && (
          <Html position={[0, 6.2, 1.4]} center distanceFactor={8}>
            <div className="w-max bg-red-700 text-yellow-300 border-2 border-yellow-400 px-6 py-2 rounded-2xl shadow-2xl flex items-center gap-2 select-none pointer-events-none">
              <Landmark size={20} className="text-yellow-400 fill-yellow-400 shrink-0" />
              <div className="text-center">
                <span className="text-xs font-black tracking-wider uppercase text-yellow-300 block">
                  CƠ QUAN QUẢN LÝ NHÀ NƯỚC - BỆ PHÓNG KIẾN TẠO
                </span>
                <span className="text-[10px] text-white/90 font-medium">
                  Ủng hộ mô hình HTX Nông nghiệp chuyển đổi số Vĩnh Long
                </span>
              </div>
            </div>
          </Html>
        )}
      </group>

      {/* 5. CÁN BỘ NHÀ NƯỚC (ĐỨNG TRÊN BỤC DANH DỰ TẠI [0, 0, 0]) */}
      <group position={[0, 0, 0]}>
        {/* Bục tròn đá hoa cương danh dự */}
        <mesh position={[0, 0.12, 0]} receiveShadow castShadow>
          <cylinderGeometry args={[2.2, 2.4, 0.24, 32]} />
          <meshStandardMaterial color="#1E293B" roughness={0.4} />
        </mesh>
        {/* Vòng viền vàng trang trọng */}
        <mesh position={[0, 0.25, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[1.9, 2.1, 32]} />
          <meshBasicMaterial color="#FBBF24" />
        </mesh>

        {/* Vòng hào quang tương tác dưới chân Cán Bộ */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.26, 0]}>
          <ringGeometry args={[0.45, 0.8, 32]} />
          <meshBasicMaterial
            color={nearNPC === 'CanBo' ? '#22C55E' : '#38BDF8'}
            opacity={0.85}
            transparent
          />
        </mesh>

        <CanBoModel />

        {/* Biển định danh 3D Cán Bộ trực tiếp trong WebGL */}
        {show3DLabels && <CanBoTag3D nearNPC={nearNPC} />}
      </group>

      {/* 6. CHÚ TƯ ĐƯỢC NGƯỜI CHƠI ĐIỀU KHIỂN */}
      <PlayerController initialPosition={[-2.2, 0, 3]} boundaries={[-8, 8, -2, 8]} />

      {/* 7. 3 THẺ BÀI CHÍNH SÁCH 3D: HIỆN LẦN LƯỢT 1 -> (0.5s) -> 2 -> (0.5s) -> 3 KHI ĐỤNG CÁN BỘ */}
      {show3DLabels && (
        <>
          {/* Mục 1: Vốn Drone 50% */}
          <FloatingPolicyCard
            position={[-3.3, 2.8, 1]}
            icon={Coins}
            title="1. Vốn Drone 50%"
            desc="Hỗ trợ 50% vốn vay ưu đãi nâng cấp công nghệ phun thuốc"
            delay={0}
            isVisible={policyCardsStep >= 1}
          />

          {/* Mục 2: Cao Tốc Vận Tải (Hiện sau 0.5s) */}
          <FloatingPolicyCard
            position={[0, 3.8, 1.5]}
            icon={Truck}
            title="2. Cao Tốc Vận Tải"
            desc="Đẩy nhanh tuyến Cần Thơ - Cà Mau giảm cước logistics"
            delay={0.8}
            isVisible={policyCardsStep >= 2}
          />

          {/* Mục 3: Trọng Tài Kinh Tế (Hiện sau 0.5s tiếp) */}
          <FloatingPolicyCard
            position={[3.3, 2.8, 1]}
            icon={ShieldCheck}
            title="3. Trọng Tài Kinh Tế"
            desc="Bảo vệ quyền lợi hợp pháp, chống đứt gãy chuỗi giá trị"
            delay={1.6}
            isVisible={policyCardsStep >= 3}
          />
        </>
      )}
    </>
  )
}
