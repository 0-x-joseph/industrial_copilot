# OpenCode SDK Integration Implementation Guide

## Overview
This guide provides step-by-step instructions to integrate the OpenCode SDK with your OCP chat interface, connecting to your remote OpenCode server running on Ubuntu PC via Cloudflare tunnel.

## Connection Details
- **OpenCode Server URL**: `https://northeast-duke-ide-zoloft.trycloudflare.com/`
- **Architecture**: NixOS PC (frontend) → Cloudflare Tunnel → Ubuntu PC (OpenCode server)
- **Integration Target**: `src/components/chat/ChatUIDemo.tsx`

---

## Phase 1: SDK Setup & Configuration

### Step 1.1: Install OpenCode SDK
```bash
cd /home/_hippo/dev/ocp
npm install @opencode-ai/sdk
```

### Step 1.2: Create OpenCode Client Configuration
Create new file: `src/lib/opencode-client.ts`

```typescript
import { createOpencodeClient } from "@opencode-ai/sdk";

// OpenCode client configuration for remote server
export const createOCPClient = () => {
  return createOpencodeClient({
    baseUrl: "https://northeast-duke-ide-zoloft.trycloudflare.com",
    throwOnError: false,
    timeout: 30000,
  });
};

// Global client instance
export const opcClient = createOCPClient();
```

### Step 1.3: Create TypeScript Types
Create new file: `src/types/opencode.ts`

```typescript
import type { Session, Message as OpenCodeMessage, Part } from "@opencode-ai/sdk";

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
```

---

## Phase 2: Replace Simulated Logic

### Step 2.1: Remove Simulated Response Logic
**File**: `src/components/chat/ChatUIDemo.tsx`

**Remove lines 692-716** (the entire useEffect with simulated typing):
```typescript
// DELETE THIS ENTIRE BLOCK:
useEffect(() => {
  if (chatState.isTyping) {
    const timer = setTimeout(() => {
      // ... entire simulated response logic
    }, 3000);
    return () => clearTimeout(timer);
  }
}, [chatState.isTyping]);
```

### Step 2.2: Update Imports
Add to top of `ChatUIDemo.tsx`:
```typescript
import { opcClient } from '@/lib/opencode-client';
import type { OCPMessage, OCPSession } from '@/types/opencode';
```

### Step 2.3: Update ChatState Interface
Replace the existing ChatState:
```typescript
interface ChatState {
  currentSession: OCPSession | null;
  messages: OCPMessage[];
  isTyping: boolean;
  currentInput: string;
  connectionStatus: 'connected' | 'connecting' | 'disconnected';
}
```

---

## Phase 3: Implement Real OpenCode Integration

### Step 3.1: Initialize Real Chat State
Replace the initial chatState in `ChatUIDemo.tsx`:

```typescript
const [chatState, setChatState] = useState<ChatState>({
  currentSession: null,
  messages: [],
  isTyping: false,
  currentInput: '',
  connectionStatus: 'connecting'
});
```

### Step 3.2: Create Session Management Functions
Add these functions to `ChatUIDemo.tsx`:

```typescript
// Create new OpenCode session
const createNewSession = async (): Promise<OCPSession | null> => {
  try {
    const session = await opcClient.session.create({
      body: { title: `OCP Chat ${new Date().toLocaleString()}` }
    });
    
    if (session.data) {
      return {
        ...session.data,
        title: session.data.title || 'New Chat',
        lastActivity: new Date()
      };
    }
  } catch (error) {
    console.error('Failed to create session:', error);
    setChatState(prev => ({ ...prev, connectionStatus: 'disconnected' }));
  }
  return null;
};

// Load session messages
const loadSessionMessages = async (sessionId: string): Promise<OCPMessage[]> => {
  try {
    const response = await opcClient.session.messages({
      path: { id: sessionId }
    });
    
    if (response.data) {
      return response.data.map((msg, index) => ({
        id: `${sessionId}-${index}`,
        type: msg.info.role === 'user' ? 'user' : 'assistant',
        content: msg.parts.map(part => part.type === 'text' ? part.text : '').join(''),
        timestamp: new Date(msg.info.timestamp || Date.now()),
        status: 'sent',
        metadata: {
          sessionId: sessionId,
          model: msg.info.model || 'OpenCode'
        }
      }));
    }
  } catch (error) {
    console.error('Failed to load messages:', error);
  }
  return [];
};
```

### Step 3.3: Replace handleSendMessage Function
Replace the existing `handleSendMessage` function:

```typescript
const handleSendMessage = async () => {
  if (!chatState.currentInput.trim()) return;
  
  let session = chatState.currentSession;
  
  // Create session if none exists
  if (!session) {
    session = await createNewSession();
    if (!session) {
      alert('Failed to create chat session. Please check your connection.');
      return;
    }
  }

  const userMessage: OCPMessage = {
    id: `${Date.now()}-user`,
    type: 'user',
    content: chatState.currentInput,
    timestamp: new Date(),
    status: 'sending',
    metadata: { sessionId: session.id }
  };

  // Add user message immediately
  setChatState(prev => ({
    ...prev,
    currentSession: session,
    messages: [...prev.messages, userMessage],
    currentInput: '',
    isTyping: true
  }));

  try {
    // Send prompt to OpenCode
    const response = await opcClient.session.prompt({
      path: { id: session.id },
      body: {
        model: { 
          providerID: "anthropic", 
          modelID: "claude-3-5-sonnet-20241022" 
        },
        parts: [{ 
          type: "text", 
          text: chatState.currentInput 
        }],
      },
    });

    // Mark user message as sent
    setChatState(prev => ({
      ...prev,
      messages: prev.messages.map(msg => 
        msg.id === userMessage.id ? { ...msg, status: 'sent' } : msg
      ),
      isTyping: false
    }));

    // Add assistant response
    if (response.data) {
      const assistantMessage: OCPMessage = {
        id: `${Date.now()}-assistant`,
        type: 'assistant',
        content: response.data.parts.map(part => 
          part.type === 'text' ? part.text : ''
        ).join(''),
        timestamp: new Date(),
        status: 'sent',
        metadata: {
          sessionId: session.id,
          model: response.data.info.model || 'OpenCode',
          tokens: response.data.info.usage?.total_tokens
        }
      };

      setChatState(prev => ({
        ...prev,
        messages: [...prev.messages, assistantMessage]
      }));
    }

  } catch (error) {
    console.error('Failed to send message:', error);
    
    // Mark user message as failed
    setChatState(prev => ({
      ...prev,
      messages: prev.messages.map(msg => 
        msg.id === userMessage.id ? { ...msg, status: 'failed' } : msg
      ),
      isTyping: false,
      connectionStatus: 'disconnected'
    }));
  }
};
```

