import React, { useMemo, useState } from 'react';
import type { User } from 'firebase/auth';
import { Download, LogIn, LogOut, ShieldCheck, X } from 'lucide-react';
import { COMPETITIONS } from '../data/competitions';
import { ADMIN_EMAIL } from '../firebase';
import {
  CompetitionId,
  DivisionType,
  RegistrationEntry,
} from '../types/competition';

interface RegisteredGridSectionProps {
  user: User | null;
  isAdmin: boolean;
  privateRegistrations: RegistrationEntry[];
  showAdminModal: boolean;
  onCloseAdminModal: () => void;
  onGoogleSignIn: (forceSelectAccount?: boolean) => Promise<void>;
  onSignOut: () => Promise<void>;
  onDeleteRegistration: (id: string) => Promise<void>;
}

export const RegisteredGridSection: React.FC<RegisteredGridSectionProps> = ({
  user,
  isAdmin,
  privateRegistrations,
  showAdminModal,
  onCloseAdminModal,
  onGoogleSignIn,
  onSignOut,
  onDeleteRegistration,
}) => {
  const [search, setSearch] = useState('');
  const [compFilter, setCompFilter] = useState<CompetitionId | 'all'>('all');
  const [divisionFilter, setDivisionFilter] = useState<DivisionType | 'all'>('all');
  const [adminError, setAdminError] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const filteredAdmin = useMemo(() => {
    const q = search.trim().toLowerCase();
    return privateRegistrations.filter((item) => {
      if (compFilter !== 'all' && item.competitionId !== compFilter) return false;
      if (divisionFilter !== 'all' && item.division !== divisionFilter) return false;
      if (!q) return true;
      return (
        item.studentName.toLowerCase().includes(q) ||
        (item.englishFullName && item.englishFullName.toLowerCase().includes(q)) ||
        item.studentId.toLowerCase().includes(q) ||
        item.raceNumber.toLowerCase().includes(q) ||
        (item.teamName && item.teamName.toLowerCase().includes(q)) ||
        (item.teamMembers && item.teamMembers.toLowerCase().includes(q))
      );
    });
  }, [privateRegistrations, compFilter, divisionFilter, search]);

  const handleAdminSignIn = async () => {
    setAdminError('');
    try {
      await onGoogleSignIn(true);
    } catch {
      setAdminError('ไม่สามารถเข้าสู่ระบบ Google ได้ กรุณาอนุญาตป๊อปอัปแล้วลองใหม่');
    }
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await onDeleteRegistration(id);
    } finally {
      setDeletingId(null);
    }
  };

  const handleExportCsv = (rowsToExport: RegistrationEntry[], suffix: string) => {
    if (!isAdmin || rowsToExport.length === 0) return;
    const headers = [
      'Race Pass',
      'Competition',
      'Division',
      'Thai Full Name',
      'English Full Name',
      'Student ID',
      'Grade',
      'Classroom',
      'Contact',
      'Team Name',
      'Team Members',
      'Submission Title',
      'Submission URL',
      'Registered At',
    ];
    const escapeCsv = (val: string | undefined) => {
      const safe = (val ?? '').replace(/"/g, '""');
      return `"${safe}"`;
    };
    const rows = rowsToExport.map((r) => {
      const compTitle = COMPETITIONS.find((c) => c.id === r.competitionId)?.title ?? r.competitionId;
      const divLabel =
        r.division === 'junior'
          ? 'ม.ต้น'
          : r.division === 'senior'
          ? 'ม.ปลาย'
          : 'Combined Levels';
      return [
        r.raceNumber,
        compTitle,
        divLabel,
        r.studentName,
        r.englishFullName,
        r.studentId,
        r.gradeLevel,
        r.classroom,
        r.contactInfo,
        r.teamName,
        r.teamMembers,
        r.submissionTitle,
        r.submissionUrl,
        r.createdAt,
      ]
        .map(escapeCsv)
        .join(',');
    });
    const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `udonpit-christmas-gp-2569-${suffix}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const getDivisionLabel = (div: DivisionType) => {
    if (div === 'junior') return 'ม.ต้น';
    if (div === 'senior') return 'ม.ปลาย';
    return 'รวมทุกระดับ';
  };

  const isFilteredSubset =
    filteredAdmin.length !== privateRegistrations.length && filteredAdmin.length > 0;

  return (
    <>
      {isAdmin && (
        <section id="admin-panel" className="border-b border-white/10 bg-[#0F1216] py-16">
          <div className="mx-auto max-w-[1200px] px-6">
            <div className="flex flex-col justify-between gap-4 border-b border-white/10 pb-8 lg:flex-row lg:items-end">
              <div className="space-y-2">
                <p className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-400">
                  <ShieldCheck className="h-4 w-4" />
                  โหมดแอดมิน ({user?.email})
                </p>
                <h2 className="font-display text-4xl font-bold tracking-tight text-white [text-wrap:balance]">
                  จัดการข้อมูลผู้สมัครและส่งออก CSV
                </h2>
                <p className="text-sm text-neutral-400">
                  ส่วนนี้แสดงเฉพาะผู้ดูแลระบบที่ยืนยันตัวตนแล้วเท่านั้น
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => handleExportCsv(privateRegistrations, 'all')}
                  disabled={privateRegistrations.length === 0}
                  className="inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 rounded-md bg-[#E10600] px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#B80500] disabled:cursor-not-allowed disabled:opacity-40 cursor-pointer"
                >
                  <Download className="h-3.5 w-3.5" />
                  ดาวน์โหลด CSV ทั้งหมด ({privateRegistrations.length})
                </button>

                {isFilteredSubset && (
                  <button
                    type="button"
                    onClick={() => handleExportCsv(filteredAdmin, 'filtered')}
                    className="inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 rounded-md border border-[#D4AF37]/50 bg-[#D4AF37]/10 px-3.5 py-2 text-xs font-semibold text-[#FDE68A] transition-colors hover:bg-[#D4AF37]/20 cursor-pointer"
                  >
                    <Download className="h-3.5 w-3.5" />
                    CSV ตามที่กรอง ({filteredAdmin.length})
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => onSignOut()}
                  className="inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 rounded-md border border-white/15 bg-[#161B22] px-3 py-2 text-xs font-medium text-neutral-300 transition-colors hover:border-[#F87171]/50 hover:text-[#F87171] cursor-pointer"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  ออกจากแอดมิน
                </button>
              </div>
            </div>

            {/* Admin Search & Filters */}
            <div className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-12">
              <div className="md:col-span-5">
                <label htmlFor="admin-search" className="sr-only">
                  ค้นหาผู้สมัคร
                </label>
                <input
                  id="admin-search"
                  type="search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="ค้นหาชื่อ, เลขประจำตัว, ชื่อทีม หรือ #UP-..."
                  className="w-full rounded-lg border border-white/15 bg-[#0B0D0F] px-4 py-2.5 text-sm text-white placeholder:text-neutral-500 focus:border-[#E10600] focus:outline-none"
                />
              </div>

              <div className="md:col-span-4">
                <label htmlFor="admin-comp-filter" className="sr-only">
                  กรองตามรายการแข่งขัน
                </label>
                <select
                  id="admin-comp-filter"
                  value={compFilter}
                  onChange={(e) => setCompFilter(e.target.value as CompetitionId | 'all')}
                  className="w-full rounded-lg border border-white/15 bg-[#0B0D0F] px-4 py-2.5 text-sm text-white focus:border-[#E10600] focus:outline-none"
                >
                  <option value="all">ทุกรายการแข่งขัน (6)</option>
                  {COMPETITIONS.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.code}. {c.title}
                    </option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-3">
                <label htmlFor="admin-div-filter" className="sr-only">
                  กรองตามระดับชั้น
                </label>
                <select
                  id="admin-div-filter"
                  value={divisionFilter}
                  onChange={(e) => setDivisionFilter(e.target.value as DivisionType | 'all')}
                  className="w-full rounded-lg border border-white/15 bg-[#0B0D0F] px-4 py-2.5 text-sm text-white focus:border-[#E10600] focus:outline-none"
                >
                  <option value="all">ทุกรุ่น (ม.ต้น / ม.ปลาย / รวมทุกระดับ)</option>
                  <option value="junior">ม.ต้น</option>
                  <option value="senior">ม.ปลาย</option>
                  <option value="open">รวมทุกระดับ (Drawing &amp; Cover Dance)</option>
                </select>
              </div>
            </div>

            {privateRegistrations.length === 0 ? (
              <div className="mt-8 rounded-xl border border-white/10 bg-[#12151A] px-6 py-12 text-center">
                <h3 className="font-display text-2xl font-bold text-white">
                  ยังไม่มีข้อมูลผู้สมัครในฐานข้อมูล
                </h3>
                <p className="mx-auto mt-2 max-w-[48ch] text-sm text-neutral-400">
                  เมื่อนักเรียนส่งใบสมัคร รายชื่อทั้งหมดจะปรากฏที่นี่และสามารถดาวน์โหลดเป็น CSV ได้ทันที
                </p>
              </div>
            ) : filteredAdmin.length === 0 ? (
              <div className="mt-8 rounded-xl border border-white/10 bg-[#12151A] px-6 py-10 text-center">
                <p className="text-sm text-neutral-300">ไม่พบข้อมูลที่ตรงกับเงื่อนไขการค้นหา</p>
              </div>
            ) : (
              <div className="mt-6 overflow-x-auto rounded-xl border border-white/10 bg-[#12151A]">
                <table className="w-full min-w-[820px] border-collapse text-left">
                  <thead>
                    <tr className="border-b border-white/10 bg-[#171B22] text-xs font-semibold text-neutral-300">
                      <th className="px-5 py-3.5 font-mono">Race Pass</th>
                      <th className="px-5 py-3.5">รายการแข่งขัน</th>
                      <th className="px-5 py-3.5">รุ่น</th>
                      <th className="px-5 py-3.5">ผู้สมัคร / ทีม</th>
                      <th className="px-5 py-3.5">ชั้น / รหัส</th>
                      <th className="px-5 py-3.5">เบอร์ติดต่อ</th>
                      <th className="px-5 py-3.5">รายละเอียดผลงาน</th>
                      <th className="px-5 py-3.5 text-right">จัดการ</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10 text-sm">
                    {filteredAdmin.map((entry) => {
                      const comp = COMPETITIONS.find((c) => c.id === entry.competitionId);
                      return (
                        <tr key={entry.id} className="hover:bg-white/[0.03]">
                          <td className="px-5 py-4 font-mono text-xs font-semibold text-[#D4AF37] tabular-nums">
                            {entry.raceNumber}
                          </td>
                          <td className="px-5 py-4 font-medium text-white">
                            {comp?.title ?? entry.competitionId}
                          </td>
                          <td className="px-5 py-4">
                            <span
                              className={
                                entry.division === 'open'
                                  ? 'text-xs font-semibold text-[#D4AF37]'
                                  : 'text-xs text-emerald-400'
                              }
                            >
                              {getDivisionLabel(entry.division)}
                            </span>
                          </td>
                          <td className="px-5 py-4">
                            <div className="font-medium text-white">{entry.studentName}</div>
                            {entry.englishFullName && (
                              <div className="text-xs text-neutral-400">{entry.englishFullName}</div>
                            )}
                            {entry.teamName && (
                              <div className="text-xs text-[#D4AF37]">
                                ทีม: {entry.teamName}
                                {entry.teamMembersList
                                  ? ` (${entry.teamMembersList.length} คน)`
                                  : ''}
                              </div>
                            )}
                            {entry.teamMembers && (
                              <div className="mt-0.5 text-xs text-neutral-400">
                                {entry.teamMembers}
                              </div>
                            )}
                          </td>
                          <td className="px-5 py-4 font-mono text-xs text-neutral-300 tabular-nums">
                            {entry.gradeLevel}/{entry.classroom} · {entry.studentId}
                          </td>
                          <td className="px-5 py-4 font-mono text-xs text-neutral-300 tabular-nums">
                            {entry.contactInfo}
                          </td>
                          <td className="px-5 py-4 text-xs text-neutral-300">
                            {entry.submissionTitle && <div>{entry.submissionTitle}</div>}
                            {entry.submissionUrl && (
                              <a
                                href={entry.submissionUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="text-[#E10600] underline hover:text-white"
                              >
                                เปิดลิงก์คลิป
                              </a>
                            )}
                            {!entry.submissionTitle && !entry.submissionUrl && (
                              <span className="text-neutral-500">รอส่งผลงานตามกำหนด</span>
                            )}
                          </td>
                          <td className="px-5 py-4 text-right">
                            <button
                              type="button"
                              disabled={deletingId === entry.id}
                              onClick={() => handleDelete(entry.id)}
                              className="whitespace-nowrap shrink-0 text-xs font-medium text-neutral-400 transition-colors hover:text-[#F87171] disabled:opacity-40 cursor-pointer"
                            >
                              {deletingId === entry.id ? 'กำลังลบ...' : 'ลบรายการ'}
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Admin Google Auth Modal */}
      {showAdminModal && !isAdmin && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="admin-login-title"
          onClick={onCloseAdminModal}
        >
          <div
            className="w-full max-w-md rounded-xl border border-white/15 bg-[#12151A] p-6 space-y-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-4">
              <div>
                <p className="text-xs font-semibold text-[#D4AF37]">
                  Foreign Language Department &amp; IP
                </p>
                <h3 id="admin-login-title" className="mt-1 font-display text-2xl font-bold text-white">
                  เข้าสู่โหมดแอดมิน
                </h3>
              </div>
              <button
                type="button"
                onClick={onCloseAdminModal}
                aria-label="ปิดหน้าต่าง"
                className="rounded-md border border-white/15 p-1.5 text-neutral-300 hover:bg-white/10 hover:text-white cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-4 text-xs leading-relaxed text-neutral-300">
              <p>
                การเข้าดูรายชื่อผู้สมัครและดาวน์โหลดไฟล์ CSV สงวนสิทธิ์เฉพาะบัญชีผู้ดูแลระบบของกลุ่มสาระฯ (
                <span className="font-mono text-[#D4AF37]">{ADMIN_EMAIL}</span>)
                เท่านั้น
              </p>

              {user && user.email !== ADMIN_EMAIL && (
                <div className="rounded-lg border border-[#F87171]/40 bg-[#F87171]/10 p-3 text-[#FCA5A5]">
                  ขณะนี้คุณเข้าสู่ระบบด้วยบัญชี <span className="font-mono">{user.email}</span>{' '}
                  ซึ่งไม่มีสิทธิ์แอดมิน กรุณาสลับไปใช้บัญชี <span className="font-mono">{ADMIN_EMAIL}</span>
                </div>
              )}

              {adminError && <p className="text-[#F87171]">{adminError}</p>}

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={onCloseAdminModal}
                  className="whitespace-nowrap shrink-0 rounded-md border border-white/15 px-4 py-2 text-xs font-medium text-neutral-300 hover:text-white cursor-pointer"
                >
                  ปิด
                </button>
                <button
                  type="button"
                  onClick={handleAdminSignIn}
                  className="inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 rounded-md bg-[#E10600] px-5 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#B80500] cursor-pointer"
                >
                  <LogIn className="h-3.5 w-3.5" />
                  เข้าสู่ระบบด้วยบัญชีแอดมิน
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
