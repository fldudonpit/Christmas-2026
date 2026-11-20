import React from 'react';
import { Lock, ShieldCheck } from 'lucide-react';

interface FooterProps {
  isAdmin: boolean;
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({ isAdmin, onOpenAdmin }) => {
  return (
    <footer className="no-print bg-[#0B0D0F] py-12">
      <div className="mx-auto max-w-[1200px] px-6">
        <div className="grid grid-cols-1 gap-8 border-b border-white/10 pb-8 md:grid-cols-12">
          <div className="space-y-2 md:col-span-5">
            <p className="font-display text-2xl font-extrabold tracking-tight text-white">
              UP Christmas Grand Prix 2026
            </p>
            <p className="text-sm text-neutral-300">
              Foreign Language Department &amp; International Program
            </p>
            <p className="text-xs text-neutral-400">
              โรงเรียนอุดรพิทยานุกูล · งานคริสต์มาสวันจริง 18 ธันวาคม 2569
            </p>
          </div>

          <div className="space-y-2 text-xs text-neutral-400 md:col-span-4">
            <p className="font-semibold text-white">จุดส่งผลงานและสถานที่แข่งขัน</p>
            <p>Christmas Card: ม.ต้น ห้อง 421 (Teacher Wan) · ม.ปลาย ห้อง 412 (Teacher Araya)</p>
            <p>Drawing &amp; Painting: ส่งผลงานที่ห้อง 421</p>
            <p>Speech: ม.ต้น ห้อง 425 · ม.ปลาย ห้อง 426 · ห้องเตรียมตัว 427 (8 ธ.ค. 2569)</p>
            <p>English Quiz: ม.ต้น ห้อง 425 · ม.ปลาย ห้อง 426 (15 ธ.ค. 2569)</p>
            <p>Cover Dance วันจริง: โดมอเนกประสงค์ (18 ธ.ค. 2569) · ชิงเกียรติบัตรและของรางวัลสุดพิเศษ</p>
          </div>

          <div className="space-y-2 text-xs text-neutral-400 md:col-span-3">
            <p className="font-semibold text-white">เมนูหลัก</p>
            <ul className="space-y-1.5">
              <li>
                <a href="#competitions" className="hover:text-white">
                  รายการแข่งขันและกติกา
                </a>
              </li>
              <li>
                <a href="#calendar" className="hover:text-white">
                  กำหนดการและห้องส่งผลงาน
                </a>
              </li>
              <li>
                <a href="#register" className="hover:text-white">
                  สมัครเข้าร่วมการแข่งขัน
                </a>
              </li>
              <li className="flex items-center gap-1.5 text-neutral-500">
                <Lock className="h-3 w-3" />
                <span>ประกาศผล (ยังไม่เปิดใช้งาน)</span>
              </li>
              <li className="flex items-center gap-1.5 text-neutral-500">
                <Lock className="h-3 w-3" />
                <span>เกียรติบัตร (ยังไม่เปิดใช้งาน)</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-6 flex flex-col justify-between gap-3 text-xs text-neutral-500 sm:flex-row sm:items-center">
          <p>© 2569 Foreign Language Department &amp; International Program, Udonpittayanukoon</p>
          <button
            type="button"
            onClick={onOpenAdmin}
            className="inline-flex items-center gap-1.5 self-start text-xs font-medium text-neutral-400 transition-colors hover:text-[#D4AF37] sm:self-auto cursor-pointer"
          >
            {isAdmin ? (
              <>
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                <span className="text-emerald-400">เปิดโหมดแอดมินอยู่ (จัดการและโหลด CSV)</span>
              </>
            ) : (
              <>
                <Lock className="h-3.5 w-3.5" />
                <span>สำหรับแอดมิน (ดาวน์โหลดข้อมูลผู้สมัคร CSV)</span>
              </>
            )}
          </button>
        </div>
      </div>
    </footer>
  );
};
