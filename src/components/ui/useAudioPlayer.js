import { useEffect, useRef } from 'react'
import { useGameStore } from '../../store/useGameStore'
import { bgmService } from '../../services/bgmService'

export function useAudioPlayer() {
  const dialogue = useGameStore((state) => state.dialogue)
  const isGameOver = useGameStore((state) => state.isGameOver)
  const activeAudioRef = useRef(null)

  useEffect(() => {
    // 1. Dừng âm thanh trước đó nếu đổi câu thoại
    if (activeAudioRef.current) {
      activeAudioRef.current.pause()
      activeAudioRef.current.currentTime = 0
      activeAudioRef.current = null
    }

    const contentAudioPath = dialogue?.audio || dialogue?.voiceFile
    const nameAudioPath = dialogue?.nameAudio

    if (!contentAudioPath && !nameAudioPath) return

    let isCancelled = false
    let hasEnded = false

    const triggerOnEnded = () => {
      if (isCancelled || hasEnded) return
      hasEnded = true
      const callback = useGameStore.getState().dialogue?.onEnded
      if (typeof callback === 'function') {
        callback()
      }
    }

    // Phát câu thoại chính (ví dụ: chutu_1.mp3, truongban1.mp3)
    const playContentVoice = () => {
      if (isCancelled) return
      if (!contentAudioPath) {
        triggerOnEnded()
        return
      }

      const contentAudio = new Audio(contentAudioPath)
      activeAudioRef.current = contentAudio

      contentAudio.onended = () => {
        triggerOnEnded()
      }

      contentAudio.onerror = (e) => {
        console.warn(`[Audio] Không tải được file: "${contentAudioPath}"`, e)
        // Fallback sau 4 giây nếu file bị lỗi để không kẹt mạch game
        setTimeout(triggerOnEnded, 4000)
      }

      contentAudio.play().catch((err) => {
        console.info(`[Audio] Cần tương tác người dùng hoặc lỗi autoplay: "${contentAudioPath}"`, err)
        // Fallback sau 6 giây nếu trình duyệt chặn autoplay
        setTimeout(triggerOnEnded, 6000)
      })
    }

    // Nếu có file xướng tên nhân vật trước (ví dụ: chutu.mp3 -> "Chú Tư")
    if (nameAudioPath) {
      const nameAudio = new Audio(nameAudioPath)
      activeAudioRef.current = nameAudio

      nameAudio.onended = () => {
        if (!isCancelled) {
          // Nghỉ tự nhiên 250ms giữa phần xướng tên và câu thoại
          setTimeout(playContentVoice, 250)
        }
      }

      nameAudio.onerror = () => {
        if (!isCancelled) playContentVoice()
      }

      nameAudio.play().catch(() => {
        if (!isCancelled) playContentVoice()
      })
    } else {
      playContentVoice()
    }

    return () => {
      isCancelled = true
      if (activeAudioRef.current) {
        activeAudioRef.current.pause()
        activeAudioRef.current = null
      }
    }
  }, [dialogue?.audio, dialogue?.voiceFile, dialogue?.nameAudio, dialogue?.timestamp])

  // Phát âm thanh báo động kịch tính khi Game Over
  useEffect(() => {
    if (isGameOver) {
      bgmService.playGameOverSFX()
    }
  }, [isGameOver])
}
