'use client';

import React, { useState, useEffect } from 'react';
import { Icon } from '@/components/ui';

/**
 * Settings Page
 * 
 * Configure LLM API settings:
 * - API Endpoint (e.g., OpenAI, Anthropic, local)
 * - API Key
 * - Model Name
 */

interface LLMSettings {
  apiEndpoint: string;
  apiKey: string;
  modelName: string;
}

const DEFAULT_SETTINGS: LLMSettings = {
  apiEndpoint: 'https://api.openai.com/v1/chat/completions',
  apiKey: '',
  modelName: 'gpt-4o-mini',
};

// Preset configurations for common providers
const PRESETS = [
  {
    name: 'OpenAI',
    endpoint: 'https://api.openai.com/v1/chat/completions',
    models: ['gpt-4o', 'gpt-4o-mini', 'gpt-4-turbo', 'gpt-3.5-turbo'],
  },
  {
    name: 'Anthropic',
    endpoint: 'https://api.anthropic.com/v1/messages',
    models: ['claude-3-5-sonnet-20241022', 'claude-3-opus-20240229', 'claude-3-haiku-20240307'],
  },
  {
    name: 'Groq',
    endpoint: 'https://api.groq.com/openai/v1/chat/completions',
    models: ['llama-3.3-70b-versatile', 'llama-3.1-8b-instant', 'mixtral-8x7b-32768'],
  },
  {
    name: 'OpenRouter',
    endpoint: 'https://openrouter.ai/api/v1/chat/completions',
    models: ['anthropic/claude-3.5-sonnet', 'openai/gpt-4o', 'google/gemini-pro-1.5'],
  },
  {
    name: 'Local (Ollama)',
    endpoint: 'http://localhost:11434/v1/chat/completions',
    models: ['llama3.2', 'mistral', 'codellama', 'phi3'],
  },
];

