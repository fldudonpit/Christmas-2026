import React, { useMemo, useState } from 'react';
import { Award, Medal, Trophy } from 'lucide-react';
import { AWARD_OPTIONS, COMPETITIONS, getAwardOption, getAwardRank } from '../data/competitions';
import {
  AwardStatus,
  Competition,
  CompetitionId,
  CompetitionResult,
  DivisionType,
} from '../types/competition';

interface ResultsSectionProps {
  results: CompetitionResult[];
}

type CompetitionFilter = CompetitionId | 'all';
type DivisionFilter = DivisionType | 'all';

function sortResultsByRank(items: CompetitionResult[]): CompetitionResult[] {
  return [...items].sort((a, b) => {
    const rankDiff = getAwardRank(a.awardStatus) - getAwardRank(b.awardStatus);
    if (rankDiff !== 0) return rankDiff;
    const nameA = a.teamName || a.studentName;
    const nameB = b.teamName || b.studentName;
    return nameA.localeCompare(nameB, 'th');
  });
}

function getAwardRowStyle(status: AwardStatus) {
  switch (status) {
    case 'winner_1':
      return {
        textColor: 'text-[#F5D061]',
        rowBg: 'bg-[#D4AF37]/[0.07]',
        icon: Trophy,
      };
    case 'runner_up_1':
      return {
        textColor: 'text-neutral-200',
        rowBg: 'bg-white/[0.03]',
        icon: Medal,
      };
    case 'runner_up_2':
      return {
        textColor: 'text-amber-400',
        rowBg: 'bg-amber-500/[0.04]',
        icon: Award,
      };
    case 'participant':
      return {
        textColor: 'text-emerald-400',
        rowBg: '',
        icon: null,
      };
    case 'absent':
      return {
        textColor: 'text-neutral-400',
        rowBg: 'opacity-75',
        icon: null,
      };
  }
}

