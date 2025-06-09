#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Starting PoE Exile Leveling Application Setup${NC}"
echo -e "${PURPLE}🔥 Full cleanup and fresh installation${NC}"
echo "=================================================="

# Check if we're in the correct directory by looking for package.json and web folder
if [ ! -f "package.json" ] || [ ! -d "web" ]; then
    echo -e "${RED}❌ Please run this script from the poe1-campaign-helper directory!${NC}"
    echo -e "${YELLOW}Make sure you're in the root folder containing package.json and web/seeding directories.${NC}"
    exit 1
fi

# Kill ALL Node.js processes and development servers
echo -e "${YELLOW}💀 Destroying all existing Node.js processes...${NC}"
pkill -f node 2>/dev/null || true
pkill -f npm 2>/dev/null || true
pkill -f vite 2>/dev/null || true
pkill -f tsx 2>/dev/null || true

# Kill processes on all common development ports
echo -e "${YELLOW}🧹 Cleaning up all development ports...${NC}"
for port in 3000 3001 4000 4173 5000 5173 5174 8000 8080 8081 9000; do
    lsof -ti:$port | xargs kill -9 2>/dev/null || true
done

echo -e "${YELLOW}📂 Working in poe1-campaign-helper directory${NC}"

# Complete cleanup of all dependencies, cache, and build artifacts
echo -e "${YELLOW}🧽 Complete cleanup - removing ALL previous installations...${NC}"

# Remove all node_modules directories
rm -rf node_modules
rm -rf web/node_modules  
rm -rf seeding/node_modules
rm -rf common/node_modules

# Remove all package lock files
rm -f package-lock.json
rm -f web/package-lock.json
rm -f seeding/package-lock.json

# Remove yarn lock files (if any)
rm -f yarn.lock
rm -f web/yarn.lock
rm -f seeding/yarn.lock

# Remove build directories and cache
rm -rf dist
rm -rf web/dist
rm -rf web/build
rm -rf .vite
rm -rf web/.vite
rm -rf .cache
rm -rf web/.cache

# Clear npm cache
echo -e "${YELLOW}🗑️  Clearing npm cache...${NC}"
npm cache clean --force 2>/dev/null || true

# Clear any TypeScript build cache
rm -rf .tsbuildinfo
rm -rf web/.tsbuildinfo
rm -rf seeding/.tsbuildinfo

# Remove any temporary files
rm -rf .tmp
rm -rf web/.tmp
rm -rf seeding/.tmp

echo -e "${GREEN}✅ Complete cleanup finished${NC}"

# Fresh install of dependencies
echo -e "${YELLOW}📦 Fresh installation of dependencies...${NC}"
npm install

# Check if installation was successful
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Failed to install dependencies${NC}"
    echo -e "${YELLOW}Trying alternative installation methods...${NC}"
    
    # Try with legacy peer deps
    npm install --legacy-peer-deps
    
    if [ $? -ne 0 ]; then
        echo -e "${RED}❌ All installation methods failed${NC}"
        exit 1
    fi
fi

echo -e "${GREEN}✅ Root dependencies installed successfully${NC}"

# Install workspace dependencies explicitly
echo -e "${YELLOW}📦 Installing workspace dependencies...${NC}"

# Install web workspace dependencies
echo -e "${YELLOW}  📱 Installing web workspace...${NC}"
npm install -w web

# Install seeding workspace dependencies  
echo -e "${YELLOW}  🌱 Installing seeding workspace...${NC}"
npm install -w seeding

echo -e "${GREEN}✅ All workspace dependencies installed${NC}"

# Verify installation
echo -e "${YELLOW}🔍 Verifying installation...${NC}"

# Check if root node_modules exists
if [ ! -d "node_modules" ]; then
    echo -e "${RED}❌ Root node_modules missing${NC}"
    exit 1
fi

# Check if web has either node_modules or can access dependencies
if [ ! -d "web/node_modules" ] && [ ! -d "node_modules" ]; then
    echo -e "${RED}❌ Web workspace dependencies not accessible${NC}"
    exit 1
fi

# Verify package.json files exist in workspaces
if [ ! -f "web/package.json" ] || [ ! -f "seeding/package.json" ]; then
    echo -e "${RED}❌ Workspace package.json files missing${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Installation verified successfully${NC}"

# Start the development server
echo -e "${YELLOW}🌐 Starting fresh development server...${NC}"
echo -e "${BLUE}The application will be available at: http://localhost:5173/poe1-campaign-helper/${NC}"
echo -e "${BLUE}Press Ctrl+C to stop the server${NC}"
echo -e "${GREEN}🎉 Ready to go!${NC}"
echo "=================================================="

# Start the web development server
npm run dev -w web
