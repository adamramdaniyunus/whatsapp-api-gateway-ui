
import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { PageRoute, BotCommand, ChatSession } from './types';
import { 
  Users, 
  MessageCircle, 
  Server, 
  Zap,
  PlayCircle,
  Edit2,
  Save,
  Play,
  Plus,
  Terminal,
  Type,
  XCircle,
  Inbox,
  Smartphone,
  CheckCircle,
  Search,
  UserPlus,
  Trash2,
  Settings
} from 'lucide-react';
import { StatCard, Card, Button, InputGroup, TextInput, TextArea, Badge, ChatWindow } from './components/UI';
import { DummyProvider } from './services/whatsapp/provider';
import { WhatsAppRouter } from './services/whatsapp/router';
import { logger } from './services/logger';
import { storage } from './services/mock/storage';

// Initialize Services
const provider = new DummyProvider();
const router = new WhatsAppRouter(provider);

// --- Pages ---

const DashboardPage = ({ onNavigate }: { onNavigate: (p: PageRoute) => void }) => {
    const logs = storage.getLogs();
    return (
        <div className="space-y-6">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-slate-800">Overview</h1>
                <p className="text-slate-500">Welcome back, here is your gateway summary.</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard title="Total Messages" value="1,284" icon={MessageCircle} trend="+12% this week" color="emerald" />
                <StatCard title="Active Sessions" value="8" icon={Users} color="teal" />
                <StatCard title="Server Uptime" value="99.9%" icon={Server} color="blue" />
                <StatCard title="Avg Response" value="0.8s" icon={Zap} color="amber" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Quick Actions */}
                <Card title="Quick Actions">
                    <div className="grid grid-cols-2 gap-4">
                        <Button onClick={() => onNavigate('demo')} variant="secondary" className="h-24 flex-col">
                            <PlayCircle className="w-8 h-8 mb-2" />
                            Open Simulator
                        </Button>
                        <Button onClick={() => onNavigate('inbox')} variant="outline" className="h-24 flex-col">
                            <Inbox className="w-8 h-8 mb-2" />
                            Open Inbox
                        </Button>
                    </div>
                </Card>

                {/* Recent Logs Preview */}
                <Card title="Recent Activity">
                    <div className="space-y-3">
                        {logs.slice(0, 5).map(log => (
                            <div key={log.id} className="flex items-start gap-3 text-sm pb-3 border-b border-slate-50 last:border-0 last:pb-0">
                                <span className={`mt-1 w-2 h-2 rounded-full ${
                                    log.level === 'ERROR' ? 'bg-red-500' : 
                                    log.level === 'SUCCESS' ? 'bg-emerald-500' : 'bg-blue-500'
                                }`} />
                                <div className="flex-1">
                                    <p className="text-slate-700 font-medium">{log.message}</p>
                                    <p className="text-xs text-slate-400">{log.timestamp.toLocaleTimeString()}</p>
                                </div>
                            </div>
                        ))}
                        {logs.length === 0 && <p className="text-slate-400 italic text-sm">No recent activity.</p>}
                    </div>
                </Card>
            </div>
        </div>
    );
};

const ResponseEditor = ({ value, onChange }: { value: string, onChange: (val: string) => void }) => {
    return (
        <div className="border border-slate-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-emerald-500/20 transition-all bg-white shadow-sm">
            <div className="bg-slate-50 px-3 py-2 border-b border-slate-200 flex justify-between items-center select-none">
                <div className="flex items-center gap-2">
                    <Type className="w-4 h-4 text-slate-400" />
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Response Body</span>
                </div>
                <span className="text-[10px] text-slate-400 font-mono bg-slate-100 px-2 py-0.5 rounded border border-slate-200">MARKDOWN SUPPORTED</span>
            </div>
            <textarea
                className="w-full p-4 bg-white font-mono text-sm text-slate-800 resize-none focus:outline-none min-h-[160px] leading-relaxed"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder="Type the bot response message here..."
                spellCheck={false}
            />
        </div>
    );
};

