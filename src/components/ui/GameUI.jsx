import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useGameStore } from '../../store/useGameStore'
import { useAudioPlayer } from './useAudioPlayer'
import { CharacterAvatar } from './CharacterAvatars'
import confetti from 'canvas-confetti'
import ketoanBg from '../../assets/ketoanhtxnoidangameover.png'
import tongketBg from '../../assets/tongket.png'
import {
  RotateCcw,
  AlertTriangle,
  Award,
  CheckCircle2,
  Volume2,
  VolumeX,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Sparkles,
  TrendingUp,
  TrendingDown,
  PlayCircle
} from 'lucide-react'

export function GameUI() {
  useAudioPlayer()

  const currentScene = useGameStore((state) => state.currentScene)
  const dialogue = useGameStore((state) => state.dialogue)
  const options = useGameStore((state) => state.options)
  const isGameOver = useGameStore((state) => state.isGameOver)
  const isVictory = useGameStore((state) => state.isVictory)
  const resetToOffice = useGameStore((state) => state.resetToOffice)
  const restartGame = useGameStore((state) => state.restartGame)

  // Nhạc nền BGM
  const isBGMMuted = useGameStore((state) => state.isBGMMuted)
  const toggleBGM = useGameStore((state) => state.toggleBGM)

  // Virtual Movement
  const setVirtualMovement = useGameStore((state) => state.setVirtualMovement)

  // Pháo hoa khi Victory
  useEffect(() => {
    if (isVictory) {
      const duration = 4 * 1000
      const end = Date.now() + duration
      const frame = () => {
        confetti({
          particleCount: 5,
          angle: 60,
          spread: 60,
          origin: { x: 0, y: 0.7 }
        })
        confetti({
          particleCount: 5,
          angle: 120,
          spread: 60,
          origin: { x: 1, y: 0.7 }
        })
        if (Date.now() < end) requestAnimationFrame(frame)
      }
      frame()
    }
  }, [isVictory])

  const handleReplayVoice = () => {
    useGameStore.setState({
      dialogue: {
        ...dialogue,
        timestamp: Date.now()
      }
    })
  }

  return (
    <div className="absolute inset-0 pointer-events-none z-10 flex flex-col justify-between p-3 sm:p-6 pb-[max(env(safe-area-inset-bottom),0.75rem)] pt-[max(env(safe-area-inset-top),0.75rem)] overflow-hidden select-none">
      {/* 1. HEADER BAR: GỌN GÀNG Ở TRÊN CÙNG */}
      <header className="flex justify-between items-start gap-2 sm:gap-3">
        <div className="bg-slate-950/85 backdrop-blur-md border border-white/15 px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl sm:rounded-2xl text-white pointer-events-auto shadow-2xl max-w-[62%] sm:max-w-none">
          <div className="text-[9px] sm:text-[10px] uppercase tracking-widest text-slate-400 font-extrabold flex items-center gap-1.5 truncate">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping shrink-0" />
            <span className="truncate">HTX Kiểu Mới - Vĩnh Long</span>
          </div>
          <div className="text-[11px] sm:text-sm font-black text-amber-300 mt-0.5 truncate sm:whitespace-normal">
            {currentScene === 'FARM' && 'Di chuyển Chú Tư lại gặp Trưởng Bản'}
            {currentScene === 'OFFICE' && 'Văn phòng HTX - Giữ vững cam kết chuỗi cung ứng'}
            {currentScene === 'GOV_STORM' && 'Di chuyển Chú Tư lại gặp Cán Bộ Nhà Nước'}
          </div>
        </div>

        {/* Cụm công cụ bên phải */}
        <div className="flex items-center gap-1.5 sm:gap-2 pointer-events-auto shrink-0">
          <button
            onClick={handleReplayVoice}
            className="p-2 sm:px-3 sm:py-2 rounded-xl border border-amber-500/40 bg-slate-900/85 hover:bg-slate-800 text-amber-300 text-xs font-bold flex items-center gap-1.5 transition-all shadow-lg backdrop-blur-md active:scale-90 touch-manipulation"
            title="Phát lại đoạn audio này"
          >
            <PlayCircle size={15} />
            <span className="hidden sm:inline">Phát lại</span>
          </button>

          <button
            onClick={toggleBGM}
            className={`p-2 sm:px-3 sm:py-2 rounded-xl border flex items-center gap-1.5 text-xs font-bold transition-all shadow-lg backdrop-blur-md active:scale-90 touch-manipulation ${
              isBGMMuted
                ? 'bg-rose-950/70 border-rose-500/50 text-rose-300'
                : 'bg-slate-900/85 border-emerald-500/50 text-emerald-300 hover:bg-slate-800'
            }`}
            title={isBGMMuted ? 'Bật nhạc nền' : 'Tắt nhạc nền'}
          >
            {isBGMMuted ? <VolumeX size={15} /> : <Volume2 size={15} />}
            <span className="hidden sm:inline">{isBGMMuted ? 'Nhạc: Tắt' : 'Nhạc: Bật'}</span>
          </button>

          <button
            onClick={restartGame}
            className="p-2 sm:px-3 sm:py-2 bg-slate-900/85 hover:bg-slate-800 text-slate-300 hover:text-white border border-white/10 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-lg backdrop-blur-md active:scale-90 touch-manipulation"
            title="Khởi động lại từ đầu"
          >
            <RotateCcw size={15} />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>
      </header>

      {/* 2. CÁC NÚT LỰA CHỌN: ĐẶT GỌN GÀNG NGAY TRÊN KHUNG CHAT Ở ĐÁY (KHÔNG CHE CHÍNH GIỮA) */}
      <div className="w-full flex flex-col items-center pointer-events-none mb-2">
        <AnimatePresence>
          {options && options.length > 0 && !isGameOver && !isVictory && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="max-w-xl w-full flex flex-col gap-2 pointer-events-auto px-2 sm:px-4"
            >
              {options.map((opt) => (
                <motion.button
                  key={opt.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={opt.action}
                  className={`w-full py-2.5 sm:py-3 px-3.5 sm:px-5 rounded-xl sm:rounded-2xl font-bold text-xs sm:text-sm shadow-2xl transition-all border flex items-center justify-between text-left cursor-pointer backdrop-blur-md active:scale-[0.98] ${
                    opt.variant === 'danger'
                      ? 'bg-rose-950/90 hover:bg-rose-900 text-rose-100 border-rose-500/70 shadow-rose-950/60'
                      : opt.variant === 'success'
                      ? 'bg-emerald-950/90 hover:bg-emerald-900 text-emerald-100 border-emerald-400/70 shadow-emerald-950/60'
                      : 'bg-slate-900/90 hover:bg-slate-800 text-amber-100 border-amber-500/50 shadow-slate-950/80'
                  }`}
                >
                  <span className="pr-2">{opt.text}</span>
                  <span className="text-[10px] font-black px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg bg-black/50 text-white shrink-0">
                    Chọn &rarr;
                  </span>
                </motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 3. KHUNG CHAT VISUAL NOVEL & VIRTUAL D-PAD Ở ĐÁY MÀN HÌNH */}
      <div className="w-full flex flex-col-reverse sm:flex-row items-start sm:items-end justify-between gap-2.5 sm:gap-4 pointer-events-auto">
        {/* D-PAD ĐIỀU KHIỂN CHÚ TƯ: TỐI ƯU NÚT BẤM TO RÕ, CHỐNG ZOOM CHO ĐIỆN THOẠI */}
        {!isGameOver && !isVictory && (
          <div className="bg-slate-950/85 backdrop-blur-md border border-white/20 p-2 sm:p-1.5 rounded-2xl flex flex-col items-center gap-1 shadow-2xl shrink-0 touch-none select-none">
            <button
              onMouseDown={() => setVirtualMovement('up', true)}
              onMouseUp={() => setVirtualMovement('up', false)}
              onTouchStart={(e) => { e.preventDefault(); setVirtualMovement('up', true) }}
              onTouchEnd={(e) => { e.preventDefault(); setVirtualMovement('up', false) }}
              className="w-10 h-10 sm:w-8 sm:h-8 flex items-center justify-center bg-slate-800 hover:bg-amber-500 hover:text-black rounded-xl text-white transition-all active:scale-90 active:bg-amber-500 active:text-black touch-none select-none shadow-md"
              title="Đi tới"
            >
              <ArrowUp size={16} />
            </button>
            <div className="flex gap-1">
              <button
                onMouseDown={() => setVirtualMovement('left', true)}
                onMouseUp={() => setVirtualMovement('left', false)}
                onTouchStart={(e) => { e.preventDefault(); setVirtualMovement('left', true) }}
                onTouchEnd={(e) => { e.preventDefault(); setVirtualMovement('left', false) }}
                className="w-10 h-10 sm:w-8 sm:h-8 flex items-center justify-center bg-slate-800 hover:bg-amber-500 hover:text-black rounded-xl text-white transition-all active:scale-90 active:bg-amber-500 active:text-black touch-none select-none shadow-md"
                title="Rẽ trái"
              >
                <ArrowLeft size={16} />
              </button>
              <button
                onMouseDown={() => setVirtualMovement('down', true)}
                onMouseUp={() => setVirtualMovement('down', false)}
                onTouchStart={(e) => { e.preventDefault(); setVirtualMovement('down', true) }}
                onTouchEnd={(e) => { e.preventDefault(); setVirtualMovement('down', false) }}
                className="w-10 h-10 sm:w-8 sm:h-8 flex items-center justify-center bg-slate-800 hover:bg-amber-500 hover:text-black rounded-xl text-white transition-all active:scale-90 active:bg-amber-500 active:text-black touch-none select-none shadow-md"
                title="Đi lùi"
              >
                <ArrowDown size={16} />
              </button>
              <button
                onMouseDown={() => setVirtualMovement('right', true)}
                onMouseUp={() => setVirtualMovement('right', false)}
                onTouchStart={(e) => { e.preventDefault(); setVirtualMovement('right', true) }}
                onTouchEnd={(e) => { e.preventDefault(); setVirtualMovement('right', false) }}
                className="w-10 h-10 sm:w-8 sm:h-8 flex items-center justify-center bg-slate-800 hover:bg-amber-500 hover:text-black rounded-xl text-white transition-all active:scale-90 active:bg-amber-500 active:text-black touch-none select-none shadow-md"
                title="Rẽ phải"
              >
                <ArrowRight size={16} />
              </button>
            </div>
            <span className="text-[8px] text-slate-400 font-bold uppercase tracking-tight">Di chuyển</span>
          </div>
        )}

        {/* KHUNG THOẠI VISUAL NOVEL Ở ĐÁY: RỘNG RÃI TRÊN ĐIỆN THOẠI */}
        <AnimatePresence>
          {dialogue.text && !isGameOver && !isVictory && (
            <motion.div
              key={dialogue.text}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 15 }}
              className="w-full sm:flex-1 max-w-4xl"
            >
              <div className="bg-slate-950/90 backdrop-blur-md border border-white/20 rounded-2xl sm:rounded-3xl p-3.5 sm:p-5 shadow-2xl flex items-center gap-3 sm:gap-4 relative">
                <div className="shrink-0 scale-90 sm:scale-100 origin-center">
                  <CharacterAvatar speaker={dialogue.speaker} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] sm:text-xs font-black text-amber-300 uppercase tracking-wider bg-white/10 px-2.5 py-0.5 rounded-full border border-white/10">
                      {dialogue.speaker || 'Thông tin'}
                    </span>
                  </div>

                  <p className="text-white text-xs sm:text-base leading-relaxed font-medium">
                    {dialogue.text}
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 4. FULLSCREEN OVERLAY: GAME OVER (HÌNH NỀN KẾ TOÁN MẮNG CHÚ TƯ) */}
      <AnimatePresence>
        {isGameOver && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[999999] flex flex-col justify-between p-3 sm:p-6 pointer-events-auto overflow-y-auto select-none safe-area-bottom safe-area-top gap-3"
          >
            {/* HÌNH NỀN 1920x1080 KẾ TOÁN HTX CHỈ TAY MẮNG CHÚ TƯ */}
            <motion.div
              initial={{ scale: 1.05 }}
              animate={{ scale: 1 }}
              transition={{ duration: 15, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{ backgroundImage: `url(${ketoanBg})` }}
            />

            {/* Lớp phủ điện ảnh đỏ & tối viền */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/75 pointer-events-none" />
            <div className="absolute inset-0 shadow-[inset_0_0_140px_rgba(225,29,72,0.5)] pointer-events-none" />
            <div className="absolute inset-0 border-4 border-rose-600/50 pointer-events-none" />

            {/* TOP HEADER: CẢNH BÁO VI PHẠM & BÁO CÁO THIỆT HẠI GỌN GÀNG Ở TRÊN */}
            <div className="relative z-10 flex flex-col md:flex-row justify-between items-start gap-2.5 sm:gap-4">
              {/* Tiêu đề Game Over */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="bg-black/80 backdrop-blur-md border border-rose-500/50 rounded-xl sm:rounded-2xl p-3 sm:p-4 shadow-2xl max-w-full sm:max-w-md w-full"
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 rounded-full bg-rose-600 text-white font-black text-[9px] sm:text-xs uppercase tracking-widest flex items-center gap-1.5 animate-pulse shadow-md">
                    <AlertTriangle size={12} />
                    Cảnh Báo Vi Phạm Cam Kết
                  </span>
                  <span className="text-rose-400 font-mono text-[11px] sm:text-xs font-bold">
                    MÂU THUẪN LỢI ÍCH
                  </span>
                </div>
                <h1 className="text-lg sm:text-3xl font-black text-rose-500 tracking-wider uppercase">
                  GAME OVER
                </h1>
                <p className="text-[11px] sm:text-xs text-rose-200/90 font-medium mt-0.5">
                  Chạy theo lợi ích ngắn hạn trước mắt phá vỡ chuỗi liên kết giá trị HTX.
                </p>
              </motion.div>

              {/* Bảng Báo Cáo Thiệt Hại Kinh Tế Trong Suốt Nằm Gọn Góc Phải */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="bg-slate-950/90 backdrop-blur-md border-2 border-rose-500/60 rounded-xl sm:rounded-2xl p-2.5 sm:p-4 shadow-2xl max-w-full sm:max-w-sm w-full"
              >
                <div className="flex items-center justify-between text-[11px] sm:text-xs font-black uppercase text-rose-300 tracking-wider border-b border-rose-500/30 pb-1 mb-1.5 sm:mb-2">
                  <span className="flex items-center gap-1.5">
                    <TrendingDown size={14} className="text-rose-400" />
                    Thiệt Hại Của Chú Tư
                  </span>
                  <span className="bg-rose-600 text-white text-[9px] sm:text-[10px] px-1.5 py-0.5 rounded font-black">
                    LỖ NẶNG
                  </span>
                </div>

                <div className="space-y-0.5 sm:space-y-1 text-[10px] sm:text-xs text-slate-200">
                  <div className="flex justify-between items-center py-0.5">
                    <span className="text-slate-400">Tiền chênh lệch ngắn hạn:</span>
                    <span className="text-emerald-400 font-mono font-bold">+5.000.000 VNĐ</span>
                  </div>
                  <div className="flex justify-between items-center py-0.5">
                    <span className="text-slate-400">Phạt bồi thường vi phạm:</span>
                    <span className="text-rose-400 font-mono font-bold">-20.000.000 VNĐ</span>
                  </div>
                  <div className="flex justify-between items-center py-0.5">
                    <span className="text-slate-400">Mất bao tiêu khi bị ép giá:</span>
                    <span className="text-rose-400 font-mono font-bold">-35.000.000 VNĐ</span>
                  </div>
                  <div className="flex justify-between items-center pt-1.5 sm:pt-2 border-t border-rose-500/30 font-black">
                    <span className="text-white text-[11px] sm:text-xs">Lợi nhuận thực tế:</span>
                    <span className="text-rose-400 font-mono text-sm sm:text-base font-extrabold">
                      -50.000.000 VNĐ
                    </span>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* BOTTOM DOCK: KHUNG THOẠI KẾ TOÁN MẮNG & NÚT CHỌN LẠI */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.15 }}
              className="relative z-10 max-w-4xl w-full mx-auto"
            >
              <div className="bg-slate-950/90 backdrop-blur-xl border-2 border-rose-500/60 rounded-2xl sm:rounded-3xl p-3.5 sm:p-5 shadow-2xl shadow-black relative overflow-hidden">
                {/* Vạch phát sáng đỏ */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-rose-500 to-transparent" />

                {/* Header người nói */}
                <div className="flex justify-between items-center mb-1.5 sm:mb-2">
                  <div className="inline-flex items-center gap-1.5 sm:gap-2 bg-gradient-to-r from-rose-600 to-red-600 text-white font-black text-[11px] sm:text-sm px-3 sm:px-4 py-0.5 sm:py-1 rounded-full uppercase tracking-wider shadow-md">
                    <AlertTriangle size={13} />
                    <span>Kế toán HTX Nông nghiệp</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleReplayVoice}
                      className="px-2 sm:px-2.5 py-1 rounded-lg border border-rose-500/40 bg-black/50 hover:bg-black/80 text-rose-300 text-[10px] sm:text-[11px] font-bold flex items-center gap-1 transition-all cursor-pointer"
                    >
                      <PlayCircle size={12} />
                      <span>Phát lại</span>
                    </button>
                  </div>
                </div>

                {/* Lời thoại mắng */}
                <p className="text-rose-100 text-xs sm:text-base leading-relaxed font-medium pt-1 italic">
                  &ldquo;{dialogue.text || 'Chú Tư! Chú chạy theo lợi ích cá nhân trước mắt mà phá vỡ hợp đồng. Điều này làm đứt gãy chuỗi cung ứng, HTX phải đền bù. Lợi ích lâu dài của tập thể đã bị chú phá hoại!'}&rdquo;
                </p>

                {/* NÚT UNDO / CHỌN LẠI TO RÕ */}
                <div className="mt-3 sm:mt-4 pt-2.5 sm:pt-3 border-t border-rose-500/30 flex justify-end">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={resetToOffice}
                    className="w-full sm:w-auto py-2.5 sm:py-3 px-4 sm:px-8 bg-gradient-to-r from-rose-600 via-red-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white font-black text-xs sm:text-sm uppercase tracking-wider rounded-xl sm:rounded-2xl shadow-xl shadow-rose-950 flex items-center justify-center gap-2 cursor-pointer transition-all animate-pulse"
                  >
                    <RotateCcw size={16} />
                    <span>Chọn lại: Tuân thủ hợp đồng HTX</span>
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 5. FULLSCREEN OVERLAY: VICTORY (HÌNH NỀN TỔNG KẾT VĨNH LONG) */}
      <AnimatePresence>
        {isVictory && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[999999] flex flex-col justify-between p-3 sm:p-6 pointer-events-auto overflow-y-auto select-none safe-area-bottom safe-area-top gap-3"
          >
            {/* HÌNH NỀN 1920x1080 TỔNG KẾT TOÀN DIỆN VĨNH LONG */}
            <motion.div
              initial={{ scale: 1.04 }}
              animate={{ scale: 1 }}
              transition={{ duration: 16, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{ backgroundImage: `url(${tongketBg})` }}
            />

            {/* Lớp phủ điện ảnh nhẹ nhàng & Viền hào quang vàng */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/15 to-black/65 pointer-events-none" />
            <div className="absolute inset-0 shadow-[inset_0_0_120px_rgba(245,158,11,0.35)] pointer-events-none" />
            <div className="absolute inset-0 border-4 border-amber-400/40 pointer-events-none" />

            {/* TOP HEADER: TIÊU ĐỀ TỔNG KẾT & HUY HIỆU */}
            <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start gap-2.5 sm:gap-4">
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-black/80 backdrop-blur-md border border-amber-400/60 rounded-xl sm:rounded-2xl p-3 sm:p-4 shadow-2xl max-w-full sm:max-w-xl w-full"
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-black text-[9px] sm:text-xs uppercase tracking-widest flex items-center gap-1.5 shadow-md">
                    <Award size={13} className="fill-slate-950" />
                    KẾT QUẢ NGHIÊN CỨU HTX KIỂU MỚI
                  </span>
                  <span className="text-emerald-400 font-mono text-[11px] sm:text-xs font-bold flex items-center gap-1">
                    <Sparkles size={12} /> VĨNH LONG
                  </span>
                </div>
                <h1 className="text-lg sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-300 to-amber-500 uppercase tracking-wider">
                  VICTORY: BÀI TOÁN HÀI HÒA LỢI ÍCH KINH TẾ
                </h1>
                <p className="text-[11px] sm:text-xs text-amber-200/90 font-medium mt-0.5">
                  Thống nhất quan hệ lợi ích – Động lực phát triển bền vững của kinh tế tập thể.
                </p>
              </motion.div>

              {/* BẢNG BÁO CÁO TÀI CHÍNH CUỐI NĂM CỦA CHÚ TƯ GỌN GÀNG TRÊN NỀN TRỜI BÊN PHẢI */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.15 }}
                className="bg-slate-950/90 backdrop-blur-md border-2 border-emerald-400/80 rounded-xl sm:rounded-2xl p-2.5 sm:p-4 shadow-2xl max-w-full sm:max-w-sm w-full"
              >
                <div className="flex items-center justify-between text-[11px] sm:text-xs font-black uppercase text-emerald-300 tracking-wider border-b border-emerald-500/30 pb-1 mb-1.5 sm:mb-2">
                  <span className="flex items-center gap-1.5">
                    <TrendingUp size={15} />
                    Tài Chính Chú Tư
                  </span>
                  <span className="bg-emerald-500 text-slate-950 px-1.5 py-0.5 rounded text-[9px] sm:text-[10px] font-black">
                    TĂNG x1.5 LẦN
                  </span>
                </div>

                <div className="space-y-0.5 sm:space-y-1 text-[10px] sm:text-xs text-slate-200">
                  <div className="flex justify-between items-center py-0.5">
                    <span className="text-slate-400">Làm ăn cá thể nhỏ lẻ:</span>
                    <span className="text-slate-300 font-mono font-bold">80.000.000 VNĐ</span>
                  </div>
                  <div className="flex justify-between items-center py-0.5">
                    <span className="text-slate-400">Tham gia chuỗi HTX:</span>
                    <span className="text-emerald-400 font-mono font-bold">120.000.000 VNĐ</span>
                  </div>
                  <div className="flex justify-between items-center py-0.5">
                    <span className="text-slate-400">Cổ tức phân phối thêm:</span>
                    <span className="text-emerald-400 font-mono font-bold">+15.000.000 VNĐ</span>
                  </div>
                  <div className="flex justify-between items-center pt-1.5 sm:pt-2 border-t border-emerald-500/30 font-black">
                    <span className="text-white text-[11px] sm:text-xs">Tổng thu nhập thực tế:</span>
                    <span className="text-emerald-400 font-mono text-sm sm:text-base font-extrabold">
                      +135.000.000 VNĐ
                    </span>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* 3 NHÃN BÀI HỌC CỐT LÕI NẰM DƯỚI 3 VÒNG TRÒN TRÊN TRANH VẼ */}
            <div className="relative z-10 pointer-events-none hidden md:grid grid-cols-3 gap-6 px-4 my-auto">
              {/* Nhãn dưới vòng tròn 1: Bữa cơm gia đình */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-slate-950/85 backdrop-blur-md border border-emerald-400/70 p-2.5 rounded-2xl shadow-xl text-center"
              >
                <div className="inline-flex items-center gap-1.5 text-emerald-300 text-xs font-black uppercase">
                  <CheckCircle2 size={14} className="text-emerald-400" />
                  <span>1. Tư Cách Kép</span>
                </div>
                <p className="text-[11px] text-slate-200 font-medium mt-0.5 leading-snug">
                  Thống nhất lợi ích cá nhân & tập thể, gắn liền với nồi cơm từng gia đình.
                </p>
              </motion.div>

              {/* Nhãn dưới vòng tròn 2: Minh bạch hợp đồng & diệt trừ ép giá */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="bg-slate-950/85 backdrop-blur-md border border-amber-400/70 p-2.5 rounded-2xl shadow-xl text-center"
              >
                <div className="inline-flex items-center gap-1.5 text-amber-300 text-xs font-black uppercase">
                  <CheckCircle2 size={14} className="text-amber-400" />
                  <span>2. Minh Bạch Cam Kết</span>
                </div>
                <p className="text-[11px] text-slate-200 font-medium mt-0.5 leading-snug">
                  Đánh tan ép giá, vượt qua cám dỗ thị trường bằng kỷ luật chuỗi cung ứng.
                </p>
              </motion.div>

              {/* Nhãn dưới vòng tròn 3: Trọng tài & Cao tốc Nhà nước */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="bg-slate-950/85 backdrop-blur-md border border-cyan-400/70 p-2.5 rounded-2xl shadow-xl text-center"
              >
                <div className="inline-flex items-center gap-1.5 text-cyan-300 text-xs font-black uppercase">
                  <CheckCircle2 size={14} className="text-cyan-400" />
                  <span>3. Bệ Phóng Nhà Nước</span>
                </div>
                <p className="text-[11px] text-slate-200 font-medium mt-0.5 leading-snug">
                  Hạ tầng cao tốc logistics và bảo vệ pháp lý là điểm tựa vươn xa.
                </p>
              </motion.div>
            </div>

            {/* BOTTOM DOCK: KHUNG THOẠI ĐÚC KẾT CHỐT HẠ & NÚT RESTART */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.25 }}
              className="relative z-10 max-w-5xl w-full mx-auto"
            >
              <div className="bg-slate-950/90 backdrop-blur-xl border-2 border-amber-400/60 rounded-2xl sm:rounded-3xl p-3.5 sm:p-5 shadow-2xl shadow-black relative overflow-hidden">
                {/* Vạch phát sáng ánh vàng */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent" />

                {/* Header người nói */}
                <div className="flex justify-between items-center mb-1.5 sm:mb-2">
                  <div className="inline-flex items-center gap-1.5 sm:gap-2 bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-black text-[11px] sm:text-sm px-3 sm:px-4 py-0.5 sm:py-1 rounded-full uppercase tracking-wider shadow-md">
                    <Sparkles size={13} className="fill-slate-950" />
                    <span>Tổng Kết Báo Cáo</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleReplayVoice}
                      className="px-2 sm:px-2.5 py-1 rounded-lg border border-amber-500/40 bg-black/50 hover:bg-black/80 text-amber-300 text-[10px] sm:text-[11px] font-bold flex items-center gap-1 transition-all cursor-pointer"
                      title="Phát lại đoạn audio này"
                    >
                      <PlayCircle size={12} />
                      <span>Phát lại</span>
                    </button>
                  </div>
                </div>

                {/* Lời thoại đúc kết 3 bài học */}
                <p className="text-amber-100 text-xs sm:text-sm leading-relaxed font-medium pt-1">
                  &ldquo;{dialogue.text || 'Tổng kết lại, chặng đường của Chú Tư đã minh chứng cho ba bài học cốt lõi: Thứ nhất, bản chất HTX kiểu mới là thống nhất lợi ích qua tư cách kép. Thứ hai, minh bạch cam kết phân phối. Thứ ba, Nhà nước là bệ phóng quan trọng nhất.'}&rdquo;
                </p>

                {/* NÚT HOÀN TẤT & KHỞI ĐỘNG LẠI */}
                <div className="mt-3 sm:mt-3.5 pt-2.5 sm:pt-3 border-t border-amber-500/30 flex justify-end">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={restartGame}
                    className="w-full sm:w-auto py-2.5 sm:py-3 px-5 sm:px-7 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black text-xs sm:text-sm uppercase tracking-wider rounded-xl sm:rounded-2xl shadow-xl shadow-amber-950 flex items-center justify-center gap-2 cursor-pointer transition-all"
                  >
                    <RotateCcw size={16} />
                    <span>Hoàn Tất & Khởi Động Lại Trò Chơi</span>
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
