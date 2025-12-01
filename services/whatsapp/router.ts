import { WAMessage, MessageDirection } from '../../types';
import { IWhatsAppProvider } from './provider';
import { BotEngine } from './bot';
import { logger } from '../logger';
import { storage } from '../mock/storage';

export class WhatsAppRouter {
  private provider: IWhatsAppProvider;
  private bot: BotEngine;

  constructor(provider: IWhatsAppProvider) {
    this.provider = provider;
    this.bot = new BotEngine();
  }

  getBotEngine() {
    return this.bot;
  }

  // API: /api/whatsapp/webhook
  async handleIncomingWebhook(payload: { from: string; body: string }) {
    const messageId = `msg_in_${Date.now()}`;
    
    const incomingMsg: WAMessage = {
      id: messageId,
      from: payload.from,
      to: 'SYSTEM',
      body: payload.body,
      timestamp: Date.now(),
      direction: MessageDirection.INBOUND,
      status: 'received',
      isBot: false
    };

    // 1. Save to Storage (Simulate Database)
    storage.addMessage(payload.from, incomingMsg);
    logger.info(`[Router] Received message from ${incomingMsg.from}`, incomingMsg.body);
    
    // 2. Trigger Bot Processing
    // Artificial delay for realism
    setTimeout(async () => {
        const botResponse = this.bot.processCommand(incomingMsg);

        if (botResponse) {
          logger.info(`[Router] Bot triggered. Replying...`);
          // 3. Send Reply via Provider
          await this.sendReply(payload.from, botResponse);
        }
    }, 600); // 600ms thinking time

    return { success: true };
  }

  // API: /api/whatsapp/send
  async sendOutboundMessage(to: string, body: string) {
    const result = await this.provider.sendMessage(to, body);
    
    if (result.success) {
         const outboundMsg: WAMessage = {
            id: result.id,
            from: 'SYSTEM',
            to: to,
            body: body,
            timestamp: Date.now(),
            direction: MessageDirection.OUTBOUND,
            status: 'sent',
            isBot: true
        };
        storage.createSession(to, 'Unknown User');
        storage.addMessage(to, outboundMsg);
    }

    return result;
  }

  private async sendReply(to: string, body: string) {
    // Artificial delay to feel like a real bot typing
    await new Promise(r => setTimeout(r, 800)); 
    
    const result = await this.provider.sendMessage(to, body);
    
    // Save bot reply to storage
    const replyMsg: WAMessage = {
        id: result.id,
        from: 'BOT',
        to: to,
        body: body,
        timestamp: Date.now(),
        direction: MessageDirection.OUTBOUND,
        status: 'sent',
        isBot: true
    };
    storage.addMessage(to, replyMsg);
  }
}