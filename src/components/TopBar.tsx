import React from 'react';
import { Lock } from 'lucide-react';

interface TopBarProps {
  onRegisterClick: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({ onRegisterClick }) => {
  return (
    <header className="no-print sticky top-0 z-40 border-b border-white/10 bg-[#0B0D0F]/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-[1200px] items-center justify-between gap-8 px-6 py-4">
        <a
          href="#top"
          className="font-display text-2xl font-extrabold tracking-tight text-white whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E10600]"
        >
          UP Christmas GP
        </a>

        <nav
          aria-label="เมนูหลัก"
          className="hidden md:flex items-center gap-6 text-sm font-medium text-neutral-300"
        >
          <a
            href="#competitions"
            className="whitespace-nowrap shrink-0 transition-colors duration-150 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E10600]"
          >
            การแข่งขัน
          </a>
          <a
            href="#calendar"
            className="whitespace-nowrap shrink-0 transition-colors duration-150 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E10600]"
          >
            กำหนดการ
          </a>
          <a
            href="#results"
            className="whitespace-nowrap shrink-0 transition-colors duration-150 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E10600]"
          >
            ประกาศผล
          </a>
          <button
            type="button"
            disabled
            aria-disabled="true"
            title="ยังไม่เปิดให้เข้าใช้งาน — รอรับเกียรติบัตรหลังการแข่งขัน"
            className="inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 text-neutral-500 cursor-not-allowed"
          >
            <Lock className="h-3.5 w-3.5" />
            เกียรติบัตร
          </button>
        </nav>

        <div className="shrink-0">
          <button
            type="button"
            onClick={onRegisterClick}
            className="whitespace-nowrap shrink-0 rounded-md bg-[#E10600] px-4 py-2 text-sm font-semibold text-white transition-colors duration-150 hover:bg-[#B80500] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white cursor-pointer"
          >
            สมัครแข่งขัน
          </button>
        </div>
      </div>
    </header>
  );
};
