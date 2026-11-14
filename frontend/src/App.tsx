import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { Dashboard } from './pages/Dashboard';
import { FlameAnalysis } from './pages/FlameAnalysis';
import { ExperimentComparison } from './pages/ExperimentComparison';
import { FireSafetyIntelligence } from './pages/FireSafetyIntelligence';
import { AIChat } from './pages/AIChat';
import { ResearchLibrary } from './pages/ResearchLibrary';
import { Reports } from './pages/Reports';
import { HistoricalIncidents } from './pages/HistoricalIncidents';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="analysis" element={<FlameAnalysis />} />
          <Route path="incidents" element={<HistoricalIncidents />} />
          <Route path="comparison" element={<ExperimentComparison />} />
          <Route path="risk" element={<FireSafetyIntelligence />} />
          <Route path="assistant" element={<AIChat />} />
          <Route path="library" element={<ResearchLibrary />} />
          <Route path="reports" element={<Reports />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
