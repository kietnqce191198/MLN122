import React from 'react'
import { Mic } from 'lucide-react'

export function CharacterAvatar({ speaker = '' }) {
  if (speaker.includes('Chú Tư')) {
    return (
      <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden bg-gradient-to-b from-amber-600 to-amber-950 border-2 border-amber-400 shadow-xl shrink-0 flex items-center justify-center">
        {/* Nón lá */}
        <div className="absolute top-1 w-14 h-6 bg-yellow-400 border border-yellow-600 rounded-t-full shadow" />
        {/* Khuôn mặt & Khăn rằn */}
        <div className="absolute top-6 w-9 h-9 bg-amber-200 rounded-full border border-amber-400 flex flex-col items-center justify-center">
          <div className="flex gap-2 mt-1">
            <span className="w-1.5 h-1.5 bg-slate-900 rounded-full" />
            <span className="w-1.5 h-1.5 bg-slate-900 rounded-full" />
          </div>
          {/* Râu mép */}
          <div className="w-4 h-1 bg-slate-700 rounded-full mt-1" />
        </div>
        {/* Khăn rằn vắt vai */}
        <div className="absolute bottom-0 w-full h-5 bg-red-700 flex items-center justify-center border-t border-red-500">
          <span className="text-[8px] font-extrabold text-white uppercase tracking-tighter">
            CHÚ TƯ
          </span>
        </div>
      </div>
    )
  }

  if (speaker.includes('Trưởng Bản') || speaker.includes('Giám đốc')) {
    return (
      <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden bg-gradient-to-b from-blue-700 to-slate-950 border-2 border-blue-400 shadow-xl shrink-0 flex items-center justify-center">
        <div className="absolute top-2 w-10 h-10 bg-amber-200 rounded-full border border-amber-300 flex flex-col items-center justify-center">
          {/* Mắt kính */}
          <div className="flex gap-1 mt-1">
            <span className="w-3 h-2 border border-slate-900 bg-cyan-100/60 rounded" />
            <span className="w-3 h-2 border border-slate-900 bg-cyan-100/60 rounded" />
          </div>
        </div>
        {/* Áo sơ mi xanh HTX */}
        <div className="absolute bottom-0 w-full h-6 bg-blue-600 flex items-center justify-center border-t border-blue-400">
          <span className="text-[8px] font-extrabold text-white uppercase tracking-tighter">
            TRƯỞNG BẢN
          </span>
        </div>
      </div>
    )
  }

  if (speaker.includes('Thương Lái')) {
    return (
      <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden bg-gradient-to-b from-rose-700 to-slate-950 border-2 border-rose-500 shadow-xl shrink-0 flex items-center justify-center">
        <div className="absolute top-2 w-10 h-10 bg-amber-200 rounded-full border border-amber-300 flex flex-col items-center justify-center">
          {/* Kính đen cực ngầu */}
          <div className="w-7 h-2.5 bg-black rounded-full mt-1" />
          <div className="w-3 h-1 bg-red-800 rounded-full mt-1.5" />
        </div>
        {/* Áo vest đỏ đô */}
        <div className="absolute bottom-0 w-full h-6 bg-red-900 flex items-center justify-center border-t border-red-500">
          <span className="text-[8px] font-extrabold text-white uppercase tracking-tighter">
            THƯƠNG LÁI
          </span>
        </div>
      </div>
    )
  }

  if (speaker.includes('Cán Bộ')) {
    return (
      <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden bg-gradient-to-b from-amber-700 to-slate-950 border-2 border-amber-400 shadow-xl shrink-0 flex items-center justify-center">
        <div className="absolute top-2 w-10 h-10 bg-amber-200 rounded-full border border-amber-300 flex flex-col items-center justify-center">
          <div className="flex gap-2 mt-2">
            <span className="w-1.5 h-1.5 bg-slate-900 rounded-full" />
            <span className="w-1.5 h-1.5 bg-slate-900 rounded-full" />
          </div>
        </div>
        {/* Áo vest đen & Huy hiệu sao vàng */}
        <div className="absolute bottom-0 w-full h-6 bg-slate-900 flex items-center justify-center border-t border-amber-400">
          <span className="text-[8px] font-extrabold text-amber-300 uppercase tracking-tighter">
            CÁN BỘ
          </span>
        </div>
      </div>
    )
  }

  if (speaker.includes('Kế toán')) {
    return (
      <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden bg-gradient-to-b from-red-800 to-slate-950 border-2 border-red-500 shadow-xl shrink-0 flex items-center justify-center">
        <div className="absolute top-2 w-10 h-10 bg-rose-200 rounded-full border border-rose-300 flex flex-col items-center justify-center">
          <div className="w-6 h-2 bg-slate-900 rounded mt-1" />
          <div className="w-3 h-1 bg-red-600 rounded mt-1" />
        </div>
        <div className="absolute bottom-0 w-full h-6 bg-red-950 flex items-center justify-center border-t border-red-500">
          <span className="text-[8px] font-extrabold text-white uppercase tracking-tighter">
            KẾ TOÁN HTX
          </span>
        </div>
      </div>
    )
  }

  // Mặc định: Người dẫn chuyện
  return (
    <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden bg-gradient-to-b from-amber-500 to-slate-900 border-2 border-amber-300 shadow-xl shrink-0 flex flex-col items-center justify-center">
      <Mic size={26} className="text-white drop-shadow" />
      <div className="absolute bottom-0 w-full h-4 bg-black/60 flex items-center justify-center">
        <span className="text-[7px] font-extrabold text-amber-200 uppercase tracking-tighter">
          NARRATOR
        </span>
      </div>
    </div>
  )
}
