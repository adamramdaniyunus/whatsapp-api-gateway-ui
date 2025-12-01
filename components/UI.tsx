
import React, { useEffect, useRef } from 'react';
import { LucideIcon, Send as SendIcon } from 'lucide-react';
import { WAMessage, MessageDirection } from '../types';

// --- Card ---
export const Card: React.FC<{ title?: string; icon?: LucideIcon; children: React.ReactNode; className?: string; action?: React.ReactNode }> = ({ 
  title, 
  icon: Icon, 
  children,
  className = "",
  action
}) => (
  <div className={`bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col ${className}`}>
    {title && (
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 flex-shrink-0">
            <div className="flex items-center gap-2">
                {Icon && <Icon className="w-5 h-5 text-emerald-600" />}
                <h3 className="font-semibold text-slate-800">{title}</h3>
            </div>
            {action && <div>{action}</div>}
        </div>
    )}
    <div className="p-6 flex-1 flex flex-col min-h-0">
      {children}
    </div>
  </div>
);

// --- Stat Card ---
export const StatCard: React.FC<{ title: string; value: string | number; icon: LucideIcon; trend?: string; color?: string }> = ({
    title, value, icon: Icon, trend, color = "emerald"
}) => (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <div className="flex items-center justify-between">
            <div>
                <p className="text-sm font-medium text-slate-500">{title}</p>
                <h3 className="text-2xl font-bold text-slate-800 mt-1">{value}</h3>
                {trend && <p className="text-xs text-emerald-600 mt-1 font-medium">{trend}</p>}
            </div>
            <div className={`p-3 rounded-lg bg-${color}-50 text-${color}-600`}>
                <Icon className="w-6 h-6" />
            </div>
        </div>
    </div>
);

// --- Button ---
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  isLoading?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  isLoading, 
  size = 'md',
  className = "", 
  ...props 
}) => {
  const baseStyle = "rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed";
  
  const sizes = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base"
  };

  const variants = {
    primary: "bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm hover:shadow-md",
    secondary: "bg-teal-600 hover:bg-teal-700 text-white shadow-sm",
    outline: "border-2 border-slate-200 hover:border-emerald-600 text-slate-600 hover:text-emerald-600 bg-transparent",
    ghost: "bg-transparent text-slate-600 hover:bg-slate-100",
    danger: "bg-red-50 text-red-600 hover:bg-red-100 border border-red-100"
  };

  return (
    <button className={`${baseStyle} ${sizes[size]} ${variants[variant]} ${className}`} disabled={isLoading || props.disabled} {...props}>
      {isLoading ? (
        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
      ) : children}
    </button>
  );
};

// --- Inputs ---
export const InputGroup: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <div className="flex flex-col gap-1.5 mb-4">
    <label className="text-sm font-medium text-slate-700">{label}</label>
    {children}
  </div>
);

export const TextInput: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = (props) => (
  <input 
    className={`w-full px-3 py-2 bg-white text-slate-900 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors placeholder:text-slate-400 ${props.className || ''}`}
    {...props}
  />
);

export const TextArea: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement>> = (props) => (
  <textarea 
    className={`w-full px-3 py-2 bg-white text-slate-900 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors min-h-[100px] resize-none placeholder:text-slate-400 ${props.className || ''}`}
    {...props}
  />
);

// --- Badge ---
export const Badge: React.FC<{ children: React.ReactNode; color?: 'green' | 'blue' | 'gray' | 'red' | 'yellow' }> = ({ children, color = 'gray' }) => {
  const colors = {
    green: "bg-emerald-100 text-emerald-700 border-emerald-200",
    blue: "bg-blue-100 text-blue-700 border-blue-200",
    gray: "bg-slate-100 text-slate-700 border-slate-200",
    red: "bg-red-100 text-red-700 border-red-200",
    yellow: "bg-amber-100 text-amber-700 border-amber-200",
  };
  return (
    <span className={`px-2 py-0.5 rounded text-xs font-semibold border ${colors[color]}`}>
      {children}
    </span>
  );
};

// --- WhatsApp Chat Components ---

export type ChatPerspective = 'simulator' | 'admin';

