// Cache âm thanh đã tạo để không tốn quota API khi bấm lại kịch bản
const audioCache = new Map()

// Map giọng đọc phù hợp theo từng nhân vật trong kịch bản
export const VOICE_MAPPING = {
  FPT: {
    'Chú Tư': 'minhquang',       // Giọng Nam miền Nam chất phác
    'Trưởng Bản': 'leminh',       // Giọng Nam miền Bắc uy tín
    'Hệ thống': 'banmai',         // Giọng Nữ Bắc chuẩn mực
    'Kế toán HTX': 'thuyminh',    // Giọng Nữ Bắc nghiêm túc
    'Cán Bộ': 'leminh',           // Giọng Cán bộ Nhà nước chuẩn mực
    'Tổng kết': 'banmai'          // Giọng Tổng kết thuyết trình truyền cảm
  },
  ZALO: {
    'Chú Tư': 3,                  // Giọng Nam miền Nam
    'Trưởng Bản': 1,              // Giọng Nam miền Bắc
    'Hệ thống': 2,                // Giọng Nữ miền Bắc
    'Kế toán HTX': 4,             // Giọng Nữ miền Nam
    'Cán Bộ': 1,                  // Giọng Nam miền Bắc
    'Tổng kết': 2                 // Giọng Nữ miền Bắc
  }
}

/**
 * Gọi API TTS của FPT.AI
 */
async function fetchFPT_TTS(text, speaker, apiKey) {
  const voice = VOICE_MAPPING.FPT[speaker] || 'banmai'
  const cacheKey = `fpt_${voice}_${text}`
  if (audioCache.has(cacheKey)) {
    return audioCache.get(cacheKey)
  }

  // Gọi qua Vite proxy /api/fpt-tts/voice
  const response = await fetch('/api/fpt-tts/voice', {
    method: 'POST',
    headers: {
      'api_key': apiKey,
      'voice': voice,
      'speed': '0'
    },
    body: text
  })

  if (!response.ok) {
    throw new Error(`FPT.AI HTTP error: ${response.status}`)
  }

  const data = await response.json()
  if (data.error && data.error !== 0) {
    throw new Error(`FPT.AI error: ${data.message || data.error}`)
  }

  const audioUrl = data.async || data.url
  if (!audioUrl) {
    throw new Error('FPT.AI không trả về audio url')
  }

  // Chờ ngắn để FPT hoàn tất render file audio trên CDN
  await new Promise((resolve) => setTimeout(resolve, 800))

  audioCache.set(cacheKey, audioUrl)
  return audioUrl
}

/**
 * Gọi API TTS của Zalo AI
 */
async function fetchZalo_TTS(text, speaker, apiKey) {
  const speakerId = VOICE_MAPPING.ZALO[speaker] || 1
  const cacheKey = `zalo_${speakerId}_${text}`
  if (audioCache.has(cacheKey)) {
    return audioCache.get(cacheKey)
  }

  const body = new URLSearchParams()
  body.append('input', text)
  body.append('speaker_id', speakerId.toString())
  body.append('speed', '1.0')

  const response = await fetch('/api/zalo-tts/synthesize', {
    method: 'POST',
    headers: {
      'apikey': apiKey,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: body.toString()
  })

  if (!response.ok) {
    throw new Error(`Zalo AI HTTP error: ${response.status}`)
  }

  const data = await response.json()
  if (data.error_code && data.error_code !== 0) {
    throw new Error(`Zalo AI error: ${data.message || data.error_code}`)
  }

  const audioUrl = data.data?.url
  if (!audioUrl) {
    throw new Error('Zalo AI không trả về audio url')
  }

  audioCache.set(cacheKey, audioUrl)
  return audioUrl
}

/**
 * Phát giọng nói bằng Web Speech API (Trình duyệt có sẵn)
 * Làm fallback hoàn hảo khi chưa nhập API Key hoặc quota cạn
 */
export function speakNative(text, speaker = 'Chú Tư') {
  return new Promise((resolve) => {
    if (!('speechSynthesis' in window)) {
      resolve(false)
      return
    }

    window.speechSynthesis.cancel() // Dừng câu thoại trước
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = 'vi-VN'

    // Tùy biến cao độ và tốc độ theo nhân vật
    if (speaker === 'Chú Tư') {
      utterance.pitch = 0.9
      utterance.rate = 0.95
    } else if (speaker === 'Cán Bộ' || speaker === 'Trưởng Bản') {
      utterance.pitch = 1.05
      utterance.rate = 1.0
    } else {
      utterance.pitch = 1.1
      utterance.rate = 1.05
    }

    utterance.onend = () => resolve(true)
    utterance.onerror = () => resolve(false)

    window.speechSynthesis.speak(utterance)
  })
}

/**
 * Hàm trung tâm fetch luồng âm thanh
 */
export async function getTTSAudioUrl({ text, speaker, provider, apiKey }) {
  if (!text) return null

  if (provider === 'FPT' && apiKey) {
    return await fetchFPT_TTS(text, speaker, apiKey)
  }

  if (provider === 'ZALO' && apiKey) {
    return await fetchZalo_TTS(text, speaker, apiKey)
  }

  return null
}
