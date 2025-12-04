# Interactive Dashboard Architecture
## LLM-Powered Dashboard with Integrated ML Capabilities

### Executive Summary

This document outlines the architecture for an **LLM-powered dashboard with integrated ML capabilities**. The platform allows users to create, manage, and share data visualizations while interacting with a chat interface powered by the LLM.

**Core Capabilities:**
- **Interactive Dashboard**: Central showcase for all user-created content with multiple custom tabs
- **Dual Chart Addition**: Charts can be added via LLM chat prompts OR manual selection from workspace
- **Time Frame Controls**: Users can select time frames or data windows for each chart
- **Sharing System**: Share individual charts or entire tabs seamlessly
- **Energy Optimization ML**: Integrated ML model with manual/automatic triggering
- **Context-Aware Notifications**: Smart notifications based on ML outputs and chat interactions

### System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                    OCP LLM-Powered Dashboard                    │
├─────────────────┬─────────────────────┬─────────────────────────┤
│  Chat Interface │      Dashboard      │       Workspace         │
│ (OpenCode SDK)  │    (Plotly.js)      │   (Chart Library)       │
│                 │                     │                         │
│ • Agents        │ • Custom Tabs       │ • Manual Selection      │
│ • Sessions      │ • Chart Placements  │ • Chart Storage         │
│ • Commands      │ • Time Windows      │ • Templates             │
│ • Permissions   │ • Sharing           │ • Datasets              │
└─────────────────┴─────────────────────┴─────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Backend Services (FastAPI)                   │
├─────────────────┬─────────────────────┬─────────────────────────┤
│   ML Services   │    Chart APIs       │    Real-Time Layer      │
│                 │                     │                         │
│ • Energy Model  │ • Plotly.py Gen     │ • WebSocket Updates     │
│ • Auto Trigger  │ • Chart Storage     │ • Live Notifications    │
│ • Manual Exec   │ • Data Processing   │ • Multi-User Sync       │
│ • Notifications │ • Export Services   │ • Permission Controls   │
└─────────────────┴─────────────────────┴─────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│              Database Layer (PostgreSQL + Supabase)             │
│ • User Authentication & Permissions (RLS)                       │
│ • Dashboard Tabs, Chart Placements, Workspace Items             │
│ • Chat Sessions, Agents, ML Model States                        │
│ • Energy Data, Optimization Results, Notification History       │
└─────────────────────────────────────────────────────────────────┘
```

## Core Components

### 1. Dashboard System Architecture

#### Dashboard Structure
- **Dashboard Tabs**: User-created containers for related charts
- **Chart Windows**: Predefined slots within tabs that can hold charts
- **Chart Placements**: Individual chart instances with position and configuration
- **Layout Manager**: Responsive grid system for chart organization

#### Database Schema Extensions
```sql
-- Dashboard Tabs
CREATE TABLE dashboard_tabs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    layout_config JSONB DEFAULT '{}', -- Grid configuration
    is_default BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Chart Windows (predefined slots)
