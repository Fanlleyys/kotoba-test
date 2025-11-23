import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Dashboard } from '../pages/Dashboard';
import { Study } from '../pages/Study';
import { Decks } from '../pages/Decks';
import { DeckDetails } from '../pages/DeckDetails';
import { Import } from '../pages/Import';

export const AppRouter: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/study" element={<Study />} />
      <Route path="/decks" element={<Decks />} />
      <Route path="/decks/:deckId" element={<DeckDetails />} />
      <Route path="/import" element={<Import />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};