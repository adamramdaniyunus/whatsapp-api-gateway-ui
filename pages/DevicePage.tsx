import React, { useState, useEffect, useRef } from 'react';
import { CheckCircle, Smartphone, AlertCircle, Loader2 } from 'lucide-react';
import { Card, Button } from '../components/UI';
import { api } from '../services/api';

type ConnectionStatus = 'disconnected' | 'initializing' | 'qr' | 'connecting' | 'connected' | 'failed';

export const DevicePage = () => {
    const [status, setStatus] = useState<ConnectionStatus>('disconnected');
    const [qrCode, setQrCode] = useState<string | null>(null);
    const [phoneNumber, setPhoneNumber] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);

    // Check initial status on mount
    useEffect(() => {
        checkStatus();
        return () => {
            // Cleanup polling on unmount
            if (pollingIntervalRef.current) {
                clearInterval(pollingIntervalRef.current);
            }
        };
    }, []);

    const checkStatus = async () => {
        try {
            const response = await api.getWhatsAppStatus();
            if (response.success) {
                setStatus(response.status);
                setPhoneNumber(response.phoneNumber);
                
                // If status is QR, start polling
                if (response.status === 'qr') {
                    startPolling();
                }
            }
        } catch (err: any) {
            console.error('Error checking status:', err);
        }
    };

    const handleInitialize = async () => {
        setIsLoading(true);
        setError(null);
        
        try {
            // Initialize WhatsApp instance
            const response = await api.initWhatsApp();
            
            if (response.success) {
                setStatus('initializing');
                // Start polling for QR code
                startPolling();
            } else {
                setError(response.message || 'Failed to initialize WhatsApp');
                setStatus('failed');
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to initialize WhatsApp');
            setStatus('failed');
        } finally {
            setIsLoading(false);
        }
    };

    const startPolling = () => {
        // Clear existing interval
        if (pollingIntervalRef.current) {
            clearInterval(pollingIntervalRef.current);
        }

        // Poll immediately
        pollQRCode();

        // Then poll every 3 seconds
        pollingIntervalRef.current = setInterval(() => {
            pollQRCode();
        }, 3000);
    };

    const pollQRCode = async () => {
        try {
            const response = await api.getQRCode();
            
            if (response.success) {
                const currentStatus = response.status;
                
                if (currentStatus === 'qr' && response.qrCode) {
                    setStatus('qr');
                    setQrCode(response.qrCode);
                } else if (currentStatus === 'connected') {
                    setStatus('connected');
                    setQrCode(null);
                    // Stop polling when connected
                    if (pollingIntervalRef.current) {
                        clearInterval(pollingIntervalRef.current);
                    }
                    // Get phone number
                    checkStatus();
                } else if (currentStatus === 'failed') {
                    setStatus('failed');
                    setError('Authentication failed. Please try again.');
                    if (pollingIntervalRef.current) {
                        clearInterval(pollingIntervalRef.current);
                    }
                }
            }
        } catch (err: any) {
            console.error('Error polling QR code:', err);
        }
    };

    const handleDisconnect = async () => {
        setIsLoading(true);
        setError(null);
        
        try {
            const response = await api.disconnectWhatsApp();
            
            if (response.success) {
                setStatus('disconnected');
                setQrCode(null);
                setPhoneNumber(null);
                
                // Stop polling
                if (pollingIntervalRef.current) {
                    clearInterval(pollingIntervalRef.current);
                }
            } else {
                setError(response.message || 'Failed to disconnect');
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to disconnect');
        } finally {
            setIsLoading(false);
        }
    };

    const renderContent = () => {
        if (status === 'connected') {
            return (
                <div className="w-64 h-64 bg-emerald-50 rounded-xl flex items-center justify-center border-2 border-emerald-100">
                    <div className="text-center">
                        <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 text-white shadow-lg shadow-emerald-200">
                            <CheckCircle className="w-8 h-8" />
                        </div>
                        <h3 className="font-bold text-emerald-800">Connected</h3>
                        <p className="text-xs text-emerald-600 mt-1">Ready to send & receive</p>
                        {phoneNumber && (
                            <p className="text-xs text-emerald-700 mt-2 font-mono">{phoneNumber}</p>
                        )}
                    </div>
                </div>
            );
        }

        if (status === 'qr' && qrCode) {
            return (
                <div className="relative group">
                    <div className="w-64 h-64 bg-white border-2 border-slate-200 rounded-xl p-3 shadow-lg">
                        <img 
                            src={qrCode} 
                            alt="WhatsApp QR Code" 
                            className="w-full h-full object-contain"
                        />
                    </div>
                    <div className="mt-3 flex items-center justify-center gap-2 text-sm text-slate-600">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Waiting for scan...</span>
                    </div>
                </div>
            );
        }

        if (status === 'initializing' || status === 'connecting') {
            return (
                <div className="w-64 h-64 bg-slate-50 rounded-xl flex items-center justify-center border-2 border-slate-100">
                    <div className="text-center">
                        <Loader2 className="w-12 h-12 text-emerald-500 animate-spin mx-auto mb-4" />
                        <p className="text-sm font-medium text-slate-600">
                            {status === 'initializing' ? 'Initializing...' : 'Connecting...'}
                        </p>
                    </div>
                </div>
            );
        }

        if (status === 'failed') {
            return (
                <div className="w-64 h-64 bg-red-50 rounded-xl flex items-center justify-center border-2 border-red-100">
                    <div className="text-center">
                        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                        <p className="text-sm font-medium text-red-600">Connection Failed</p>
                        {error && <p className="text-xs text-red-500 mt-2">{error}</p>}
                    </div>
                </div>
            );
        }

        // Disconnected state
        return (
            <div className="w-64 h-64 bg-slate-50 rounded-xl flex items-center justify-center border-2 border-slate-200">
                <div className="text-center">
                    <Smartphone className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                    <p className="text-sm font-medium text-slate-600">Not Connected</p>
                    <p className="text-xs text-slate-500 mt-1">Click below to start</p>
                </div>
            </div>
        );
    };

    return (
        <div className="max-w-4xl mx-auto h-full flex flex-col items-center justify-center min-h-[500px]">
            <Card className="max-w-md w-full p-8 text-center">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-slate-800 mb-2">WhatsApp Connection</h1>
                    <p className="text-slate-500 text-sm">
                        {status === 'connected' 
                            ? 'Device is connected and ready.' 
                            : status === 'qr'
                            ? 'Scan the QR code with your WhatsApp mobile app.'
                            : 'Initialize WhatsApp to get started.'}
                    </p>
                </div>

                <div className="flex justify-center mb-8">
                    {renderContent()}
                </div>

                {error && status !== 'failed' && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-sm text-red-600">{error}</p>
                    </div>
                )}

                {(status === 'qr' || status === 'disconnected' || status === 'failed') && (
                    <div className="text-left text-sm space-y-3 bg-slate-50 p-4 rounded-lg border border-slate-100 mb-6">
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
                )}
                
                {status === 'disconnected' || status === 'failed' ? (
                    <Button 
                        variant="primary" 
                        className="w-full" 
                        onClick={handleInitialize}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <span className="flex items-center justify-center gap-2">
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Initializing...
                            </span>
                        ) : (
                            'Initialize WhatsApp'
                        )}
                    </Button>
                ) : status === 'connected' && (
                    <Button 
                        variant="outline" 
                        className="w-full" 
                        onClick={handleDisconnect}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Disconnecting...' : 'Disconnect Device'}
                    </Button>
                )}
            </Card>
        </div>
    );
};