export const ResultsSection: React.FC<ResultsSectionProps> = ({ results }) => {
  const [compFilter, setCompFilter] = useState<CompetitionFilter>('all');
  const [divisionFilter, setDivisionFilter] = useState<DivisionFilter>('all');

  const visibleCompetitions = useMemo(() => {
    if (compFilter === 'all') return COMPETITIONS;
    return COMPETITIONS.filter((c) => c.id === compFilter);
  }, [compFilter]);

  const getDivisionsForCompetition = (comp: Competition): DivisionType[] => {
    if (comp.divisionMode === 'open') {
      if (divisionFilter !== 'all' && divisionFilter !== 'open') return [];
      return ['open'];
    }
    const base: DivisionType[] = ['junior', 'senior'];
    if (divisionFilter === 'all') return base;
    if (divisionFilter === 'open') return [];
    return base.filter((d) => d === divisionFilter);
  };

  const getDivisionTitle = (div: DivisionType) => {
    if (div === 'junior') return 'ระดับ ม.ต้น (Lower Secondary · M.1–M.3)';
    if (div === 'senior') return 'ระดับ ม.ปลาย (Upper Secondary · M.4–M.6)';
    return 'รวมทุกระดับชั้น (Combined Levels · M.1–M.6)';
  };

  const renderDivisionBlock = (comp: Competition, division: DivisionType) => {
    const groupResults = sortResultsByRank(
      results.filter((r) => r.competitionId === comp.id && r.division === division)
    );

    return (
      <div key={`${comp.id}-${division}`} className="space-y-3">
        <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-white/10 pb-2">
          <h4 className="text-sm font-semibold text-white">{getDivisionTitle(division)}</h4>
          <span className="font-mono text-xs text-neutral-400 tabular-nums">
            {groupResults.length > 0 ? `${groupResults.length} รายการ` : 'รอประกาศผล'}
          </span>
        </div>

        {groupResults.length === 0 ? (
          <div className="rounded-lg border border-white/10 bg-[#0B0D0F] px-4 py-4 text-xs text-neutral-400">
            ยังไม่มีประกาศผลการตัดสินในรุ่นนี้
          </div>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-white/10 bg-[#0B0D0F]">
            <table className="w-full min-w-[600px] border-collapse text-left">
              <thead>
                <tr className="border-b border-white/10 bg-[#171B22] text-xs font-semibold text-neutral-300">
                  <th className="w-16 px-4 py-3 font-mono">อันดับ</th>
                  <th className="w-48 px-4 py-3">ผลการแข่งขัน</th>
                  <th className="px-4 py-3">ผู้เข้าแข่งขัน / ทีม</th>
                  <th className="w-28 px-4 py-3 text-right">ชั้น / ห้อง</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10 text-sm">
                {groupResults.map((item) => {
                  const awardMeta = getAwardOption(item.awardStatus);
                  const style = getAwardRowStyle(item.awardStatus);
                  const StatusIcon = style.icon;

                  return (
                    <tr key={item.id} className={style.rowBg}>
                      <td className="px-4 py-3.5 font-mono text-sm font-bold text-white tabular-nums">
                        {awardMeta?.shortRank ?? '-'}
                      </td>
                      <td className="px-4 py-3.5">
                        <span
                          className={`inline-flex items-center gap-1.5 text-xs font-semibold whitespace-nowrap ${style.textColor}`}
                        >
                          {StatusIcon && <StatusIcon className="h-3.5 w-3.5 shrink-0" />}
                          {awardMeta?.label ?? item.awardStatus}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        {item.teamName ? (
                          <div>
                            <div className="font-semibold text-[#D4AF37]">
                              ทีม {item.teamName}
                            </div>
                            <div className="text-xs text-neutral-300">
                              ตัวแทนทีม: {item.studentName}
                            </div>
                            {item.teamMembers && (
                              <div className="mt-0.5 text-xs text-neutral-400">
                                สมาชิก: {item.teamMembers}
                              </div>
                            )}
                          </div>
                        ) : (
                          <div>
                            <div className="font-medium text-white">{item.studentName}</div>
                            {item.englishFullName && (
                              <div className="text-xs text-neutral-400">
                                {item.englishFullName}
                              </div>
                            )}
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3.5 text-right font-mono text-xs text-neutral-300 tabular-nums">
                        {item.gradeLevel}/{item.classroom}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  };

  return (
    <section id="results" className="border-b border-white/10 bg-[#0D1014] py-16">
      <div className="mx-auto max-w-[1200px] px-6">
        <div className="flex flex-col justify-between gap-6 border-b border-white/10 pb-6 lg:flex-row lg:items-end">
          <div className="space-y-2">
            <p className="text-sm font-medium text-[#D4AF37]">
              ประกาศผลการแข่งขันอย่างเป็นทางการ
            </p>
            <h2 className="font-display text-4xl font-bold tracking-tight text-white [text-wrap:balance]">
              โหมดประกาศผล (Official Results)
            </h2>
            <p className="max-w-[66ch] text-sm leading-relaxed text-neutral-400">
              เรียงลำดับตามผลการตัดสิน:{' '}
              {AWARD_OPTIONS.map((opt) => opt.label).join(' · ')}
            </p>
          </div>

          {/* Division Filter Tabs */}
          <div
            role="tablist"
            aria-label="กรองตามรุ่นการแข่งขัน"
            className="flex flex-wrap items-center gap-1 rounded-lg border border-white/10 bg-[#12151A] p-1"
          >
            {[
              { key: 'all', label: 'ทุกรุ่น' },
              { key: 'junior', label: 'ม.ต้น' },
              { key: 'senior', label: 'ม.ปลาย' },
              { key: 'open', label: 'รวมทุกระดับ' },
            ].map((item) => (
              <button
                key={item.key}
                type="button"
                role="tab"
                aria-selected={divisionFilter === item.key}
                onClick={() => setDivisionFilter(item.key as DivisionFilter)}
                className={`whitespace-nowrap shrink-0 rounded-md px-3 py-1.5 text-xs font-medium transition-colors duration-150 cursor-pointer ${
                  divisionFilter === item.key
                    ? 'bg-[#E10600] text-white'
                    : 'text-neutral-300 hover:bg-white/5 hover:text-white'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Competition Selector Tabs */}
        <div
          role="tablist"
          aria-label="เลือกรายการแข่งขันเพื่อดูผล"
          className="mt-6 flex flex-wrap items-center gap-2"
        >
          <button
            type="button"
            role="tab"
            aria-selected={compFilter === 'all'}
            onClick={() => setCompFilter('all')}
            className={`whitespace-nowrap shrink-0 rounded-md border px-3.5 py-2 text-xs font-medium transition-colors duration-150 cursor-pointer ${
              compFilter === 'all'
                ? 'border-[#E10600] bg-[#E10600] text-white'
                : 'border-white/10 bg-[#12151A] text-neutral-300 hover:border-white/25 hover:text-white'
            }`}
          >
            ทั้งหมด 6 รายการ
          </button>
          {COMPETITIONS.map((comp) => (
            <button
              key={comp.id}
              type="button"
              role="tab"
              aria-selected={compFilter === comp.id}
              onClick={() => setCompFilter(comp.id)}
              className={`whitespace-nowrap shrink-0 rounded-md border px-3.5 py-2 text-xs font-medium transition-colors duration-150 cursor-pointer ${
                compFilter === comp.id
                  ? 'border-[#E10600] bg-[#E10600] text-white'
                  : 'border-white/10 bg-[#12151A] text-neutral-300 hover:border-white/25 hover:text-white'
              }`}
            >
              {comp.code}. {comp.title}
            </button>
          ))}
        </div>

        {/* Results Content */}
        {results.length === 0 ? (
          <div className="mt-8 rounded-xl border border-white/10 bg-[#12151A] px-6 py-12 text-center">
            <Trophy className="mx-auto h-9 w-9 text-[#D4AF37]" />
            <h3 className="mt-3 font-display text-2xl font-bold text-white">
              ยังไม่มีประกาศผลการแข่งขัน
            </h3>
            <p className="mx-auto mt-2 max-w-[52ch] text-sm text-neutral-400">
              เมื่อคณะกรรมการและแอดมินบันทึกอันดับผู้ได้รับรางวัลและผู้เข้าร่วมการแข่งขันแล้ว
              รายชื่อจะเรียงอันดับและแสดงในหน้านี้โดยอัตโนมัติ
            </p>
          </div>
        ) : (
          <div className="mt-8 space-y-6">
            {visibleCompetitions.map((comp) => {
              const divs = getDivisionsForCompetition(comp);
              if (divs.length === 0) return null;

              return (
                <article
                  key={comp.id}
                  className="rounded-xl border border-white/10 bg-[#12151A] p-6 space-y-5"
                >
                  <div className="flex flex-col justify-between gap-2 border-b border-white/10 pb-4 sm:flex-row sm:items-baseline">
                    <div>
                      <p className="font-mono text-xs font-semibold text-[#D4AF37] tabular-nums">
                        รายการที่ {comp.code} · {comp.divisionLabel}
                      </p>
                      <h3 className="mt-1 font-display text-3xl font-bold tracking-tight text-white">
                        {comp.title}
                      </h3>
                      <p className="text-xs text-neutral-400">{comp.thaiSubtitle}</p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    {divs.map((div) => renderDivisionBlock(comp, div))}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};
