
// Global types shared across components and services

export enum MessageDirection {
  INBOUND = 'INBOUND',
  OUTBOUND = 'OUTBOUND',
}

export enum LogLevel {
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
  SUCCESS = 'SUCCESS',
}

export interface LogEntry {
  id: string;
  timestamp: Date;
  level: LogLevel;
  message: string;
  details?: any;
}

export interface WAMessage {
  id: string;
  from: string; // Phone number
  to: string;   // Phone number
  body: string;
  timestamp: number;
  direction: MessageDirection;
  status: 'pending' | 'sent' | 'received' | 'failed';
  isBot?: boolean;
}

export interface ChatSession {
  phoneNumber: string;
  name: string;
  messages: WAMessage[];
  lastActivity: number;
}

export interface BotCommand {
  command: string;
  description: string;
  response: (args: string[]) => string;
}

// Simulating Next.js Pages
export type PageRoute = 'dashboard' | 'demo' | 'inbox' | 'device' | 'commands' | 'settings';
