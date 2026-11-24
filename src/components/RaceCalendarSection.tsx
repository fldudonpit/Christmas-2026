import React, { useMemo, useState } from 'react';
import { ArrowRight, ExternalLink, MapPin } from 'lucide-react';
import { COMPETITIONS } from '../data/competitions';
import { CompetitionId } from '../types/competition';

interface RaceCalendarSectionProps {
  onSelectForRegister: (id: CompetitionId) => void;
}

type ScheduleFilter = 'all' | 'dec8_submit' | 'onsite_live' | 'dec18_live';

export const RaceCalendarSection: React.FC<RaceCalendarSectionProps> = ({
  onSelectForRegister,
}) => {
  const [activeFilter, setActiveFilter] = useState<ScheduleFilter>('all');

  const filteredCompetitions = useMemo(() => {
    switch (activeFilter) {
      case 'dec8_submit':
        return COMPETITIONS.filter(
          (c) => c.dateGroup === 'dec8_submit' || c.id === 'cover-dance'
        );
      case 'onsite_live':
        return COMPETITIONS.filter(
          (c) => c.dateGroup === 'dec8_live' || c.dateGroup === 'dec15_live'
        );
      case 'dec18_live':
        return COMPETITIONS.filter((c) => c.dateGroup === 'dec18_live');
      default:
        return COMPETITIONS;
    }
  }, [activeFilter]);

  const getFormatShort = (id: CompetitionId) => {
    switch (id) {
      case 'singing-contest':
        return 'เดี่ยว · ส่งคลิปทางอีเมล';
      case 'christmas-card':
        return 'เดี่ยว · ส่งการ์ดขนาด A5 ที่ห้อง 412';
      case 'speech':
        return 'เดี่ยว · แข่งสด 3:00–3:30 นาที';
      case 'drawing-painting':
        return 'เดี่ยว · ส่งภาพวาดที่ห้อง 421';
      case 'english-quiz':
        return 'เดี่ยว · แข่งสด 2 รอบ (30 ข้อ + รอบชิง)';
      case 'cover-dance':
        return 'ทีมไม่เกิน 10 คน · คลิป One-Take + เวทีสด';
    }
  };

  return (
    <section id="calendar" className="border-b border-white/10 bg-[#0F1216] py-16">
      <div className="mx-auto max-w-[1200px] px-6">
        {/* Section Header */}
        <div className="flex flex-col justify-between gap-4 border-b border-white/10 pb-6 md:flex-row md:items-end">
          <div className="space-y-2">
            <p className="text-sm font-medium text-[#D4AF37]">
              2. ตรวจสอบวันแข่งและห้องส่งผลงาน
            </p>
            <h2 className="font-display text-4xl font-bold tracking-tight text-white [text-wrap:balance]">
              ตารางกำหนดการและสถานที่แข่งขัน
            </h2>
            <p className="text-sm text-neutral-400">
              สรุปวันส่งผลงาน ห้องแข่งขัน และช่องทางติดต่อแยกระดับชั้นอย่างชัดเจน
            </p>
          </div>
          <p className="text-xs font-medium text-neutral-300">
            คลิกปุ่ม <span className="text-[#E10600] font-semibold">สมัครรายการนี้</span> เพื่อกรอกใบสมัครได้ทันที
          </p>
        </div>

        {/* High-Visibility 2-Date Milestone Strip */}
        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Dec 8 Milestone */}
          <div className="overflow-hidden rounded-xl border border-[#D4AF37]/35 bg-[#14181F]">
            <div className="h-1.5 w-full bg-[#D4AF37]" />
            <div className="p-6 sm:p-7">
              <div className="flex flex-wrap items-baseline justify-between gap-3 border-b border-white/10 pb-4">
                <div>
                  <p className="text-xs font-semibold text-[#D4AF37]">
                    รอบส่งผลงาน &amp; แข่งขันรอบคัดเลือก
                  </p>
                  <p className="mt-1 font-display text-4xl font-extrabold tracking-tight text-white tabular-nums">
                    8 – 15 ธันวาคม 2569
                  </p>
                </div>
                <span className="font-mono text-xs font-medium text-neutral-300 tabular-nums">
                  ส่งผลงาน &amp; แข่งรอบคัดเลือก
                </span>
              </div>

              <div className="mt-4 grid grid-cols-1 gap-4 text-xs sm:grid-cols-2">
                <div className="space-y-1.5">
                  <p className="font-semibold text-white">8 ธ.ค. · ส่งผลงาน / แข่ง Speech</p>
                  <p className="text-neutral-300 leading-relaxed">
                    Singing (อีเมล) · Card (412) · Drawing (421) · Cover Dance (ลิงก์ 23:59 น.) ·
                    Speech (ห้อง 425/426 · เตรียม 427)
                  </p>
                </div>
                <div className="space-y-1.5">
                  <p className="font-semibold text-white">14–15 ธ.ค. · จับฉลาก &amp; English Quiz</p>
                  <p className="text-neutral-300 leading-relaxed">
                    14 ธ.ค.: จับฉลาก Cover Dance (แจ้งเวลา/สถานที่ใน OpenChat) · 15 ธ.ค.: แข่ง
                    English Quiz ห้อง 425 (ม.ต้น) / 426 (ม.ปลาย)
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Dec 18 Milestone */}
          <div className="overflow-hidden rounded-xl border border-[#E10600]/45 bg-[#181214]">
            <div className="h-1.5 w-full bg-[#E10600]" />
            <div className="p-6 sm:p-7 flex flex-col justify-between">
              <div>
                <div className="flex flex-wrap items-baseline justify-between gap-3 border-b border-white/10 pb-4">
                  <div>
                    <p className="text-xs font-semibold text-[#E10600]">
                      Grand Prix Day · วันงานคริสต์มาสจริง
                    </p>
                    <p className="mt-1 font-display text-4xl font-extrabold tracking-tight text-white tabular-nums">
                      18 ธันวาคม 2569
                    </p>
                  </div>
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-white">
                    <MapPin className="h-3.5 w-3.5 text-[#E10600]" />
                    โดมอเนกประสงค์
                  </span>
                </div>

                <p className="mt-4 text-sm font-medium text-white leading-relaxed">
                  การแข่งขัน Cover Dance รอบชิงชนะเลิศบนเวทีใหญ่ ณ โดมอเนกประสงค์
                </p>
                <p className="mt-1.5 text-xs leading-relaxed text-neutral-300">
                  พร้อมพิธีประกาศผลและมอบ{' '}
                  <span className="font-semibold text-[#D4AF37]">
                    เกียรติบัตร และของรางวัลสุดพิเศษ
                  </span>{' '}
                  แก่ผู้ชนะทุกรายการ
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Interactive Schedule Filter Tabs */}
        <div className="mt-8 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div
            role="tablist"
            aria-label="ตัวกรองตารางแข่งขัน"
            className="flex flex-wrap items-center gap-1.5 rounded-lg border border-white/10 bg-[#12151A] p-1"
          >
            {[
              { key: 'all', label: 'ทั้งหมด (6)' },
              { key: 'dec8_submit', label: '8 ธ.ค. ส่งผลงาน / คลิป (4)' },
              { key: 'onsite_live', label: '8 และ 15 ธ.ค. แข่งสดที่ห้อง (2)' },
              { key: 'dec18_live', label: '18 ธ.ค. โดมอเนกประสงค์ (1)' },
            ].map((tab) => (
              <button
                key={tab.key}
                type="button"
                role="tab"
                aria-selected={activeFilter === tab.key}
                onClick={() => setActiveFilter(tab.key as ScheduleFilter)}
                className={`whitespace-nowrap shrink-0 rounded-md px-3.5 py-2 text-xs font-medium transition-colors duration-150 cursor-pointer ${
                  activeFilter === tab.key
                    ? 'bg-[#E10600] text-white font-semibold'
                    : 'text-neutral-300 hover:bg-white/5 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <p className="font-mono text-xs text-neutral-400 tabular-nums">
            แสดง {filteredCompetitions.length} จาก 6 รายการ
          </p>
        </div>

        {/* Prominent Easy-to-Scan Schedule Matrix */}
        <div className="mt-4 overflow-hidden rounded-xl border border-white/15 bg-[#12151A]">
          {/* Desktop Column Headings */}
          <div className="hidden lg:grid lg:grid-cols-12 lg:gap-4 border-b border-white/10 bg-[#171B22] px-6 py-3.5 text-xs font-semibold text-neutral-300">
            <div className="col-span-4">รายการแข่งขัน</div>
            <div className="col-span-2">กำหนดวันสำคัญ</div>
            <div className="col-span-4">ระดับชั้น · ห้อง / ช่องทางส่งผลงาน</div>
            <div className="col-span-2 text-right">ดำเนินการ</div>
          </div>

          <div className="divide-y divide-white/10">
            {filteredCompetitions.map((comp) => {
              const isCombined = comp.divisionMode === 'open';
              const isDec18 = comp.dateGroup === 'dec18_live';

              return (
                <div
                  key={comp.id}
                  onClick={() => onSelectForRegister(comp.id)}
                  className="group grid grid-cols-1 gap-4 px-5 py-5 transition-colors duration-150 hover:bg-white/[0.03] sm:px-6 lg:grid-cols-12 lg:items-center cursor-pointer"
                >
                  {/* Column 1: Number + Competition Name + Format */}
                  <div className="lg:col-span-4 flex items-start gap-4">
                    <span
                      className={`font-display text-2xl font-extrabold tabular-nums leading-none pt-0.5 shrink-0 ${
                        isDec18 ? 'text-[#E10600]' : 'text-[#D4AF37]'
                      }`}
                    >
                      {comp.code}
                    </span>
                    <div className="min-w-0 space-y-1">
                      <h3 className="font-display text-xl font-bold text-white group-hover:text-[#D4AF37] transition-colors">
                        {comp.title}
                      </h3>
                      <p className="text-xs font-medium text-neutral-300">{comp.thaiSubtitle}</p>
                      <p className="text-xs text-neutral-400">{getFormatShort(comp.id)}</p>
                    </div>
                  </div>

                  {/* Column 2: Prominent Date & Deadline */}
                  <div className="lg:col-span-2 space-y-1">
                    <p className="text-[11px] font-medium text-neutral-400 lg:hidden">
                      กำหนดวันสำคัญ
                    </p>
                    {comp.id === 'cover-dance' ? (
                      <div className="space-y-0.5 font-mono tabular-nums">
                        <p className="text-sm font-bold text-[#E10600]">18 ธ.ค. 2569</p>
                        <p className="text-xs text-neutral-300">ส่งคลิป 8 ธ.ค. (23:59)</p>
                        <p className="text-xs text-[#D4AF37]">จับฉลาก 14 ธ.ค. 2569</p>
                      </div>
                    ) : (
                      <div className="space-y-0.5 font-mono tabular-nums">
                        <p className="text-sm font-bold text-white">{comp.dateLabel}</p>
                        <p className="text-xs text-neutral-400">
                          {comp.dateGroup === 'dec8_live' || comp.dateGroup === 'dec15_live'
                            ? 'แข่งขันสดที่โรงเรียน'
                            : 'วันปิดรับผลงาน'}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Column 3: Clear Breakdown by Level (M.1-M.3 vs M.4-M.6 or Combined) */}
                  <div className="lg:col-span-4 space-y-2 text-xs">
                    <p
                      className={`font-semibold ${
                        isCombined ? 'text-[#D4AF37]' : 'text-emerald-400'
                      }`}
                    >
                      {isCombined
                        ? 'รวมทุกระดับชั้น (M.1–M.6 · ไม่แยก ม.ต้น/ม.ปลาย)'
                        : 'แยกระดับ ม.ต้น (M.1–M.3) และ ม.ปลาย (M.4–M.6)'}
                    </p>

                    <div className="space-y-1.5 text-neutral-200">
                      {comp.contacts.map((contact, idx) => (
                        <div key={idx} className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                          {comp.contacts.length > 1 && (
                            <span className="font-semibold text-white shrink-0">
                              {idx === 0 ? 'ม.ต้น:' : 'ม.ปลาย:'}
                            </span>
                          )}
                          {contact.room && (
                            <span className="text-neutral-200">
                              {contact.room}
                              {contact.teacher ? ` (${contact.teacher})` : ''}
                            </span>
                          )}
                          {contact.email && (
                            <span className="font-mono text-[#D4AF37]">{contact.email}</span>
                          )}
                          {contact.note && !contact.room && !contact.email && (
                            <span className="text-neutral-400">{contact.note}</span>
                          )}
                          {contact.room && contact.note && (
                            <span className="text-neutral-400">· {contact.note}</span>
                          )}
                          {contact.lineOpenChat && (
                            <a
                              href={contact.lineOpenChat}
                              target="_blank"
                              rel="noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="inline-flex items-center gap-1 whitespace-nowrap font-semibold text-emerald-400 underline hover:text-emerald-300"
                            >
                              LINE OpenChat <ExternalLink className="h-3 w-3" />
                            </a>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Column 4: Direct Registration CTA */}
                  <div className="lg:col-span-2 flex items-center justify-start lg:justify-end pt-1 lg:pt-0">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectForRegister(comp.id);
                      }}
                      className="inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 rounded-md bg-[#E10600] px-4 py-2 text-xs font-semibold text-white transition-colors duration-150 hover:bg-[#B80500] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white cursor-pointer"
                    >
                      สมัครรายการนี้
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