CREATE TABLE chart_windows (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tab_id UUID NOT NULL REFERENCES dashboard_tabs(id) ON DELETE CASCADE,
    window_name VARCHAR(100) NOT NULL, -- "top-left", "main", "sidebar", etc.
    position_x INTEGER NOT NULL,
    position_y INTEGER NOT NULL,
    width INTEGER NOT NULL DEFAULT 6, -- Grid units (1-12)
    height INTEGER NOT NULL DEFAULT 4, -- Grid units
    is_resizable BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Chart Placements (actual charts in windows)
CREATE TABLE chart_placements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    window_id UUID NOT NULL REFERENCES chart_windows(id) ON DELETE CASCADE,
    workspace_item_id UUID REFERENCES workspace_items(id) ON DELETE SET NULL,
    chart_config JSONB NOT NULL, -- Plotly chart configuration
    chart_data JSONB, -- Chart data if stored locally
    data_source_config JSONB, -- External data source configuration
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    auto_refresh_interval INTEGER, -- Seconds, null for manual refresh
    created_by_llm BOOLEAN DEFAULT false, -- Whether chart was created by LLM
    llm_prompt TEXT, -- Original prompt if created by LLM
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 2. LLM Integration Architecture

#### OpenCode SDK Integration
```typescript
// Chat interface integration
interface ChatDashboardBridge {
  // LLM can identify available dashboard windows
  getAvailableWindows(tabId?: string): Promise<ChartWindow[]>;
  
  // LLM can place charts in specific windows
  placeChartInWindow(windowId: string, chartConfig: PlotlyConfig): Promise<ChartPlacement>;
  
  // LLM can modify existing charts
  modifyChart(placementId: string, modifications: PlotlyUpdate): Promise<ChartPlacement>;
  
  // LLM can create new dashboard tabs
  createDashboardTab(name: string, layout: LayoutConfig): Promise<DashboardTab>;
}
```

#### Chart Generation Pipeline
```python
# Backend chart generation using Plotly.py
class ChartGenerator:
    def __init__(self, opencode_client):
        self.opencode = opencode_client
        
    async def generate_chart_from_prompt(
        self, 
        prompt: str, 
        data_context: dict,
        target_window: str = None
    ) -> dict:
        """Generate Plotly chart from natural language prompt"""
        
        # 1. LLM analyzes prompt and data context
        chart_spec = await self.opencode.analyze_chart_request(
            prompt=prompt,
            available_data=data_context,
            target_window_constraints=target_window
        )
        
        # 2. Generate Plotly.py code
        plotly_code = await self.generate_plotly_code(chart_spec)
        
        # 3. Execute code safely and get chart JSON
        chart_config = await self.execute_chart_generation(plotly_code, data_context)
        
        # 4. Return chart configuration for Plotly.js
        return {
            'config': chart_config,
            'generated_code': plotly_code,
            'source_prompt': prompt,
            'data_sources': chart_spec.get('data_sources', [])
        }
```

### 3. Real-Time Dashboard Interface

#### Plotly.js Integration
```typescript
// Frontend dashboard component
interface DashboardChart {
  id: string;
  windowId: string;
  plotlyConfig: any; // Plotly.js configuration
  isInteractive: boolean;
  allowRealTimeModification: boolean;
}

class DashboardManager {
  // Real-time chart updates from LLM
  async handleLLMChartPlacement(placement: ChartPlacement) {
    const targetWindow = this.getWindow(placement.window_id);
    
    // Create Plotly chart in specified window
    await Plotly.newPlot(
      targetWindow.element,
      placement.chart_config.data,
      placement.chart_config.layout,
      placement.chart_config.config
    );
    
    // Enable real-time modifications
    this.enableChartInteractivity(targetWindow, placement);
  }
  
  // User modifications sync back to backend
  async handleUserChartModification(placementId: string, changes: any) {
    // Update chart locally
    await Plotly.relayout(this.getChartElement(placementId), changes);
    
    // Sync changes to backend
    await this.api.updateChartPlacement(placementId, {
      chart_config: this.getUpdatedConfig(placementId)
    });
  }
}
```

### 4. Chat-Dashboard Communication

#### Bidirectional State Synchronization
```typescript
// WebSocket connection for real-time updates
class ChatDashboardSync {
  private websocket: WebSocket;
  
  // Chat sends dashboard commands
  async sendDashboardCommand(command: DashboardCommand) {
    this.websocket.send(JSON.stringify({
      type: 'dashboard_command',
      command: command.type, // 'place_chart', 'modify_chart', 'create_tab'
      target: command.target, // window_id, tab_id, etc.
      payload: command.payload
    }));
  }
  
  // Dashboard sends status updates to chat
  async sendDashboardStatus(status: DashboardStatus) {
    this.websocket.send(JSON.stringify({
      type: 'dashboard_status',
      action: status.action, // 'chart_placed', 'chart_modified', 'error'
      result: status.result
    }));
  }
}
```

#### LLM Context Management
```typescript
// Context bridge for LLM dashboard awareness
interface DashboardContext {
  // Current dashboard state accessible to LLM
  getCurrentDashboardState(): {
    activeTabs: DashboardTab[];
    availableWindows: ChartWindow[];
    existingCharts: ChartPlacement[];
    userPreferences: UserDashboardPrefs;
  };
  
  // LLM can reference specific dashboard elements
  resolveDashboardReference(reference: string): {
    type: 'tab' | 'window' | 'chart';
    id: string;
    currentState: any;
  };
}
```

## User Experience Flow

### 1. Chart Creation via Chat
```
User: "Create a bar chart of Q3 sales data and put it in the main dashboard window"
                                   ↓
LLM: 1. Identifies available dashboard windows
     2. Generates Plotly.py code for bar chart
     3. Executes chart generation with Q3 sales data
     4. Places chart in specified "main" window
     5. Confirms placement in chat
                                   ↓
Dashboard: Chart appears in real-time in main window
User: Can immediately interact with chart (zoom, hover, modify)
```

### 2. Chart Modification Flow
```
User: "Make the bars in the main chart blue and add a trend line"
                                   ↓
LLM: 1. Identifies chart in main window
     2. Generates modification commands
     3. Updates chart configuration
     4. Applies changes via Plotly.js
                                   ↓
Dashboard: Chart updates in real-time with new styling and trend line
```

### 3. Dashboard Management
```
User: "Create a new dashboard tab called 'Energy Analytics' with 4 chart windows"
                                   ↓
LLM: 1. Creates new dashboard tab
     2. Sets up 4 predefined chart windows (2x2 grid)
     3. Navigates user to new tab
                                   ↓
Dashboard: New tab appears with empty chart windows ready for content
```

## Technical Implementation Details

### 1. Chart Window Management
- **Flexible Grid System**: 12-column responsive grid for chart placement
- **Window Types**: Predefined (main, sidebar, top) and custom user-defined
- **Resize Handling**: Real-time chart reflow when windows are resized
- **Collision Detection**: Prevent chart overlap in manual placement

### 2. Data Integration
- **Live Data Sources**: Support for real-time data feeds
- **Static Datasets**: Charts based on uploaded workspace datasets
- **API Integrations**: External data source connections
- **Data Caching**: Intelligent caching for performance optimization

### 3. Chart Interaction Features
- **Plotly.js Controls**: Native zoom, pan, select, and hover interactions
- **Custom Modification Panel**: UI for common chart adjustments
- **Version History**: Track chart modifications over time
- **Export Capabilities**: PNG, SVG, PDF, and interactive HTML exports

### 4. Performance Optimization
- **Lazy Loading**: Load charts only when tabs are active
- **Chart Virtualization**: Efficiently handle large datasets
- **WebSocket Optimization**: Minimize real-time update overhead
- **Caching Strategy**: Smart caching of chart configurations and data

## Security and Permissions

### 1. Dashboard Access Control
- **Tab-level Permissions**: Control who can view/edit specific tabs
- **Chart Modification Rights**: Fine-grained control over chart editing
- **LLM Action Limits**: Prevent unauthorized LLM dashboard modifications
- **Data Source Security**: Secure handling of sensitive data in charts

### 2. Code Execution Safety
- **Sandboxed Plotly.py Execution**: Secure code generation and execution
- **Input Validation**: Strict validation of all LLM-generated code
- **Resource Limits**: Prevent resource exhaustion from chart generation
- **Audit Trail**: Log all LLM actions for security review

## Future Enhancements

### 1. Advanced LLM Capabilities
- **Chart Recommendations**: LLM suggests optimal chart types for data
- **Data Analysis**: Automated insights and annotations on charts
- **Dashboard Optimization**: LLM suggests layout improvements
- **Cross-Chart Interactions**: Smart linking between related charts

### 2. Collaboration Features
- **Multi-User Editing**: Real-time collaborative dashboard editing
- **Comment System**: Contextual comments on charts and dashboards
- **Version Control**: Git-like versioning for dashboard states
- **Change Notifications**: Real-time updates when others modify dashboards

### 3. Advanced Integrations
- **External Dashboard Tools**: Import/export to Tableau, Power BI, etc.
- **API Webhooks**: Trigger dashboard updates from external systems
- **Mobile Optimization**: Responsive design for mobile dashboard viewing
- **Embedded Dashboards**: Shareable embedded dashboard components

## Implementation Roadmap

### Phase 1: Core Infrastructure (Weeks 1-2)
- [ ] Database schema implementation
- [ ] Basic dashboard tab and window management
- [ ] Plotly.js integration for chart rendering
- [ ] WebSocket setup for real-time communication

### Phase 2: LLM Integration (Weeks 3-4)
- [ ] OpenCode SDK integration
- [ ] Chart generation pipeline with Plotly.py
- [ ] Chat-dashboard command processing
- [ ] Basic chart placement functionality

### Phase 3: Interactive Features (Weeks 5-6)
- [ ] Real-time chart modification interface
- [ ] User-driven chart editing controls
- [ ] Chart export and sharing capabilities
- [ ] Dashboard layout customization

### Phase 4: Advanced Features (Weeks 7-8)
- [ ] Complex chart interactions and linking
- [ ] Performance optimization
- [ ] Advanced security implementation
- [ ] Comprehensive testing and bug fixes

---

*This architecture document serves as the foundation for implementing an interactive, LLM-powered dashboard system that seamlessly integrates chat-based commands with real-time chart management and user interactions.*