const DemoPage = () => {
    // Simulator State
    const demoPhone = '628123456789';
    const [messages, setMessages] = useState(storage.getSession(demoPhone)?.messages || []);
    const [isBotTyping, setIsBotTyping] = useState(false);

    // Command Editing State
    const [commands, setCommands] = useState(router.getBotEngine().getCommandsList());
    const [editingCmd, setEditingCmd] = useState<string | null>(null);
    const [editValue, setEditValue] = useState('');

    // Adding New Command State
    const [isAddingNew, setIsAddingNew] = useState(false);
    const [newCmdData, setNewCmdData] = useState({ command: '', description: '', response: '' });

    // Sync with storage
    useEffect(() => {
        const unsubscribe = storage.subscribe(() => {
            const session = storage.getSession(demoPhone);
            if (session) {
                setMessages([...session.messages]);
                
                // Simple logic to guess if bot is "typing" (if last message is INBOUND)
                const lastMsg = session.messages[session.messages.length - 1];
                if (lastMsg && lastMsg.direction === 'INBOUND') {
                    setIsBotTyping(true);
                } else {
                    setIsBotTyping(false);
                }
            }
        });
        return () => unsubscribe();
    }, []);

    const handleSendMessage = async (text: string) => {
        // Send to API (Simulated)
        await router.handleIncomingWebhook({
            from: demoPhone,
            body: text
        });
    };

    const handleEditStart = (cmd: BotCommand) => {
        setIsAddingNew(false);
        setEditingCmd(cmd.command);
        try {
            setEditValue(cmd.response([]));
        } catch {
            setEditValue('(Dynamic logic response cannot be fully edited here)');
        }
    };

    const handleSaveCommand = (cmd: string) => {
        router.getBotEngine().updateCommandResponse(cmd, editValue);
        setCommands([...router.getBotEngine().getCommandsList()]); // Force Update
        setEditingCmd(null);
    };

    const handleAddNewCommand = () => {
        if(!newCmdData.command || !newCmdData.response) return;
        router.getBotEngine().addCommand(newCmdData.command, newCmdData.description, newCmdData.response);
        setCommands([...router.getBotEngine().getCommandsList()]); // Update list
        setIsAddingNew(false);
        setNewCmdData({ command: '', description: '', response: '' });
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-140px)]">
            <div className="lg:col-span-2 h-full flex flex-col">
                <div className="mb-4">
                    <h1 className="text-2xl font-bold text-slate-800">Live Simulator</h1>
                    <p className="text-slate-500">Test your bot logic in real-time. This mimics the WhatsApp Client.</p>
                </div>
                <div className="flex-1 min-h-0">
                    <ChatWindow 
                        messages={messages} 
                        onSendMessage={handleSendMessage}
                        isTyping={isBotTyping}
                        perspective='simulator'
                    />
                </div>
            </div>
            
            <div className="space-y-4 h-full flex flex-col overflow-hidden">
                <Card title="Simulation Context" className="flex-shrink-0">
                    <div className="space-y-4 text-sm">
                        <div>
                            <span className="text-slate-500 block mb-1">Simulated User</span>
                            <div className="flex items-center gap-2 font-medium text-slate-800">
                                <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600">D</div>
                                Demo User ({demoPhone})
                            </div>
                        </div>
                    </div>
                </Card>
                
                <Card 
                    title="Command Editor" 
                    className="flex-1 flex flex-col min-h-0 bg-slate-50/50"
                    action={
                        !isAddingNew && !editingCmd && (
                            <Button 
                                variant="primary" 
                                size="sm" 
                                onClick={() => {
                                    setIsAddingNew(true); 
                                    setEditingCmd(null);
                                }}
                            >
                                <Plus className="w-4 h-4" /> New
                            </Button>
                        )
                    }
                >
                    <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
                        
                        {/* New Command Form */}
                        {isAddingNew && (
                            <div className="bg-white rounded-xl p-5 border border-emerald-200 shadow-md space-y-4 mb-4 animate-in fade-in slide-in-from-top-2 relative">
                                <button 
                                    onClick={() => setIsAddingNew(false)}
                                    className="absolute top-4 right-4 text-slate-400 hover:text-red-500"
                                >
                                    <XCircle className="w-5 h-5" />
                                </button>
                                
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="p-1.5 bg-emerald-100 rounded text-emerald-600">
                                        <Plus className="w-4 h-4" />
                                    </div>
                                    <h4 className="font-bold text-slate-800">Create New Command</h4>
                                </div>

                                <div className="grid grid-cols-1 gap-4">
                                    <div>
                                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 block">Trigger Word</label>
                                        <TextInput 
                                            className="w-full px-3 py-2 bg-slate-50 text-slate-900 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                                            placeholder="e.g. menu, promo, info" 
                                            value={newCmdData.command}
                                            onChange={(e) => setNewCmdData({...newCmdData, command: e.target.value})}
                                        />
                                        <p className="text-[10px] text-slate-500 mt-1">Users can trigger this by typing the word directly (e.g. "menu").</p>
                                    </div>
                                    <div>
                                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 block">Description</label>
                                        <TextInput 
                                            placeholder="What does this command do?" 
                                            value={newCmdData.description}
                                            onChange={(e) => setNewCmdData({...newCmdData, description: e.target.value})}
                                        />
                                    </div>
                                    
                                    <ResponseEditor 
                                        value={newCmdData.response}
                                        onChange={(val) => setNewCmdData({...newCmdData, response: val})}
                                    />
                                </div>

                                <div className="flex justify-end gap-2 pt-2">
                                    <Button variant="ghost" size="sm" onClick={() => setIsAddingNew(false)}>Cancel</Button>
                                    <Button variant="primary" size="sm" onClick={handleAddNewCommand}>Add Command</Button>
                                </div>
                            </div>
                        )}

                        {/* Existing Commands */}
                        {commands.map(cmd => (
                            <div key={cmd.command} className={`bg-white rounded-lg border shadow-sm transition-all overflow-hidden ${editingCmd === cmd.command ? 'ring-2 ring-emerald-500 border-emerald-500' : 'border-slate-200 hover:border-emerald-300'}`}>
                                
                                {/* Header of Card */}
                                <div className={`px-4 py-3 flex justify-between items-center ${editingCmd === cmd.command ? 'bg-emerald-50/50' : 'bg-white'}`}>
                                    <div className="flex items-center gap-3">
                                        <div className="font-mono text-sm font-bold text-emerald-700 bg-emerald-100 px-2 py-1 rounded border border-emerald-200">
                                            {cmd.command}
                                        </div>
                                        {editingCmd !== cmd.command && (
                                             <span className="text-xs text-slate-500 truncate max-w-[150px]">{cmd.description}</span>
                                        )}
                                    </div>
                                    <div className="flex gap-1">
                                         {editingCmd !== cmd.command && (
                                            <>
                                                <button 
                                                    onClick={() => handleSendMessage(cmd.command.replace('/',''))}
                                                    className="p-1.5 hover:bg-emerald-50 rounded-md text-slate-400 hover:text-emerald-600 transition-colors"
                                                    title="Test Run"
                                                >
                                                    <Play className="w-4 h-4" />
                                                </button>
                                                <button 
                                                    onClick={() => handleEditStart(cmd)}
                                                    className="p-1.5 hover:bg-emerald-50 rounded-md text-slate-400 hover:text-emerald-600 transition-colors"
                                                    title="Edit Response"
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                            </>
                                         )}
                                    </div>
                                </div>
                                
                                {/* Edit Mode */}
                                {editingCmd === cmd.command && (
                                    <div className="p-4 pt-0 space-y-4 animate-in slide-in-from-top-1">
                                        <p className="text-xs text-emerald-600 font-medium px-1">Editing Response for {cmd.command}</p>
                                        <ResponseEditor 
                                            value={editValue}
                                            onChange={setEditValue}
                                        />
                                        <div className="flex justify-end gap-2">
                                            <Button variant="ghost" className="px-3 py-1 h-auto text-xs" onClick={() => setEditingCmd(null)}>Cancel</Button>
                                            <Button className="px-3 py-1 h-auto text-xs" onClick={() => handleSaveCommand(cmd.command)}>
                                                <Save className="w-3 h-3" /> Save Changes
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </Card>
            </div>
        </div>
    );
};

const InboxPage = () => {
    // Logic: Select a user from storage, show chat window.
    const [sessions, setSessions] = useState<ChatSession[]>(storage.getAllSessions());
    const [selectedPhone, setSelectedPhone] = useState<string | null>('628123456789'); // Default to demo user
    
    // Subscribe to storage updates
    useEffect(() => {
        const unsubscribe = storage.subscribe(() => {
            setSessions(storage.getAllSessions());
        });
        return () => unsubscribe();
    }, []);

    const activeSession = selectedPhone ? storage.getSession(selectedPhone) : null;

    const handleSendReply = async (text: string) => {
        if(!selectedPhone) return;
        await router.sendOutboundMessage(selectedPhone, text);
    };

    return (
        <div className="flex h-[calc(100vh-140px)] bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            {/* Sidebar Contact List */}
            <div className="w-80 border-r border-slate-200 flex flex-col">
                <div className="p-4 bg-slate-50 border-b border-slate-100 flex-shrink-0">
                    <div className="relative">
                        <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                        <input 
                            type="text" 
                            placeholder="Search or start new chat" 
                            className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                        />
                    </div>
                </div>
                
                <div className="flex-1 overflow-y-auto">
                    {sessions.map(session => (
                        <div 
                            key={session.phoneNumber}
                            onClick={() => setSelectedPhone(session.phoneNumber)}
                            className={`p-4 border-b border-slate-50 cursor-pointer transition-colors hover:bg-slate-50 ${selectedPhone === session.phoneNumber ? 'bg-emerald-50/50' : ''}`}
                        >
                            <div className="flex justify-between items-start mb-1">
                                <h4 className="font-medium text-slate-800 text-sm">{session.name || session.phoneNumber}</h4>
                                <span className="text-[10px] text-slate-400">
                                    {new Date(session.lastActivity).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                </span>
                            </div>
                            <p className="text-xs text-slate-500 truncate pr-4">
                                {session.messages[session.messages.length - 1]?.body || 'No messages'}
                            </p>
                        </div>
                    ))}
                    {sessions.length === 0 && (
                        <div className="p-8 text-center text-slate-400 text-sm">No active chats</div>
                    )}
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 flex flex-col bg-[#efeae2] relative">
                {activeSession ? (
                    <div className="flex-1 flex flex-col h-full min-h-0">
                        {/* Custom Header for Inbox */}
                        <div className="bg-[#f0f2f5] px-4 py-3 border-b border-slate-200 flex items-center gap-3 flex-shrink-0">
                            <div className="w-10 h-10 rounded-full bg-slate-300 flex items-center justify-center text-white font-bold">
                                {activeSession.name?.charAt(0) || 'U'}
                            </div>
                            <div>
                                <h4 className="font-semibold text-gray-800 text-sm">{activeSession.name || activeSession.phoneNumber}</h4>
                                <p className="text-xs text-gray-500">
                                    {activeSession.phoneNumber}
                                </p>
                            </div>
                        </div>

                        {/* We reuse ChatWindow but we want to strip its internal header or customize it. 
                            Since ChatWindow has its own header, let's just use it but pass correct props.
                            Actually, ChatWindow has a hardcoded header. Let's update ChatWindow first to be more flexible? 
                            I already updated ChatWindow in components/UI.tsx to accept header props.
                        */}
                        <div className="flex-1 min-h-0 relative">
                             {/* 
                                Note: ChatWindow component includes the container styles. 
                                In this layout we want to embed it. 
                                The ChatWindow component I defined has fixed height styles or flex. 
                                Let's just use it as is, it should fit if the container is flex.
                             */}
                             <div className="absolute inset-0">
                                 <ChatWindow 
                                    messages={activeSession.messages} 
                                    onSendMessage={handleSendReply}
                                    perspective='admin'
                                    headerTitle={activeSession.name}
                                    headerSubtitle={activeSession.phoneNumber}
                                 />
                             </div>
                        </div>
                    </div>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
                        <Inbox className="w-16 h-16 mb-4 opacity-20" />
                        <p>Select a conversation to start messaging</p>
                    </div>
                )}
            </div>
        </div>
    );
};

const DevicePage = () => {
    const [status, setStatus] = useState<'scan' | 'connecting' | 'connected'>('scan');

    useEffect(() => {
        if (status === 'scan') {
            const timer = setTimeout(() => setStatus('connecting'), 3000); // Simulate scan delay
            return () => clearTimeout(timer);
        }
        if (status === 'connecting') {
            const timer = setTimeout(() => setStatus('connected'), 2000);
            return () => clearTimeout(timer);
        }
    }, [status]);

    return (
        <div className="max-w-4xl mx-auto h-full flex flex-col items-center justify-center min-h-[500px]">
            <Card className="max-w-md w-full p-8 text-center">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-slate-800 mb-2">WhatsApp Web</h1>
                    <p className="text-slate-500 text-sm">
                        {status === 'connected' ? 'Device is connected and ready.' : 'Open WhatsApp on your phone and scan the QR code.'}
                    </p>
                </div>

                <div className="flex justify-center mb-8">
                    {status === 'connected' ? (
                        <div className="w-64 h-64 bg-emerald-50 rounded-xl flex items-center justify-center border-2 border-emerald-100">
                            <div className="text-center">
                                <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 text-white shadow-lg shadow-emerald-200">
                                    <CheckCircle className="w-8 h-8" />
                                </div>
                                <h3 className="font-bold text-emerald-800">Connected</h3>
                                <p className="text-xs text-emerald-600 mt-1">Ready to send & receive</p>
                            </div>
                        </div>
                    ) : (
                        <div className="relative group">
                            <div className={`w-64 h-64 bg-white border-2 border-slate-100 rounded-xl p-2 shadow-inner ${status === 'connecting' ? 'blur-sm opacity-50' : ''}`}>
                                {/* Mock QR Code Pattern */}
                                <div className="w-full h-full bg-[url('https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=WhatsAppGatewayDemo')] bg-cover bg-center opacity-80" />
                            </div>
                            {status === 'connecting' && (
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="flex flex-col items-center">
                                        <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-2"></div>
                                        <span className="text-xs font-bold text-slate-600">Connecting...</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <div className="text-left text-sm space-y-3 bg-slate-50 p-4 rounded-lg border border-slate-100">
                    <div className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-600">1</span>
                        <span className="text-slate-600">Open WhatsApp on your phone</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-600">2</span>
                        <span className="text-slate-600">Tap Menu or Settings and select Linked Devices</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-600">3</span>
                        <span className="text-slate-600">Point your phone to this screen to capture the code</span>
                    </div>
                </div>
                
                {status === 'connected' && (
                    <Button variant="outline" className="mt-6 w-full" onClick={() => setStatus('scan')}>
                        Disconnect Device
                    </Button>
                )}
            </Card>
        </div>
    );
};

const CommandsPage = () => {
    const commands = router.getBotEngine().getCommandsList();
    return (
        <div className="max-w-4xl mx-auto">
             <div className="mb-6">
                <h1 className="text-2xl font-bold text-slate-800">Bot Commands</h1>
                <p className="text-slate-500">List of registered commands handled by the Bot Engine.</p>
            </div>

            <div className="grid gap-4">
                {commands.map((cmd) => (
                    <Card key={cmd.command} className="hover:shadow-md transition-shadow">
                        <div className="flex items-start gap-4">
                            <div className="bg-slate-100 p-3 rounded-lg font-mono text-emerald-600 font-bold">
                                {cmd.command}
                            </div>
                            <div>
                                <h3 className="font-semibold text-slate-800 mb-1">{cmd.description}</h3>
                                <p className="text-sm text-slate-500">Response Type: Dynamic Text</p>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
}

const SettingsPage = () => {
    const [users, setUsers] = useState(storage.getAllSessions());
    const [newName, setNewName] = useState('');
    const [newPhone, setNewPhone] = useState('');

    useEffect(() => {
        const unsubscribe = storage.subscribe(() => {
            setUsers(storage.getAllSessions());
        });
        return () => unsubscribe();
    }, []);

    const handleAddUser = () => {
        if (!newName || !newPhone) return;
        storage.createSession(newPhone, newName);
        setNewName('');
        setNewPhone('');
    };

    const handleDeleteUser = (phone: string) => {
        if(window.confirm('Are you sure you want to delete this user and their chats?')) {
            storage.deleteSession(phone);
        }
    };

    return (
        <div className="max-w-5xl mx-auto">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-slate-800">Settings</h1>
                <p className="text-slate-500">Manage application configuration and user data.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column - Navigation (Mock) */}
                <div className="space-y-2">
                    <button className="w-full text-left px-4 py-2 bg-emerald-50 text-emerald-700 font-medium rounded-lg text-sm">
                        User Management
                    </button>
                    <button className="w-full text-left px-4 py-2 text-slate-600 hover:bg-slate-50 rounded-lg text-sm transition-colors">
                        API Configuration
                    </button>
                    <button className="w-full text-left px-4 py-2 text-slate-600 hover:bg-slate-50 rounded-lg text-sm transition-colors">
                        Webhook Settings
                    </button>
                    <button className="w-full text-left px-4 py-2 text-slate-600 hover:bg-slate-50 rounded-lg text-sm transition-colors">
                        Notifications
                    </button>
                </div>

                {/* Right Column - Content */}
                <div className="lg:col-span-2 space-y-6">
                    
                    {/* Add New User */}
                    <Card title="Add New Contact / User" icon={UserPlus}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-semibold text-slate-500 uppercase mb-1.5">Full Name</label>
                                <TextInput 
                                    placeholder="e.g. John Doe" 
                                    value={newName}
                                    onChange={(e) => setNewName(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-500 uppercase mb-1.5">Phone Number</label>
                                <TextInput 
                                    placeholder="e.g. 62812..." 
                                    value={newPhone}
                                    onChange={(e) => setNewPhone(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="mt-4 flex justify-end">
                            <Button onClick={handleAddUser} disabled={!newName || !newPhone}>
                                <Plus className="w-4 h-4" /> Add User
                            </Button>
                        </div>
                    </Card>

                    {/* User List */}
                    <Card title={`Registered Users (${users.length})`} icon={Users}>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-100">
                                    <tr>
                                        <th className="px-4 py-3 font-semibold">Name</th>
                                        <th className="px-4 py-3 font-semibold">Phone</th>
                                        <th className="px-4 py-3 font-semibold">Last Active</th>
                                        <th className="px-4 py-3 font-semibold text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {users.map(user => (
                                        <tr key={user.phoneNumber} className="hover:bg-slate-50/50">
                                            <td className="px-4 py-3 font-medium text-slate-800">{user.name}</td>
                                            <td className="px-4 py-3 text-slate-600">{user.phoneNumber}</td>
                                            <td className="px-4 py-3 text-slate-500 text-xs">
                                                {new Date(user.lastActivity).toLocaleString()}
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                <button 
                                                    onClick={() => handleDeleteUser(user.phoneNumber)}
                                                    className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                                                    title="Delete User"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {users.length === 0 && (
                                        <tr>
                                            <td colSpan={4} className="px-4 py-8 text-center text-slate-400 italic">
                                                No users found. Add one above.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

// --- Main Router ---

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
