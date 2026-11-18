import React from 'react';

export const Footer: React.FC = () => {
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
              Udonpittayanukoon School · วันงานคริสต์มาสจริง 18 ธันวาคม 2569
            </p>
          </div>

          <div className="space-y-2 text-xs text-neutral-400 md:col-span-4">
            <p className="font-semibold text-white">จุดส่งผลงานและสนามแข่งขัน (8 &amp; 18 ธ.ค. 2569)</p>
            <p>Christmas Card: ม.ต้น ห้อง 421 (Teacher Wan) · ม.ปลาย ห้อง 412 (Teacher Araya)</p>
            <p>Drawing &amp; Painting: ส่งผลงานที่ห้อง 421</p>
            <p>Speech: ม.ต้น ห้อง 425 · ม.ปลาย ห้อง 426 · ห้องเตรียมตัว 427</p>
            <p>Cover Dance Live Stage: โดมอเนกประสงค์ (18 ธ.ค. 2569) · ชิงเกียรติบัตรและของรางวัลสุดพิเศษ</p>
          </div>

          <div className="space-y-2 text-xs text-neutral-400 md:col-span-3">
            <p className="font-semibold text-white">เมนูลัด</p>
            <ul className="space-y-1.5">
              <li>
                <a href="#competitions" className="hover:text-white">
                  รายการแข่งขันและเกณฑ์คะแนน
                </a>
              </li>
              <li>
                <a href="#calendar" className="hover:text-white">
                  ตารางแข่งและห้องส่งผลงาน
                </a>
              </li>
              <li>
                <a href="#register" className="hover:text-white">
                  ลงทะเบียนผู้เข้าแข่งขัน
                </a>
              </li>
              <li>
                <a href="#grid" className="hover:text-white">
                  รายชื่อผู้สมัคร &amp; โหมดแอดมิน
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-6 flex flex-col justify-between gap-2 text-xs text-neutral-500 sm:flex-row sm:items-center">
          <p>© 2569 Foreign Language Department &amp; International Program, Udonpittayanukoon</p>
          <p>Christmas Theme · Formula 1 Grand Prix</p>
        </div>
      </div>
    </footer>
  );
};
