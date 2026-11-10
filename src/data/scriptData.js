export const GAME_SCRIPT = {
  // LỜI DẪN MỞ ĐẦU (INTRO PROLOGUE)
  INTRO: {
    speaker: "Người dẫn chuyện",
    text: "Xin chào Thầy và các bạn. Để trả lời cho câu hỏi: Quan hệ lợi ích kinh tế trong Hợp tác xã kiểu mới tại Vĩnh Long đang biến đổi như thế nào? Hôm nay, em xin mời mọi người cùng em chơi một tựa game do nhóm tự phát triển. Trên màn hình là Chú Tư - một nông dân Vĩnh Long đang lao đao vì bị thương lái ép giá. Nhu cầu lớn nhất của chú bây giờ là Lợi ích kinh tế - động lực trực tiếp để chú bám trụ với nghề nông.",
    audio: "/audio/intro_narrator.mp3"
  },

  // PHÚT 1: VƯỜN BƯỞI VĨNH LONG
  SCENE_1: {
    monologue: {
      speaker: "Chú Tư",
      text: "Trời ơi... bưởi năm nay rớt giá thê thảm quá. Cả năm chăm bẵm vất vả mà tới hồi thu hoạch, thương lái vô ép giá còn có một nửa. Cứ làm ăn lẻ tẻ một mình vầy hoài chắc tui gồng hết nổi rồi... Phải đi gặp trưởng bản hỏi mới được.",
      nameAudio: "/audio/chutu.mp3",
      audio: "/audio/chutu_thantho.mp3"
    },
    intro: {
      speaker: "Chú Tư",
      text: "Trưởng bản ơi! Tui khổ quá, làm sao để giữ được cái lợi ích kinh tế, tiền mồ hôi nước mắt của mình bây giờ?",
      nameAudio: "/audio/chutu.mp3",
      audio: "/audio/chutu_1.mp3"
    },
    reply: {
      speaker: "Trưởng Bản",
      text: "Chú Tư à, sản xuất nhỏ lẻ thì lợi ích cá nhân luôn bị chèn ép. Chú hãy gia nhập HTX Nông nghiệp kiểu mới, nơi lợi ích của chú sẽ được bảo vệ bằng sức mạnh tập thể!",
      nameAudio: "/audio/truongban.mp3",
      audio: "/audio/truongban1.mp3"
    }
  },

  // PHÚT 2 - 3: VĂN PHÒNG HTX & NÚT THẮT
  SCENE_2: {
    event: {
      speaker: "Hệ thống",
      text: "Chú Tư đã vào HTX với tư cách kép. Nhưng hôm nay, có thương lái ngoài gạ mua lúa giá cao hơn 10% so với hợp đồng.",
      nameAudio: "/audio/hethong.mp3",
      audio: "/audio/hethong_1.mp3"
    },
    fail: {
      speaker: "Kế toán HTX",
      text: "Chú Tư! Chú chạy theo lợi ích cá nhân trước mắt mà phá vỡ hợp đồng. Chuỗi cung ứng đứt gãy, HTX phải đền bù. Lợi ích lâu dài của tập thể đã bị chú phá hoại!",
      nameAudio: "/audio/ketoan.mp3",
      audio: "/audio/ketoan_fail.mp3"
    },
    success: {
      speaker: "Kế toán HTX",
      text: "Mừng quá! Cảm ơn Chú Tư đã giữ vững chữ tín. Nhờ bà con đồng lòng tuân thủ hợp đồng, chuỗi cung ứng được giữ vững, HTX mình vừa xuất thành công lô hàng lớn, ai cũng có cổ tức!",
      nameAudio: "/audio/ketoan.mp3",
      audio: "/audio/ketoan_success.mp3"
    }
  },

  // PHÚT 4: GIÔNG BÃO THỊ TRƯỜNG & CAN THIỆP NHÀ NƯỚC
  SCENE_3: {
    crisis: {
      speaker: "Hệ thống",
      text: "Tuy nội bộ HTX đã đoàn kết, nhưng khó khăn khách quan lại ập tới. Bão giá vật tư nông nghiệp tăng phi mã, hạ tầng vận chuyển yếu kém khiến chi phí đội lên cao. HTX lâm vào cảnh cạn kiệt vốn...",
      nameAudio: "/audio/hethong.mp3",
      audio: "/audio/hethong_2.mp3"
    },
    ask: {
      speaker: "Chú Tư",
      text: "HTX Vĩnh Long đang cạn vốn áp dụng kỹ thuật số, Cán bộ có chính sách gì gỡ rối không?",
      nameAudio: "/audio/chutu.mp3",
      audio: "/audio/chutu_2.mp3"
    },
    answer: {
      speaker: "Cán Bộ",
      text: "Nhà nước sẽ can thiệp 3 hướng: 1. Hỗ trợ 50% vốn vay ưu đãi mua máy móc. 2. Đẩy nhanh cao tốc Cần Thơ - Cà Mau giảm chi phí Logistics. 3. Cử trọng tài kinh tế bảo vệ quyền lợi hợp pháp.",
      nameAudio: "/audio/canbo.mp3",
      audio: "/audio/canbo1.mp3"
    }
  },

  // PHÚT 5: CHIẾN THẮNG & ĐÚC KẾT BÀI HỌC
  VICTORY: {
    summary: {
      speaker: "Tổng kết",
      text: "Tổng kết lại, chặng đường của Chú Tư đã minh chứng cho ba bài học cốt lõi. Thứ nhất, bản chất của Hợp tác xã kiểu mới chính là giải quyết bài toán thống nhất lợi ích thông qua 'tư cách kép', gắn kết chặt chẽ sự hưng thịnh của tập thể với nồi cơm của từng cá nhân. Thứ hai, những cám dỗ từ thị trường và mâu thuẫn nội tại sẽ luôn rình rập, đòi hỏi mô hình này phải được vận hành với một cơ chế phân phối cực kỳ công bằng và minh bạch. Và cuối cùng, để kinh tế tập thể tại Vĩnh Long thực sự vươn xa, sự hỗ trợ của Nhà nước thông qua các chính sách nâng cấp hạ tầng và bảo vệ pháp lý chính là bệ phóng vững chắc nhất.",
      audio: "/audio/chothot.mp3"
    }
  }
};
