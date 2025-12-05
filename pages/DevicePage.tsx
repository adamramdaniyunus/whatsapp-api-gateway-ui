import React, { useState, useEffect } from 'react';
import { CheckCircle } from 'lucide-react';
import { Card, Button } from '../components/UI';

export const DevicePage = () => {
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
