import React, { useEffect, useMemo, useState } from 'react';
import type { User } from 'firebase/auth';
import { ExternalLink, LogIn, LogOut, Plus, Trash2 } from 'lucide-react';
import {
  ALL_GRADES,
  COMPETITIONS,
  JUNIOR_GRADES,
  SENIOR_GRADES,
} from '../data/competitions';
import {
  CompetitionId,
  DivisionType,
  RegistrationEntry,
  TeamMember,
} from '../types/competition';

interface RegistrationSectionProps {
  user: User | null;
  authReady: boolean;
  onGoogleSignIn: (forceSelectAccount?: boolean) => Promise<void>;
  onSignOut: () => Promise<void>;
  selectedCompetitionId: CompetitionId;
  onCompetitionChange: (id: CompetitionId) => void;
  onAddRegistration: (
    entry: Omit<RegistrationEntry, 'id' | 'ownerUid' | 'raceNumber' | 'createdAt'>
  ) => Promise<RegistrationEntry>;
}

const MAX_COVER_DANCE_MEMBERS = 10;

export const RegistrationSection: React.FC<RegistrationSectionProps> = ({
  user,
  authReady,
  onGoogleSignIn,
  onSignOut,
  selectedCompetitionId,
  onCompetitionChange,
  onAddRegistration,
}) => {
  const selectedComp = useMemo(
    () => COMPETITIONS.find((c) => c.id === selectedCompetitionId) ?? COMPETITIONS[0],
    [selectedCompetitionId]
  );

  const isCombinedLevel = selectedComp.divisionMode === 'open';

  const [division, setDivision] = useState<DivisionType>(isCombinedLevel ? 'open' : 'junior');
  const [studentName, setStudentName] = useState('');
  const [englishFullName, setEnglishFullName] = useState('');
  const [studentId, setStudentId] = useState('');
  const [gradeLevel, setGradeLevel] = useState('ม.1');
  const [classroom, setClassroom] = useState('');
  const [contactInfo, setContactInfo] = useState('');
  const [teamName, setTeamName] = useState('');
  const [teamMembersList, setTeamMembersList] = useState<TeamMember[]>([
    { name: '', gradeClass: '' },
  ]);
  const [submissionTitle, setSubmissionTitle] = useState('');
  const [submissionUrl, setSubmissionUrl] = useState('');

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [createdPass, setCreatedPass] = useState<RegistrationEntry | null>(null);

  useEffect(() => {
    if (selectedComp.divisionMode === 'open') {
      setDivision('open');
    } else if (division === 'open') {
      setDivision('junior');
      setGradeLevel(JUNIOR_GRADES[0]);
    }
  }, [selectedComp, division]);

  const availableGrades = useMemo(() => {
    if (division === 'junior') return JUNIOR_GRADES;
    if (division === 'senior') return SENIOR_GRADES;
    return ALL_GRADES;
  }, [division]);

  useEffect(() => {
    if (!availableGrades.includes(gradeLevel)) {
      setGradeLevel(availableGrades[0]);
    }
  }, [availableGrades, gradeLevel]);

  const handleDivisionSelect = (nextDiv: DivisionType) => {
    if (isCombinedLevel) return;
    setDivision(nextDiv);
    setErrors((prev) => ({ ...prev, division: '' }));
  };

  const handleAddMemberRow = () => {
    if (teamMembersList.length >= MAX_COVER_DANCE_MEMBERS) return;
    setTeamMembersList((prev) => [...prev, { name: '', gradeClass: '' }]);
  };

  const handleRemoveMemberRow = (index: number) => {
    if (teamMembersList.length <= 1) return;
    setTeamMembersList((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleUpdateMemberRow = (
    index: number,
    field: keyof TeamMember,
    value: string
  ) => {
    setTeamMembersList((prev) =>
      prev.map((item, idx) => (idx === index ? { ...item, [field]: value } : item))
    );
    setErrors((prev) => ({ ...prev, teamMembers: '' }));
  };

  const activeContact = useMemo(() => {
    if (selectedComp.contacts.length === 1) return selectedComp.contacts[0];
    if (division === 'senior') return selectedComp.contacts[1];
    return selectedComp.contacts[0];
  }, [selectedComp, division]);

  const activeThemeText = useMemo(() => {
    if (typeof selectedComp.themeTopic === 'string') return selectedComp.themeTopic;
    return division === 'senior'
      ? selectedComp.themeTopic.senior
      : selectedComp.themeTopic.junior;
  }, [selectedComp, division]);

  const handleSignInClick = async () => {
    setSubmitError('');
    setIsSigningIn(true);
    try {
      await onGoogleSignIn(false);
    } catch {
      setSubmitError('ไม่สามารถเข้าสู่ระบบ Google ได้ กรุณาอนุญาตป๊อปอัปแล้วลองใหม่อีกครั้ง');
    } finally {
      setIsSigningIn(false);
    }
  };

  const validate = (): boolean => {
    const nextErrors: Record<string, string> = {};

    const cleanStudentName = studentName.trim();
    if (cleanStudentName.length < 2 || cleanStudentName.length > 150) {
      nextErrors.studentName = 'กรุณากรอกชื่อ-นามสกุลภาษาไทย (2–150 ตัวอักษร)';
    }
    if (
      selectedComp.id === 'drawing-painting' &&
      (englishFullName.trim().length < 2 || englishFullName.trim().length > 150)
    ) {
      nextErrors.englishFullName =
        'รายการ Drawing & Painting ต้องระบุชื่อ-นามสกุลภาษาอังกฤษด้วย (สำหรับเขียนด้านหลังภาพ)';
    } else if (englishFullName.trim().length > 150) {
      nextErrors.englishFullName = 'ชื่อ-นามสกุลภาษาอังกฤษต้องไม่เกิน 150 ตัวอักษร';
    }
    if (!/^[0-9]{4,8}$/.test(studentId.trim())) {
      nextErrors.studentId = 'กรุณากรอกเลขประจำตัวนักเรียนเป็นตัวเลข 4–8 หลัก';
    }
    if (classroom.trim().length < 1 || classroom.trim().length > 20) {
      nextErrors.classroom = 'กรุณาระบุห้องเรียน (1–20 ตัวอักษร เช่น 1, 2, IP1)';
    }
    if (contactInfo.trim().length < 5 || contactInfo.trim().length > 60) {
      nextErrors.contactInfo = 'กรุณาระบุเบอร์โทรศัพท์ติดต่อ (5–60 ตัวอักษร)';
    }
    if (selectedComp.id === 'cover-dance') {
      if (teamName.trim().length < 1 || teamName.trim().length > 100) {
        nextErrors.teamName = 'กรุณากรอกชื่อทีมสำหรับรายการ Cover Dance (ไม่เกิน 100 ตัวอักษร)';
      }
      const validMembers = teamMembersList.filter((m) => m.name.trim().length > 0);
      if (validMembers.length === 0) {
        nextErrors.teamMembers = 'กรุณากรอกชื่อสมาชิกในทีมอย่างน้อย 1 คน';
      }
    }
    if (submissionTitle.trim().length > 200) {
      nextErrors.submissionTitle = 'ข้อความต้องไม่เกิน 200 ตัวอักษร';
    }
    if (submissionUrl.trim()) {
      if (!/^https?:\/\/.+/i.test(submissionUrl.trim()) || submissionUrl.trim().length > 500) {
        nextErrors.submissionUrl = 'ลิงก์คลิปต้องขึ้นต้นด้วย https:// หรือ http:// และไม่เกิน 500 ตัวอักษร';
      }
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');

    if (!user) {
      setSubmitError('กรุณาเข้าสู่ระบบด้วยบัญชี Google ก่อนกดยืนยันการสมัคร');
      return;
    }
    if (!validate()) return;

    const cleanedMembers =
      selectedComp.id === 'cover-dance'
        ? teamMembersList
            .map((m) => ({
              name: m.name.trim().slice(0, 120),
              gradeClass: m.gradeClass.trim().slice(0, 30),
            }))
            .filter((m) => m.name.length > 0)
            .slice(0, MAX_COVER_DANCE_MEMBERS)
        : undefined;

    const formattedMembersText = cleanedMembers?.length
      ? cleanedMembers
          .map((m, idx) =>
            `${idx + 1}. ${m.name}${m.gradeClass ? ` (${m.gradeClass})` : ''}`
          )
          .join(', ')
          .slice(0, 2000)
      : undefined;

    setIsSubmitting(true);
    try {
      const saved = await onAddRegistration({
        competitionId: selectedComp.id,
        division: isCombinedLevel ? 'open' : division,
        studentName: studentName.trim(),
        englishFullName: englishFullName.trim() || undefined,
        studentId: studentId.trim(),
        gradeLevel,
        classroom: classroom.trim(),
        contactInfo: contactInfo.trim(),
        teamName: teamName.trim() || undefined,
        teamMembersList: cleanedMembers,
        teamMembers: formattedMembersText,
        submissionTitle:
          selectedComp.id === 'cover-dance' ? undefined : submissionTitle.trim() || undefined,
        submissionUrl: submissionUrl.trim() || undefined,
      });

      setCreatedPass(saved);
      setStudentName('');
      setEnglishFullName('');
      setStudentId('');
      setClassroom('');
      setContactInfo('');
      setTeamName('');
      setTeamMembersList([{ name: '', gradeClass: '' }]);
      setSubmissionTitle('');
      setSubmissionUrl('');
      setErrors({});
    } catch {
      setSubmitError('บันทึกข้อมูลลงฐานข้อมูลไม่สำเร็จ กรุณาตรวจสอบการเชื่อมต่อและลองใหม่อีกครั้ง');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getDivisionText = (div: DivisionType) => {
    if (div === 'junior') return 'มัธยมศึกษาตอนต้น (Lower Secondary · M.1–M.3)';
    if (div === 'senior') return 'มัธยมศึกษาตอนปลาย (Upper Secondary · M.4–M.6)';
    return 'รวมทุกระดับชั้น (Combined Levels · ไม่แยก ม.ต้น/ม.ปลาย)';
  };

  const createdPassComp = createdPass
    ? COMPETITIONS.find((c) => c.id === createdPass.competitionId)
    : null;
  const createdPassContact = createdPassComp
    ? createdPassComp.contacts.length === 1
      ? createdPassComp.contacts[0]
      : createdPass?.division === 'senior'
      ? createdPassComp.contacts[1]
      : createdPassComp.contacts[0]
    : null;

  return (
    <section id="register" className="border-b border-white/10 bg-[#0B0D0F] py-16">
      <div className="mx-auto max-w-[1200px] px-6">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
          {/* Left Context & Selected Competition Telemetry */}
          <div className="space-y-6 lg:col-span-5">
            <div className="space-y-2">
              <p className="text-sm font-medium text-[#D4AF37]">Driver Entry &amp; Race Pass</p>
              <h2 className="font-display text-4xl font-bold tracking-tight text-white [text-wrap:balance]">
                ลงทะเบียนเข้าร่วมการแข่งขัน
              </h2>
              <p className="text-sm leading-relaxed text-neutral-400">
                กรอกข้อมูลเพื่อบันทึกลงฐานข้อมูลกลางของโรงเรียนอย่างถาวร และรับรหัส Race Pass
                สำหรับใช้ตรวจสอบสิทธิ์การแข่งขัน
              </p>
            </div>

            {/* Selected Competition Telemetry Box */}
            <div className="rounded-xl border border-white/10 bg-[#12151A] p-6 space-y-4">
              <div className="flex items-baseline justify-between border-b border-white/10 pb-3">
                <span className="font-mono text-xs font-semibold text-[#D4AF37]">
                  รายการที่เลือก · {selectedComp.code}
                </span>
                <span className="font-mono text-xs text-white tabular-nums">
                  {selectedComp.dateLabel}
                </span>
              </div>
              <div>
                <h3 className="font-display text-2xl font-bold text-white">
                  {selectedComp.title}
                </h3>
                <p className="text-xs text-neutral-400">{selectedComp.categoryLabel}</p>
              </div>

              <dl className="space-y-2.5 border-t border-white/10 pt-3 text-xs">
                <div className="flex justify-between gap-4">
                  <dt className="text-neutral-400 shrink-0">การแบ่งระดับชั้น</dt>
                  <dd
                    className={`font-semibold text-right ${
                      isCombinedLevel ? 'text-[#D4AF37]' : 'text-emerald-400'
                    }`}
                  >
                    {selectedComp.divisionLabel}
                  </dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-neutral-400 shrink-0">หัวข้อที่กำหนด</dt>
                  <dd className="text-right text-white">{activeThemeText}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-neutral-400 shrink-0">รูปแบบการแข่ง</dt>
                  <dd className="text-right text-neutral-200">{selectedComp.teamFormat}</dd>
                </div>
                {activeContact.room && (
                  <div className="flex justify-between gap-4">
                    <dt className="text-neutral-400 shrink-0">สถานที่ / ห้อง</dt>
                    <dd className="text-right font-medium text-white">
                      {activeContact.room}
                      {activeContact.teacher ? ` (${activeContact.teacher})` : ''}
                    </dd>
                  </div>
                )}
                {activeContact.email && (
                  <div className="flex justify-between gap-4">
                    <dt className="text-neutral-400 shrink-0">อีเมลส่งคลิป</dt>
                    <dd className="text-right font-mono text-[#D4AF37]">{activeContact.email}</dd>
                  </div>
                )}
                {activeContact.note && (
                  <div className="border-t border-white/10 pt-2 text-neutral-300">
                    {activeContact.note}
                  </div>
                )}
              </dl>

              {activeContact.lineOpenChat && (
                <div className="border-t border-white/10 pt-3">
                  <a
                    href={activeContact.lineOpenChat}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-md border border-emerald-500/40 bg-emerald-500/10 px-3 py-2 text-xs font-semibold text-emerald-300 transition-colors hover:bg-emerald-500/20"
                  >
                    เข้าร่วม LINE OpenChat รายการนี้ <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>
              )}
            </div>

            {/* Created Race Pass Confirmation Card */}
            {createdPass && (
              <div
                role="status"
                aria-live="polite"
                className="rounded-xl border border-[#D4AF37] bg-[#14181F] p-6 space-y-4"
              >
                <div className="checkered-border h-2 w-full rounded-sm opacity-60" />
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold text-emerald-400">
                      บันทึกข้อมูลลงฐานข้อมูลคลาวด์สำเร็จ
                    </p>
                    <h3 className="font-display text-3xl font-extrabold text-white">
                      Race Pass {createdPass.raceNumber}
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="no-print whitespace-nowrap shrink-0 rounded-md border border-white/20 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-white/10 cursor-pointer"
                  >
                    พิมพ์บัตร
                  </button>
                </div>

                <dl className="space-y-1.5 border-t border-white/10 pt-3 text-xs">
                  <div className="flex justify-between gap-2">
                    <dt className="text-neutral-400">รายการแข่งขัน</dt>
                    <dd className="font-semibold text-white">{createdPassComp?.title}</dd>
                  </div>
                  <div className="flex justify-between gap-2">
                    <dt className="text-neutral-400">รุ่นการแข่งขัน</dt>
                    <dd className="text-neutral-200 text-right">
                      {getDivisionText(createdPass.division)}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-2">
                    <dt className="text-neutral-400">ผู้สมัคร</dt>
                    <dd className="text-white text-right">{createdPass.studentName}</dd>
                  </div>
                  {createdPass.englishFullName && (
                    <div className="flex justify-between gap-2">
                      <dt className="text-neutral-400">ชื่อภาษาอังกฤษ</dt>
                      <dd className="text-neutral-200 text-right">{createdPass.englishFullName}</dd>
                    </div>
                  )}
                  <div className="flex justify-between gap-2">
                    <dt className="text-neutral-400">ชั้น / ห้อง</dt>
                    <dd className="font-mono text-neutral-200 tabular-nums">
                      {createdPass.gradeLevel}/{createdPass.classroom} · {createdPass.studentId}
                    </dd>
                  </div>
                  {createdPass.teamName && (
                    <div className="flex justify-between gap-2">
                      <dt className="text-neutral-400">ชื่อทีม</dt>
                      <dd className="text-[#D4AF37]">{createdPass.teamName}</dd>
                    </div>
                  )}
                </dl>

                {createdPass.teamMembersList && createdPass.teamMembersList.length > 0 && (
                  <div className="border-t border-white/10 pt-3 text-xs">
                    <p className="font-semibold text-neutral-300">
                      สมาชิกในทีม ({createdPass.teamMembersList.length} คน):
                    </p>
                    <ul className="mt-1.5 space-y-1 text-neutral-300">
                      {createdPass.teamMembersList.map((member, idx) => (
                        <li key={idx} className="font-mono tabular-nums">
                          {idx + 1}. {member.name}
                          {member.gradeClass ? ` · ${member.gradeClass}` : ''}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {createdPassContact && (
                  <div className="rounded-lg border border-white/10 bg-[#0B0D0F] p-3 text-xs text-neutral-300 space-y-1">
                    <p className="font-semibold text-white">ขั้นตอนถัดไป:</p>
                    {createdPassContact.email && (
                      <p>
                        ส่งคลิปวิดีโอมาที่อีเมล{' '}
                        <span className="font-mono text-[#D4AF37]">{createdPassContact.email}</span>{' '}
                        ภายใน 8 ธ.ค. 2569
                      </p>
                    )}
                    {createdPassContact.room && (
                      <p>
                        สถานที่: {createdPassContact.room}
                        {createdPassContact.teacher ? ` (${createdPassContact.teacher})` : ''}
                      </p>
                    )}
                    {createdPassContact.lineOpenChat && (
                      <a
                        href={createdPassContact.lineOpenChat}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-emerald-400 underline"
                      >
                        เข้ากลุ่ม LINE OpenChat <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Form Column */}
          <div className="lg:col-span-7">
            <form
              onSubmit={handleSubmit}
              noValidate
              className="rounded-xl border border-white/10 bg-[#12151A] p-6 sm:p-8 space-y-6"
            >
              {/* Google Sign-In Status Bar */}
              <div className="flex flex-col justify-between gap-3 rounded-lg border border-white/10 bg-[#0B0D0F] p-4 sm:flex-row sm:items-center">
                {!authReady ? (
                  <p className="text-xs text-neutral-400">กำลังตรวจสอบสถานะบัญชี...</p>
                ) : user ? (
                  <>
                    <div className="space-y-0.5">
                      <p className="text-xs font-semibold text-emerald-400">
                        ยืนยันตัวตนด้วยบัญชี Google แล้ว
                      </p>
                      <p className="font-mono text-xs text-neutral-300">{user.email}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => onSignOut()}
                      className="inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 rounded-md border border-white/15 px-3 py-1.5 text-xs font-medium text-neutral-300 transition-colors hover:text-white cursor-pointer"
                    >
                      <LogOut className="h-3.5 w-3.5" />
                      เปลี่ยนบัญชี / ออกจากระบบ
                    </button>
                  </>
                ) : (
                  <>
                    <div className="space-y-0.5">
                      <p className="text-xs font-semibold text-white">
                        เข้าสู่ระบบด้วย Google ก่อนลงทะเบียน
                      </p>
                      <p className="text-xs text-neutral-400">
                        เพื่อบันทึกข้อมูลถาวรบนคลาวด์ และป้องกันการแอบอ้างสมัครแทนผู้อื่น
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleSignInClick}
                      disabled={isSigningIn}
                      className="inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 rounded-md bg-white px-4 py-2 text-xs font-semibold text-neutral-900 transition-colors hover:bg-neutral-200 disabled:opacity-50 cursor-pointer"
                    >
                      <LogIn className="h-3.5 w-3.5" />
                      {isSigningIn ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบด้วย Google'}
                    </button>
                  </>
                )}
              </div>

              {/* Step 1: Competition Selector */}
              <div className="space-y-2">
                <label
                  htmlFor="competition-select"
                  className="block text-sm font-semibold text-white"
                >
                  1. เลือกรายการแข่งขัน <span className="text-[#E10600]">*</span>
                </label>
                <select
                  id="competition-select"
                  value={selectedComp.id}
                  onChange={(e) => onCompetitionChange(e.target.value as CompetitionId)}
                  className="w-full rounded-lg border border-white/15 bg-[#0B0D0F] px-4 py-3 text-sm text-white focus:border-[#E10600] focus:outline-none"
                >
                  {COMPETITIONS.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.code}. {c.title} — {c.divisionLabel} ({c.dateLabel})
                    </option>
                  ))}
                </select>
              </div>

              {/* Step 2: Division Selection */}
              <div className="space-y-2">
                <span className="block text-sm font-semibold text-white">
                  2. ระดับการแข่งขัน <span className="text-[#E10600]">*</span>
                </span>
                {isCombinedLevel ? (
                  <div className="rounded-lg border border-[#D4AF37]/40 bg-[#D4AF37]/10 px-4 py-3 text-sm text-[#FDE68A]">
                    รายการ {selectedComp.title} แข่งขันแบบรวมทุกระดับชั้น (Combined Levels ·
                    ไม่แยก ม.ต้น / ม.ปลาย)
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <button
                      type="button"
                      onClick={() => handleDivisionSelect('junior')}
                      className={`rounded-lg border px-4 py-3 text-left text-sm transition-colors cursor-pointer ${
                        division === 'junior'
                          ? 'border-[#E10600] bg-[#E10600]/15 text-white font-semibold'
                          : 'border-white/15 bg-[#0B0D0F] text-neutral-300 hover:border-white/30'
                      }`}
                    >
                      <div>ระดับ ม.ต้น (Lower Secondary)</div>
                      <div className="mt-0.5 text-xs text-neutral-400">
                        สำหรับนักเรียนชั้น M.1 – M.3
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDivisionSelect('senior')}
                      className={`rounded-lg border px-4 py-3 text-left text-sm transition-colors cursor-pointer ${
                        division === 'senior'
                          ? 'border-[#E10600] bg-[#E10600]/15 text-white font-semibold'
                          : 'border-white/15 bg-[#0B0D0F] text-neutral-300 hover:border-white/30'
                      }`}
                    >
                      <div>ระดับ ม.ปลาย (Upper Secondary)</div>
                      <div className="mt-0.5 text-xs text-neutral-400">
                        สำหรับนักเรียนชั้น M.4 – M.6
                      </div>
                    </button>
                  </div>
                )}
              </div>

              {/* Step 3: Student Info */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <label htmlFor="studentName" className="block text-xs font-medium text-neutral-300">
                    ชื่อ - นามสกุล (ภาษาไทย) <span className="text-[#E10600]">*</span>
                  </label>
                  <input
                    id="studentName"
                    type="text"
                    maxLength={150}
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    placeholder="เช่น นายพิชญะ อุดรพิทย์"
                    className="w-full rounded-lg border border-white/15 bg-[#0B0D0F] px-4 py-2.5 text-sm text-white placeholder:text-neutral-500 focus:border-[#E10600] focus:outline-none"
                  />
                  {errors.studentName && (
                    <p className="text-xs text-[#F87171]">{errors.studentName}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label
                    htmlFor="englishFullName"
                    className="block text-xs font-medium text-neutral-300"
                  >
                    ชื่อ - นามสกุล (ภาษาอังกฤษ){' '}
                    {selectedComp.id === 'drawing-painting' && (
                      <span className="text-[#E10600]">*</span>
                    )}
                  </label>
                  <input
                    id="englishFullName"
                    type="text"
                    maxLength={150}
                    value={englishFullName}
                    onChange={(e) => setEnglishFullName(e.target.value)}
                    placeholder="เช่น Mr. Phitchaya Udonpit"
                    className="w-full rounded-lg border border-white/15 bg-[#0B0D0F] px-4 py-2.5 text-sm text-white placeholder:text-neutral-500 focus:border-[#E10600] focus:outline-none"
                  />
                  {errors.englishFullName && (
                    <p className="text-xs text-[#F87171]">{errors.englishFullName}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="studentId" className="block text-xs font-medium text-neutral-300">
                    เลขประจำตัวนักเรียน <span className="text-[#E10600]">*</span>
                  </label>
                  <input
                    id="studentId"
                    type="text"
                    inputMode="numeric"
                    maxLength={8}
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                    placeholder="เช่น 51234"
                    className="w-full rounded-lg border border-white/15 bg-[#0B0D0F] px-4 py-2.5 font-mono text-sm text-white placeholder:text-neutral-500 focus:border-[#E10600] focus:outline-none tabular-nums"
                  />
                  {errors.studentId && <p className="text-xs text-[#F87171]">{errors.studentId}</p>}
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="contactInfo" className="block text-xs font-medium text-neutral-300">
                    เบอร์โทรศัพท์ติดต่อ <span className="text-[#E10600]">*</span>
                  </label>
                  <input
                    id="contactInfo"
                    type="text"
                    maxLength={60}
                    value={contactInfo}
                    onChange={(e) => setContactInfo(e.target.value)}
                    placeholder="เช่น 08X-XXX-XXXX"
                    className="w-full rounded-lg border border-white/15 bg-[#0B0D0F] px-4 py-2.5 text-sm text-white placeholder:text-neutral-500 focus:border-[#E10600] focus:outline-none"
                  />
                  {errors.contactInfo && (
                    <p className="text-xs text-[#F87171]">{errors.contactInfo}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="gradeLevel" className="block text-xs font-medium text-neutral-300">
                    ระดับชั้น <span className="text-[#E10600]">*</span>
                  </label>
                  <select
                    id="gradeLevel"
                    value={gradeLevel}
                    onChange={(e) => setGradeLevel(e.target.value)}
                    className="w-full rounded-lg border border-white/15 bg-[#0B0D0F] px-4 py-2.5 text-sm text-white focus:border-[#E10600] focus:outline-none"
                  >
                    {availableGrades.map((g) => (
                      <option key={g} value={g}>
                        {g}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="classroom" className="block text-xs font-medium text-neutral-300">
                    ห้องเรียน <span className="text-[#E10600]">*</span>
                  </label>
                  <input
                    id="classroom"
                    type="text"
                    maxLength={20}
                    value={classroom}
                    onChange={(e) => setClassroom(e.target.value)}
                    placeholder="เช่น 1 หรือ IP"
                    className="w-full rounded-lg border border-white/15 bg-[#0B0D0F] px-4 py-2.5 text-sm text-white placeholder:text-neutral-500 focus:border-[#E10600] focus:outline-none"
                  />
                  {errors.classroom && <p className="text-xs text-[#F87171]">{errors.classroom}</p>}
                </div>
              </div>

              {/* Step 4: Competition-Specific Fields */}
              <div className="space-y-4 border-t border-white/10 pt-5">
                <p className="text-sm font-semibold text-white">
                  3. รายละเอียดสำหรับ {selectedComp.title}
                </p>

                {selectedComp.id === 'cover-dance' && (
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label htmlFor="teamName" className="block text-xs font-medium text-neutral-300">
                        ชื่อทีม <span className="text-[#E10600]">*</span>
                      </label>
                      <input
                        id="teamName"
                        type="text"
                        maxLength={100}
                        value={teamName}
                        onChange={(e) => setTeamName(e.target.value)}
                        placeholder="เช่น Pit Lane Crew"
                        className="w-full rounded-lg border border-white/15 bg-[#0B0D0F] px-4 py-2.5 text-sm text-white placeholder:text-neutral-500 focus:border-[#E10600] focus:outline-none"
                      />
                      {errors.teamName && (
                        <p className="text-xs text-[#F87171]">{errors.teamName}</p>
                      )}
                    </div>

                    {/* Dynamic Individual Member Inputs with Add Button */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-medium text-neutral-300">
                          รายชื่อสมาชิกในทีม (สูงสุด 10 คน · ชุดเดียวกับวันแข่งจริง){' '}
                          <span className="text-[#E10600]">*</span>
                        </span>
                        <span className="font-mono text-xs text-neutral-400 tabular-nums">
                          {teamMembersList.length} / {MAX_COVER_DANCE_MEMBERS} คน
                        </span>
                      </div>

                      <div className="space-y-2.5">
                        {teamMembersList.map((member, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <span className="w-6 shrink-0 font-mono text-xs text-neutral-400 tabular-nums">
                              {index + 1}.
                            </span>
                            <input
                              type="text"
                              maxLength={120}
                              value={member.name}
                              onChange={(e) =>
                                handleUpdateMemberRow(index, 'name', e.target.value)
                              }
                              placeholder={`ชื่อ-นามสกุล สมาชิกคนที่ ${index + 1}`}
                              aria-label={`ชื่อ-นามสกุล สมาชิกคนที่ ${index + 1}`}
                              className="min-w-0 flex-1 rounded-lg border border-white/15 bg-[#0B0D0F] px-3.5 py-2 text-sm text-white placeholder:text-neutral-500 focus:border-[#E10600] focus:outline-none"
                            />
                            <input
                              type="text"
                              maxLength={30}
                              value={member.gradeClass}
                              onChange={(e) =>
                                handleUpdateMemberRow(index, 'gradeClass', e.target.value)
                              }
                              placeholder="ชั้น/ห้อง (เช่น ม.3/1)"
                              aria-label={`ชั้น/ห้อง สมาชิกคนที่ ${index + 1}`}
                              className="w-36 shrink-0 rounded-lg border border-white/15 bg-[#0B0D0F] px-3 py-2 text-sm text-white placeholder:text-neutral-500 focus:border-[#E10600] focus:outline-none sm:w-44"
                            />
                            {teamMembersList.length > 1 && (
                              <button
                                type="button"
                                onClick={() => handleRemoveMemberRow(index)}
                                aria-label={`ลบสมาชิกคนที่ ${index + 1}`}
                                className="shrink-0 rounded-lg border border-white/15 p-2 text-neutral-400 transition-colors hover:border-[#F87171]/50 hover:text-[#F87171] cursor-pointer"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            )}
                          </div>
                        ))}
                      </div>

                      {errors.teamMembers && (
                        <p className="text-xs text-[#F87171]">{errors.teamMembers}</p>
                      )}

                      <div>
                        <button
                          type="button"
                          onClick={handleAddMemberRow}
                          disabled={teamMembersList.length >= MAX_COVER_DANCE_MEMBERS}
                          className="inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 rounded-md border border-white/15 bg-[#0B0D0F] px-3.5 py-2 text-xs font-semibold text-white transition-colors hover:border-[#D4AF37] hover:text-[#D4AF37] disabled:cursor-not-allowed disabled:opacity-40 cursor-pointer"
                        >
                          <Plus className="h-3.5 w-3.5" />
                          เพิ่มชื่อสมาชิก
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 gap-4">
                  {selectedComp.id !== 'cover-dance' && (
                    <div className="space-y-1.5">
                      <label
                        htmlFor="submissionTitle"
                        className="block text-xs font-medium text-neutral-300"
                      >
                        {selectedComp.id === 'singing-contest' &&
                          'ชื่อเพลงภาษาอังกฤษที่จะใช้ประกวด (English Song Title)'}
                        {selectedComp.id === 'speech' &&
                          'ชื่อเรื่อง / แนวทางสุนทรพจน์ (ความยาว 3:00–3:30 นาที)'}
                        {selectedComp.id === 'christmas-card' &&
                          'แนวคิด / ข้อความอวยพร (การ์ดขนาด A5 · ส่งห้อง 421 หรือ 412)'}
                        {selectedComp.id === 'drawing-painting' &&
                          'ชื่อผลงาน (หัวข้อ: ของขวัญจากหัวใจในค่ำคืนวันคริสต์มาส)'}
                        {selectedComp.id === 'english-quiz' && 'หมายเหตุเพิ่มเติม (ถ้ามี)'}
                      </label>
                      <input
                        id="submissionTitle"
                        type="text"
                        maxLength={200}
                        value={submissionTitle}
                        onChange={(e) => setSubmissionTitle(e.target.value)}
                        placeholder="ระบุชื่อเพลง ชื่อผลงาน หรือแนวคิด"
                        className="w-full rounded-lg border border-white/15 bg-[#0B0D0F] px-4 py-2.5 text-sm text-white placeholder:text-neutral-500 focus:border-[#E10600] focus:outline-none"
                      />
                      {errors.submissionTitle && (
                        <p className="text-xs text-[#F87171]">{errors.submissionTitle}</p>
                      )}
                    </div>
                  )}

                  {selectedComp.id === 'cover-dance' && (
                    <div className="space-y-1.5">
                      <label
                        htmlFor="submissionUrl"
                        className="block text-xs font-medium text-neutral-300"
                      >
                        ลิงก์คลิป One-Take (YouTube หรือ Google Drive · ภายใน 8 ธ.ค. 2569 เวลา 23:59 น.)
                      </label>
                      <input
                        id="submissionUrl"
                        type="url"
                        maxLength={500}
                        value={submissionUrl}
                        onChange={(e) => setSubmissionUrl(e.target.value)}
                        placeholder="https://youtu.be/... หรือ https://drive.google.com/..."
                        className="w-full rounded-lg border border-white/15 bg-[#0B0D0F] px-4 py-2.5 font-mono text-sm text-white placeholder:text-neutral-500 focus:border-[#E10600] focus:outline-none"
                      />
                      {errors.submissionUrl && (
                        <p className="text-xs text-[#F87171]">{errors.submissionUrl}</p>
                      )}
                    </div>
                  )}

                  {selectedComp.id === 'singing-contest' && (
                    <div className="rounded-lg border border-white/10 bg-[#0B0D0F] px-4 py-3 text-xs text-neutral-300">
                      หมายเหตุ: รายการ Singing Contest ส่งคลิปวิดีโอทางอีเมล{' '}
                      <span className="font-mono text-[#D4AF37]">{activeContact.email}</span>{' '}
                      ภายในวันที่ 8 ธันวาคม 2569
                    </div>
                  )}

                  {selectedComp.id === 'drawing-painting' && (
                    <div className="rounded-lg border border-white/10 bg-[#0B0D0F] px-4 py-3 text-xs text-neutral-300">
                      ข้อบังคับหลังภาพวาด: กรุณาเขียน 1) ชื่อ-สกุลภาษาไทย 2) ชื่อ-สกุลภาษาอังกฤษ 3)
                      ระดับชั้น 4) ห้องเรียน 5) เบอร์โทรศัพท์ติดต่อ ให้ชัดเจนด้านหลังผลงานก่อนส่งที่ห้อง 421
                    </div>
                  )}
                </div>
              </div>

              {submitError && (
                <div className="rounded-lg border border-[#F87171]/40 bg-[#F87171]/10 px-4 py-3 text-xs text-[#FCA5A5]">
                  {submitError}
                </div>
              )}

              <div className="flex flex-col justify-between gap-4 border-t border-white/10 pt-5 sm:flex-row sm:items-center">
                <p className="text-xs text-neutral-400">
                  Foreign Language Department &amp; International Program
                </p>
                {user ? (
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="whitespace-nowrap shrink-0 rounded-md bg-[#E10600] px-6 py-3 text-sm font-semibold text-white transition-colors duration-150 hover:bg-[#B80500] disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white cursor-pointer"
                  >
                    {isSubmitting ? 'กำลังบันทึกข้อมูล...' : 'ยืนยันการสมัครแข่งขัน'}
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleSignInClick}
                    disabled={isSigningIn}
                    className="inline-flex items-center justify-center gap-2 whitespace-nowrap shrink-0 rounded-md bg-[#E10600] px-6 py-3 text-sm font-semibold text-white transition-colors duration-150 hover:bg-[#B80500] disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white cursor-pointer"
                  >
                    <LogIn className="h-4 w-4" />
                    {isSigningIn ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบด้วย Google เพื่อสมัคร'}
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};
