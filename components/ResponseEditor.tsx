import React from 'react';
import { Type } from 'lucide-react';

export const ResponseEditor = ({ value, onChange }: { value: string, onChange: (val: string) => void }) => {
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