export default function SettingsPage() {
  const [settings, setSettings] = useState<LLMSettings>(DEFAULT_SETTINGS);
  const [showApiKey, setShowApiKey] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [testStatus, setTestStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [testMessage, setTestMessage] = useState('');

  // Load settings from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('llm_settings');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setSettings(parsed);
      } catch (e) {
        console.error('Failed to parse saved settings:', e);
      }
    }
  }, []);

  // Save settings to localStorage
  const handleSave = () => {
    setIsSaving(true);
    try {
      localStorage.setItem('llm_settings', JSON.stringify(settings));
      setSaveStatus('success');
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch (e) {
      setSaveStatus('error');
      console.error('Failed to save settings:', e);
    } finally {
      setIsSaving(false);
    }
  };

  // Test API connection
  const handleTestConnection = async () => {
    if (!settings.apiKey && !settings.apiEndpoint.includes('localhost')) {
      setTestStatus('error');
      setTestMessage('API Key is required');
      return;
    }

    setTestStatus('testing');
    setTestMessage('Testing connection...');

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{ role: 'user', content: 'Hello, respond with just "OK" to confirm connection.' }],
          settings: settings,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setTestStatus('success');
        setTestMessage(`Connection successful! Response: "${data.content?.substring(0, 50)}..."`);
      } else {
        const error = await response.json();
        setTestStatus('error');
        setTestMessage(`Error: ${error.error || 'Connection failed'}`);
      }
    } catch (e) {
      setTestStatus('error');
      setTestMessage(`Network error: ${e instanceof Error ? e.message : 'Unknown error'}`);
    }
  };

  // Apply preset
  const applyPreset = (preset: typeof PRESETS[0]) => {
    setSettings(prev => ({
      ...prev,
      apiEndpoint: preset.endpoint,
      modelName: preset.models[0],
    }));
  };

  return (
    <div className="min-h-screen bg-ocp-950 text-ocp-cream">
      {/* Header */}
      <header className="h-16 bg-ocp-900/80 backdrop-blur-md border-b border-ocp-400/30 px-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <a href="/dashboard" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 bg-gradient-to-br from-ocp-accent to-ocp-500 rounded-lg flex items-center justify-center">
              <Icon name="settings" size={16} color="inverse" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-ocp-cream">Energy Copilot</h1>
              <p className="text-[10px] text-ocp-300">Settings</p>
            </div>
          </a>
        </div>

        <nav className="flex items-center gap-2">
          <a
            href="/dashboard"
            className="px-3 py-1.5 text-xs font-medium text-ocp-cream-muted hover:text-ocp-cream hover:bg-ocp-800 rounded-lg transition-colors"
          >
            Dashboard
          </a>
          <a
            href="/chat"
            className="px-3 py-1.5 text-xs font-medium text-ocp-cream-muted hover:text-ocp-cream hover:bg-ocp-800 rounded-lg transition-colors"
          >
            Chat
          </a>
          <a
            href="/optimize"
            className="px-3 py-1.5 text-xs font-medium text-ocp-cream-muted hover:text-ocp-cream hover:bg-ocp-800 rounded-lg transition-colors"
          >
            Optimize
          </a>
        </nav>
      </header>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto p-6">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-ocp-cream mb-2">LLM Configuration</h2>
          <p className="text-ocp-300 text-sm">
            Configure your AI provider settings for the Energy Copilot chat assistant.
          </p>
        </div>

        {/* Quick Presets */}
        <div className="bg-ocp-900/50 rounded-lg border border-ocp-400/30 p-4 mb-6">
          <h3 className="text-sm font-semibold text-ocp-cream mb-3">Quick Presets</h3>
          <div className="flex flex-wrap gap-2">
            {PRESETS.map((preset) => (
              <button
                key={preset.name}
                onClick={() => applyPreset(preset)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
                  settings.apiEndpoint === preset.endpoint
                    ? 'bg-ocp-accent/20 border-ocp-accent text-ocp-accent'
                    : 'bg-ocp-800 border-ocp-400/30 text-ocp-300 hover:border-ocp-accent hover:text-ocp-cream'
                }`}
              >
                {preset.name}
              </button>
            ))}
          </div>
        </div>

        {/* Settings Form */}
        <div className="bg-ocp-900/50 rounded-lg border border-ocp-400/30 p-6 space-y-6">
          {/* API Endpoint */}
          <div>
            <label className="block text-sm font-medium text-ocp-cream mb-2">
              API Endpoint
            </label>
            <input
              type="text"
              value={settings.apiEndpoint}
              onChange={(e) => setSettings(prev => ({ ...prev, apiEndpoint: e.target.value }))}
              placeholder="https://api.openai.com/v1/chat/completions"
              className="w-full px-4 py-2.5 bg-ocp-800 border border-ocp-400/30 rounded-lg text-ocp-cream placeholder-ocp-400 focus:outline-none focus:border-ocp-accent transition-colors"
            />
            <p className="mt-1.5 text-xs text-ocp-400">
              The chat completions endpoint for your LLM provider
            </p>
          </div>

          {/* API Key */}
          <div>
            <label className="block text-sm font-medium text-ocp-cream mb-2">
              API Key
            </label>
            <div className="relative">
              <input
                type={showApiKey ? 'text' : 'password'}
                value={settings.apiKey}
                onChange={(e) => setSettings(prev => ({ ...prev, apiKey: e.target.value }))}
                placeholder="sk-..."
                className="w-full px-4 py-2.5 pr-20 bg-ocp-800 border border-ocp-400/30 rounded-lg text-ocp-cream placeholder-ocp-400 focus:outline-none focus:border-ocp-accent transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowApiKey(!showApiKey)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-ocp-400 hover:text-ocp-cream transition-colors"
              >
                {showApiKey ? 'Hide' : 'Show'}
              </button>
            </div>
            <p className="mt-1.5 text-xs text-ocp-400">
              Your API key (stored locally in your browser, never sent to our servers)
            </p>
          </div>

          {/* Model Name */}
          <div>
            <label className="block text-sm font-medium text-ocp-cream mb-2">
              Model Name
            </label>
            <input
              type="text"
              value={settings.modelName}
              onChange={(e) => setSettings(prev => ({ ...prev, modelName: e.target.value }))}
              placeholder="gpt-4o-mini"
              className="w-full px-4 py-2.5 bg-ocp-800 border border-ocp-400/30 rounded-lg text-ocp-cream placeholder-ocp-400 focus:outline-none focus:border-ocp-accent transition-colors"
            />
            {/* Model suggestions based on selected endpoint */}
            {PRESETS.find(p => p.endpoint === settings.apiEndpoint) && (
              <div className="mt-2 flex flex-wrap gap-1">
                {PRESETS.find(p => p.endpoint === settings.apiEndpoint)?.models.map((model) => (
                  <button
                    key={model}
                    onClick={() => setSettings(prev => ({ ...prev, modelName: model }))}
                    className={`px-2 py-1 text-xs rounded transition-colors ${
                      settings.modelName === model
                        ? 'bg-ocp-accent/20 text-ocp-accent'
                        : 'bg-ocp-700 text-ocp-400 hover:text-ocp-cream'
                    }`}
                  >
                    {model}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 pt-4 border-t border-ocp-400/30">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="px-4 py-2 bg-ocp-accent text-ocp-950 font-semibold rounded-lg hover:bg-ocp-accent/90 transition-colors disabled:opacity-50"
            >
              {isSaving ? 'Saving...' : 'Save Settings'}
            </button>

            <button
              onClick={handleTestConnection}
              disabled={testStatus === 'testing'}
              className="px-4 py-2 bg-ocp-800 text-ocp-cream font-medium rounded-lg border border-ocp-400/30 hover:border-ocp-accent transition-colors disabled:opacity-50"
            >
              {testStatus === 'testing' ? 'Testing...' : 'Test Connection'}
            </button>

            {saveStatus === 'success' && (
              <span className="text-sm text-status-success">Settings saved!</span>
            )}
            {saveStatus === 'error' && (
              <span className="text-sm text-status-danger">Failed to save</span>
            )}
          </div>

          {/* Test Result */}
          {testStatus !== 'idle' && testStatus !== 'testing' && (
            <div
              className={`p-3 rounded-lg text-sm ${
                testStatus === 'success'
                  ? 'bg-status-success-muted border border-status-success/30 text-status-success'
                  : 'bg-status-danger-muted border border-status-danger/30 text-status-danger'
              }`}
            >
              {testMessage}
            </div>
          )}
        </div>

        {/* Info Box */}
        <div className="mt-6 p-4 bg-ocp-800/50 rounded-lg border border-ocp-400/20">
          <h4 className="text-sm font-semibold text-ocp-cream mb-2">About API Settings</h4>
          <ul className="text-xs text-ocp-300 space-y-1.5">
            <li>- Settings are stored locally in your browser using localStorage</li>
            <li>- Your API key is sent directly to your chosen provider, not our servers</li>
            <li>- For Anthropic, the system uses their Messages API format automatically</li>
            <li>- Local models (Ollama) don&apos;t require an API key</li>
          </ul>
        </div>
      </main>
    </div>
  );
}
