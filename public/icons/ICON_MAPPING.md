# 🎨 OCP Dashboard Icon Mapping & Color System

## 🎯 Color Palette Integration
- **#313647** (Deep Navy) - Primary headers, navigation, important text
- **#435663** (Medium Blue-Grey) - Secondary elements, borders, muted text  
- **#A3B087** (Sage Green) - Accents, active states, success indicators
- **#FFF8D4** (Warm Cream) - Backgrounds, highlights, soft areas

## 📐 Icon Mapping for Web Chat UI Specification

### Header Bar Icons
| UI Element | Current Icon | Directory | Color | Usage |
|------------|--------------|-----------|-------|--------|
| ☰ Hamburger Menu | `menu.svg` | `/ui/` | `#313647` | Main navigation toggle |
| 🤖 Agent Dropdown | `bot.svg` | `/agents/` | `#435663` | Agent selector |  
| 🧠 Model Dropdown | `settings.svg` | `/ui/` | `#435663` | Model selector |
| ⚙️ Settings | `settings.svg` | `/ui/` | `#435663` | Global settings |

### Context Bar Icons  
| UI Element | Current Icon | Directory | Color | Usage |
|------------|--------------|-----------|-------|--------|
| 📁 Files Dropdown | `file-plus.svg` | `/files/` | `#435663` | File context selector |
| 📋 Commands Dropdown | `commands.svg` | `/commands/` | `#435663` | Command context selector |
| 📊 Dashboard Tab | `panel-right.svg` | `/dashboard/` | `#A3B087` (active) | Tab selector |
| 🗂️ Workspace | `three-line-open.svg` | `/ui/` | `#435663` | Workspace selector |

### Sidebar Icons
| UI Element | Current Icon | Recommended Color | Usage |
|------------|--------------|-------------------|--------|
| + New Chat | `plus.svg` | `#A3B087` | Create new conversation |
| Recent Chats | `dot.svg` | `#435663` | Chat indicators |
| Chat Actions | `ellipsis.svg` | `#435663` | More options |

### Message Area Icons
| UI Element | Current Icon | Recommended Color | Usage |
|------------|--------------|-------------------|--------|
| 💬 Input Field | - | `#435663` | Message composer |
| 📎 Attach Files | `upload-files.svg` | `#435663` | File attachment |
| Send Message | `yes.svg` | `#A3B087` | Send button |
| Copy Message | `copy.svg` | `#435663` | Copy to clipboard |
| Star Message | `star.svg` | `#A3B087` | Favorite message |
| Thumbs Up | `thumbs-up.svg` | `#A3B087` | Like message |

### Interactive States
| State | Color | Usage |
|-------|-------|--------|
| Default | `#435663` | Normal icon state |
| Hover | `#A3B087` | Mouse hover state |
| Active | `#313647` | Pressed/selected state |
| Disabled | `#9CA3AF` | Inactive state |

## 🔧 Icon Component System

### Recommended Icon Component Structure:
```tsx
interface IconProps {
  name: keyof typeof iconMap;
  size?: 16 | 20 | 24 | 28;
  color?: 'primary' | 'secondary' | 'accent' | 'muted';
  className?: string;
}

const iconMap = {
  // Header
  'hamburger-menu': 'menu.svg',
  'agent-selector': 'bot.svg', 
  'model-selector': 'settings.svg',
  'settings': 'settings.svg',
  
  // Context Bar  
  'files': 'file-plus.svg',
  'commands': 'commands.svg',
  'dashboard-tab': 'panel-right.svg',
  'workspace': 'three-line-open.svg',
  
  // Chat Interface
  'new-chat': 'plus.svg',
  'chat-options': 'ellipsis.svg', 
  'upload': 'upload-files.svg',
  'send': 'yes.svg',
  'copy': 'copy.svg',
  'star': 'star.svg',
  'thumbs-up': 'thumbs-up.svg',
  'search': 'search.svg',
  'share': 'share.svg'
};
```

## 🎨 CSS Implementation

### Icon Color Classes:
```css
.icon-primary { color: #313647; }
.icon-secondary { color: #435663; }  
.icon-accent { color: #A3B087; }
.icon-muted { color: #9CA3AF; }

.icon-hover:hover { color: #A3B087; }
.icon-active { color: #313647; }
```

## 📱 Responsive Sizes
- **Mobile**: 20px default, 24px for primary actions
- **Tablet**: 24px default, 28px for primary actions  
- **Desktop**: 24px default, 32px for primary actions

## ♿ Accessibility Notes
- All icons include proper `aria-label` attributes
- Minimum touch target of 44x44px on mobile
- High contrast ratios maintained across all color combinations
- Icons paired with text labels where context is critical