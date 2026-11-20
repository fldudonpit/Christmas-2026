import React, { useMemo, useState } from 'react';
import type { User } from 'firebase/auth';
import { Check, Copy, Download, LogIn, LogOut, ShieldCheck, X } from 'lucide-react';
import { AWARD_OPTIONS, COMPETITIONS, getAwardOption } from '../data/competitions';
import { ADMIN_DOMAIN } from '../firebase';
import {
  AwardStatus,
  CompetitionId,
  CompetitionResult,
  DivisionType,
  RegistrationEntry,
} from '../types/competition';

interface RegisteredGridSectionProps {
  user: User | null;
  isAdmin: boolean;
  privateRegistrations: RegistrationEntry[];
  results: CompetitionResult[];
  showAdminModal: boolean;
  onCloseAdminModal: () => void;
  onAdminSignIn: (username: string, password: string) => Promise<void>;
  onSignOut: () => Promise<void>;
  onDeleteRegistration: (id: string) => Promise<void>;
  onSaveResult: (entry: RegistrationEntry, awardStatus: AwardStatus | '') => Promise<void>;
}

export const RegisteredGridSection: React.FC<RegisteredGridSectionProps> = ({
  user,
  isAdmin,
  privateRegistrations,
  results,
  showAdminModal,
  onCloseAdminModal,
  onAdminSignIn,
  onSignOut,
  onDeleteRegistration,
  onSaveResult,
}) => {
  const [search, setSearch] = useState('');
  const [compFilter, setCompFilter] = useState<CompetitionId | 'all'>('all');
  const [divisionFilter, setDivisionFilter] = useState<DivisionType | 'all'>('all');
  const [awardFilter, setAwardFilter] = useState<AwardStatus | 'all' | 'unassigned'>('all');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [adminError, setAdminError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [copiedUid, setCopiedUid] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [savingResultId, setSavingResultId] = useState<string | null>(null);
  const [savedResultId, setSavedResultId] = useState<string | null>(null);
  const [resultError, setResultError] = useState('');

  const resultMap = useMemo(() => {
    const map = new Map<string, CompetitionResult>();
    for (const r of results) {
      map.set(r.registrationId || r.id, r);
    }
    return map;
  }, [results]);

  const filteredAdmin = useMemo(() => {
    const q = search.trim().toLowerCase();
    return privateRegistrations.filter((item) => {
      if (compFilter !== 'all' && item.competitionId !== compFilter) return false;
      if (divisionFilter !== 'all' && item.division !== divisionFilter) return false;
      const assignedStatus = resultMap.get(item.id)?.awardStatus;
      if (awardFilter === 'unassigned' && assignedStatus) return false;
      if (
        awardFilter !== 'all' &&
        awardFilter !== 'unassigned' &&
        assignedStatus !== awardFilter
      ) {
        return false;
      }
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
  }, [privateRegistrations, compFilter, divisionFilter, awardFilter, search, resultMap]);

  const adminDisplayUsername = useMemo(() => {
    if (!user?.email) return 'Admin';
    return user.email.endsWith(`@${ADMIN_DOMAIN}`)
      ? user.email.replace(`@${ADMIN_DOMAIN}`, '')
      : user.email;
  }, [user]);

  const handleAdminSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdminError('');

    if (!username.trim() || !password) {
      setAdminError('กรุณากรอก Username และ Password ให้ครบถ้วน');
      return;
    }

    setIsLoggingIn(true);
    try {
      await onAdminSignIn(username, password);
      setPassword('');
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      if (msg.includes('operation-not-allowed')) {
        setAdminError(
          'ยังไม่ได้เปิดใช้งานระบบ Email/Password ใน Firebase Console (Authentication → Sign-in method)'
        );
      } else if (
        msg.includes('invalid-credential') ||
        msg.includes('wrong-password') ||
        msg.includes('user-not-found') ||
        msg.includes('invalid-email')
      ) {
        setAdminError('ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง กรุณาลองใหม่อีกครั้ง');
      } else if (msg.includes('too-many-requests')) {
        setAdminError('ลองเข้าสู่ระบบผิดหลายครั้ง กรุณารอสักครู่แล้วลองใหม่');
      } else {
        setAdminError('ไม่สามารถเข้าสู่ระบบแอดมินได้ กรุณาตรวจสอบการตั้งค่า Firebase Auth');
      }
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleCopyUid = async () => {
    if (!user?.uid) return;
    try {
      await navigator.clipboard.writeText(user.uid);
      setCopiedUid(true);
      window.setTimeout(() => setCopiedUid(false), 2000);
    } catch {
      // Ignore clipboard failure
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

  const handleResultChange = async (
    entry: RegistrationEntry,
    nextStatus: AwardStatus | ''
  ) => {
    setResultError('');
    setSavingResultId(entry.id);
    try {
      await onSaveResult(entry, nextStatus);
      setSavedResultId(entry.id);
      window.setTimeout(() => {
        setSavedResultId((prev) => (prev === entry.id ? null : prev));
      }, 1800);
    } catch {
      setResultError(
        `ไม่สามารถบันทึกผลการแข่งขันของ ${entry.studentName} ได้ กรุณาลองใหม่อีกครั้ง`
      );
    } finally {
      setSavingResultId(null);
    }
  };

  const handleExportCsv = (rowsToExport: RegistrationEntry[], suffix: string) => {
    if (!isAdmin || rowsToExport.length === 0) return;
    const headers = [
      'Reference ID',
      'Competition',
      'Division',
      'Award / Result',
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
      const awardStatus = resultMap.get(r.id)?.awardStatus;
      const awardLabel = getAwardOption(awardStatus)?.label ?? 'ยังไม่ระบุผล';
      return [
        r.raceNumber,
        compTitle,
        divLabel,
        awardLabel,
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
                  โหมดแอดมิน ({adminDisplayUsername})
                </p>
                <h2 className="font-display text-4xl font-bold tracking-tight text-white [text-wrap:balance]">
                  จัดการผู้สมัคร บันทึกผลการแข่งขัน และส่งออก CSV
                </h2>
                <p className="text-sm text-neutral-400">
                  เลือกอันดับผลการแข่งขันของแต่ละคนเพื่อแสดงผลเรียงอันดับในโหมดประกาศผลโดยอัตโนมัติ
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                <a
                  href="#results"
                  className="inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 rounded-md border border-[#D4AF37]/50 bg-[#D4AF37]/10 px-3.5 py-2 text-xs font-semibold text-[#FDE68A] transition-colors hover:bg-[#D4AF37]/20"
                >
                  ดูหน้าประกาศผล
                </a>

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
              <div className="md:col-span-4">
                <label htmlFor="admin-search" className="sr-only">
                  ค้นหาผู้สมัคร
                </label>
                <input
                  id="admin-search"
                  type="search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="ค้นหาชื่อ, เลขประจำตัว หรือชื่อทีม..."
                  className="w-full rounded-lg border border-white/15 bg-[#0B0D0F] px-4 py-2.5 text-sm text-white placeholder:text-neutral-500 focus:border-[#E10600] focus:outline-none"
                />
              </div>

              <div className="md:col-span-3">
                <label htmlFor="admin-comp-filter" className="sr-only">
                  กรองตามรายการแข่งขัน
                </label>
                <select
                  id="admin-comp-filter"
                  value={compFilter}
                  onChange={(e) => setCompFilter(e.target.value as CompetitionId | 'all')}
                  className="w-full rounded-lg border border-white/15 bg-[#0B0D0F] px-3.5 py-2.5 text-sm text-white focus:border-[#E10600] focus:outline-none"
                >
                  <option value="all">ทุกรายการแข่งขัน (6)</option>
                  {COMPETITIONS.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.code}. {c.title}
                    </option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2">
                <label htmlFor="admin-div-filter" className="sr-only">
                  กรองตามระดับชั้น
                </label>
                <select
                  id="admin-div-filter"
                  value={divisionFilter}
                  onChange={(e) => setDivisionFilter(e.target.value as DivisionType | 'all')}
                  className="w-full rounded-lg border border-white/15 bg-[#0B0D0F] px-3.5 py-2.5 text-sm text-white focus:border-[#E10600] focus:outline-none"
                >
                  <option value="all">ทุกรุ่น</option>
                  <option value="junior">ม.ต้น</option>
                  <option value="senior">ม.ปลาย</option>
                  <option value="open">รวมทุกระดับ</option>
                </select>
              </div>

              <div className="md:col-span-3">
                <label htmlFor="admin-award-filter" className="sr-only">
                  กรองตามผลการแข่งขัน
                </label>
                <select
                  id="admin-award-filter"
                  value={awardFilter}
                  onChange={(e) =>
                    setAwardFilter(e.target.value as AwardStatus | 'all' | 'unassigned')
                  }
                  className="w-full rounded-lg border border-white/15 bg-[#0B0D0F] px-3.5 py-2.5 text-sm text-white focus:border-[#E10600] focus:outline-none"
                >
                  <option value="all">สถานะผลทั้งหมด</option>
                  <option value="unassigned">ยังไม่ระบุผล</option>
                  {AWARD_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {resultError && (
              <div className="mt-4 rounded-lg border border-[#F87171]/40 bg-[#F87171]/10 px-4 py-3 text-xs text-[#FCA5A5]">
                {resultError}
              </div>
            )}

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
                <table className="w-full min-w-[980px] border-collapse text-left">
                  <thead>
                    <tr className="border-b border-white/10 bg-[#171B22] text-xs font-semibold text-neutral-300">
                      <th className="px-4 py-3.5">รายการแข่งขัน</th>
                      <th className="px-4 py-3.5">รุ่น</th>
                      <th className="px-4 py-3.5">ผู้สมัคร / ทีม</th>
                      <th className="px-4 py-3.5">ชั้น / รหัส</th>
                      <th className="px-4 py-3.5">เบอร์ติดต่อ</th>
                      <th className="px-4 py-3.5">รายละเอียดผลงาน</th>
                      <th className="px-4 py-3.5">ผลการแข่งขัน (โหมดประกาศผล)</th>
                      <th className="px-4 py-3.5 text-right">จัดการ</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10 text-sm">
                    {filteredAdmin.map((entry) => {
                      const comp = COMPETITIONS.find((c) => c.id === entry.competitionId);
                      const currentAward = resultMap.get(entry.id)?.awardStatus ?? '';
                      const isSavingThis = savingResultId === entry.id;
                      const isSavedThis = savedResultId === entry.id;

                      return (
                        <tr key={entry.id} className="hover:bg-white/[0.03]">
                          <td className="px-4 py-4 font-medium text-white">
                            {comp?.title ?? entry.competitionId}
                          </td>
                          <td className="px-4 py-4">
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
                          <td className="px-4 py-4">
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
                          <td className="px-4 py-4 font-mono text-xs text-neutral-300 tabular-nums">
                            {entry.gradeLevel}/{entry.classroom} · {entry.studentId}
                          </td>
                          <td className="px-4 py-4 font-mono text-xs text-neutral-300 tabular-nums">
                            {entry.contactInfo}
                          </td>
                          <td className="px-4 py-4 text-xs text-neutral-300">
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
                          <td className="px-4 py-4">
                            <div className="space-y-1">
                              <select
                                aria-label={`เลือกผลการแข่งขันของ ${entry.studentName}`}
                                value={currentAward}
                                disabled={isSavingThis}
                                onChange={(e) =>
                                  handleResultChange(
                                    entry,
                                    e.target.value as AwardStatus | ''
                                  )
                                }
                                className={`w-48 rounded-md border px-2.5 py-1.5 text-xs font-medium focus:border-[#E10600] focus:outline-none disabled:opacity-50 ${
                                  currentAward === 'winner_1'
                                    ? 'border-[#D4AF37] bg-[#D4AF37]/15 text-[#FDE68A]'
                                    : currentAward === 'runner_up_1' ||
                                      currentAward === 'runner_up_2'
                                    ? 'border-white/30 bg-[#171B22] text-white'
                                    : currentAward === 'participant'
                                    ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300'
                                    : currentAward === 'absent'
                                    ? 'border-white/15 bg-[#0B0D0F] text-neutral-400'
                                    : 'border-white/15 bg-[#0B0D0F] text-neutral-300'
                                }`}
                              >
                                <option value="">-- ยังไม่ระบุผล --</option>
                                {AWARD_OPTIONS.map((opt) => (
                                  <option key={opt.value} value={opt.value}>
                                    {opt.label}
                                  </option>
                                ))}
                              </select>
                              {isSavingThis && (
                                <p className="text-[11px] text-neutral-400">กำลังบันทึก...</p>
                              )}
                              {!isSavingThis && isSavedThis && (
                                <p className="text-[11px] text-emerald-400">
                                  บันทึกแล้ว · แสดงในหน้าประกาศผล
                                </p>
                              )}
                            </div>
                          </td>
                          <td className="px-4 py-4 text-right">
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

      {/* Admin Username & Password Login Modal */}
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

            {user ? (
              <div className="space-y-4 text-xs leading-relaxed text-neutral-300">
                <div className="rounded-lg border border-[#D4AF37]/40 bg-[#D4AF37]/10 p-4 space-y-2">
                  <p className="font-semibold text-[#FDE68A]">
                    ยืนยัน Username / Password แล้ว แต่บัญชีนี้ยังไม่ได้รับสิทธิ์แอดมินในกฎ Firestore
                  </p>
                  <p className="text-neutral-200">
                    คัดลอกรหัส <span className="font-semibold text-white">User UID</span> ด้านล่างเพื่อนำไปอนุญาตสิทธิ์แอดมิน:
                  </p>
                  <div className="flex items-center justify-between gap-2 rounded-md border border-white/15 bg-[#0B0D0F] px-3 py-2">
                    <span className="font-mono text-xs text-white truncate">{user.uid}</span>
                    <button
                      type="button"
                      onClick={handleCopyUid}
                      className="inline-flex items-center gap-1 whitespace-nowrap shrink-0 text-xs font-semibold text-[#D4AF37] hover:text-white cursor-pointer"
                    >
                      {copiedUid ? (
                        <>
                          <Check className="h-3.5 w-3.5 text-emerald-400" />
                          <span className="text-emerald-400">คัดลอกแล้ว</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-3.5 w-3.5" />
                          คัดลอก UID
                        </>
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => onSignOut()}
                    className="whitespace-nowrap shrink-0 rounded-md border border-white/15 px-4 py-2 text-xs font-medium text-neutral-300 hover:text-white cursor-pointer"
                  >
                    ออกจากบัญชีนี้
                  </button>
                  <button
                    type="button"
                    onClick={onCloseAdminModal}
                    className="whitespace-nowrap shrink-0 rounded-md bg-[#E10600] px-4 py-2 text-xs font-semibold text-white hover:bg-[#B80500] cursor-pointer"
                  >
                    ปิด
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleAdminSubmit} noValidate className="space-y-4">
                <p className="text-xs leading-relaxed text-neutral-300">
                  กรอก Username และ Password ของแอดมินเพื่อดูรายชื่อผู้สมัครและดาวน์โหลดไฟล์ CSV
                </p>

                <div className="space-y-1.5">
                  <label htmlFor="admin-username" className="block text-xs font-medium text-neutral-300">
                    Username <span className="text-[#E10600]">*</span>
                  </label>
                  <input
                    id="admin-username"
                    type="text"
                    autoComplete="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="เช่น admin"
                    className="w-full rounded-lg border border-white/15 bg-[#0B0D0F] px-3.5 py-2.5 text-sm text-white placeholder:text-neutral-500 focus:border-[#E10600] focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="admin-password" className="block text-xs font-medium text-neutral-300">
                    Password <span className="text-[#E10600]">*</span>
                  </label>
                  <input
                    id="admin-password"
                    type="password"
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full rounded-lg border border-white/15 bg-[#0B0D0F] px-3.5 py-2.5 text-sm text-white placeholder:text-neutral-500 focus:border-[#E10600] focus:outline-none"
                  />
                </div>

                {adminError && (
                  <p className="rounded-lg border border-[#F87171]/40 bg-[#F87171]/10 px-3 py-2 text-xs text-[#FCA5A5]">
                    {adminError}
                  </p>
                )}

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={onCloseAdminModal}
                    className="whitespace-nowrap shrink-0 rounded-md border border-white/15 px-4 py-2 text-xs font-medium text-neutral-300 hover:text-white cursor-pointer"
                  >
                    ปิด
                  </button>
                  <button
                    type="submit"
                    disabled={isLoggingIn}
                    className="inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 rounded-md bg-[#E10600] px-5 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#B80500] disabled:opacity-50 cursor-pointer"
                  >
                    <LogIn className="h-3.5 w-3.5" />
                    {isLoggingIn ? 'กำลังตรวจสอบ...' : 'เข้าสู่ระบบแอดมิน'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
};
