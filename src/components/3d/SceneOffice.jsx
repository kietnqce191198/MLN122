import React from 'react'
import { Html } from '@react-three/drei'
import { TruongBanModel, ThuongLaiModel } from './HumanCharacters'
import { PlayerController } from './PlayerController'
import { useGameStore } from '../../store/useGameStore'

// Bàn làm việc văn phòng HTX
function OfficeDesk({ position }) {
  return (
    <group position={position}>
      {/* Mặt bàn gỗ sáng màu */}
      <mesh position={[0, 1.05, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.5, 0.08, 1.2]} />
        <meshStandardMaterial color="#A16207" roughness={0.4} />
      </mesh>
      {/* 4 Chân bàn kim loại */}
      <mesh position={[-1.15, 0.52, -0.5]} castShadow>
        <boxGeometry args={[0.08, 1.05, 0.08]} />
        <meshStandardMaterial color="#1E293B" />
      </mesh>
      <mesh position={[1.15, 0.52, -0.5]} castShadow>
        <boxGeometry args={[0.08, 1.05, 0.08]} />
        <meshStandardMaterial color="#1E293B" />
      </mesh>
      <mesh position={[-1.15, 0.52, 0.5]} castShadow>
        <boxGeometry args={[0.08, 1.05, 0.08]} />
        <meshStandardMaterial color="#1E293B" />
      </mesh>
      <mesh position={[1.15, 0.52, 0.5]} castShadow>
        <boxGeometry args={[0.08, 1.05, 0.08]} />
        <meshStandardMaterial color="#1E293B" />
      </mesh>

      {/* Laptop & Hồ sơ hợp đồng HTX */}
      <mesh position={[-0.4, 1.13, 0]} castShadow>
        <boxGeometry args={[0.5, 0.02, 0.35]} />
        <meshStandardMaterial color="#94A3B8" metalness={0.8} />
      </mesh>
      <mesh position={[0.4, 1.12, 0.1]} castShadow>
        <boxGeometry args={[0.35, 0.06, 0.45]} />
        <meshStandardMaterial color="#F8FAFC" />
      </mesh>
      {/* Con dấu đỏ HTX */}
      <mesh position={[0.7, 1.14, 0.1]} castShadow>
        <cylinderGeometry args={[0.06, 0.06, 0.1, 12]} />
        <meshStandardMaterial color="#DC2626" />
      </mesh>
    </group>
  )
}

export function SceneOffice() {
  const isGameOver = useGameStore((state) => state.isGameOver)
  const isVictory = useGameStore((state) => state.isVictory)
  const show3DLabels = !isGameOver && !isVictory

  return (
    <>
      {/* Ánh sáng văn phòng khang trang, rực rỡ */}
      <ambientLight intensity={0.75} color="#FFFFFF" />
      <directionalLight
        position={[5, 10, 5]}
        intensity={1.2}
        castShadow
        shadow-mapSize={[1024, 1024]}
        color="#F8FAFC"
      />
      <pointLight position={[-4, 4, -2]} intensity={0.6} color="#60A5FA" />

      {/* Nền gạch xám bóng */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[35, 35]} />
        <meshStandardMaterial color="#E2E8F0" roughness={0.2} metalness={0.15} />
      </mesh>

      {/* Bức tường văn phòng HTX */}
      <mesh position={[0, 3.5, -4]} receiveShadow>
        <boxGeometry args={[25, 7, 0.4]} />
        <meshStandardMaterial color="#F1F5F9" roughness={0.7} />
      </mesh>

      {/* Biển hiệu HTX Tấn Đạt lớn trên tường (Ẩn khi Game Over) */}
      {show3DLabels && (
        <Html position={[0, 4.2, -3.7]} center distanceFactor={8}>
          <div className="w-max min-w-[380px] bg-emerald-950/95 text-emerald-100 border-2 border-emerald-400 px-8 py-3 rounded-2xl shadow-2xl text-center select-none pointer-events-none">
            <h2 className="font-black text-lg sm:text-xl tracking-wider uppercase text-emerald-300">
              HỢP TÁC XÃ NÔNG NGHIỆP TẤN ĐẠT - VĨNH LONG
            </h2>
            <p className="text-xs text-emerald-400 font-semibold mt-0.5">
              Mô hình kiểu mới: Thống nhất quan hệ lợi ích qua Tư cách kép
            </p>
          </div>
        </Html>
      )}

      {/* Bàn làm việc trung tâm */}
      <OfficeDesk position={[0, 0, -0.6]} />

      {/* Đại diện HTX (Trưởng bản / Giám đốc HTX bên trong bàn) */}
      <group position={[0, 0, -1.8]}>
        <TruongBanModel />
        {show3DLabels && (
          <Html position={[0, 2.3, 0]} center distanceFactor={9}>
            <div className="w-max bg-blue-950/90 text-blue-200 border border-blue-400 px-3 py-0.5 rounded text-xs font-bold shadow select-none pointer-events-none">
              Ban Quản lý HTX
            </div>
          </Html>
        )}
      </group>

      {/* NPC Thương Lái bên ngoài gõ cửa gạ mua (+10%) */}
      <group position={[2.6, 0, 0.8]}>
        <ThuongLaiModel />
        {show3DLabels && (
          <Html position={[0, 2.4, 0]} center distanceFactor={9}>
            <div className="animate-pulse w-max bg-red-950/95 text-red-200 border-2 border-red-500 px-3 py-1 rounded-xl text-xs font-black whitespace-nowrap shadow-xl select-none pointer-events-none">
              Thương Lái Ngoài Gạ Mua
            </div>
          </Html>
        )}
      </group>

      {/* Chú Tư được người chơi điều khiển bên trong văn phòng */}
      <PlayerController initialPosition={[-1.2, 0, 1.5]} boundaries={[-6, 6, -1.5, 6]} />
    </>
  )
}
