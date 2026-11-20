export type DivisionType = 'junior' | 'senior' | 'open';

export type SubmissionChannel = 'online_email' | 'online_link' | 'onsite_artwork' | 'onsite_live' | 'hybrid_stage';

export type CompetitionId =
  | 'singing-contest'
  | 'christmas-card'
  | 'speech'
  | 'drawing-painting'
  | 'english-quiz'
  | 'cover-dance';

export interface JudgingCriterion {
  label: string;
  points?: number;
  description?: string;
}

export interface CompetitionContact {
  level: string;
  room?: string;
  teacher?: string;
  email?: string;
  lineOpenChat?: string;
  note?: string;
}

export interface CompetitionRound {
  title: string;
  details: string[];
}

export interface Competition {
  index: number;
  code: string;
  id: CompetitionId;
  title: string;
  thaiSubtitle: string;
  categoryLabel: string;
  divisionMode: 'split' | 'open';
  divisionLabel: string;
  channel: SubmissionChannel;
  venueOrType: string;
  dateLabel: string;
  submissionDeadline: string;
  themeTopic: string | { junior: string; senior: string };
  teamFormat: string;
  summary: string;
  rules: string[];
  rounds?: CompetitionRound[];
  judgingCriteria: JudgingCriterion[];
  totalPoints?: number;
  judgingNote?: string;
  contacts: CompetitionContact[];
  dateGroup: 'dec8_submit' | 'dec8_live' | 'dec15_live' | 'dec18_live';
}

export interface TeamMember {
  name: string;
  gradeClass: string;
}

export type AwardStatus =
  | 'winner_1'
  | 'runner_up_1'
  | 'runner_up_2'
  | 'participant'
  | 'absent';

export interface CompetitionResult {
  id: string;
  registrationId: string;
  competitionId: CompetitionId;
  division: DivisionType;
  studentName: string;
  englishFullName?: string;
  gradeLevel: string;
  classroom: string;
  teamName?: string;
  teamMembersList?: TeamMember[];
  teamMembers?: string;
  awardStatus: AwardStatus;
  updatedAt: string;
}

export interface RegistrationEntry {
  id: string;
  raceNumber: string;
  competitionId: CompetitionId;
  division: DivisionType;
  studentName: string;
  englishFullName?: string;
  studentId: string;
  gradeLevel: string;
  classroom: string;
  contactInfo: string;
  teamName?: string;
  teamMembersList?: TeamMember[];
  teamMembers?: string;
  submissionTitle?: string;
  submissionUrl?: string;
  createdAt: string;
}
