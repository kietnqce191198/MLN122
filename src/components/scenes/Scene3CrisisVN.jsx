import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useGameStore } from '../../store/useGameStore'
import { useAudioPlayer } from '../ui/useAudioPlayer'
import suynghiBg from '../../assets/suynghi.png'
import {
  Volume2,
  VolumeX,
  RotateCcw,
  ChevronRight,
  PlayCircle,
  Footprints,
  AlertOctagon
} from 'lucide-react'

export function Scene3CrisisVN() {
  useAudioPlayer()

  const dialogue = useGameStore((state) => state.dialogue)
  const isBGMMuted = useGameStore((state) => state.isBGMMuted)
  const toggleBGM = useGameStore((state) => state.toggleBGM)
  const startGov3DWalk = useGameStore((state) => state.startGov3DWalk)
  const restartGame = useGameStore((state) => state.restartGame)

  // Đánh dấu khi audio hethong_2.mp3 kết thúc -> hiện nút bấm đi gặp Cán Bộ
  const [audioFinished, setAudioFinished] = useState(false)

  useEffect(() => {
    // Gắn hàm onEnded vào dialogue để lắng nghe khi hethong_2.mp3 đọc xong
    useGameStore.setState((state) => ({
      dialogue: {
        ...state.dialogue,
        onEnded: () => {
          setAudioFinished(true)
        }
      }
    }))

    // Fallback an toàn: Sau 12s nếu trình duyệt chặn autoplay thì vẫn tự động mở nút
    const fallbackTimer = setTimeout(() => {
      setAudioFinished(true)
    }, 12000)

    return () => clearTimeout(fallbackTimer)
  }, [])

  // Nút nghe lại câu thoại
  const handleReplayVoice = () => {
    useGameStore.setState((state) => ({
      dialogue: {
        ...state.dialogue,
        timestamp: Date.now()
      }
    }))
  }

  return (
    <div className="relative w-screen h-screen overflow-hidden select-none bg-stone-950 font-sans">
      {/* 1. HÌNH NỀN FULL MÀN HÌNH CHÚ TƯ SUY NGHĨ & BÃO GIÁ VẬT TƯ */}
      <motion.div
        initial={{ scale: 1 }}
        animate={{ scale: 1.03 }}
        transition={{ duration: 20, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${suynghiBg})` }}
      />

      {/* Lớp phủ điện ảnh nhẹ để tôn bật các chi tiết vẽ */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/90 via-black/15 to-black/55" />
      <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_120px_rgba(0,0,0,0.6)]" />

      {/* 2. HEADER BAR: TIẾN TRÌNH & CÔNG CỤ */}
      <header className="absolute top-0 left-0 right-0 p-3 sm:p-5 flex justify-between items-center z-20 safe-area-top gap-2">
        <div className="flex items-center gap-2 sm:gap-3 max-w-[62%] sm:max-w-none">
          <div className="bg-black/75 backdrop-blur-md border border-cyan-500/40 px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl sm:rounded-2xl text-white shadow-xl flex items-center gap-2">
            <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-cyan-400 animate-ping shrink-0" />
            <div className="min-w-0">
              <span className="text-[9px] sm:text-[10px] text-cyan-300 font-extrabold uppercase tracking-widest block truncate">
                Thách Thức Khách Quan
              </span>
              <span className="text-[11px] sm:text-sm font-bold text-slate-100 truncate block sm:inline">
                Bão giá vật tư & Bài toán vốn
              </span>
            </div>
          </div>
        </div>

        {/* Cụm nút BGM & Nghe lại & Reset */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <button
            onClick={handleReplayVoice}
            className="p-2 sm:px-3 sm:py-2 rounded-xl border border-cyan-500/40 bg-black/60 hover:bg-black/80 text-cyan-300 text-xs font-bold flex items-center gap-1.5 transition-all shadow-lg backdrop-blur-md active:scale-90 touch-manipulation"
            title="Phát lại đoạn audio này"
          >
            <PlayCircle size={15} />
            <span className="hidden sm:inline">Phát lại</span>
          </button>

          <button
            onClick={toggleBGM}
            className={`p-2 sm:px-3 sm:py-2 rounded-xl border flex items-center gap-1.5 text-xs font-bold transition-all shadow-lg backdrop-blur-md active:scale-90 touch-manipulation ${
              isBGMMuted
                ? 'bg-rose-950/70 border-rose-500/40 text-rose-300'
                : 'bg-black/60 border-cyan-500/40 text-cyan-300 hover:bg-black/80'
            }`}
          >
            {isBGMMuted ? <VolumeX size={15} /> : <Volume2 size={15} />}
            <span className="hidden sm:inline">{isBGMMuted ? 'Nhạc: Tắt' : 'Nhạc: Bật'}</span>
          </button>

          <button
            onClick={restartGame}
            className="p-2 sm:px-3 sm:py-2 bg-black/60 hover:bg-black/80 text-slate-300 hover:text-white border border-white/20 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-lg backdrop-blur-md active:scale-90 touch-manipulation"
            title="Khởi động lại từ đầu"
          >
            <RotateCcw size={15} />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>
      </header>


      {/* 4. KHUNG THOẠI VISUAL NOVEL SANG TRỌNG DƯỚI ĐÁY MÀN HÌNH */}
      <div className="absolute bottom-3 sm:bottom-6 left-0 right-0 px-3 sm:px-8 flex justify-center z-20 safe-area-bottom">
        <motion.div
          key={dialogue.text}
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="max-w-4xl w-full"
        >
          <div className="bg-slate-950/90 backdrop-blur-xl border-2 border-cyan-500/50 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-2xl shadow-black relative overflow-hidden">
            {/* Vạch sáng ánh lam tinh tế */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-80" />

            {/* Header khung thoại: Tên người nói */}
            <div className="flex justify-between items-center mb-2">
              <div className="inline-flex items-center gap-1.5 sm:gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-black text-[11px] sm:text-sm px-3 sm:px-4 py-0.5 sm:py-1 rounded-full uppercase tracking-wider shadow-md">
                <AlertOctagon size={13} className="fill-white" />
                <span>{dialogue.speaker || 'Hệ thống'}</span>
              </div>
            </div>

            {/* Lời thoại */}
            <p className="text-white text-xs sm:text-base md:text-lg leading-relaxed font-medium pt-1">
              {dialogue.text}
            </p>

            {/* NÚT ĐI GẶP CÁN BỘ NHÀ NƯỚC (HIỆN RA KHI AUDIO HETHONG_2 CHẠY XONG) */}
            <div className="mt-3.5 sm:mt-4 pt-2.5 sm:pt-3 border-t border-white/10 flex justify-end gap-3 items-center min-h-[46px]">
              {audioFinished ? (
                <motion.button
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={startGov3DWalk}
                  className="w-full sm:w-auto py-2.5 sm:py-3 px-5 sm:px-7 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black text-xs sm:text-sm uppercase tracking-wider rounded-xl shadow-2xl flex items-center justify-center gap-2 cursor-pointer transition-all animate-pulse"
                >
                  <Footprints size={18} />
                  <span>Đi gặp Cán Bộ Nhà Nước</span>
                  <ChevronRight size={18} />
                </motion.button>
              ) : (
                <div className="text-[11px] sm:text-xs text-cyan-300/80 flex items-center gap-2 font-mono">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                  <span>Đang lắng nghe phân tích tình huống...</span>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
