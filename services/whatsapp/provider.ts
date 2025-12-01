import { logger } from '../logger';

// Interface for any WhatsApp Provider (Fonnte, UltraMsg, WAPI, etc.)
export interface IWhatsAppProvider {
  sendMessage(to: string, message: string): Promise<{ success: boolean; id: string; raw?: any }>;
}

// ------------------------------------------------------------------
// Implementation A: Dummy Provider (Mock)
// ------------------------------------------------------------------
export class DummyProvider implements IWhatsAppProvider {
  async sendMessage(to: string, message: string) {
    logger.info(`[DummyProvider] Prepare send to ${to}`);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));

    // Mock success
    const mockId = `msg_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
    logger.success(`[DummyProvider] Sent successfully`, { id: mockId, to, body: message });

    return { success: true, id: mockId };
  }
}

// ------------------------------------------------------------------
// Implementation B: Generic API Provider (e.g., UltraMsg/Fonnte)
// ------------------------------------------------------------------
export class GenericAPIProvider implements IWhatsAppProvider {
  private apiUrl: string;
  private token: string;

  constructor(apiUrl: string, token: string) {
    this.apiUrl = apiUrl;
    this.token = token;
  }

  async sendMessage(to: string, message: string) {
    try {
      logger.info(`[APIProvider] POST to ${this.apiUrl}`);
      
      // Example structure for a generic provider
      // In a real app, you'd configure this based on the specific provider's docs
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: this.token,
          to: to,
          body: message
        })
      });

      const data = await response.json();
      
      if (!response.ok) throw new Error(data.message || 'API Error');

      logger.success(`[APIProvider] API Response`, data);
      return { success: true, id: data.id || 'unknown', raw: data };

    } catch (error: any) {
      logger.error(`[APIProvider] Failed`, error.message);
      return { success: false, id: '', raw: error };
    }
  }
}