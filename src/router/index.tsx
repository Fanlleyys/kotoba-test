import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { LoadingScreen } from '../components/ui/LoadingScreen';

// Lazy Load Components
const Dashboard = lazy(() => import('../pages/Dashboard').then(module => ({ default: module.Dashboard })));
const Study = lazy(() => import('../pages/Study').then(module => ({ default: module.Study })));
const Decks = lazy(() => import('../pages/Decks').then(module => ({ default: module.Decks })));
const DeckDetails = lazy(() => import('../pages/DeckDetails').then(module => ({ default: module.DeckDetails })));
const Import = lazy(() => import('../modules/decks/Import').then(module => ({ default: module.Import })));

// Game pages
const KataCannonGame = lazy(() => import('../game/KataCannonGame').then(module => ({ default: module.KataCannonGame })));
const TestMode = lazy(() => import('../pages/TestMode').then(module => ({ default: module.TestMode })));
const MatchGame = lazy(() => import('../pages/MatchGame').then(module => ({ default: module.MatchGame })));
const Settings = lazy(() => import('../pages/Settings').then(module => ({ default: module.Settings })));
const Tasks = lazy(() => import('../pages/Tasks').then(module => ({ default: module.Tasks })));

export const AppRouter: React.FC = () => {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <Routes>
        {/* Dashboard */}
        <Route path="/" element={<Dashboard />} />

        {/* Study (flashcards & arcade mode via query ?mode=...) */}
        <Route path="/study" element={<Study />} />

        {/* Deck management */}
        <Route path="/decks" element={<Decks />} />
        <Route path="/decks/:deckId" element={<DeckDetails />} />

        {/* Import JSON */}
        <Route path="/import" element={<Import />} />

        {/* Arcade standalone (bisa pakai ?deckId=... juga) */}
        <Route
          path="/arcade"
          element={
            <div className="p-4 max-w-4xl mx-auto">
              <KataCannonGame />
            </div>
          }
        />

        {/* New games */}
        <Route path="/test" element={<TestMode />} />
        <Route path="/match" element={<MatchGame />} />

        {/* Tasks */}
        <Route path="/tasks" element={<Tasks />} />

        <Route path="/settings" element={<Settings />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
};
