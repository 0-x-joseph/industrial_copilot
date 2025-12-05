# AgentSelector API Response Format Fix ✅

## Problem Identified

**Issue**: API route was returning wrapped object format that was incompatible with OpenCode SDK expectations.

### Original Response Format (INCORRECT ❌)
```json
{
  "agents": [
    { "id": "architect", "name": "Architect", ... },
    { "id": "engineer", "name": "Engineer", ... }
  ]
}
```

### Error Encountered
```
TypeError: agents.map is not a function
  at AgentSelector component (line 45)
```

**Root Cause**: The OpenCode SDK's `app.agents()` method expects a direct `Agent[]` array response, not a wrapped object with an `agents` property.

## Solution Implemented

### Corrected Response Format (CORRECT ✅)
```json
[
  { "id": "architect", "name": "Architect", ... },
  { "id": "engineer", "name": "Engineer", ... }
]
```

### Changes Made

#### File Modified: `src/app/api/agent/route.ts`

**Lines Changed**: 
- Line 26-115: Non-OK response handler (mock data fallback)
- Line 126-215: Error handler (mock data fallback)

**Key Changes**:
1. ✅ Changed from `NextResponse.json({ agents: [...] })` to `NextResponse.json([...])`
2. ✅ Updated Agent object structure to match OpenCode SDK expectations
3. ✅ Fixed field naming inconsistencies

## Agent Object Structure Updates

### Field Name Changes

| Old Field | New Field | Reason |
|-----------|-----------|---------|
| `isBuiltIn` | `builtIn` | Match OpenCode SDK Agent interface |
| `MODE` (uppercase) | `mode` (lowercase) | Consistent with SDK type definitions |
| `model.provider` | `model.providerID` | Match SDK ModelReference interface |
| `model.name` | `model.modelID` | Match SDK ModelReference interface |

### Permission Structure Enhancement

**Old Structure (Incomplete)**:
```typescript
permission: {
  edit: 'allow',
  bash: 'allow'
}
```

**New Structure (Complete)**:
```typescript
permission: {
  edit: 'allow' | 'deny' | 'ask',
  webfetch: 'allow' | 'deny' | 'ask',
  bash: {
    read: 'allow' | 'deny' | 'ask',
    write: 'allow' | 'deny' | 'ask'
  }
}
```

### Visual Enhancement

Added `color` field for agent visual indicators:
```typescript
color: '#A3B087'  // Sage green for Architect
color: '#435663'  // Blue-gray for Engineer
color: '#FFF8D4'  // Cream for Researcher
color: '#313647'  // Dark gray for QA Tester
```

## Complete Agent Interface

```typescript
interface Agent {
  id: string;
  name: string;
  description: string;
  mode: 'primary' | 'subagent';
  builtIn: boolean;
  color: string;
  permission: {
    edit: 'allow' | 'deny' | 'ask';
    webfetch: 'allow' | 'deny' | 'ask';
    bash: {
      read: 'allow' | 'deny' | 'ask';
      write: 'allow' | 'deny' | 'ask';
    };
  };
  model: {
    providerID: string;  // e.g., 'anthropic'
    modelID: string;     // e.g., 'claude-3-5-sonnet-20241022'
  };
  temperature: number;
  topP: number;
}
```

## Mock Agent Data

The API now returns 4 mock agents for development when OpenCode server is unavailable:

### 1. Architect
```json
{
  "id": "architect",
  "name": "Architect",
  "description": "System design and architecture planning specialist",
  "mode": "primary",
  "builtIn": true,
  "color": "#A3B087",
  "permission": {
    "edit": "allow",
    "webfetch": "allow",
    "bash": { "read": "allow", "write": "allow" }
  },
  "model": {
    "providerID": "anthropic",
    "modelID": "claude-3-5-sonnet-20241022"
  },
  "temperature": 0.7,
  "topP": 0.9
}
```

### 2. Engineer
```json
{
  "id": "engineer",
  "name": "Engineer",
  "description": "Code implementation and technical problem-solving expert",
  "mode": "primary",
  "builtIn": true,
  "color": "#435663",
  "permission": {
    "edit": "allow",
    "webfetch": "allow",
    "bash": { "read": "allow", "write": "allow" }
  },
  "model": {
    "providerID": "anthropic",
    "modelID": "claude-3-5-sonnet-20241022"
  },
  "temperature": 0.5,
  "topP": 0.85
}
```

### 3. Researcher
```json
{
  "id": "researcher",
  "name": "Researcher",
  "description": "Information gathering and analysis specialist",
  "mode": "subagent",
  "builtIn": true,
  "color": "#FFF8D4",
  "permission": {
    "edit": "deny",
    "webfetch": "allow",
    "bash": { "read": "allow", "write": "deny" }
  },
  "model": {
    "providerID": "anthropic",
    "modelID": "claude-3-5-sonnet-20241022"
  },
  "temperature": 0.6,
  "topP": 0.9
}
```

### 4. QA Tester
```json
{
  "id": "qa-tester",
  "name": "QA Tester",
  "description": "Quality assurance and testing automation expert",
  "mode": "subagent",
  "builtIn": true,
  "color": "#313647",
  "permission": {
    "edit": "allow",
    "webfetch": "deny",
    "bash": { "read": "allow", "write": "allow" }
  },
  "model": {
    "providerID": "anthropic",
    "modelID": "claude-3-5-sonnet-20241022"
  },
  "temperature": 0.4,
  "topP": 0.8
}
```

