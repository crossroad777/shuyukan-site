import React from 'react';

/**
 * ポータルの共通ボタンコンポーネント
 * 画像のイメージ（濃紺背景、白文字、アイコン付き）を再現
 */
export default function PortalButton({ icon, label, onClick, color = 'bg-shuyukan-blue', disabled = false, badgeCount = 0 }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`relative ${color} text-white w-full p-2 pr-6 rounded-full shadow-md flex items-center gap-4 hover:shadow-xl hover:-translate-y-1 active:scale-95 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group border border-white/10`}
    >
      <div className="flex items-center justify-center w-12 h-12 bg-white/15 rounded-full group-hover:bg-white/25 transition-colors shrink-0 shadow-inner">
        {icon && <span className="text-2xl drop-shadow-sm">{icon}</span>}
      </div>
      <span className="text-lg font-bold tracking-wider text-left leading-tight flex-1">{label}</span>

      {badgeCount > 0 && (
        <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[24px] h-6 px-1.5 rounded-full bg-red-600 text-white text-xs font-bold border-2 border-white shadow-md z-10">
          {badgeCount > 99 ? '99+' : badgeCount}
        </span>
      )}

    </button>
  );
}
