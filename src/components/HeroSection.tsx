import React, { useEffect, useState } from 'react';
import { Award, Calendar, ClipboardCheck, Lock, Trophy } from 'lucide-react';
import { EVENT_DATE_ISO } from '../data/competitions';
import { CompetitionId } from '../types/competition';
import { CircuitArtwork } from './CircuitArtwork';

interface HeroSectionProps {
  selectedCompetitionId: CompetitionId;
  onSelectCompetition: (id: CompetitionId) => void;
  onRegisterClick: () => void;
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
      <div className="mx-auto max-w-[1200px] px-6 py-10 lg:py-14">
        <div className="grid grid-cols-1 items-stretch gap-10 lg:grid-cols-12">
          {/* Left Narrative Column */}
          <div className="flex flex-col justify-between gap-7 lg:col-span-6">
            <div className="space-y-4">
              <p className="text-sm font-medium text-[#D4AF37]">
                Foreign Language Department &amp; International Program · โรงเรียนอุดรพิทยานุกูล
              </p>

              <h1 className="font-display text-5xl font-extrabold tracking-tight text-white sm:text-6xl leading-[1.0] [text-wrap:balance]">
                งานคริสต์มาส 2569
                <span className="block text-[#E10600]">Christmas Grand Prix</span>
              </h1>

              <p className="max-w-[54ch] text-base leading-relaxed text-neutral-300">
                ร่วมแข่งขันกิจกรรมภาษาต่างประเทศในธีม Formula 1 ทั้ง 6 รายการ
                ส่งผลงานและแข่งรอบคัดเลือก <strong className="text-white">8 ธันวาคม 2569</strong>{' '}
                และร่วมงานวันจริง <strong className="text-white">18 ธันวาคม 2569</strong> ณ
                โดมอเนกประสงค์ ชิงเกียรติบัตร และของรางวัลสุดพิเศษ
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-1">
                <button
                  type="button"
                  onClick={onRegisterClick}
                  className="whitespace-nowrap shrink-0 rounded-md bg-[#E10600] px-6 py-3 text-sm font-semibold text-white transition-colors duration-150 hover:bg-[#B80500] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white cursor-pointer"
                >
                  สมัครแข่งขันเลย
                </button>
                <a
                  href="#competitions"
                  className="whitespace-nowrap shrink-0 rounded-md border border-white/15 bg-[#151921] px-5 py-3 text-sm font-semibold text-neutral-200 transition-colors duration-150 hover:border-white/30 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                >
                  ดูกติกา 6 รายการ
                </a>
              </div>
            </div>

            {/* Live Countdown to 18 Dec 2569 */}
            <div className="border-t border-white/10 pt-5">
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
                  <div className="rounded-lg border border-white/10 bg-[#12151A] px-3 py-2.5">
                    <p className="font-mono text-2xl font-semibold text-white tabular-nums sm:text-3xl">
                      {String(countdown.days).padStart(2, '0')}
                    </p>
                    <p className="text-xs text-neutral-400">วัน</p>
                  </div>
                  <div className="rounded-lg border border-white/10 bg-[#12151A] px-3 py-2.5">
                    <p className="font-mono text-2xl font-semibold text-white tabular-nums sm:text-3xl">
                      {String(countdown.hours).padStart(2, '0')}
                    </p>
                    <p className="text-xs text-neutral-400">ชั่วโมง</p>
                  </div>
                  <div className="rounded-lg border border-white/10 bg-[#12151A] px-3 py-2.5">
                    <p className="font-mono text-2xl font-semibold text-white tabular-nums sm:text-3xl">
                      {String(countdown.minutes).padStart(2, '0')}
                    </p>
                    <p className="text-xs text-neutral-400">นาที</p>
                  </div>
                  <div className="rounded-lg border border-white/10 bg-[#12151A] px-3 py-2.5">
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

