import { create } from 'zustand'
import { GAME_SCRIPT } from '../data/scriptData'
import { bgmService } from '../services/bgmService'

export const useGameStore = create((set, get) => ({
  gamePhase: 'INTRO', // 'INTRO' | 'PLAYING'
  currentScene: 'FARM', // 'FARM' | 'OFFICE' | 'GOV_STORM'
  farmPhase: '2D_STORY', // '2D_STORY' (Ảnh 2D than thở) | '3D_WALK' (Sân khấu 3D tươi sáng đi gặp Trưởng bản)
  govPhase: '2D_CRISIS', // '2D_CRISIS' (Ảnh 2D suy nghĩ bão giá) | '3D_WALK' (Sân khấu 3D gặp Cán bộ Nhà nước)

  // Đánh dấu đã tiếp xúc với NPC để tự động kích hoạt thoại
  hasTalkedToTruongBan: false,
  hasTalkedToCanBo: false,

  // Hiệu ứng hiện lần lượt 3 thẻ chính sách ở Cảnh 3 (0: chưa hiện, 1: hiện thẻ 1, 2: hiện thẻ 2, 3: hiện thẻ 3)
  policyCardsStep: 0,

  dialogue: {
    speaker: '',
    text: '',
    nameAudio: null,
    audio: null,
    timestamp: Date.now(),
    onEnded: null
  },
  options: [],
  isGameOver: false,
  isVictory: false,

  // Di chuyển nhân vật 3D
  virtualMovement: { up: false, down: false, left: false, right: false },
  nearNPC: null, // 'TruongBan' | 'CanBo' | null

  // Nhạc nền BGM
  isBGMMuted: false,

  toggleBGM: () => {
    const muted = bgmService.toggleMute()
    set({ isBGMMuted: muted })
  },

  setFarmPhase: (phase) => set({ farmPhase: phase }),

  setVirtualMovement: (dir, active) => {
    set((state) => ({
      virtualMovement: { ...state.virtualMovement, [dir]: active }
    }))
  },

  // KIỂM TRA VA CHẠM / TIẾP XÚC VỚI NPC ĐỂ TỰ ĐỘNG CHẠY THOẠI & PHÁT MP3
  setPlayerDistanceToNPC: ({ x, z }) => {
    const state = get()
    const scene = state.currentScene
    let detected = null

    if (scene === 'FARM') {
      // Trưởng bản ở vị trí [3, 0, 0]
      const dist = Math.hypot(x - 3, z - 0)
      if (dist < 2.3) {
        detected = 'TruongBan'
        // Khi Chú Tư chạm tới Trưởng Bản: TỰ ĐỘNG BẬT THOẠI & CHẠY FILE MP3
        if (state.farmPhase === '3D_WALK' && !state.hasTalkedToTruongBan) {
          set({ hasTalkedToTruongBan: true, nearNPC: 'TruongBan' })
          state.askTruongBan(GAME_SCRIPT.SCENE_1.intro)
        }
      }
    } else if (scene === 'GOV_STORM') {
      // Cán bộ ở vị trí [0, 0, 0]
      const dist = Math.hypot(x - 0, z - 0)
      if (dist < 2.5) {
        detected = 'CanBo'
        if (state.govPhase === '3D_WALK' && !state.hasTalkedToCanBo) {
          set({ hasTalkedToCanBo: true, nearNPC: 'CanBo' })
          state.askCanBo(GAME_SCRIPT.SCENE_3.ask)
          state.revealPolicyCardsSequentially()
        }
      }
    }

    set({ nearNPC: detected })
  },

  // 1. Khởi động màn hình Intro (2D Story)
  startIntro: () => {
    set({
      gamePhase: 'INTRO',
      currentScene: 'FARM',
      farmPhase: '2D_STORY',
      govPhase: '2D_CRISIS',
      hasTalkedToTruongBan: false,
      hasTalkedToCanBo: false,
      policyCardsStep: 0,
      isGameOver: false,
      isVictory: false,
      options: [],
      dialogue: {
        speaker: GAME_SCRIPT.INTRO.speaker,
        text: GAME_SCRIPT.INTRO.text,
        nameAudio: null,
        audio: GAME_SCRIPT.INTRO.audio,
        timestamp: Date.now(),
        onEnded: null
      }
    })
    bgmService.playSceneBGM('FARM')
  },

  // 2. Chuyển sang Sân khấu 3D điều khiển Chú Tư đi gặp Trưởng Bản
  startFarm3DWalk: () => {
    set({
      gamePhase: 'PLAYING',
      farmPhase: '3D_WALK',
      hasTalkedToTruongBan: false,
      isGameOver: false,
      isVictory: false,
      options: [],
      dialogue: {
        speaker: 'Hướng dẫn',
        text: 'Điều khiển Chú Tư lại gặp Trưởng Bản.',
        nameAudio: null,
        audio: null,
        timestamp: Date.now(),
        onEnded: null
      }
    })
  },

  // Tự động chạy khi đụng Trưởng Bản: Chú Tư hỏi
  askTruongBan: (questionObj) => {
    set({
      dialogue: {
        speaker: questionObj.speaker,
        text: questionObj.text,
        nameAudio: questionObj.nameAudio,
        audio: questionObj.audio,
        timestamp: Date.now(),
        // Chú Tư phát biểu xong 100% audio -> Trưởng Bản mới trả lời
        onEnded: () => {
          setTimeout(() => {
            get().replyTruongBan()
          }, 600)
        }
      },
      options: []
    })
  },

  // Trưởng bản trả lời sau khi Chú Tư hỏi xong hoàn toàn
  replyTruongBan: () => {
    const r = GAME_SCRIPT.SCENE_1.reply
    set({
      dialogue: {
        speaker: r.speaker,
        text: r.text,
        nameAudio: r.nameAudio,
        audio: r.audio,
        timestamp: Date.now(),
        onEnded: null
      },
      options: [
        {
          id: 'join_htx',
          text: 'Gia nhập Hợp tác xã Nông nghiệp kiểu mới',
          variant: 'success',
          action: () => {
            get().initScene2()
          }
        }
      ]
    })
  },

  // 3. Vào Cảnh 2 (Văn phòng HTX Tấn Đạt)
  initScene2: () => {
    const n = GAME_SCRIPT.SCENE_2.event
    set({
      gamePhase: 'PLAYING',
      currentScene: 'OFFICE',
      isGameOver: false,
      isVictory: false,
      options: [],
      dialogue: {
        speaker: n.speaker,
        text: n.text,
        nameAudio: n.nameAudio,
        audio: n.audio,
        timestamp: Date.now(),
        // Nghe xong lời dẫn Hệ thống -> Hiện 2 lựa chọn A và B
        onEnded: () => {
          setTimeout(() => {
            if (get().currentScene === 'OFFICE' && !get().isGameOver) {
              set({
                options: [
                  {
                    id: 'opt_sell_out',
                    text: 'Lựa chọn A: Phá vỡ hợp đồng, bán cho thương lái ngoài',
                    variant: 'danger',
                    action: () => {
                      get().triggerGameOver()
                    }
                  },
                  {
                    id: 'opt_stay_htx',
                    text: 'Lựa chọn B: Tuân thủ hợp đồng, bán cho Hợp tác xã',
                    variant: 'success',
                    action: () => {
                      get().chooseStayHTX()
                    }
                  }
                ]
              })
            }
          }, 400)
        }
      }
    })
    bgmService.playSceneBGM('OFFICE')
  },

  // Khi người chơi bấm chọn [B]: Tuân thủ hợp đồng
  chooseStayHTX: () => {
    const s = GAME_SCRIPT.SCENE_2.success
    set({
      options: [
        {
          id: 'proceed_to_scene3',
          text: 'Tiếp tục câu chuyện',
          variant: 'success',
          action: () => {
            get().initScene3()
          }
        }
      ],
      dialogue: {
        speaker: s.speaker,
        text: s.text,
        nameAudio: s.nameAudio,
        audio: s.audio,
        timestamp: Date.now(),
        // Kế toán nói xong lời chúc mừng & chia cổ tức -> Tự động chuyển sang Cảnh 3
        onEnded: () => {
          setTimeout(() => {
            if (get().currentScene === 'OFFICE' && !get().isGameOver) {
              get().initScene3()
            }
          }, 1000)
        }
      }
    })
  },

  // Kích hoạt Game Over khi chọn phá vỡ hợp đồng [A]
  triggerGameOver: () => {
    const f = GAME_SCRIPT.SCENE_2.fail
    bgmService.playGameOverSFX()
    set({
      isGameOver: true,
      options: [],
      dialogue: {
        speaker: f.speaker,
        text: f.text,
        nameAudio: f.nameAudio,
        audio: f.audio,
        timestamp: Date.now(),
        onEnded: null
      }
    })
  },

  // Undo / Chọn lại về đầu Scene 2
  resetToOffice: () => {
    get().initScene2()
  },

  // 4. Vào Cảnh 3: Bắt đầu bằng 2D Story suynghi.png (Khủng hoảng bão giá & cạn vốn)
  initScene3: () => {
    const c = GAME_SCRIPT.SCENE_3.crisis
    set({
      gamePhase: 'PLAYING',
      currentScene: 'GOV_STORM',
      govPhase: '2D_CRISIS', // Hiện tranh suynghi.png
      hasTalkedToCanBo: false,
      policyCardsStep: 0,
      isGameOver: false,
      isVictory: false,
      options: [],
      dialogue: {
        speaker: c.speaker,
        text: c.text,
        nameAudio: c.nameAudio,
        audio: c.audio,
        timestamp: Date.now(),
        onEnded: null
      }
    })
    bgmService.playSceneBGM('GOV_STORM')
  },

  // Chuyển sang Sân khấu 3D để Chú Tư đi gặp Cán Bộ Nhà Nước
  startGov3DWalk: () => {
    set({
      govPhase: '3D_WALK',
      hasTalkedToCanBo: false,
      policyCardsStep: 0,
      options: [],
      dialogue: {
        speaker: 'Hướng dẫn',
        text: 'Điều khiển Chú Tư lại gặp Cán Bộ Nhà Nước.',
        nameAudio: null,
        audio: null,
        timestamp: Date.now(),
        onEnded: null
      }
    })
  },

  // Khi đụng Cán Bộ: Hiện lần lượt từng thẻ bài 1 -> (0.5s) -> 2 -> (0.5s) -> 3
  revealPolicyCardsSequentially: () => {
    set({ policyCardsStep: 1 })
    setTimeout(() => {
      if (get().currentScene === 'GOV_STORM') {
        set({ policyCardsStep: 2 })
        setTimeout(() => {
          if (get().currentScene === 'GOV_STORM') {
            set({ policyCardsStep: 3 })
          }
        }, 500)
      }
    }, 500)
  },

  // Tự động chạy khi đụng Cán Bộ: Chú Tư hỏi
  askCanBo: (questionObj) => {
    set({
      dialogue: {
        speaker: questionObj.speaker,
        text: questionObj.text,
        nameAudio: questionObj.nameAudio,
        audio: questionObj.audio,
        timestamp: Date.now(),
        // Chú Tư hỏi xong hoàn chỉnh 100% -> Cán Bộ mới trả lời
        onEnded: () => {
          setTimeout(() => {
            get().replyCanBo()
          }, 600)
        }
      },
      options: []
    })
  },

  // Cán bộ giải đáp chính sách
  replyCanBo: () => {
    if (get().currentScene !== 'GOV_STORM' || get().isGameOver) return
    const a = GAME_SCRIPT.SCENE_3.answer
    set({
      dialogue: {
        speaker: a.speaker,
        text: a.text,
        nameAudio: a.nameAudio,
        audio: a.audio,
        timestamp: Date.now(),
        // Cán bộ nói xong cả 3 chính sách -> Tự động chuyển sang Victory
        onEnded: () => {
          setTimeout(() => {
            if (get().currentScene === 'GOV_STORM' && !get().isGameOver) {
              get().triggerVictory()
            }
          }, 1200)
        }
      }
    })
  },

  // 5. Màn hình VICTORY
  triggerVictory: () => {
    const v = GAME_SCRIPT.VICTORY.summary
    set({
      isVictory: true,
      options: [],
      dialogue: {
        speaker: v.speaker,
        text: v.text,
        nameAudio: null,
        audio: v.audio,
        timestamp: Date.now(),
        onEnded: null
      }
    })
    bgmService.playSceneBGM('VICTORY')
  },

  // Khởi động lại từ đầu
  restartGame: () => {
    get().startIntro()
  }
}))
