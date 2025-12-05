import { DummyProvider } from './whatsapp/provider';
import { WhatsAppRouter } from './whatsapp/router';

// Initialize Services Singleton
export const provider = new DummyProvider();
export const router = new WhatsAppRouter(provider);
