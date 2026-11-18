import React, { useMemo, useState } from 'react';
import { ExternalLink, Mail, MapPin, X } from 'lucide-react';
import { COMPETITIONS } from '../data/competitions';
import { Competition, CompetitionId } from '../types/competition';

interface CompetitionsSectionProps {
  registrations: Array<{ competitionId: CompetitionId }>;
  selectedCompetitionId: CompetitionId;
  onSelectForRegister: (id: CompetitionId) => void;
}

type FilterMode = 'all' | 'split' | 'open' | 'submit' | 'onsite';

export const CompetitionsSection: React.FC<CompetitionsSectionProps> = ({
  registrations,
  selectedCompetitionId,
  onSelectForRegister,
}) => {
  const [filter, setFilter] = useState<FilterMode>('all');
  const [detailCompetition, setDetailCompetition] = useState<Competition | null>(null);

  const filteredCompetitions = useMemo(() => {
    switch (filter) {
      case 'split':
        return COMPETITIONS.filter((c) => c.divisionMode === 'split');
      case 'open':
        return COMPETITIONS.filter((c) => c.divisionMode === 'open');
      case 'submit':
        return COMPETITIONS.filter(
          (c) =>
            c.channel === 'online_email' ||
            c.channel === 'onsite_artwork' ||
            c.channel === 'hybrid_stage'
        );
      case 'onsite':
        return COMPETITIONS.filter(
          (c) => c.channel === 'onsite_live' || c.channel === 'hybrid_stage'
        );
      default:
        return COMPETITIONS;
    }
  }, [filter]);

  const countByCompetition = useMemo(() => {
    const map: Record<string, number> = {};
    for (const entry of registrations) {
      map[entry.competitionId] = (map[entry.competitionId] ?? 0) + 1;
    }
    return map;
  }, [registrations]);

  const getAccentBorderClass = (isSelected: boolean) =>
    isSelected ? 'border-[#E10600]' : 'border-white/10 hover:border-white/25';

  return (
    <section id="competitions" className="border-b border-white/10 bg-[#0B0D0F] py-16">
      <div className="mx-auto max-w-[1200px] px-6">
        <div className="flex flex-col justify-between gap-6 border-b border-white/10 pb-8 lg:flex-row lg:items-end">
          <div className="space-y-2">
            <p className="text-sm font-medium text-[#D4AF37]">
              Official Grand Prix Rulebook &amp; Categories
            </p>
            <h2 className="font-display text-4xl font-bold tracking-tight text-white [text-wrap:balance]">
              รายการแข่งขันทั้งหมด 6 กิจกรรม
            </h2>
            <p className="max-w-[64ch] text-sm leading-relaxed text-neutral-400">
              Singing Contest, Christmas Card, Speech และ English Quiz แข่งแยก ม.ต้น (M.1–M.3) และ ม.ปลาย (M.4–M.6)
              ส่วน Drawing &amp; Painting และ Cover Dance แข่งขันรวมทุกระดับชั้น (Combined Levels) —{' '}
              <span className="font-semibold text-[#D4AF37]">ชิงเกียรติบัตร และของรางวัลสุดพิเศษ</span>
            </p>
          </div>

          {/* Interactive Segmented Filter Controls */}
          <div
            role="tablist"
            aria-label="กรองรายการแข่งขัน"
            className="flex flex-wrap items-center gap-1 rounded-lg border border-white/10 bg-[#12151A] p-1"
          >
            {[
              { key: 'all', label: 'ทั้งหมด (6)' },
              { key: 'split', label: 'แยก ม.ต้น-ม.ปลาย (4)' },
              { key: 'open', label: 'รวมทุกระดับ (2)' },
              { key: 'submit', label: 'ส่งคลิป / ชิ้นงาน (4)' },
              { key: 'onsite', label: 'แข่งสดที่โรงเรียน (3)' },
            ].map((item) => (
              <button
                key={item.key}
                type="button"
                role="tab"
                aria-selected={filter === item.key}
                onClick={() => setFilter(item.key as FilterMode)}
                className={`whitespace-nowrap shrink-0 rounded-md px-3 py-1.5 text-xs font-medium transition-colors duration-150 cursor-pointer ${
                  filter === item.key
                    ? 'bg-[#E10600] text-white'
                    : 'text-neutral-300 hover:bg-white/5 hover:text-white'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* 6-Event Grid */}
        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredCompetitions.map((comp) => {
            const isSelected = comp.id === selectedCompetitionId;
            const entrantCount = countByCompetition[comp.id] ?? 0;

            return (
              <article
                key={comp.id}
                className={`flex flex-col justify-between rounded-xl border bg-[#12151A] p-6 transition-colors duration-150 ${getAccentBorderClass(
                  isSelected
                )}`}
              >
                <div>
                  <div className="flex items-baseline justify-between gap-4">
                    <span className="font-mono text-xs font-semibold text-[#D4AF37] tabular-nums">
                      {comp.code}.
                    </span>
                    <span className="font-mono text-xs text-neutral-400 tabular-nums">
                      ผู้สมัคร {entrantCount} รายการ
                    </span>
                  </div>

                  <h3 className="mt-2 font-display text-3xl font-bold tracking-tight text-white">
                    {comp.title}
                  </h3>
                  <p className="mt-0.5 text-sm font-medium text-neutral-300">
                    {comp.thaiSubtitle}
                  </p>

                  {/* Clean Unboxed Metadata */}
                  <div className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 border-t border-white/10 pt-3 text-xs text-neutral-300">
                    <span
                      className={
                        comp.divisionMode === 'open'
                          ? 'font-semibold text-[#D4AF37]'
                          : 'font-medium text-emerald-400'
                      }
                    >
                      {comp.divisionLabel}
                    </span>
                    <span aria-hidden="true" className="text-neutral-600">
                      ·
                    </span>
                    <span className="font-mono tabular-nums text-white">{comp.dateLabel}</span>
                  </div>

                  <p className="mt-3 text-sm leading-relaxed text-neutral-400">{comp.summary}</p>

                  {/* Theme / Topic Preview */}
                  <div className="mt-4 rounded-lg border border-white/10 bg-[#0B0D0F] p-3.5 text-xs">
                    <p className="font-semibold text-neutral-300">หัวข้อการแข่งขัน (Theme / Topic)</p>
                    {typeof comp.themeTopic === 'string' ? (
                      <p className="mt-1 text-white">{comp.themeTopic}</p>
                    ) : (
                      <div className="mt-1.5 space-y-1 text-neutral-200">
                        <p>
                          <span className="text-emerald-400">ม.ต้น:</span> {comp.themeTopic.junior}
                        </p>
                        <p>
                          <span className="text-[#D4AF37]">ม.ปลาย:</span> {comp.themeTopic.senior}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Venue & Contact Preview */}
                  <div className="mt-3 space-y-1.5 text-xs text-neutral-300">
                    {comp.contacts.map((c, idx) => (
                      <div key={idx} className="leading-relaxed">
                        <span className="font-medium text-white">{c.level}:</span>{' '}
                        {c.room && <span>{c.room}</span>}
                        {c.teacher && <span> · {c.teacher}</span>}
                        {c.email && (
                          <span className="font-mono text-[#D4AF37]"> {c.email}</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-between gap-3 border-t border-white/10 pt-4">
                  <button
                    type="button"
                    onClick={() => setDetailCompetition(comp)}
                    className="whitespace-nowrap shrink-0 text-xs font-semibold text-neutral-200 underline decoration-white/30 underline-offset-4 transition-colors hover:text-white hover:decoration-white cursor-pointer"
                  >
                    ระเบียบการและเกณฑ์คะแนน
                  </button>

                  <button
                    type="button"
                    onClick={() => onSelectForRegister(comp.id)}
                    className="whitespace-nowrap shrink-0 rounded-md bg-[#E10600] px-4 py-2 text-xs font-semibold text-white transition-colors duration-150 hover:bg-[#B80500] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white cursor-pointer"
                  >
                    สมัครรายการนี้
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      {/* Detailed Rulebook & Judging Criteria Modal */}
      {detailCompetition && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="rulebook-modal-title"
          onClick={() => setDetailCompetition(null)}
        >
          <div
            className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-xl border border-white/15 bg-[#12151A] p-6 sm:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-5">
              <div>
                <p className="font-mono text-xs font-semibold text-[#D4AF37]">
                  {detailCompetition.code}. {detailCompetition.categoryLabel}
                </p>
                <h3
                  id="rulebook-modal-title"
                  className="mt-1 font-display text-3xl font-extrabold text-white"
                >
                  {detailCompetition.title}
                </h3>
                <p className="mt-0.5 text-sm text-neutral-300">
                  {detailCompetition.thaiSubtitle} · {detailCompetition.divisionLabel}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setDetailCompetition(null)}
                aria-label="ปิดหน้าต่างระเบียบการ"
                className="rounded-md border border-white/15 p-2 text-neutral-300 transition-colors hover:bg-white/10 hover:text-white cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-6 space-y-6">
              {/* Theme & Submission Info */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="rounded-lg border border-white/10 bg-[#0B0D0F] p-4">
                  <p className="text-xs font-semibold text-[#D4AF37]">หัวข้อ (Theme / Topic)</p>
                  {typeof detailCompetition.themeTopic === 'string' ? (
                    <p className="mt-1 text-sm text-white">{detailCompetition.themeTopic}</p>
                  ) : (
                    <div className="mt-1.5 space-y-1 text-xs text-neutral-200">
                      <p>
                        <span className="font-semibold text-emerald-400">Lower Secondary:</span>{' '}
                        {detailCompetition.themeTopic.junior}
                      </p>
                      <p>
                        <span className="font-semibold text-[#D4AF37]">Upper Secondary:</span>{' '}
                        {detailCompetition.themeTopic.senior}
                      </p>
                    </div>
                  )}
                </div>

                <div className="rounded-lg border border-white/10 bg-[#0B0D0F] p-4">
                  <p className="text-xs font-semibold text-[#D4AF37]">กำหนดการสำคัญ</p>
                  <p className="mt-1 font-mono text-sm text-white tabular-nums">
                    {detailCompetition.submissionDeadline}
                  </p>
                  <p className="mt-1 text-xs text-neutral-400">{detailCompetition.teamFormat}</p>
                </div>
              </div>

              {/* Rules & Requirements */}
              <div>
                <h4 className="text-sm font-semibold text-white">
                  กติกาและข้อกำหนด (Rules &amp; Requirements)
                </h4>
                <ol className="mt-3 space-y-2 text-sm leading-relaxed text-neutral-300">
                  {detailCompetition.rules.map((rule, idx) => (
                    <li key={idx} className="flex gap-3">
                      <span className="font-mono text-xs font-semibold text-[#D4AF37] tabular-nums pt-1">
                        {idx + 1}.
                      </span>
                      <span>{rule}</span>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Rounds for English Quiz */}
              {detailCompetition.rounds && (
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold text-white">รูปแบบการแข่งขัน 2 รอบ</h4>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {detailCompetition.rounds.map((round, idx) => (
                      <div
                        key={idx}
                        className="rounded-lg border border-white/10 bg-[#0B0D0F] p-4 space-y-2"
                      >
                        <p className="text-xs font-semibold text-emerald-400">{round.title}</p>
                        <ul className="space-y-1.5 text-xs leading-relaxed text-neutral-300">
                          {round.details.map((d, i) => (
                            <li key={i}>• {d}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Judging Criteria */}
              <div>
                <div className="flex items-baseline justify-between">
                  <h4 className="text-sm font-semibold text-white">
                    เกณฑ์การตัดสิน (Judging Criteria)
                  </h4>
                  {detailCompetition.totalPoints && (
                    <span className="font-mono text-xs font-semibold text-[#D4AF37] tabular-nums">
                      Total {detailCompetition.totalPoints} Points
                    </span>
                  )}
                </div>

                <div className="mt-3 divide-y divide-white/10 rounded-lg border border-white/10 bg-[#0B0D0F]">
                  {detailCompetition.judgingCriteria.map((crit, idx) => (
                    <div
                      key={idx}
                      className="flex items-start justify-between gap-4 px-4 py-3 text-xs"
                    >
                      <div>
                        <p className="font-semibold text-white">{crit.label}</p>
                        {crit.description && (
                          <p className="mt-0.5 text-neutral-400">{crit.description}</p>
                        )}
                      </div>
                      {crit.points !== undefined && (
                        <span className="font-mono font-semibold text-[#D4AF37] tabular-nums whitespace-nowrap shrink-0">
                          {crit.points} คะแนน
                        </span>
                      )}
                    </div>
                  ))}
                </div>
                {detailCompetition.judgingNote && (
                  <p className="mt-2 text-xs text-neutral-400">{detailCompetition.judgingNote}</p>
                )}
              </div>

              {/* Contacts, Submission Rooms, Emails, LINE OpenChat */}
              <div>
                <h4 className="text-sm font-semibold text-white">
                  ช่องทางส่งผลงาน สถานที่ และติดต่อประสานงาน
                </h4>
                <div className="mt-3 space-y-3">
                  {detailCompetition.contacts.map((contact, idx) => (
                    <div
                      key={idx}
                      className="rounded-lg border border-white/10 bg-[#0B0D0F] p-4 text-xs space-y-1.5"
                    >
                      <p className="font-semibold text-white">{contact.level}</p>
                      {(contact.room || contact.teacher) && (
                        <p className="flex items-center gap-1.5 text-neutral-300">
                          <MapPin className="h-3.5 w-3.5 text-[#D4AF37] shrink-0" />
                          <span>
                            {contact.room}
                            {contact.teacher ? ` · ${contact.teacher}` : ''}
                          </span>
                        </p>
                      )}
                      {contact.email && (
                        <p className="flex items-center gap-1.5 text-neutral-300">
                          <Mail className="h-3.5 w-3.5 text-[#D4AF37] shrink-0" />
                          <a
                            href={`mailto:${contact.email}`}
                            className="font-mono text-[#D4AF37] underline hover:text-white"
                          >
                            {contact.email}
                          </a>
                        </p>
                      )}
                      {contact.note && <p className="text-neutral-400">{contact.note}</p>}
                      {contact.lineOpenChat && (
                        <div className="pt-1">
                          <a
                            href={contact.lineOpenChat}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 rounded-md border border-emerald-500/40 bg-emerald-500/10 px-3 py-1.5 font-semibold text-emerald-300 transition-colors hover:bg-emerald-500/20"
                          >
                            เข้าร่วม LINE OpenChat <ExternalLink className="h-3.5 w-3.5" />
                          </a>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-3 border-t border-white/10 pt-5">
              <button
                type="button"
                onClick={() => setDetailCompetition(null)}
                className="whitespace-nowrap shrink-0 rounded-md border border-white/15 px-4 py-2 text-xs font-medium text-neutral-300 hover:text-white cursor-pointer"
              >
                ปิดหน้าต่าง
              </button>
              <button
                type="button"
                onClick={() => {
                  const id = detailCompetition.id;
                  setDetailCompetition(null);
                  onSelectForRegister(id);
                }}
                className="whitespace-nowrap shrink-0 rounded-md bg-[#E10600] px-5 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#B80500] cursor-pointer"
              >
                สมัครรายการนี้ทันที
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
