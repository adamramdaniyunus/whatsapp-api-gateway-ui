import React, { useState, useEffect } from 'react';
import { Plus, XCircle, Play, Edit2, Save } from 'lucide-react';
import { Card, Button, TextInput, ChatWindow } from '../components/UI';
import { ResponseEditor } from '../components/ResponseEditor';
import { storage } from '../services/mock/storage';
import { BotCommand } from '../types';

import { router } from '../services/instance'; 

export const DemoPage = () => {
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
