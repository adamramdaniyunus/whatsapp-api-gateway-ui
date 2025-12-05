import React, { useState, useEffect } from 'react';
import { Search, Inbox } from 'lucide-react';
import { ChatWindow } from '../components/UI';
import { storage } from '../services/mock/storage';
import { ChatSession } from '../types';
import { router } from '../services/instance';

export const InboxPage = () => {
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

                        <div className="flex-1 min-h-0 relative">
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
