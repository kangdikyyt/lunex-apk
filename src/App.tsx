/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Routes, Route } from 'react-router-dom';
import LandingPage from './pages/landing/LandingPage';
import DashboardLayout from './components/layout/DashboardLayout';
import ProtectedRoute from './components/layout/ProtectedRoute';
import BotsPage from './pages/dashboard/BotsPage';
import CreateBotPage from './pages/dashboard/CreateBotPage';
import BotDetailsPage from './pages/dashboard/BotDetailsPage';
import AccountSettingsPage from './pages/dashboard/AccountSettingsPage';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<BotsPage />} />
          <Route path="bots" element={<BotsPage />} />
          <Route path="bots/create" element={<CreateBotPage />} />
          <Route path="bots/:id/*" element={<BotDetailsPage />} />
          <Route path="settings" element={<AccountSettingsPage />} />
        </Route>
      </Route>
    </Routes>
  );
}
