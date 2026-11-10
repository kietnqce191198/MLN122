import { useEffect, Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { useGameStore } from './store/useGameStore'
import { Scene1FarmVN } from './components/scenes/Scene1FarmVN'
import { Scene3CrisisVN } from './components/scenes/Scene3CrisisVN'
import { SceneFarm } from './components/3d/SceneFarm'
import { SceneOffice } from './components/3d/SceneOffice'
import { SceneGov } from './components/3d/SceneGov'
import { GameUI } from './components/ui/GameUI'

export default function App() {
  const currentScene = useGameStore((state) => state.currentScene)
  const farmPhase = useGameStore((state) => state.farmPhase)
  const govPhase = useGameStore((state) => state.govPhase)
  const startIntro = useGameStore((state) => state.startIntro)

  useEffect(() => {
    startIntro()
  }, [startIntro])

  // 1. Khúc mở đầu & Chú Tư than thở: Hiện tranh vẽ chutubuonrau.png phong cách Visual Novel
  if (currentScene === 'FARM' && farmPhase === '2D_STORY') {
    return <Scene1FarmVN />
  }

  // 2. Khúc khủng hoảng bão giá & cạn vốn: Hiện tranh vẽ suynghi.png phong cách Visual Novel
  if (currentScene === 'GOV_STORM' && govPhase === '2D_CRISIS') {
    return <Scene3CrisisVN />
  }

  // 3. Sân khấu 3D cho các màn di chuyển & tương tác
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-black select-none">
      <Canvas
        shadows
        camera={{ position: [0, 5, 8], fov: 48 }}
        gl={{ antialias: true, powerPreference: 'high-performance' }}
        style={{ width: '100vw', height: '100vh', display: 'block' }}
      >
        <Suspense fallback={null}>
          {currentScene === 'FARM' && <SceneFarm />}
          {currentScene === 'OFFICE' && <SceneOffice />}
          {currentScene === 'GOV_STORM' && <SceneGov />}
        </Suspense>
      </Canvas>

      <GameUI />
    </div>
  )
}
