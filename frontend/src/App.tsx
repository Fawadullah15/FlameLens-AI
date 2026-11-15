import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { ErrorBoundary } from './components/ui/ErrorBoundary';
import { MissionOverview } from './pages/MissionOverview';
import { CombustionIntelligence } from './pages/CombustionIntelligence';
import { ResearchExplorer } from './pages/ResearchExplorer';
import { ScientificAnalysis } from './pages/ScientificAnalysis';
import { AICopilot } from './pages/AICopilot';
import { MissionSafety } from './pages/MissionSafety';
import { ReportsFindings } from './pages/ReportsFindings';

export const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            {/* 7 Core Mission Intelligence Pages */}
            <Route index element={<MissionOverview />} />
            <Route path="combustion" element={<CombustionIntelligence />} />
            <Route path="library" element={<ResearchExplorer />} />
            <Route path="analysis" element={<ScientificAnalysis />} />
            <Route path="copilot" element={<AICopilot />} />
            <Route path="safety" element={<MissionSafety />} />
            <Route path="reports" element={<ReportsFindings />} />

            {/* Backward Compatibility Aliases */}
            <Route path="comparison" element={<ScientificAnalysis />} />
            <Route path="assistant" element={<AICopilot />} />
            <Route path="risk" element={<MissionSafety />} />
            <Route path="incidents" element={<MissionSafety defaultTab="incidents" />} />

            {/* Catch-all */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  );
};

export default App;
