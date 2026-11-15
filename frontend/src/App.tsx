import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { ErrorBoundary } from './components/ui/ErrorBoundary';
import { MissionOverview } from './pages/MissionOverview';
import { CombustionIntelligence } from './pages/CombustionIntelligence';
import { ResearchExplorer } from './pages/ResearchExplorer';
import { Experiments } from './pages/Experiments';
import { ScientificAnalysis } from './pages/ScientificAnalysis';
import { AICopilot } from './pages/AICopilot';
import { MissionSafety } from './pages/MissionSafety';
import { ReportsFindings } from './pages/ReportsFindings';
import { Settings } from './pages/Settings';

export const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            {/* Core Scientific Intelligence Modules */}
            <Route index element={<MissionOverview />} />
            <Route path="copilot" element={<AICopilot />} />
            <Route path="assistant" element={<AICopilot />} />
            <Route path="library" element={<ResearchExplorer />} />
            <Route path="experiments" element={<Experiments />} />
            <Route path="combustion" element={<CombustionIntelligence />} />
            <Route path="analysis" element={<ScientificAnalysis />} />
            <Route path="comparison" element={<ScientificAnalysis />} />
            <Route path="safety" element={<MissionSafety />} />
            <Route path="risk" element={<MissionSafety />} />
            <Route path="incidents" element={<MissionSafety defaultTab="incidents" />} />
            <Route path="reports" element={<ReportsFindings />} />
            <Route path="settings" element={<Settings />} />

            {/* Catch-all */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  );
};

export default App;
