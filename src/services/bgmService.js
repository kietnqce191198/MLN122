class BGMService {
  constructor() {
    this.ctx = null
    this.currentTrack = null
    this.audioElement = null
    this.isPlaying = false
    this.volume = 0.35
    this.isMuted = false
    this.intervalId = null
    this.currentScene = null
  }

  initContext() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext
      if (AudioContext) {
        this.ctx = new AudioContext()
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume()
    }
  }

  setVolume(vol) {
    this.volume = Math.max(0, Math.min(1, vol))
    if (this.audioElement) {
      this.audioElement.volume = this.isMuted ? 0 : this.volume
    }
  }

  toggleMute() {
    this.isMuted = !this.isMuted
    if (this.audioElement) {
      this.audioElement.volume = this.isMuted ? 0 : this.volume
    }
    return this.isMuted
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId)
      this.intervalId = null
    }
    if (this.audioElement) {
      this.audioElement.pause()
      this.audioElement.currentTime = 0
      this.audioElement = null
    }
    this.isPlaying = false
  }

  /**
   * Phát nhạc nền theo Scene
   */
  playSceneBGM(scene) {
    this.currentScene = scene
    this.stop()
    this.initContext()

    // Danh sách các file MP3 khả dĩ theo thứ tự ưu tiên
    const candidateFiles = [
      `/audio/bgm_${scene.toLowerCase()}.mp3`,
      `/audio/bgm.mp3`
    ]
    if (scene === 'FARM') {
      candidateFiles.unshift('/audio/bgm_farm.mp3')
      candidateFiles.unshift('/audio/bgm_intro.mp3')
    }

    const tryPlayNext = (index) => {
      if (index >= candidateFiles.length) {
        // Tự động chuyển sang Bộ tổng hợp nhạc nền bằng Web Audio API
        this.playProceduralBGM(scene)
        return
      }

      const filePath = candidateFiles[index]
      const audio = new Audio(filePath)
      audio.loop = true
      audio.volume = this.isMuted ? 0 : this.volume

      audio.play().then(() => {
        this.audioElement = audio
        this.isPlaying = true
      }).catch(() => {
        tryPlayNext(index + 1)
      })
    }

    tryPlayNext(0)
  }

  /**
   * Phát âm thanh hiệu ứng Game Over kịch tính
   */
  playGameOverSFX() {
    this.stop() // Tạm dừng nhạc nền để tôn bật âm thanh thất bại
    this.initContext()

    // 1. Thử phát file MP3 tùy chỉnh nếu có trong /public/audio/gameover.mp3 hoặc /public/audio/error.mp3
    const customSfx = new Audio('/audio/gameover.mp3')
    customSfx.volume = 0.85
    customSfx.play().catch(() => {
      const errAudio = new Audio('/audio/error.mp3')
      errAudio.volume = 0.85
      errAudio.play().catch(() => {
        // 2. Tự động tổng hợp âm thanh Dramatic Game Over bằng Web Audio API
        this.synthesizeGameOverSFX()
      })
    })
  }

  synthesizeGameOverSFX() {
    if (!this.ctx) return
    const now = this.ctx.currentTime

    // A. Tiếng nổ / Thud trầm vang dội (Sub-bass impact drop)
    const subOsc = this.ctx.createOscillator()
    const subGain = this.ctx.createGain()
    subOsc.type = 'sine'
    subOsc.frequency.setValueAtTime(150, now)
    subOsc.frequency.exponentialRampToValueAtTime(30, now + 0.9)

    subGain.gain.setValueAtTime(0.7 * this.volume, now)
    subGain.gain.exponentialRampToValueAtTime(0.001, now + 1.2)

    subOsc.connect(subGain)
    subGain.connect(this.ctx.destination)
    subOsc.start(now)
    subOsc.stop(now + 1.2)

    // B. Hợp âm bi kịch thất bại (Minor Discord: D3, F3, Ab3) tụt tông dần
    const chordFreqs = [146.83, 174.61, 207.65]
    chordFreqs.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator()
      const gain = this.ctx.createGain()
      const filter = this.ctx.createBiquadFilter()

      osc.type = 'sawtooth'
      osc.frequency.setValueAtTime(freq, now + 0.05)
      // Hạ tông tạo cảm giác tụt dốc thất bại
      osc.frequency.linearRampToValueAtTime(freq * 0.72, now + 1.8)

      filter.type = 'lowpass'
      filter.frequency.setValueAtTime(900, now)
      filter.frequency.linearRampToValueAtTime(220, now + 1.8)

      gain.gain.setValueAtTime(0.25 * this.volume, now + 0.05)
      gain.gain.exponentialRampToValueAtTime(0.001, now + 2.0)

      osc.connect(filter)
      filter.connect(gain)
      gain.connect(this.ctx.destination)

      osc.start(now + 0.05 + idx * 0.03)
      osc.stop(now + 2.0)
    })
  }

  playProceduralBGM(scene) {
    if (!this.ctx) return
    this.isPlaying = true

    let step = 0

    if (scene === 'FARM') {
      // Giai điệu mộc mạc, êm dịu, ấm áp đồng quê miền Tây (G major pentatonic / Dm acoustic)
      const notes = [293.66, 329.63, 392.00, 440.00, 523.25, 440.00, 392.00, 329.63]
      const bassNotes = [146.83, 196.00, 146.83, 220.00]

      this.intervalId = setInterval(() => {
        if (this.isMuted) return
        const now = this.ctx.currentTime

        // Bass ấm êm nhẹ
        if (step % 4 === 0) {
          const bassFreq = bassNotes[(step / 4) % bassNotes.length]
          this.playTone(bassFreq, 'sine', 2.2, this.volume * 0.14, now)
        }

        // Giai điệu mộc mạc êm đềm, không chói gắt
        const melodyFreq = notes[step % notes.length]
        this.playTone(melodyFreq, 'sine', 1.2, this.volume * 0.12, now)

        step++
      }, 1200)

    } else if (scene === 'OFFICE') {
      // Giai điệu tươi sáng, năng động, văn phòng HTX (C, G, Am, F)
      const chords = [
        [261.63, 329.63, 392.00], // C
        [196.00, 246.94, 293.66], // G
        [220.00, 261.63, 329.63], // Am
        [174.61, 220.00, 261.63]  // F
      ]

      this.intervalId = setInterval(() => {
        if (this.isMuted) return
        const now = this.ctx.currentTime
        const chord = chords[Math.floor(step / 2) % chords.length]

        // Hợp âm rải piano nhẹ nhàng
        const note = chord[step % chord.length]
        this.playTone(note * 1.5, 'sine', 0.6, this.volume * 0.24, now)
        this.playTone(chord[0] * 0.5, 'triangle', 1.0, this.volume * 0.18, now)

        step++
      }, 420)

    } else if (scene === 'GOV_STORM') {
      // Âm hưởng bão tố giông bão thị trường (Bass trầm dồn dập + tiếng sấm rền)
      this.intervalId = setInterval(() => {
        if (this.isMuted) return
        const now = this.ctx.currentTime

        // Drone trầm
        if (step % 6 === 0) {
          this.playTone(73.42, 'sawtooth', 2.5, this.volume * 0.35, now)
        }

        // Nhịp tim hồi hộp
        if (step % 2 === 0) {
          this.playTone(110.00, 'triangle', 0.4, this.volume * 0.25, now)
        }

        step++
      }, 480)

    } else if (scene === 'VICTORY') {
      // Âm hưởng chiến thắng, khải hoàn rực rỡ
      const fanfare = [523.25, 659.25, 783.99, 1046.50, 783.99, 1046.50]

      this.intervalId = setInterval(() => {
        if (this.isMuted) return
        const now = this.ctx.currentTime
        const note = fanfare[step % fanfare.length]

        this.playTone(note, 'triangle', 0.5, this.volume * 0.3, now)
        if (step % 3 === 0) {
          this.playTone(261.63, 'sine', 1.2, this.volume * 0.25, now)
        }
        step++
      }, 350)
    }
  }

  playTone(freq, type, duration, vol, startTime) {
    if (!this.ctx) return
    const osc = this.ctx.createOscillator()
    const gain = this.ctx.createGain()

    osc.type = type
    osc.frequency.setValueAtTime(freq, startTime)

    gain.gain.setValueAtTime(vol, startTime)
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration)

    osc.connect(gain)
    gain.connect(this.ctx.destination)

    osc.start(startTime)
    osc.stop(startTime + duration)
  }
}

export const bgmService = new BGMService()
