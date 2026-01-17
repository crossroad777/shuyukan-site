import React from 'react';

/**
 * ポータルの共通ボタンコンポーネント
 * 画像のイメージ（濃紺背景、白文字、アイコン付き）を再現
 */
export default function PortalButton({ icon, label, onClick, color = 'bg-shuyukan-blue', disabled = false }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${color} text-white w-full py-4 px-6 rounded-full shadow-lg flex items-center justify-center gap-4 hover:opacity-90 active:scale-95 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed`}
    >
      {icon && <span className="text-2xl">{icon}</span>}
      <span className="text-lg font-bold tracking-wider">{label}</span>
    </button>
  );
}