export const ChatBubble: React.FC<{ message: WAMessage, perspective?: ChatPerspective }> = ({ message, perspective = 'simulator' }) => {
  // Logic: 
  // If perspective is 'simulator' (User View): I am the User (INBOUND is Me), OUTBOUND is Bot (Other)
  // If perspective is 'admin' (Dashboard View): I am the System (OUTBOUND is Me), INBOUND is User (Other)
  
  let isMe = false;
  
  if (perspective === 'simulator') {
      isMe = message.direction === MessageDirection.INBOUND;
  } else {
      isMe = message.direction === MessageDirection.OUTBOUND;
  }
  
  return (
    <div className={`flex w-full ${isMe ? 'justify-end' : 'justify-start'} mb-3`}>
      <div className={`
        max-w-[80%] rounded-lg px-3 py-2 text-sm shadow-sm relative
        ${isMe ? 'bg-[#d9fdd3] text-gray-800 rounded-tr-none' : 'bg-white text-gray-800 rounded-tl-none'}
      `}>
        {/* Message Body with Line Breaks */}
        <div className="whitespace-pre-wrap leading-relaxed">{message.body}</div>
        
        {/* Timestamp & Status */}
        <div className="flex items-center justify-end gap-1 mt-1 opacity-60">
            <span className="text-[10px]">{new Date(message.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
            {isMe && (
                <span className="text-[10px] font-bold text-blue-500">✓✓</span>
            )}
        </div>
      </div>
    </div>
  );
};

export const ChatInput: React.FC<{ onSend: (msg: string) => void; disabled?: boolean; placeholder?: string }> = ({ onSend, disabled, placeholder }) => {
    const [text, setText] = React.useState('');

    const handleSend = () => {
        if(!text.trim()) return;
        onSend(text);
        setText('');
    };

    return (
        <div className="bg-[#f0f2f5] px-4 py-3 flex items-center gap-2 border-t border-slate-200">
            <input 
                type="text" 
                className="flex-1 rounded-lg border-none px-4 py-2 text-sm focus:ring-0 focus:outline-none bg-white text-slate-800 placeholder:text-slate-400 shadow-sm"
                placeholder={placeholder || "Type a message..."}
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                disabled={disabled}
            />
            <button 
                onClick={handleSend}
                disabled={disabled || !text.trim()}
                className="p-2 bg-[#00a884] text-white rounded-full hover:bg-[#008f6f] transition disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0 shadow-sm"
            >
                <SendIcon className="w-5 h-5" />
            </button>
        </div>
    );
};

export const ChatWindow: React.FC<{ 
    messages: WAMessage[]; 
    onSendMessage: (msg: string) => void; 
    isTyping?: boolean;
    perspective?: ChatPerspective;
    headerTitle?: string;
    headerSubtitle?: string;
}> = ({ messages, onSendMessage, isTyping, perspective = 'simulator', headerTitle = 'Demo Bot', headerSubtitle = 'Online' }) => {
    
    const endRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        endRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isTyping]);

    return (
        <div className="flex flex-col h-full bg-[#efeae2] border border-slate-200 rounded-lg overflow-hidden shadow-sm relative">
            {/* Header */}
            <div className="bg-[#f0f2f5] px-4 py-3 border-b border-slate-200 flex items-center gap-3 flex-shrink-0 z-20">
                <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold">
                    {perspective === 'simulator' ? '🤖' : '👤'}
                </div>
                <div>
                    <h4 className="font-semibold text-gray-800 text-sm">{headerTitle}</h4>
                    <p className="text-xs text-gray-500">{headerSubtitle}</p>
                </div>
            </div>

            {/* Messages Area */}
            {/* Background pattern simulation */}
            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar relative">
                <div className="absolute inset-0 opacity-5 pointer-events-none" 
                     style={{backgroundImage: 'url("https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png")'}}>
                </div>
                
                {messages.length === 0 && (
                    <div className="flex justify-center mt-10 relative z-10">
                        <div className="bg-[#fff5c4] text-gray-800 text-xs px-3 py-2 rounded shadow-sm text-center max-w-xs">
                           🔒 Messages are end-to-end encrypted.
                        </div>
                    </div>
                )}

                <div className="space-y-2 relative z-10 pt-4 pb-2">
                    {messages.map((msg) => (
                        <ChatBubble key={msg.id} message={msg} perspective={perspective} />
                    ))}
                    {isTyping && (
                        <div className={`flex w-full ${perspective === 'simulator' ? 'justify-start' : 'justify-start'} mb-3`}>
                            <div className="bg-white rounded-lg rounded-tl-none px-4 py-3 shadow-sm">
                                <div className="flex gap-1">
                                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-75"></span>
                                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150"></span>
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={endRef} />
                </div>
            </div>

            {/* Input Area */}
            <div className="flex-shrink-0 z-20">
                <ChatInput onSend={onSendMessage} placeholder={perspective === 'admin' ? "Type a reply..." : "Type a message..."}/>
            </div>
        </div>
    );
};
