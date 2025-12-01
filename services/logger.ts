import { LogEntry, LogLevel } from '../types';

type LogListener = (entry: LogEntry) => void;

class LoggerService {
  private listeners: LogListener[] = [];

  subscribe(listener: LogListener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notify(entry: LogEntry) {
    this.listeners.forEach((listener) => listener(entry));
  }

  log(level: LogLevel, message: string, details?: any) {
    const entry: LogEntry = {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date(),
      level,
      message,
      details,
    };
    // Console log for debug
    console.log(`[${level}] ${message}`, details || '');
    this.notify(entry);
  }

  info(msg: string, details?: any) { this.log(LogLevel.INFO, msg, details); }
  success(msg: string, details?: any) { this.log(LogLevel.SUCCESS, msg, details); }
  warn(msg: string, details?: any) { this.log(LogLevel.WARN, msg, details); }
  error(msg: string, details?: any) { this.log(LogLevel.ERROR, msg, details); }
}

export const logger = new LoggerService();