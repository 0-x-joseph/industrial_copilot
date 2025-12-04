import type { Session, Message as OpenCodeMessage, Part } from "@opencode-ai/sdk/client";

// Extended types for OCP integration
export interface OCPSession extends Session {
  title: string;
  lastActivity?: Date;
}

export interface OCPMessage {
  id: string;
  type: 'user' | 'assistant' | 'system' | 'error';
  content: string;
  timestamp: Date;
  status?: 'sending' | 'sent' | 'failed';
  metadata?: {
    tokens?: number;
    model?: string;
    hasCode?: boolean;
    sessionId?: string;
  };
}

export interface ChatSession {
  session: OCPSession;
  messages: OCPMessage[];
}