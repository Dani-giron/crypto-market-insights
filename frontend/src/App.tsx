/**
 * App Component
 * Main application component with routing
 */

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { DashboardLayout } from './components/layouts/DashboardLayout';
import { CryptoDashboardPage } from './pages/CryptoDashboardPage';

function App() {
  return (
    <BrowserRouter>
      <DashboardLayout>
        <Routes>
          <Route path="/" element={<CryptoDashboardPage />} />
          <Route path="/crypto/:assetId" element={<CryptoDashboardPage />} />
        </Routes>
      </DashboardLayout>
    </BrowserRouter>
  );
}

export default App;
