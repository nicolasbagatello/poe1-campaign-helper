# PoE1 Campaign Helper

A comprehensive Path of Exile leveling guide application with interactive zone layouts, build planning, and progress tracking.

## ✨ Features

### 📍 **Interactive Zone Layout Guides**
- **Act-specific layout guides** with embedded zone maps from Engineering Eternity
- **Visual zone layouts** with base64-encoded images for instant loading
- **Sticky guide display** that follows you through each act
- **Responsive design** with optimized image sizing for better content density

### 🔨 **Build Planning & Import**
- **PoB Archives integration** - Direct links to curated league starter builds
- **Step-by-step build import** instructions with PoB code support
- **Gem requirement tracking** with visual progress indicators
- **Build data persistence** across browser sessions

### 📋 **Progress Tracking**
- **Task completion system** with localStorage persistence
- **Section-based organization** by acts and zones
- **Visual progress indicators** with completed task styling
- **Collapsible sections** for focused gameplay

### 🎨 **Modern Interface**
- **Compact, readable design** with optimized font sizing
- **Dark theme** optimized for extended gaming sessions
- **Responsive layout** (35/65 split between tasks and guide)
- **Smooth interactions** with hover states and transitions

## 🚀 Getting Started

### Development Setup
```bash
# Install dependencies
npm i

# Start development server
npm run dev -w web
```

### Production Build
```bash
# Build for production
npm run build -w web
```

## 📁 Project Structure

### Core Components
- **`ActGuide`** - Displays zone layout guides for each act
- **`TaskList`** - Interactive task management with completion tracking
- **`SectionHolder`** - Organizes content by acts/zones with collapsible sections
- **`BuildImportForm`** - PoB build import functionality

### Data Organization
- **`common/data/routes/`** - Individual act route files (act-1.txt through act-10.txt)
- **`web/public/docs/`** - Markdown files with embedded zone layouts
- **`web/src/state/`** - Recoil state management for progress and builds

## 🗺️ Zone Layout System

The application uses a streamlined markdown-based system for zone layouts:

### Data Flow
1. **Route files** (`act-X.txt`) define the leveling progression
2. **Markdown files** (`actX.md`) contain zone layouts with base64-encoded images
3. **ActGuide component** renders markdown with proper image scaling
4. **Progress tracking** syncs task completion with localStorage

### Image Processing
- **197 zone layout images** embedded as base64 data
- **70% scaling** for optimal screen utilization
- **Responsive sizing** that adapts to container width

## 🔧 Build Integration

### PoB Archives Integration
The app provides seamless integration with [PoB Archives](https://pobarchives.com/builds/B44DWJ7P?sort=dps):

1. **Curated build selection** filtered for league starters
2. **Content-based filtering** for different playstyles
3. **Direct PoB code import** with automatic gem extraction
4. **Build data persistence** across sessions

### Supported Build Data
- **Passive tree information**
- **Required gems with counts**
- **Gem link configurations**
- **Build metadata and descriptions**

## 📊 State Management

### Persistence Strategy
- **localStorage-based** for cross-session persistence
- **Versioned data structures** for safe migrations
- **Recoil state management** for reactive updates
- **Efficient toggle state** for task completion tracking

### Key State Atoms
- `routeProgressSelectorFamily` - Task completion per route step
- `gemProgressSelectorFamily` - Gem acquisition tracking
- `sectionCollapseSelectorFamily` - UI section visibility
- `buildDataSelector` - Imported build information

## 🛠️ Data Seeding

### Passive Tree Data
```bash
npm run seed tree -w seeding
```

### Game Data Import
```bash
# Get required .dat.json files using exile-export
# https://github.com/HeartofPhos/exile-export
npm run seed data -w seeding
```

### Required Files
Check `seeding/data/index.ts` for the complete list of required `.dat` files.

## 📝 Route Philosophy

The base route follows **current speedrunning strategies** and is optimized for efficiency. While route PRs aren't currently accepted, users can:

- **Import custom builds** via PoB integration
- **Track progress** with any preferred route style
- **Use search strings** for item filtering customization

## 🎯 Usage Guide

### For League Start
1. **Visit Build section** and browse PoB Archives for league starter builds
2. **Import your chosen build** using the PoB code
3. **Follow the route tasks** while referencing zone layouts
4. **Track your progress** as you complete each objective

### For Experienced Players
1. **Import your optimized build** via PoB code
2. **Customize search strings** for advanced item filtering
3. **Use zone layouts** for efficient pathing
4. **Leverage progress tracking** for multiple character planning

## 📜 License

This project is not affiliated with or endorsed by Grinding Gear Games.

---

**Based on** [HeartofPhos/exile-leveling](https://github.com/HeartofPhos/exile-leveling) - Original leveling guide framework  
**Zone layout data** courtesy of [Engineering Eternity](https://www.youtube.com/channel/UCaFHfrY-6uGSAvmczp_7a6Q)  
**Guide creation** inspired by [leveling and zone layout cheat sheets](https://www.reddit.com/r/pathofexile/comments/8gz1jz/leveling_and_zone_layout_cheat_sheets/) by [_treB](https://www.reddit.com/user/_treB/)  
**Build data** integration with [PoB Archives](https://pobarchives.com/)
