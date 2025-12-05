import React, { useState, useEffect } from 'react';
import { Card, Button } from '../components/UI';
import { api } from '../services/api';
import { Plus, Trash2, Save, Power, Loader2, AlertCircle } from 'lucide-react';

interface BotCommand {
  command: string;
  description: string;
  response: string;
}

export const CommandsPage = () => {
  const [enabled, setEnabled] = useState(false);
  const [commands, setCommands] = useState<BotCommand[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Load bot config on mount
  useEffect(() => {
    loadBotConfig();
  }, []);

  const loadBotConfig = async () => {
    try {
      setLoading(true);
      const response = await api.getBotConfig();
      
      if (response.success) {
        console.log(response);
        
        setEnabled(response.enabled);
        setCommands(response.commands || []);
      }
    } catch (err: any) {
      console.error('Error loading bot config:', err);
      setError('Failed to load bot configuration');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);
      setSuccess(null);

      const response = await api.updateBotConfig(enabled, commands);
      
      if (response.success) {
        setSuccess('Bot configuration saved successfully!');
        setTimeout(() => setSuccess(null), 3000);
      } else {
        setError(response.message || 'Failed to save configuration');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save configuration');
    } finally {
      setSaving(false);
    }
  };

  const handleAddCommand = () => {
    setCommands([
      ...commands,
      { command: '', description: '', response: '' }
    ]);
  };

  const handleUpdateCommand = (index: number, field: keyof BotCommand, value: string) => {
    const updated = [...commands];
    updated[index][field] = value;
    setCommands(updated);
  };

  const handleDeleteCommand = (index: number) => {
    setCommands(commands.filter((_, i) => i !== index));
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-emerald-500 animate-spin mx-auto mb-4" />
          <p className="text-slate-600">Loading bot configuration...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Bot Commands</h1>
          <p className="text-slate-500">Configure auto-reply commands for your WhatsApp bot</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-600">Bot Status:</span>
            <button
              onClick={() => setEnabled(!enabled)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                enabled ? 'bg-emerald-500' : 'bg-slate-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  enabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
            <span className={`text-sm font-medium ${enabled ? 'text-emerald-600' : 'text-slate-500'}`}>
              {enabled ? 'Enabled' : 'Disabled'}
            </span>
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-500" />
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {success && (
        <div className="mb-4 p-4 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center gap-3">
          <Power className="w-5 h-5 text-emerald-500" />
          <p className="text-sm text-emerald-600">{success}</p>
        </div>
      )}

      <Card className="mb-6 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-slate-800">Custom Commands</h2>
          <Button
            variant="primary"
            onClick={handleAddCommand}
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Command
          </Button>
        </div>

        {commands.length === 0 ? (
          <div className="text-center py-12 bg-slate-50 rounded-lg border-2 border-dashed border-slate-200 flex items-center justify-center flex-col">
            <p className="text-slate-500 mb-4">No commands configured yet</p>
            <Button variant="outline" onClick={handleAddCommand}>
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Command
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {commands.map((cmd, index) => (
              <Card key={index} className="p-4 bg-slate-50">
                <div className="flex items-start gap-4">
                  <div className="flex-1 space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1">
                          Command
                        </label>
                        <input
                          type="text"
                          value={cmd.command}
                          onChange={(e) => handleUpdateCommand(index, 'command', e.target.value)}
                          placeholder="/hello"
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none font-mono text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1">
                          Description
                        </label>
                        <input
                          type="text"
                          value={cmd.description}
                          onChange={(e) => handleUpdateCommand(index, 'description', e.target.value)}
                          placeholder="Greeting message"
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none text-sm"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">
                        Response
                      </label>
                      <textarea
                        value={cmd.response}
                        onChange={(e) => handleUpdateCommand(index, 'response', e.target.value)}
                        placeholder="Hello! How can I help you today?"
                        rows={3}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none text-sm resize-none"
                      />
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteCommand(index)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </Card>

      <div className="flex items-center justify-between">
        <div className="text-sm text-slate-500">
          {commands.length} command{commands.length !== 1 ? 's' : ''} configured
        </div>
        <Button
          variant="primary"
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2"
        >
          {saving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              Save Configuration
            </>
          )}
        </Button>
      </div>

      <Card className="mt-6 p-6 bg-blue-50 border-blue-200">
        <h3 className="font-semibold text-blue-900 mb-2">💡 How to use</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Commands must start with "/" (e.g., /help, /menu)</li>
          <li>• Bot will automatically reply when someone sends a matching command</li>
          <li>• Make sure bot is enabled and WhatsApp is connected</li>
          <li>• Test by sending a command to your connected WhatsApp number</li>
        </ul>
      </Card>
    </div>
  );
};
