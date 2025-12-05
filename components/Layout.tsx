
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
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

interface LayoutProps {
  onLogout?: () => void;
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ onLogout, children }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Get current page from URL
  const currentPage = location.pathname.substring(1) || 'dashboard';

  // Get user data from localStorage
  const [userData, setUserData] = React.useState<{ name: string; email: string } | null>(null);

  React.useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        setUserData(user);
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
  }, []);

  // Get user initials
  const getUserInitials = () => {
    if (!userData?.name) return 'U';
    return userData.name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

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
                    onClick={() => navigate(`/${item.id}`)}
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

        {/* Sidebar Footer - User Info & Logout */}
        <div className="border-t border-slate-200 p-4">
          <div className="flex items-center gap-3 px-3 py-2 bg-slate-50 rounded-lg">
            {/* Avatar */}
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white font-semibold shadow-md flex-shrink-0">
              {getUserInitials()}
            </div>
            
            {/* User Info */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-800 truncate">
                {userData?.name || 'User'}
              </p>
              <p className="text-xs text-slate-500 truncate">
                {userData?.email || 'user@example.com'}
              </p>
            </div>

            {/* Logout Button */}
            {onLogout && (
              <button
                onClick={onLogout}
                className="flex-shrink-0 p-2 hover:bg-green-50 text-green-600 rounded-lg transition-colors group"
                title="Logout"
              >
                <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform" />
              </button>
            )}
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
                <nav className="p-4 space-y-2 flex-1"> {/* Added flex-1 here to push logout to bottom */}
                    {navItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => {
                                navigate(`/${item.id}`);
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
                {/* Mobile Logout */}
                {onLogout && (
                  <div className="p-4 border-t border-slate-200">
                    <button
                      onClick={() => {
                        onLogout();
                        setMobileMenuOpen(false);
                      }}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors font-medium border border-red-200"
                    >
                      <LogOut className="w-5 h-5" />
                      Logout
                    </button>
                  </div>
                )}
            </div>
            <div className="flex-1 bg-black/20 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
        </div>
      )}

    </div>
  );
};
