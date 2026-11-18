import React, { useEffect, useState } from 'react';
import { EVENT_DATE_ISO } from '../data/competitions';
import { CompetitionId } from '../types/competition';
import { CircuitArtwork } from './CircuitArtwork';

interface HeroSectionProps {
  selectedCompetitionId: CompetitionId;
  onSelectCompetition: (id: CompetitionId) => void;
  onRegisterClick: () => void;
  totalRegistrations: number;
}

interface CountdownState {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isPast: boolean;
}

function calculateCountdown(): CountdownState {
  const target = new Date(EVENT_DATE_ISO).getTime();
  const now = Date.now();
  const diff = target - now;

  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true };
  }

  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
    isPast: false,
  };
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  selectedCompetitionId,
  onSelectCompetition,
  onRegisterClick,
  totalRegistrations,
}) => {
  const [countdown, setCountdown] = useState<CountdownState>(calculateCountdown);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setCountdown(calculateCountdown());
    }, 1000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <section id="top" className="border-b border-white/10 bg-[#0B0D0F]">
      <div className="mx-auto max-w-[1200px] px-6 py-12 lg:py-16">
        <div className="grid grid-cols-1 items-stretch gap-10 lg:grid-cols-12">
          {/* Left Narrative Column */}
          <div className="flex flex-col justify-between gap-8 lg:col-span-6">
            <div className="space-y-5">
              <p className="text-sm font-medium text-[#D4AF37]">
                Foreign Language Department &amp; International Program · Udonpittayanukoon
              </p>

              <h1 className="font-display text-5xl font-extrabold tracking-tight text-white sm:text-6xl leading-[0.98] [text-wrap:balance]">
                Christmas Grand Prix 2026
              </h1>

              <p className="max-w-[56ch] text-base leading-relaxed text-neutral-300">
                ต้อนรับเทศกาลคริสต์มาสโรงเรียนอุดรพิทยานุกูลในธีม Formula 1 ประจำปี 2569
                เปิดรับสมัครและประกาศกติกาอย่างเป็นทางการครบทั้ง 6 รายการ กำหนดส่งผลงานและแข่งขันรอบคัดเลือก
                8 ธันวาคม 2569 และวันงานจริง 18 ธันวาคม 2569 ณ โดมอเนกประสงค์ ชิงเกียรติบัตร และของรางวัลสุดพิเศษ
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-1">
                <button
                  type="button"
                  onClick={onRegisterClick}
                  className="whitespace-nowrap shrink-0 rounded-md bg-[#E10600] px-6 py-3 text-sm font-semibold text-white transition-colors duration-150 hover:bg-[#B80500] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white cursor-pointer"
                >
                  สมัครเข้าร่วมการแข่งขัน
                </button>
                <a
                  href="#competitions"
                  className="whitespace-nowrap shrink-0 rounded-md border border-white/15 bg-[#151921] px-5 py-3 text-sm font-semibold text-neutral-200 transition-colors duration-150 hover:border-white/30 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                >
                  ดูกติกาและเกณฑ์คะแนน
                </a>
              </div>
            </div>

            {/* Live Countdown to 18 Dec 2569 */}
            <div className="border-t border-white/10 pt-6">
              <div className="mb-3 flex items-baseline justify-between gap-4">
                <span className="text-xs font-medium text-neutral-400">
                  นับถอยหลังสู่วันงานคริสต์มาสจริง · 18 ธันวาคม 2569
                </span>
                <span className="font-mono text-xs text-emerald-400 tabular-nums">
                  โดมอเนกประสงค์
                </span>
              </div>
              {countdown.isPast ? (
                <p className="font-display text-2xl font-bold text-[#D4AF37]">
                  วันนี้คือวันงาน Christmas Grand Prix 18 ธันวาคม 2569
                </p>
              ) : (
                <div className="grid grid-cols-4 gap-3">
                  <div className="rounded-lg border border-white/10 bg-[#12151A] px-3 py-3">
                    <p className="font-mono text-2xl font-semibold text-white tabular-nums sm:text-3xl">
                      {String(countdown.days).padStart(2, '0')}
                    </p>
                    <p className="text-xs text-neutral-400">วัน</p>
                  </div>
                  <div className="rounded-lg border border-white/10 bg-[#12151A] px-3 py-3">
                    <p className="font-mono text-2xl font-semibold text-white tabular-nums sm:text-3xl">
                      {String(countdown.hours).padStart(2, '0')}
                    </p>
                    <p className="text-xs text-neutral-400">ชั่วโมง</p>
                  </div>
                  <div className="rounded-lg border border-white/10 bg-[#12151A] px-3 py-3">
                    <p className="font-mono text-2xl font-semibold text-white tabular-nums sm:text-3xl">
                      {String(countdown.minutes).padStart(2, '0')}
                    </p>
                    <p className="text-xs text-neutral-400">นาที</p>
                  </div>
                  <div className="rounded-lg border border-white/10 bg-[#12151A] px-3 py-3">
                    <p className="font-mono text-2xl font-semibold text-[#E10600] tabular-nums sm:text-3xl">
                      {String(countdown.seconds).padStart(2, '0')}
                    </p>
                    <p className="text-xs text-neutral-400">วินาที</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Circuit Visual Column */}
          <div className="lg:col-span-6">
            <CircuitArtwork
              selectedCompetitionId={selectedCompetitionId}
              onSelectCompetition={onSelectCompetition}
            />
          </div>
        </div>

        {/* Full-Width 4-Column Race Summary Strip */}
        <div className="mt-10 grid grid-cols-1 gap-4 border-t border-white/10 pt-8 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg border border-white/10 bg-[#12151A] p-4">
            <p className="text-xs text-neutral-400">วันจัดงานจริง</p>
            <p className="mt-1 font-display text-2xl font-bold text-white tabular-nums">
              18 ธันวาคม 2569
            </p>
            <p className="mt-1 text-xs text-neutral-400">
              โดมอเนกประสงค์ · ชิงเกียรติบัตร และของรางวัลสุดพิเศษ
            </p>
          </div>
          <div className="rounded-lg border border-white/10 bg-[#12151A] p-4">
            <p className="text-xs text-neutral-400">รายการแข่งขัน</p>
            <p className="mt-1 font-display text-2xl font-bold text-white tabular-nums">
              6 กิจกรรมหลัก
            </p>
            <p className="mt-1 text-xs text-neutral-400">
              4 รายการแยก ม.ต้น-ม.ปลาย · 2 รายการรวมระดับ
            </p>
          </div>
          <div className="rounded-lg border border-white/10 bg-[#12151A] p-4">
            <p className="text-xs text-neutral-400">กำหนดส่งผลงานและแข่งรอบหลัก</p>
            <p className="mt-1 font-display text-2xl font-bold text-white tabular-nums">
              8 ธันวาคม 2569
            </p>
            <p className="mt-1 text-xs text-neutral-400">
              ห้อง 421, 412, 425–427, อีเมล &amp; ลิงก์คลิป
            </p>
          </div>
          <div className="rounded-lg border border-white/10 bg-[#12151A] p-4">
            <p className="text-xs text-neutral-400">ผู้สมัครที่บันทึกในระบบ</p>
            <p className="mt-1 font-display text-2xl font-bold text-[#D4AF37] tabular-nums">
              {totalRegistrations} รายการ
            </p>
            <p className="mt-1 text-xs text-neutral-400">ตรวจสอบสถานะผู้สมัครได้ทันที</p>
          </div>
        </div>
      </div>
    </section>
  );
};
