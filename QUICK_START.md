# ApolloIDE Quick Start Checklist

Use this checklist to get ApolloIDE up and running quickly.

## Prerequisites Checklist

### Mac
- [ ] Python 3.8+ installed (`python3 --version`)
- [ ] XCode Command Line Tools (`xcode-select --install`)
- [ ] Homebrew (optional but recommended)

### Windows
- [ ] Visual Studio 2022 with C++ and Node.js workloads
- [ ] Python 3.8+ installed
- [ ] Git for Windows

### Linux
- [ ] Build essentials installed
- [ ] Python 3.8+ and pip installed
- [ ] Node-gyp globally installed (`npm install -g node-gyp`)

## Setup Steps

### 1. Environment Setup
- [ ] Install Node Version Manager (nvm)
  ```bash
  curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
  ```
- [ ] Install Node.js 22.20.0
  ```bash
  nvm install 22.20.0
  nvm use 22.20.0
  ```
- [ ] Verify Node version
  ```bash
  node --version  # Should show v22.20.0
  ```

### 2. Clone VS Code Base
- [ ] Clone VS Code repository
  ```bash
  git clone https://github.com/microsoft/vscode.git apolloide
  cd apolloide
  ```
- [ ] Verify no spaces in path (check current directory path)

### 3. Install Dependencies
- [ ] Install npm dependencies
  ```bash
  npm install
  ```
- [ ] Wait for installation to complete (may take 5-10 minutes)

### 4. Create ApolloIDE Structure
- [ ] Create ApolloIDE directory
  ```bash
  mkdir -p src/vs/workbench/contrib/apollo
  ```
- [ ] Create placeholder file
  ```bash
  touch src/vs/workbench/contrib/apollo/README.md
  ```

### 5. Start Build Process
- [ ] Open VS Code/Void in the apolloide directory
- [ ] Start the build (choose one method):
  
  **Method 1: Terminal (Recommended - shows output)**:
  ```bash
  npm run watch
  ```
  Wait until you see "Finished compilation" messages.
  
  **Method 2: VS Code Build Task**:
  - Mac: Press <kbd>Cmd+Shift+B</kbd>
  - Windows/Linux: Press <kbd>Ctrl+Shift+B</kbd>
  - This runs in background - check terminal panel for status

### 6. Launch Developer Window
- [ ] Open terminal in apolloide directory
- [ ] Run launch script
  ```bash
  # Mac/Linux
  ./scripts/code.sh --user-data-dir ./.tmp/user-data --extensions-dir ./.tmp/extensions
  
  # Windows
  ./scripts/code.bat --user-data-dir ./.tmp/user-data --extensions-dir ./.tmp/extensions
  ```
- [ ] Verify new window opens

### 7. Test Your Setup
- [ ] Create a test file in the new window
- [ ] Make a small change
- [ ] Reload window (<kbd>Ctrl+R</kbd> or <kbd>Cmd+R</kbd>)
- [ ] Verify changes appear

## Next Steps

Once setup is complete:

1. **Read Documentation**:
   - [apollo_setup.md](apollo_setup.md) - Detailed setup guide
   - [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md) - Architecture overview
   - [VS Code Contributing Guide](https://github.com/microsoft/vscode/wiki/How-to-Contribute)

2. **Start Building**:
   - Create your first feature in `src/vs/workbench/contrib/apollo/`
   - Test in Developer Mode
   - Iterate and improve

3. **Join the Community**:
   - Create issues for bugs or feature requests
   - Contribute code improvements
   - Share your data science workflows

## Troubleshooting

If you encounter issues:

1. **Check Node Version**: Must be exactly 22.20.0
2. **Check Path**: No spaces in directory path
3. **Check Prerequisites**: All platform-specific tools installed
4. **Check Build Logs**: Look for specific error messages
5. **See Common Fixes**: Refer to [apollo_setup.md](apollo_setup.md) Common Issues section

## Success Indicators

You'll know setup is successful when:
- ✅ Developer Mode builds without errors
- ✅ New window opens with `./scripts/code.sh`
- ✅ You can edit files and see changes after reload
- ✅ No console errors in Developer Tools

---

**Ready to build?** Start with [apollo_setup.md](apollo_setup.md) for detailed instructions!

