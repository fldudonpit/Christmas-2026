import { useEffect, useState } from 'react';
import { onAuthStateChanged, type User } from 'firebase/auth';
import {
  Timestamp,
  collection,
  doc,
  onSnapshot,
  query,
  serverTimestamp,
  where,
  writeBatch,
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
import {
  CompetitionId,
  PublicEntry,
  RegistrationEntry,
} from './types/competition';

function timestampToIso(value: unknown): string {
  if (value instanceof Timestamp) {
    return value.toDate().toISOString();
  }
  if (typeof value === 'string') {
    return value;
  }
  return new Date().toISOString();
}

function generateRaceNumber(currentCount: number): string {
  const num = String(currentCount + 1).padStart(3, '0');
  const suffix = Math.random().toString(36).slice(2, 5).toUpperCase();
  return `#UP-${num}-${suffix}`;
}

export default function App() {
  const [selectedCompetitionId, setSelectedCompetitionId] =
    useState<CompetitionId>('singing-contest');
  const [user, setUser] = useState<User | null>(null);
  const [authReady, setAuthReady] = useState(false);

  const [publicEntries, setPublicEntries] = useState<PublicEntry[]>([]);
  const [privateRegistrations, setPrivateRegistrations] = useState<RegistrationEntry[]>([]);

  const isAdmin = Boolean(user?.emailVerified && user.email === ADMIN_EMAIL);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (nextUser) => {
      setUser(nextUser);
      setAuthReady(true);
    });
    return () => unsubscribe();
  }, []);

  // Real-time listener for public non-PII Starting Grid entries
  useEffect(() => {
    if (!authReady) return;
    const publicQuery = query(
      collection(db, 'public_entries'),
      where('isPublic', '==', true)
    );
    const unsubscribe = onSnapshot(
      publicQuery,
      (snapshot) => {
        const items: PublicEntry[] = snapshot.docs.map((docSnap) => {
          const data = docSnap.data();
          return {
            id: docSnap.id,
            ownerUid: String(data.ownerUid ?? ''),
            raceNumber: String(data.raceNumber ?? ''),
            competitionId: data.competitionId as CompetitionId,
            division: data.division,
            displayName: String(data.displayName ?? ''),
            gradeLevel: String(data.gradeLevel ?? ''),
            classroom: String(data.classroom ?? ''),
            teamName: typeof data.teamName === 'string' ? data.teamName : undefined,
            teamMemberCount:
              typeof data.teamMemberCount === 'number' ? data.teamMemberCount : undefined,
            isPublic: Boolean(data.isPublic),
            createdAt: timestampToIso(data.createdAt),
          };
        });
        items.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
        setPublicEntries(items);
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, 'public_entries');
      }
    );
    return () => unsubscribe();
  }, [authReady]);

  // Real-time listener for private registrations (all for admin, own entries for signed-in student)
  useEffect(() => {
    if (!authReady || !user) {
      setPrivateRegistrations([]);
      return;
    }

    const regQuery = isAdmin
      ? collection(db, 'registrations')
      : query(collection(db, 'registrations'), where('ownerUid', '==', user.uid));

    const unsubscribe = onSnapshot(
      regQuery,
      (snapshot) => {
        const items: RegistrationEntry[] = snapshot.docs.map((docSnap) => {
          const data = docSnap.data();
          return {
            id: docSnap.id,
            ownerUid: String(data.ownerUid ?? ''),
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
  }, [authReady, user, isAdmin]);

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

  const handleAddRegistration = async (
    payload: Omit<RegistrationEntry, 'id' | 'ownerUid' | 'raceNumber' | 'createdAt'>
  ): Promise<RegistrationEntry> => {
    if (!auth.currentUser) {
      throw new Error('User must be signed in with Google to register.');
    }

    const ownerUid = auth.currentUser.uid;
    const regRef = doc(collection(db, 'registrations'));
    const publicRef = doc(db, 'public_entries', regRef.id);
    const raceNumber = generateRaceNumber(publicEntries.length);

    const registrationPayload: Record<string, unknown> = {
      ownerUid,
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

    const publicPayload: Record<string, unknown> = {
      ownerUid,
      raceNumber,
      competitionId: payload.competitionId,
      division: payload.division,
      displayName: payload.studentName,
      gradeLevel: payload.gradeLevel,
      classroom: payload.classroom,
      isPublic: true,
      createdAt: serverTimestamp(),
    };

    if (payload.teamName) publicPayload.teamName = payload.teamName;
    if (payload.teamMembersList && payload.teamMembersList.length > 0) {
      publicPayload.teamMemberCount = payload.teamMembersList.length;
    }

    const batch = writeBatch(db);
    batch.set(regRef, registrationPayload);
    batch.set(publicRef, publicPayload);

    try {
      await batch.commit();
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `registrations/${regRef.id}`);
    }

    return {
      ...payload,
      id: regRef.id,
      ownerUid,
      raceNumber,
      createdAt: new Date().toISOString(),
    };
  };

  const handleDeleteRegistration = async (id: string) => {
    const batch = writeBatch(db);
    batch.delete(doc(db, 'registrations', id));
    batch.delete(doc(db, 'public_entries', id));
    try {
      await batch.commit();
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
          totalRegistrations={publicEntries.length}
        />

        <CompetitionsSection
          registrations={publicEntries}
          selectedCompetitionId={selectedCompetitionId}
          onSelectForRegister={handleSelectForRegister}
        />

        <RaceCalendarSection onSelectForRegister={handleSelectForRegister} />

        <RegistrationSection
          user={user}
          authReady={authReady}
          onGoogleSignIn={handleGoogleSignIn}
          onSignOut={handleSignOut}
          selectedCompetitionId={selectedCompetitionId}
          onCompetitionChange={setSelectedCompetitionId}
          onAddRegistration={handleAddRegistration}
        />

        <RegisteredGridSection
          user={user}
          isAdmin={isAdmin}
          publicEntries={publicEntries}
          privateRegistrations={privateRegistrations}
          onGoogleSignIn={handleGoogleSignIn}
          onSignOut={handleSignOut}
          onDeleteRegistration={handleDeleteRegistration}
          onJumpToRegister={scrollToRegister}
        />
      </main>

      <Footer />
    </div>
  );
}
