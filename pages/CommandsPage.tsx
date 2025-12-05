import React from 'react';
import { Card } from '../components/UI';
import { router } from '../services/instance';

export const CommandsPage = () => {
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
