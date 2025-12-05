import type { Session } from "@opencode-ai/sdk/client";

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

// Model and provider types
export interface ModelInfo {
  providerID: string;
  modelID: string;
  displayName: string;
}

export interface Provider {
  id: string;
  name: string;
  models: ModelInfo[];
}

export interface ConfigInfo {
  model?: {
    providerID: string;
    modelID: string;
  };
  providers?: Provider[];
  defaults?: { [key: string]: string };
  tokensUsed?: number;
  tokensLimit?: number;
  mcpServers?: MCPServer[];
}

// MCP Server and Command types
export interface MCPServer {
  name: string;
  description?: string;
  commands?: MCPCommand[];
  tools?: MCPTool[];
}

export interface MCPCommand {
  name: string;
  description?: string;
  schema?: {
    input?: any;
    output?: any;
  };
  category?: string;
  icon?: string;
}

export interface MCPTool {
  name: string;
  description?: string;
  inputSchema?: any;
}

// Command execution types
export interface CommandExecutionRequest {
  command: string;
  args?: Record<string, any>;
  sessionId?: string;
}

export interface CommandExecutionResult {
  success: boolean;
  output?: string;
  error?: string;
  metadata?: Record<string, any>;
}

// Agent types from OpenCode SDK
export interface Agent {
  name: string;
  description?: string;
  mode: 'subagent' | 'primary' | 'all';
  builtIn: boolean;
  topP?: number;
  temperature?: number;
  color?: string;
  permission: {
    edit: 'ask' | 'allow' | 'deny';
    bash: {
      [key: string]: 'ask' | 'allow' | 'deny';
    };
    webfetch?: 'ask' | 'allow' | 'deny';
    doom_loop?: 'ask' | 'allow' | 'deny';
    external_directory?: 'ask' | 'allow' | 'deny';
  };
  model?: {
    modelID: string;
    providerID: string;
  };
}
