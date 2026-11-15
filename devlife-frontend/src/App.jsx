import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import CasinoPage from './pages/CasinoPage';
import MeetingEscapePage from './pages/MeetingEscapePage';
import RoastPage from './pages/RoastPage';
import BugChasePage from './pages/BugChasePage';
import AnalyzerPage from './pages/AnalyzerPage';
import DatingPage from './pages/DatingPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/casino" element={<CasinoPage />} />
        <Route path="/meeting-escape" element={<MeetingEscapePage />} />
        <Route path="/roast" element={<RoastPage />} />
        <Route path="/bugchase" element={<BugChasePage />} />
        <Route path="/analyzer" element={<AnalyzerPage />} />
        <Route path="/dating" element={<DatingPage />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}