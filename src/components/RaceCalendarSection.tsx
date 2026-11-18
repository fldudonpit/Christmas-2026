import React from 'react';
import { ExternalLink } from 'lucide-react';
import { COMPETITIONS } from '../data/competitions';
import { CompetitionId } from '../types/competition';

interface RaceCalendarSectionProps {
  onSelectForRegister: (id: CompetitionId) => void;
}

export const RaceCalendarSection: React.FC<RaceCalendarSectionProps> = ({
  onSelectForRegister,
}) => {
  return (
    <section id="calendar" className="border-b border-white/10 bg-[#0F1216] py-16">
      <div className="mx-auto max-w-[1200px] px-6">
        <div className="flex flex-col justify-between gap-4 border-b border-white/10 pb-8 md:flex-row md:items-end">
          <div className="space-y-2">
            <p className="text-sm font-medium text-[#D4AF37]">Official Race Calendar 2569</p>
            <h2 className="font-display text-4xl font-bold tracking-tight text-white [text-wrap:balance]">
              ตารางการแข่งขัน สถานที่ส่งผลงาน และ LINE OpenChat
            </h2>
          </div>
          <p className="text-sm text-neutral-400">
            คลิกที่รายการในตารางเพื่อเลือกสมัครแข่งขันได้ทันที
          </p>
        </div>

        {/* 3 Milestone Checkpoints */}
        <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-xl border border-white/10 bg-[#14181F] p-5">
            <p className="font-mono text-xs font-semibold text-[#D4AF37] tabular-nums">
              Deadline 01 · 8 ธ.ค. 2569
            </p>
            <h3 className="mt-2 text-base font-semibold text-white">
              ส่งผลงานศิลปะ &amp; คลิปร้องเพลง / เต้น
            </h3>
            <p className="mt-1.5 text-xs leading-relaxed text-neutral-400">
              Christmas Card ส่งห้อง 421 (Teacher Wan) และห้อง 412 (Teacher Araya) · Drawing &amp;
              Painting ส่งห้อง 421 · Singing ส่งคลิปทางอีเมล · Cover Dance ส่งลิงก์ภายใน 23:59 น.
            </p>
          </div>

          <div className="rounded-xl border border-white/10 bg-[#14181F] p-5">
            <p className="font-mono text-xs font-semibold text-emerald-400 tabular-nums">
              On-site Round · 8 ธ.ค. 2569
            </p>
            <h3 className="mt-2 text-base font-semibold text-white">
              แข่งขันสด Speech &amp; English Quiz
            </h3>
            <p className="mt-1.5 text-xs leading-relaxed text-neutral-400">
              Speech แข่งที่ห้อง 425 (ม.ต้น) และห้อง 426 (ม.ปลาย) โดยเตรียมตัวที่ห้อง 427 · English
              Quiz แข่ง 2 รอบ (30 ข้อคัด 5 คนเข้าชิง) ห้องแข่งรอประกาศเพิ่มเติม
            </p>
          </div>

          <div className="rounded-xl border border-white/10 bg-[#14181F] p-5">
            <p className="font-mono text-xs font-semibold text-[#E10600] tabular-nums">
              Grand Prix Day · 18 ธ.ค. 2569
            </p>
            <h3 className="mt-2 text-base font-semibold text-white">
              วันงานจริง &amp; Cover Dance Live Stage
            </h3>
            <p className="mt-1.5 text-xs leading-relaxed text-neutral-400">
              การแข่งขัน Cover Dance รอบสด ณ โดมอเนกประสงค์
              พร้อมกิจกรรมงานคริสต์มาสโรงเรียนอุดรพิทยานุกูล ชิงเกียรติบัตร และของรางวัลสุดพิเศษ
            </p>
          </div>
        </div>

        {/* Official Schedule Table */}
        <div className="mt-8 overflow-x-auto rounded-xl border border-white/10 bg-[#12151A]">
          <table className="w-full min-w-[820px] border-collapse text-left">
            <thead>
              <tr className="border-b border-white/10 bg-[#171B22] text-xs font-semibold text-neutral-300">
                <th className="px-5 py-4 font-mono">ที่</th>
                <th className="px-5 py-4">การแข่งขัน</th>
                <th className="px-5 py-4">ระดับการแข่งขัน</th>
                <th className="px-5 py-4">ช่องทาง / สถานที่ / ผู้รับผิดชอบ</th>
                <th className="px-5 py-4">กำหนดการ</th>
                <th className="px-5 py-4 text-right">ดำเนินการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10 text-sm">
              {COMPETITIONS.map((comp) => {
                const openChatLink = comp.contacts.find((c) => c.lineOpenChat)?.lineOpenChat;
                return (
                  <tr
                    key={comp.id}
                    onClick={() => onSelectForRegister(comp.id)}
                    className="cursor-pointer transition-colors duration-150 hover:bg-white/[0.04]"
                  >
                    <td className="px-5 py-4 font-mono text-sm font-semibold text-[#D4AF37] tabular-nums">
                      {comp.index}
                    </td>
                    <td className="px-5 py-4">
                      <div className="font-semibold text-white">{comp.title}</div>
                      <div className="text-xs text-neutral-400">{comp.thaiSubtitle}</div>
                    </td>
                    <td className="px-5 py-4 text-xs">
                      <span
                        className={
                          comp.divisionMode === 'open'
                            ? 'font-semibold text-[#D4AF37]'
                            : 'text-emerald-400'
                        }
                      >
                        {comp.divisionLabel}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-xs text-neutral-200">
                      <div>{comp.venueOrType}</div>
                      {openChatLink && (
                        <a
                          href={openChatLink}
                          target="_blank"
                          rel="noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="mt-1 inline-flex items-center gap-1 text-emerald-400 underline hover:text-emerald-300"
                        >
                          LINE OpenChat <ExternalLink className="h-3 w-3" />
                        </a>
                      )}
                    </td>
                    <td className="px-5 py-4 font-mono text-xs text-white tabular-nums">
                      {comp.dateLabel}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectForRegister(comp.id);
                        }}
                        className="whitespace-nowrap shrink-0 rounded-md border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:border-[#E10600] hover:bg-[#E10600] cursor-pointer"
                      >
                        เลือกรายการ
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};
