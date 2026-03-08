# NEXIS Quick Start Guide

Get NEXIS up and running in minutes!

## Prerequisites

Before you begin, ensure you have:

- ✅ Node.js 18.x or higher ([Download](https://nodejs.org/))
- ✅ npm (comes with Node.js)
- ✅ Git ([Download](https://git-scm.com/))
- ✅ AWS CLI (for backend deployment) ([Install Guide](https://aws.amazon.com/cli/))
- ✅ A code editor (VS Code recommended)

## Quick Setup (5 minutes)

### Option 1: Automated Setup (Recommended)

**Windows (PowerShell):**
```powershell
.\scripts\setup.ps1
```

**macOS/Linux (Bash):**
```bash
chmod +x scripts/setup.sh
./scripts/setup.sh
```

### Option 2: Manual Setup

1. **Install Frontend Dependencies**
   ```bash
   cd frontend
   npm install
   ```

2. **Install Backend Dependencies**
   ```bash
   cd ../backend
   npm install
   ```

3. **Create Environment Files**
   ```bash
   # From project root
   cp frontend/.env.example frontend/.env
   cp backend/.env.example backend/.env
   ```

4. **Update Environment Variables**
   - Edit `frontend/.env` with your API configuration
   - Edit `backend/.env` with your AWS configuration

## Running the Application

### Frontend Development Server

```bash
cd frontend
npm run dev
```

The application will open at `http://localhost:3000`

### Backend Testing

```bash
cd backend
npm run test
```

## Project Structure Overview

```
nexis/
├── frontend/          # React application
│   ├── src/          # Source code
│   └── package.json  # Dependencies
│
├── backend/          # Lambda functions
│   ├── src/         # Source code
│   └── package.json # Dependencies
│
├── docs/            # Documentation
├── scripts/         # Setup scripts
└── README.md        # Main documentation
```

## Common Commands

### Frontend

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run test` | Run tests |
| `npm run lint` | Check code quality |
| `npm run format` | Format code |

### Backend

| Command | Description |
|---------|-------------|
| `npm run build` | Compile TypeScript |
| `npm run test` | Run all tests |
| `npm run test:properties` | Run property-based tests |
| `npm run lint` | Check code quality |
| `npm run format` | Format code |

## Next Steps

1. **Explore the Code**
   - Frontend: `frontend/src/App.tsx`
   - Backend: `backend/src/lambda/`

2. **Read Documentation**
   - [Project Structure](./PROJECT_STRUCTURE.md)
   - [Main README](../README.md)

3. **Start Development**
   - Check the tasks in `.kiro/specs/nexis-fullstack-transformation/tasks.md`
   - Follow the implementation plan

## Troubleshooting

### Port 3000 Already in Use

```bash
# Kill the process using port 3000
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# macOS/Linux
lsof -ti:3000 | xargs kill -9
```

### Node Version Issues

```bash
# Check your Node version
node -v

# Should be 18.x or higher
# If not, install Node.js 18+ from nodejs.org
```

### npm Install Fails

```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

### TypeScript Errors

```bash
# Rebuild TypeScript
npm run build

# Check tsconfig.json is present
```

## Getting Help

- 📚 Check [README.md](../README.md) for detailed information
- 📖 Read [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md) for code organization
- 🐛 Check existing issues in the repository
- 💬 Ask questions in team chat

## What's Next?

Now that you have NEXIS running locally, you can:

1. **Implement Features**: Follow the task list in `.kiro/specs/nexis-fullstack-transformation/tasks.md`
2. **Write Tests**: Add unit tests and property-based tests
3. **Deploy**: Follow deployment guides for AWS infrastructure
4. **Contribute**: Make improvements and submit pull requests

Happy coding! 🚀
