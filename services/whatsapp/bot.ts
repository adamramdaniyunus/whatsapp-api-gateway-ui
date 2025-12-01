import { WAMessage, BotCommand } from '../../types';
import { logger } from '../logger';

export class BotEngine {
  private commands: BotCommand[];

  constructor() {
    this.commands = [
      {
        command: '/menu',
        description: 'Show available commands',
        response: () => this.getMenu()
      },
      {
        command: '/help',
        description: 'Get help using the bot',
        response: () => `🆘 *Support*\n\nIf you need assistance, please contact admin@example.com or type *menu* to see what I can do.`
      },
      {
        command: '/ping',
        description: 'Check server latency',
        response: () => `🏓 *Pong!*\nServer time: ${new Date().toLocaleTimeString()}\nStatus: ✅ Operational`
      },
      {
        command: '/id',
        description: 'Get your User ID',
        response: () => `🆔 User ID retrieval requires context. (Mock ID: 12345)`
      },
      {
        command: '/calc',
        description: 'Calculate simple math (e.g. calc 5+5)',
        response: (args) => {
          try {
            const expression = args.join('');
            // eslint-disable-next-line no-eval
            const result = eval(expression.replace(/[^-()\d/*+.]/g, ''));
            return `🔢 Result: *${result}*`;
          } catch (e) {
            return `❌ Invalid expression. Try: calc 10*5`;
          }
        }
      }
    ];
  }

  getCommandsList() {
    return this.commands;
  }

  addCommand(command: string, description: string, responseText: string) {
    // Ensure command starts with / for internal storage consistency
    const cmdKey = command.trim().startsWith('/') ? command.trim().toLowerCase() : `/${command.trim().toLowerCase()}`;
    
    // Check if exists, update if so
    const existingIndex = this.commands.findIndex(c => c.command === cmdKey);
    
    const newCmd: BotCommand = {
        command: cmdKey,
        description,
        response: () => responseText
    };

    if (existingIndex >= 0) {
        this.commands[existingIndex] = newCmd;
    } else {
        this.commands.push(newCmd);
    }
    
    logger.info(`[Bot] Registered new command: ${cmdKey}`);
    return cmdKey;
  }

  updateCommandResponse(commandKey: string, newResponseText: string) {
    const cmd = this.commands.find(c => c.command === commandKey);
    if (cmd) {
      cmd.response = () => newResponseText;
      return true;
    }
    return false;
  }

  // Parse incoming message and determine response
  processCommand(message: WAMessage): string | null {
    const body = message.body.trim();
    if (!body) return null;

    const parts = body.split(' ');
    let commandKey = parts[0].toLowerCase();
    
    // Normalize command input: 'menu' -> '/menu'
    if (!commandKey.startsWith('/')) {
        commandKey = '/' + commandKey;
    }

    logger.info(`[Bot] Processing command match: ${commandKey}`);

    const cmd = this.commands.find(c => c.command === commandKey);
    
    if (cmd) {
        const args = parts.slice(1);
        if (cmd.command === '/id') return `🆔 Your WhatsApp ID is: *${message.from}*`;
        return cmd.response(args);
    }

    // If text explicitly started with '/', treat it as a failed command attempt
    if (body.startsWith('/')) {
         return `❓ Unknown command. Type *menu* for list.`;
    }

    // Simple NLP fallback for greetings
    if (body.toLowerCase().match(/\b(hi|hello|halo|hola|pagi|siang|malam)\b/)) {
        return "👋 Hello! I am the Gateway Bot. Type *menu* or */menu* to start.";
    }

    return null;
  }

  private getMenu(): string {
    // Display commands nicely without the slash if preferred, but usually bots show it
    const cmdList = this.commands.map(c => `🔹 *${c.command.replace('/','')}* - ${c.description}`).join('\n');
    return `🤖 *WhatsApp Bot Menu*\n\n${cmdList}\n\n_Powered by Next.js Gateway_`;
  }
}