
import { useState } from 'react';
import { Layout } from './components/Layout';
import { PageRoute } from './types';
import { DummyProvider } from './services/whatsapp/provider';
import { WhatsAppRouter } from './services/whatsapp/router';
import { DashboardPage } from './pages/DashboardPage';
import { DemoPage } from './pages/DemoPage';
import { InboxPage } from './pages/InboxPage';
import { DevicePage } from './pages/DevicePage';
import { CommandsPage } from './pages/CommandsPage';
import { SettingsPage } from './pages/SettingsPage';


// Initialize Services
const provider = new DummyProvider();
const router = new WhatsAppRouter(provider);

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageRoute>('dashboard');

  const renderPage = () => {
    switch (currentPage) {
        case 'dashboard': return <DashboardPage onNavigate={setCurrentPage} />;
        case 'demo': return <DemoPage />;
        case 'inbox': return <InboxPage />;
        case 'device': return <DevicePage />;
        case 'commands': return <CommandsPage />;
        case 'settings': return <SettingsPage />;
        default: return <DashboardPage onNavigate={setCurrentPage} />;
    }
  };

  return (
    <Layout currentPage={currentPage} onNavigate={setCurrentPage}>
      {renderPage()}
    </Layout>
  );
}