        {/* Simple Student Journey Strip + Locked Results & Certificates Menus */}
        <div className="mt-10 border-t border-white/10 pt-8">
          <div className="mb-4 flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
            <h2 className="text-sm font-semibold text-white">
              เมนูหลักและขั้นตอนการเข้าร่วม
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
            <a
              href="#competitions"
              className="flex flex-col justify-between rounded-xl border border-white/10 bg-[#12151A] p-4 transition-colors hover:border-white/30"
            >
              <div className="flex items-center justify-between text-xs text-[#D4AF37]">
                <span>ขั้นตอนที่ 1</span>
                <Trophy className="h-4 w-4" />
              </div>
              <div className="mt-3">
                <p className="text-sm font-semibold text-white">ดู 6 กิจกรรม &amp; กติกา</p>
                <p className="mt-1 text-xs text-neutral-400">เลือกประเภทและระดับชั้น</p>
              </div>
            </a>

            <a
              href="#calendar"
              className="flex flex-col justify-between rounded-xl border border-white/10 bg-[#12151A] p-4 transition-colors hover:border-white/30"
            >
              <div className="flex items-center justify-between text-xs text-emerald-400">
                <span>ขั้นตอนที่ 2</span>
                <Calendar className="h-4 w-4" />
              </div>
              <div className="mt-3">
                <p className="text-sm font-semibold text-white">เช็กกำหนดการ &amp; ห้อง</p>
                <p className="mt-1 text-xs text-neutral-400">8, 14, 15 และ 18 ธ.ค. 2569</p>
              </div>
            </a>

            <a
              href="#register"
              className="flex flex-col justify-between rounded-xl border border-[#E10600]/60 bg-[#181214] p-4 transition-colors hover:border-[#E10600]"
            >
              <div className="flex items-center justify-between text-xs text-[#E10600]">
                <span>ขั้นตอนที่ 3</span>
                <ClipboardCheck className="h-4 w-4" />
              </div>
              <div className="mt-3">
                <p className="text-sm font-semibold text-white">สมัครแข่งขันออนไลน์</p>
                <p className="mt-1 text-xs text-neutral-300">กรอกข้อมูลและรับ Race Pass ทันที</p>
              </div>
            </a>

            {/* Locked Menu 1: ประกาศผล */}
            <button
              type="button"
              disabled
              aria-disabled="true"
              title="ยังไม่เปิดให้เข้าใช้งาน — ยังไม่ได้ทำการแข่งขัน"
              className="flex flex-col justify-between rounded-xl border border-white/5 bg-[#101216] p-4 text-left opacity-60 cursor-not-allowed"
            >
              <div className="flex items-center justify-between text-xs text-neutral-400">
                <span>ยังไม่เปิดใช้งาน</span>
                <Lock className="h-4 w-4" />
              </div>
              <div className="mt-3">
                <p className="text-sm font-semibold text-neutral-300">ประกาศผลการแข่งขัน</p>
                <p className="mt-1 text-xs text-neutral-500">รอหลังการแข่งขัน 18 ธ.ค. 69</p>
              </div>
            </button>

            {/* Locked Menu 2: เกียรติบัตร */}
            <button
              type="button"
              disabled
              aria-disabled="true"
              title="ยังไม่เปิดให้เข้าใช้งาน — ยังไม่ได้ทำการแข่งขัน"
              className="flex flex-col justify-between rounded-xl border border-white/5 bg-[#101216] p-4 text-left opacity-60 cursor-not-allowed"
            >
              <div className="flex items-center justify-between text-xs text-neutral-400">
                <span>ยังไม่เปิดใช้งาน</span>
                <Award className="h-4 w-4" />
              </div>
              <div className="mt-3">
                <p className="text-sm font-semibold text-neutral-300">เกียรติบัตร</p>
                <p className="mt-1 text-xs text-neutral-500">รอหลังการแข่งขัน 18 ธ.ค. 69</p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
