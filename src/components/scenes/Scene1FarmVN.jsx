import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { GAME_SCRIPT } from '../../data/scriptData'
import { useGameStore } from '../../store/useGameStore'
import { useAudioPlayer } from '../ui/useAudioPlayer'
import chutuBg from '../../assets/chutubuonrau.png'
import {
  Volume2,
  VolumeX,
  RotateCcw,
  Sparkles,
  ChevronRight,
  PlayCircle,
  Footprints
} from 'lucide-react'

export function Scene1FarmVN() {
  useAudioPlayer()

  const dialogue = useGameStore((state) => state.dialogue)
  const isBGMMuted = useGameStore((state) => state.isBGMMuted)
  const toggleBGM = useGameStore((state) => state.toggleBGM)
  const startFarm3DWalk = useGameStore((state) => state.startFarm3DWalk)

  // 'INTRO' (Lời dẫn mở đầu) -> 'MONOLOGUE' (Chú Tư ngồi gốc bưởi than thở)
  const [step, setStep] = useState('INTRO')

  // Khởi tạo lời dẫn mở đầu
  useEffect(() => {
    useGameStore.setState({
      dialogue: {
        speaker: GAME_SCRIPT.INTRO.speaker,
        text: GAME_SCRIPT.INTRO.text,
        nameAudio: null,
        audio: GAME_SCRIPT.INTRO.audio,
        timestamp: Date.now()
      }
    })
  }, [])

  // Bước 1 -> Bước 2: Chú Tư than thở ngồi gốc bưởi
  const handleGoToMonologue = () => {
    const batDauAudio = new Audio('/audio/batdau.mp3')
    batDauAudio.play().catch(() => {})

    setStep('MONOLOGUE')
    const item = GAME_SCRIPT.SCENE_1.monologue
    useGameStore.setState({
      dialogue: {
        speaker: item.speaker,
        text: item.text,
        nameAudio: item.nameAudio,
        audio: item.audio,
        timestamp: Date.now()
      }
    })
  }

  // Bước 2 -> Chuyển sang Sân Khấu 3D Tươi Sáng để điều khiển Chú Tư đi gặp Trưởng Bản
  const handleEnter3DWalk = () => {
    startFarm3DWalk()
  }

  // Nút nghe lại câu thoại hiện tại
  const handleReplayVoice = () => {
    useGameStore.setState({
      dialogue: {
        ...dialogue,
        timestamp: Date.now()
      }
    })
  }

  // Reset lại từ đầu Scene 1
  const handleReset = () => {
    setStep('INTRO')
    useGameStore.setState({
      dialogue: {
        speaker: GAME_SCRIPT.INTRO.speaker,
        text: GAME_SCRIPT.INTRO.text,
        nameAudio: null,
        audio: GAME_SCRIPT.INTRO.audio,
        timestamp: Date.now()
      }
    })
  }

  return (
    <div className="relative w-screen h-screen overflow-hidden select-none bg-stone-950 font-sans">
      {/* 1. HÌNH NỀN FULL MÀN HÌNH CHÚ TƯ VÀ TRƯỞNG BẢN */}
      <motion.div
        initial={{ scale: 1 }}
        animate={{ scale: 1.03 }}
        transition={{ duration: 20, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${chutuBg})` }}
      />

      {/* Lớp phủ điện ảnh nhẹ */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/85 via-black/15 to-black/50" />
      <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_120px_rgba(0,0,0,0.6)]" />

      {/* 2. HEADER BAR: TIẾN TRÌNH & CÔNG CỤ */}
      <header className="absolute top-0 left-0 right-0 p-5 flex justify-between items-center z-20">
        <div className="flex items-center gap-3">
          <div className="bg-black/60 backdrop-blur-md border border-amber-500/30 px-4 py-2 rounded-2xl text-white shadow-xl flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            <div>
              <span className="text-[10px] text-amber-300 font-extrabold uppercase tracking-widest block">
                Khởi Động Câu Chuyện
              </span>
              <span className="text-xs sm:text-sm font-bold text-slate-100">
                Vườn bưởi Vĩnh Long - Nan giải của người nông dân
              </span>
            </div>
          </div>
        </div>

        {/* Cụm nút BGM & Nghe lại & Reset */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleReplayVoice}
            className="px-3 py-2 rounded-xl border border-amber-500/40 bg-black/60 hover:bg-black/80 text-amber-300 text-xs font-bold flex items-center gap-1.5 transition-all shadow-lg backdrop-blur-md"
            title="Phát lại đoạn audio này"
          >
            <PlayCircle size={15} />
            <span>Phát lại</span>
          </button>

          <button
            onClick={toggleBGM}
            className={`px-3 py-2 rounded-xl border flex items-center gap-1.5 text-xs font-bold transition-all shadow-lg backdrop-blur-md ${
              isBGMMuted
                ? 'bg-rose-950/70 border-rose-500/40 text-rose-300'
                : 'bg-black/60 border-amber-500/40 text-amber-300 hover:bg-black/80'
            }`}
          >
            {isBGMMuted ? <VolumeX size={15} /> : <Volume2 size={15} />}
            <span>{isBGMMuted ? 'Nhạc: Tắt' : 'Nhạc: Bật'}</span>
          </button>

          <button
            onClick={handleReset}
            className="bg-black/60 hover:bg-black/80 text-slate-300 hover:text-white border border-white/20 px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-lg backdrop-blur-md"
            title="Khởi động lại từ đầu"
          >
            <RotateCcw size={15} />
            <span>Reset</span>
          </button>
        </div>
      </header>


      {/* 4. KHUNG THOẠI VISUAL NOVEL SANG TRỌNG DƯỚI ĐÁY MÀN HÌNH */}
      <div className="absolute bottom-6 left-0 right-0 px-4 sm:px-8 flex justify-center z-20">
        <motion.div
          key={dialogue.text}
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="max-w-4xl w-full"
        >
          <div className="bg-slate-950/85 backdrop-blur-xl border-2 border-amber-500/40 rounded-3xl p-5 sm:p-6 shadow-2xl shadow-black relative overflow-hidden">
            {/* Vạch sáng ánh vàng tinh tế */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent opacity-75" />

            {/* Header khung thoại: Tên người nói */}
            <div className="flex justify-between items-center mb-2.5">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-black text-xs sm:text-sm px-4 py-1 rounded-full uppercase tracking-wider shadow-md">
                <Sparkles size={14} className="fill-slate-950" />
                <span>{dialogue.speaker || 'Thông tin'}</span>
              </div>
            </div>

            {/* Lời thoại */}
            <p className="text-white text-sm sm:text-lg leading-relaxed font-medium pt-1">
              {dialogue.text}
            </p>

            {/* NÚT ĐIỀU HƯỚNG */}
            <div className="mt-4 pt-3 border-t border-white/10 flex justify-end gap-3 items-center">
              {/* Bước 1: Sang lời than thở của Chú Tư */}
              {step === 'INTRO' && (
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleGoToMonologue}
                  className="py-2.5 px-6 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black text-xs sm:text-sm uppercase tracking-wider rounded-xl shadow-xl flex items-center gap-2 cursor-pointer transition-all"
                >
                  <span>Bắt đầu câu chuyện</span>
                  <ChevronRight size={16} />
                </motion.button>
              )}

              {/* Bước 2: Đi gặp Trưởng Bản */}
              {step === 'MONOLOGUE' && (
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleEnter3DWalk}
                  className="py-3 px-7 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-xs sm:text-sm uppercase tracking-wider rounded-xl shadow-2xl flex items-center gap-2 cursor-pointer transition-all animate-pulse"
                >
                  <Footprints size={18} />
                  <span>Đi gặp Trưởng Bản</span>
                  <ChevronRight size={18} />
                </motion.button>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