### Step 3.4: Update handleNewChat Function
Replace the existing `handleNewChat` function:

```typescript
const handleNewChat = async () => {
  const newSession = await createNewSession();
  if (newSession) {
    setChatState({
      currentSession: newSession,
      messages: [{
        id: '1',
        type: 'system',
        content: 'Welcome to OCP Chat! I\'m your OpenCode AI assistant ready to help with data analysis, energy optimization, and dashboard insights.',
        timestamp: new Date(),
        metadata: { sessionId: newSession.id }
      }],
      isTyping: false,
      currentInput: '',
      connectionStatus: 'connected'
    });
  }
};
```

---

## Phase 4: Connection Testing & Validation

### Step 4.1: Add Connection Status Indicator
Add to the ChatHeader component:

```typescript
// Add connection status to header
<div className="flex items-center gap-2">
  <div className={`w-2 h-2 rounded-full ${
    connectionStatus === 'connected' ? 'bg-green-500' : 
    connectionStatus === 'connecting' ? 'bg-yellow-500 animate-pulse' : 
    'bg-red-500'
  }`} />
  <span className="text-xs text-[#FFF8D4]">
    {connectionStatus === 'connected' ? 'Connected' : 
     connectionStatus === 'connecting' ? 'Connecting...' : 
     'Disconnected'}
  </span>
</div>
```

### Step 4.2: Test Connection on Component Mount
Add useEffect to test connection:

```typescript
useEffect(() => {
  const testConnection = async () => {
    try {
      setChatState(prev => ({ ...prev, connectionStatus: 'connecting' }));
      
      // Test connection to OpenCode server
      const config = await opcClient.config.get();
      
      if (config.data) {
        setChatState(prev => ({ ...prev, connectionStatus: 'connected' }));
        // Auto-create first session
        await handleNewChat();
      }
    } catch (error) {
      console.error('Connection failed:', error);
      setChatState(prev => ({ ...prev, connectionStatus: 'disconnected' }));
    }
  };

  testConnection();
}, []);
```

---

## Phase 5: Implementation Checklist

### ✅ Pre-Implementation
- [ ] Backup current `ChatUIDemo.tsx`
- [ ] Ensure OpenCode server is running on Ubuntu PC
- [ ] Verify tunnel URL is accessible: `https://northeast-duke-ide-zoloft.trycloudflare.com/`

### ✅ Implementation Steps
- [ ] Install OpenCode SDK: `npm install @opencode-ai/sdk`
- [ ] Create `src/lib/opencode-client.ts`
- [ ] Create `src/types/opencode.ts`
- [ ] Update `ChatUIDemo.tsx` imports
- [ ] Remove simulated logic (lines 692-716)
- [ ] Update ChatState interface
- [ ] Add session management functions
- [ ] Replace `handleSendMessage` function
- [ ] Update `handleNewChat` function
- [ ] Add connection status indicator
- [ ] Test connection on mount

### ✅ Testing & Validation
- [ ] Verify connection status shows "Connected"
- [ ] Test new session creation
- [ ] Send test message and verify real response
- [ ] Test error handling (disconnect tunnel temporarily)
- [ ] Verify message persistence across page reloads
- [ ] Test mobile responsiveness

---

## Phase 6: Advanced Features (Future Implementation)

### Context Panel Integration
- Connect file uploads to `opcClient.file` APIs
- Implement agent switching with `opcClient.app.agents()`
- Add command execution support

### Real-time Event Streaming
- Implement `opcClient.event.subscribe()` for live typing indicators
- Add streaming response support for longer messages

### Session Management UI
- Add session history sidebar
- Implement session switching and deletion
- Add session sharing capabilities

---

## Troubleshooting

### Connection Issues
1. **Verify tunnel URL**: Test `https://northeast-duke-ide-zoloft.trycloudflare.com/` in browser
2. **Check CORS**: Ensure OpenCode server allows cross-origin requests
3. **Network timeout**: Increase timeout in client configuration

### API Errors
1. **Check server logs** on Ubuntu PC
2. **Verify model availability**: Ensure Claude model is configured
3. **Authentication issues**: Check if API keys are properly set

### Development Issues
1. **TypeScript errors**: Ensure all imports are correct
2. **Build failures**: Clear `node_modules` and reinstall
3. **Hot reload issues**: Restart development server

---

## Success Metrics

After implementation, you should have:
- ✅ Real OpenCode AI responses instead of simulated ones
- ✅ Persistent chat sessions across page reloads
- ✅ Connection status indicators
- ✅ Error handling for network issues
- ✅ Full integration with remote OpenCode server
- ✅ Maintained all existing UI/UX functionality

---

**Ready to implement?** Follow the phases in order, and your chat interface will be fully integrated with OpenCode AI!