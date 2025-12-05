import React from 'react';
import { MessageCircle, Users, Server, Zap, PlayCircle, Inbox } from 'lucide-react';
import { StatCard, Card, Button } from '../components/UI';
import { storage } from '../services/mock/storage';
import { PageRoute } from '../types';

export const DashboardPage = ({ onNavigate }: { onNavigate: (p: PageRoute) => void }) => {
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
