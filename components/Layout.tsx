
import React from 'react';
import { 
  LayoutDashboard, 
  MessageSquare, 
  Inbox, 
  Terminal, 
  Settings, 
  Bot,
  LogOut,
  Menu,
  X,
  Smartphone
} from 'lucide-react';
import { PageRoute } from '../types';

interface LayoutProps {
  currentPage: PageRoute;
  onNavigate: (page: PageRoute) => void;
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ currentPage, onNavigate, children }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'inbox', label: 'Inbox', icon: Inbox },
    { id: 'demo', label: 'Live Simulator', icon: MessageSquare },
    { id: 'device', label: 'Device / Scan', icon: Smartphone },
    { id: 'commands', label: 'Bot Commands', icon: Bot },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans text-slate-900">
      
      {/* Sidebar (Desktop) */}
      <aside className="hidden md:flex w-64 bg-white border-r border-slate-200 flex-col fixed h-full z-20">
        <div className="h-16 flex items-center px-6 border-b border-slate-100">
            <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center mr-3 shadow-sm">
                <Bot className="text-white w-5 h-5" />
            </div>
            <span className="font-bold text-xl tracking-tight text-slate-800">WAGateway</span>
        </div>

        <nav className="flex-1 py-6 px-3 space-y-1">
            {navItems.map((item) => (
                <button
                    key={item.id}
                    onClick={() => onNavigate(item.id as PageRoute)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                        currentPage === item.id 
                        ? 'bg-emerald-50 text-emerald-700' 
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                >
                    <item.icon className={`w-5 h-5 ${currentPage === item.id ? 'text-emerald-600' : 'text-slate-400'}`} />
                    {item.label}
                </button>
            ))}
        </nav>

        <div className="p-4 border-t border-slate-100">
            <div className="flex items-center gap-3 p-2 rounded-lg bg-slate-50 border border-slate-100">
                <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center">
                    <span className="font-bold text-xs text-slate-600">AD</span>
                </div>
                <div className="flex-1 overflow-hidden">
                    <p className="text-sm font-medium truncate">Admin User</p>
                    <p className="text-xs text-slate-500 truncate">admin@demo.com</p>
                </div>
                <Settings className="w-4 h-4 text-slate-400 cursor-pointer hover:text-emerald-600" onClick={() => onNavigate('settings')} />
            </div>
        </div>
      </aside>

      {/* Mobile Header & Content */}
      <div className="flex-1 md:ml-64 flex flex-col min-h-screen">
        
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 sticky top-0 z-10 px-4 md:px-8 flex items-center justify-between shadow-sm">
            <div className="flex items-center md:hidden">
                <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 text-slate-600">
                    {mobileMenuOpen ? <X /> : <Menu />}
                </button>
                <span className="font-bold text-lg ml-2">WAGateway</span>
            </div>

            <div className="hidden md:flex items-center text-sm text-slate-500">
                <span>Application</span>
                <span className="mx-2">/</span>
                <span className="capitalize font-medium text-slate-800">{currentPage}</span>
            </div>

            <div className="flex items-center gap-4">
                <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-medium border border-emerald-100">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    Gateway Active
                </div>
            </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
            <div className="max-w-6xl mx-auto animate-in fade-in duration-500 h-full">
                {children}
            </div>
        </main>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
            <div className="w-64 bg-white h-full shadow-2xl flex flex-col">
                <div className="h-16 flex items-center px-6 border-b border-slate-100 justify-between">
                    <span className="font-bold text-xl">Menu</span>
                    <button onClick={() => setMobileMenuOpen(false)}><X className="w-5 h-5" /></button>
                </div>
                <nav className="p-4 space-y-2">
                    {navItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => {
                                onNavigate(item.id as PageRoute);
                                setMobileMenuOpen(false);
                            }}
                            className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium ${
                                currentPage === item.id ? 'bg-emerald-50 text-emerald-700' : 'text-slate-600'
                            }`}
                        >
                            <item.icon className="w-5 h-5" />
                            {item.label}
                        </button>
                    ))}
                </nav>
            </div>
            <div className="flex-1 bg-black/20 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
        </div>
      )}

    </div>
  );
};