## Testing Results

### Test 1: API Endpoint Direct Call ✅
```bash
curl http://localhost:3000/agent
```

**Result**: Returns `Agent[]` array with 4 agents
**Status**: ✅ PASSED

### Test 2: AgentSelector Test Page ✅
**URL**: `http://localhost:3000/test/agent-selector`

**Results**:
- ✅ Dropdown opens without errors
- ✅ All 4 agents display correctly
- ✅ Agent cards show all information (name, description, badges, permissions, model)
- ✅ Selection updates UI state
- ✅ "Current State" panel shows full agent details
- ✅ Selection history tracking works (2 selections recorded)
- ✅ No console errors

**Status**: ✅ PASSED

### Test 3: Chat UI Integration ✅
**URL**: `http://localhost:3000/test/chat`

**Results**:
- ✅ AgentSelector integrated in chat header
- ✅ Dropdown displays all agents with full details
- ✅ Selection works correctly
- ✅ No TypeScript errors
- ✅ No runtime errors

**Status**: ✅ PASSED

## OpenCode SDK Integration

### SDK Method Call
```typescript
import { opcClient } from '@/lib/opencode-client';

// Fetch agents
const agents = await opcClient.app.agents();
// Returns: Agent[] directly
```

### Component Usage
```typescript
// AgentSelector.tsx
useEffect(() => {
  const fetchAgents = async () => {
    try {
      setIsLoading(true);
      const response = await opcClient.app.agents();
      setAgents(response);  // response is Agent[], not { agents: Agent[] }
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching agents:', error);
      setIsLoading(false);
    }
  };

  fetchAgents();
}, []);
```

## API Route Behavior

### Scenario 1: OpenCode Server Running
1. Request sent to `http://localhost:4096/agent`
2. Response proxied directly to client
3. Returns whatever OpenCode server returns

### Scenario 2: OpenCode Server Not Running
1. Request to OpenCode server fails
2. Fallback to mock data triggered
3. Returns mock `Agent[]` array with 4 agents
4. Console logs error for debugging

### Scenario 3: Error During Fetch
1. Exception caught in try-catch
2. Fallback to mock data triggered
3. Returns mock `Agent[]` array
4. Console logs error details

## Middleware Configuration

**File**: `src/middleware.ts`

**URL Rewriting**:
```typescript
// Rewrites /agent → /api/agent
if (pathname === '/agent') {
  return NextResponse.rewrite(new URL('/api/agent', request.url));
}
```

**Purpose**: Allows OpenCode SDK to call `/agent` endpoint which is rewritten to Next.js API route at `/api/agent`

## Files Modified

### Modified Files
- ✅ `src/app/api/agent/route.ts` (218 lines)
  - Fixed response format from wrapped object to array
  - Updated agent object structure
  - Enhanced permission structure
  - Added color field
  - Fixed field naming consistency

### Related Files (No Changes Needed)
- ✅ `src/components/chat/AgentSelector.tsx` - Works with corrected format
- ✅ `src/types/opencode.ts` - Agent interface already correct
- ✅ `src/lib/opencode-client.ts` - OpenCode SDK client ready
- ✅ `src/middleware.ts` - URL rewriting already configured

## Technical Learnings

### Key Insights
1. **SDK Expectations**: OpenCode SDK's `app.agents()` expects direct array, not wrapped object
2. **Type Safety**: TypeScript interfaces must match API response structure exactly
3. **Field Naming**: Consistency in field names critical (camelCase, not mixed case)
4. **Permission Structure**: Granular permissions require nested object structure
5. **Fallback Strategy**: Mock data serves as development environment safeguard

### Best Practices Implemented
1. ✅ Return format matches SDK expectations exactly
2. ✅ Complete permission structure for all agents
3. ✅ Visual indicators (color) for better UX
4. ✅ Proper error handling with fallback
5. ✅ Console logging for debugging
6. ✅ Type-safe mock data

## Migration Guide

If you have existing code expecting the old format:

### Old Code (Won't Work ❌)
```typescript
const response = await opcClient.app.agents();
const agents = response.agents;  // Error: agents is undefined
```

### New Code (Correct ✅)
```typescript
const agents = await opcClient.app.agents();
// agents is already Agent[], no need to unwrap
```

## Future Considerations

### When OpenCode Server is Available
1. Remove mock data or keep as fallback
2. Test with real OpenCode server response
3. Verify response format matches
4. Update mock data if real structure differs

### Production Deployment
1. Ensure OpenCode server is running and accessible
2. Configure `OPENCODE_API_URL` environment variable
3. Test API route with production server
4. Monitor for any format mismatches

## Conclusion

The API response format has been successfully fixed to match OpenCode SDK expectations. All tests pass, and the AgentSelector component now works correctly with the API.

**Status**: ✅ **FIXED AND VERIFIED**

---

**Fix Date**: December 5, 2025  
**Component**: Agent API Route  
**Issue**: Response format mismatch  
**Solution**: Return `Agent[]` directly instead of wrapped object  
**Test Status**: ✅ All Tests Passing  
**Ready for**: Commit and Deployment
