import { useEffect, useState } from 'react';
import { onAuthStateChanged, type User } from 'firebase/auth';
import {
  Timestamp,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  serverTimestamp,
  setDoc,
} from 'firebase/firestore';
import { CompetitionsSection } from './components/CompetitionsSection';
import { Footer } from './components/Footer';
import { HeroSection } from './components/HeroSection';
import { RaceCalendarSection } from './components/RaceCalendarSection';
import { RegisteredGridSection } from './components/RegisteredGridSection';
import { RegistrationSection } from './components/RegistrationSection';
import { TopBar } from './components/TopBar';
import {
  ADMIN_EMAIL,
  OperationType,
  auth,
  db,
  handleFirestoreError,
  signInWithGoogle,
  signOutUser,
} from './firebase';
import { CompetitionId, RegistrationEntry } from './types/competition';

function timestampToIso(value: unknown): string {
  if (value instanceof Timestamp) {
    return value.toDate().toISOString();
  }
  if (typeof value === 'string') {
    return value;
  }
  return new Date().toISOString();
}

function generateRaceNumber(): string {
  const digits = String(Math.floor(1000 + Math.random() * 9000));
  const suffix = Math.random().toString(36).slice(2, 5).toUpperCase();
  return `#UP-${digits}-${suffix}`;
}

export default function App() {
  const [selectedCompetitionId, setSelectedCompetitionId] =
    useState<CompetitionId>('singing-contest');
  const [user, setUser] = useState<User | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [privateRegistrations, setPrivateRegistrations] = useState<RegistrationEntry[]>([]);

  const isAdmin = Boolean(user?.emailVerified && user.email === ADMIN_EMAIL);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (nextUser) => {
      setUser(nextUser);
      setAuthReady(true);
    });
    return () => unsubscribe();
  }, []);

  // Real-time listener for registrations (strictly Admin-only)
  useEffect(() => {
    if (!authReady || !isAdmin) {
      setPrivateRegistrations([]);
      return;
    }

    const unsubscribe = onSnapshot(
      collection(db, 'registrations'),
      (snapshot) => {
        const items: RegistrationEntry[] = snapshot.docs.map((docSnap) => {
          const data = docSnap.data();
          return {
            id: docSnap.id,
            raceNumber: String(data.raceNumber ?? ''),
            competitionId: data.competitionId as CompetitionId,
            division: data.division,
            studentName: String(data.studentName ?? ''),
            englishFullName:
              typeof data.englishFullName === 'string' ? data.englishFullName : undefined,
            studentId: String(data.studentId ?? ''),
            gradeLevel: String(data.gradeLevel ?? ''),
            classroom: String(data.classroom ?? ''),
            contactInfo: String(data.contactInfo ?? ''),
            teamName: typeof data.teamName === 'string' ? data.teamName : undefined,
            teamMembersList: Array.isArray(data.teamMembersList)
              ? data.teamMembersList
              : undefined,
            teamMembers: typeof data.teamMembers === 'string' ? data.teamMembers : undefined,
            submissionTitle:
              typeof data.submissionTitle === 'string' ? data.submissionTitle : undefined,
            submissionUrl:
              typeof data.submissionUrl === 'string' ? data.submissionUrl : undefined,
            createdAt: timestampToIso(data.createdAt),
          };
        });
        items.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
        setPrivateRegistrations(items);
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, 'registrations');
      }
    );

    return () => unsubscribe();
  }, [authReady, isAdmin]);

  const scrollToRegister = () => {
    const el = document.getElementById('register');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSelectForRegister = (id: CompetitionId) => {
    setSelectedCompetitionId(id);
    scrollToRegister();
  };

  const handleGoogleSignIn = async (forceSelectAccount = false) => {
    await signInWithGoogle(forceSelectAccount);
  };

  const handleSignOut = async () => {
    await signOutUser();
  };

  const handleOpenAdmin = () => {
    if (isAdmin) {
      const el = document.getElementById('admin-panel');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      setShowAdminModal(true);
    }
  };

  const handleAddRegistration = async (
    payload: Omit<RegistrationEntry, 'id' | 'raceNumber' | 'createdAt'>
  ): Promise<RegistrationEntry> => {
    const regRef = doc(collection(db, 'registrations'));
    const raceNumber = generateRaceNumber();

    const registrationPayload: Record<string, unknown> = {
      raceNumber,
      competitionId: payload.competitionId,
      division: payload.division,
      studentName: payload.studentName,
      studentId: payload.studentId,
      gradeLevel: payload.gradeLevel,
      classroom: payload.classroom,
      contactInfo: payload.contactInfo,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    if (payload.englishFullName) registrationPayload.englishFullName = payload.englishFullName;
    if (payload.teamName) registrationPayload.teamName = payload.teamName;
    if (payload.teamMembersList && payload.teamMembersList.length > 0) {
      registrationPayload.teamMembersList = payload.teamMembersList;
    }
    if (payload.teamMembers) registrationPayload.teamMembers = payload.teamMembers;
    if (payload.submissionTitle) registrationPayload.submissionTitle = payload.submissionTitle;
    if (payload.submissionUrl) registrationPayload.submissionUrl = payload.submissionUrl;

    try {
      await setDoc(regRef, registrationPayload);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `registrations/${regRef.id}`);
    }

    return {
      ...payload,
      id: regRef.id,
      raceNumber,
      createdAt: new Date().toISOString(),
    };
  };

  const handleDeleteRegistration = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'registrations', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `registrations/${id}`);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0D0F] text-[#F5F5F4]">
      <TopBar onRegisterClick={scrollToRegister} />

      <main>
        <HeroSection
          selectedCompetitionId={selectedCompetitionId}
          onSelectCompetition={setSelectedCompetitionId}
          onRegisterClick={scrollToRegister}
        />

        <CompetitionsSection
          selectedCompetitionId={selectedCompetitionId}
          onSelectForRegister={handleSelectForRegister}
        />

        <RaceCalendarSection onSelectForRegister={handleSelectForRegister} />

        <RegistrationSection
          selectedCompetitionId={selectedCompetitionId}
          onCompetitionChange={setSelectedCompetitionId}
          onAddRegistration={handleAddRegistration}
        />

        <RegisteredGridSection
          user={user}
          isAdmin={isAdmin}
          privateRegistrations={privateRegistrations}
          showAdminModal={showAdminModal}
          onCloseAdminModal={() => setShowAdminModal(false)}
          onGoogleSignIn={handleGoogleSignIn}
          onSignOut={handleSignOut}
          onDeleteRegistration={handleDeleteRegistration}
        />
      </main>

      <Footer isAdmin={isAdmin} onOpenAdmin={handleOpenAdmin} />
    </div>
  );
}
