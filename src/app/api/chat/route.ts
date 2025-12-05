import { NextRequest, NextResponse } from 'next/server';

/**
 * Chat API Route
 * 
 * Proxies chat requests to the configured LLM provider.
 * Supports OpenAI-compatible APIs and Anthropic.
 */

interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface LLMSettings {
  apiEndpoint: string;
  apiKey: string;
  modelName: string;
}

interface ChatRequest {
  messages: ChatMessage[];
  settings: LLMSettings;
}

export async function POST(request: NextRequest) {
  try {
    const body: ChatRequest = await request.json();
    const { messages, settings } = body;

    if (!settings?.apiEndpoint) {
      return NextResponse.json(
        { error: 'API endpoint not configured' },
        { status: 400 }
      );
    }

    // Detect provider type from endpoint
    const isAnthropic = settings.apiEndpoint.includes('anthropic.com');
    const isLocal = settings.apiEndpoint.includes('localhost') || settings.apiEndpoint.includes('127.0.0.1');

    // Build headers
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (isAnthropic) {
      headers['x-api-key'] = settings.apiKey;
      headers['anthropic-version'] = '2023-06-01';
    } else if (settings.apiKey && !isLocal) {
      headers['Authorization'] = `Bearer ${settings.apiKey}`;
    }

    // Build request body based on provider
    let requestBody: any;

    if (isAnthropic) {
      // Anthropic Messages API format
      const systemMessage = messages.find(m => m.role === 'system');
      const conversationMessages = messages.filter(m => m.role !== 'system');

      requestBody = {
        model: settings.modelName,
        max_tokens: 4096,
        system: systemMessage?.content || '',
        messages: conversationMessages.map(m => ({
          role: m.role,
          content: m.content,
        })),
      };
    } else {
      // OpenAI-compatible format (works for OpenAI, Groq, OpenRouter, Ollama, etc.)
      requestBody = {
        model: settings.modelName,
        messages: messages.map(m => ({
          role: m.role,
          content: m.content,
        })),
        max_tokens: 4096,
        temperature: 0.7,
      };
    }

    // Make request to LLM provider
    const response = await fetch(settings.apiEndpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      let errorMessage = `API error: ${response.status}`;
      
      try {
        const errorJson = JSON.parse(errorText);
        errorMessage = errorJson.error?.message || errorJson.message || errorMessage;
      } catch {
        errorMessage = errorText || errorMessage;
      }

      return NextResponse.json(
        { error: errorMessage },
        { status: response.status }
      );
    }

    const data = await response.json();

    // Extract content based on provider response format
    let content: string;

    if (isAnthropic) {
      // Anthropic response format
      content = data.content?.[0]?.text || '';
    } else {
      // OpenAI-compatible response format
      content = data.choices?.[0]?.message?.content || '';
    }

    return NextResponse.json({
      content,
      model: data.model || settings.modelName,
      usage: data.usage,
    });
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}
