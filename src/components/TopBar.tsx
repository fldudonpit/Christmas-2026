import React from 'react';

interface TopBarProps {
  onRegisterClick: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({ onRegisterClick }) => {
  return (
    <header className="no-print sticky top-0 z-40 border-b border-white/10 bg-[#07080A]/85 backdrop-blur-xl">
      <div className="mx-auto flex max-w-[1240px] items-center justify-between gap-8 px-6 py-4">
        <a
          href="#top"
          className="font-display text-2xl font-extrabold tracking-tight text-white whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E10600]"
        >
          UP Christmas GP
        </a>

        <nav
          aria-label="เมนูหลัก"
          className="hidden md:flex items-center gap-8 text-xs font-medium tracking-wide text-neutral-300"
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
            ตารางแข่ง
          </a>
          <a
            href="#register"
            className="whitespace-nowrap shrink-0 transition-colors duration-150 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E10600]"
          >
            ลงทะเบียน
          </a>
          <a
            href="#grid"
            className="whitespace-nowrap shrink-0 transition-colors duration-150 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E10600]"
          >
            รายชื่อผู้สมัคร
          </a>
        </nav>

        <div className="shrink-0">
          <button
            type="button"
            onClick={onRegisterClick}
            className="whitespace-nowrap shrink-0 bg-white px-5 py-2 text-xs font-bold tracking-wide text-[#07080A] transition-colors duration-150 hover:bg-[#E10600] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white cursor-pointer"
          >
            สมัครแข่งขัน
          </button>
        </div>
      </div>
    </header>
  );
};
