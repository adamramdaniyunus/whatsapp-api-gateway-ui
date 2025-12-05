import React, { useState, useEffect } from 'react';
import { UserPlus, Plus, Users, Trash2 } from 'lucide-react';
import { Card, TextInput, Button } from '../components/UI';
import { storage } from '../services/mock/storage';

export const SettingsPage = () => {
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
