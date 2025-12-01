
import { ChatSession, LogEntry, WAMessage, MessageDirection } from '../../types';

class MockStorage {
  private sessions: Map<string, ChatSession> = new Map();
  private logs: LogEntry[] = [];
  private listeners: (() => void)[] = [];

  constructor() {
    // Initialize a dummy session for the demo
    this.createSession('628123456789', 'Demo User');
  }

  // --- Session Management ---
  createSession(phoneNumber: string, name: string) {
    if (!this.sessions.has(phoneNumber)) {
      this.sessions.set(phoneNumber, {
        phoneNumber,
        name,
        messages: [],
        lastActivity: Date.now()
      });
      this.notify(); // Notify on creation
    }
  }

  deleteSession(phoneNumber: string) {
    if (this.sessions.has(phoneNumber)) {
        this.sessions.delete(phoneNumber);
        this.notify();
    }
  }

  getSession(phoneNumber: string) {
    return this.sessions.get(phoneNumber);
  }

  getAllSessions() {
    return Array.from(this.sessions.values()).sort((a, b) => b.lastActivity - a.lastActivity);
  }

  addMessage(phoneNumber: string, message: WAMessage) {
    const session = this.sessions.get(phoneNumber);
    if (session) {
      session.messages.push(message);
      session.lastActivity = Date.now();
      this.notify();
    }
  }

  // --- Logs Management ---
  addLog(entry: LogEntry) {
    this.logs.unshift(entry); // Prepend
    if (this.logs.length > 100) this.logs.pop(); // Limit size
    this.notify();
  }

  getLogs() {
    return this.logs;
  }

  // --- Subscription ---
  subscribe(listener: () => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notify() {
    this.listeners.forEach(l => l());
  }
}

export const storage = new MockStorage();
