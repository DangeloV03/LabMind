# Setting Up ApolloIDE
### Welcome! 🚀
This guide will help you set up ApolloIDE, a data science-focused IDE built on VS Code's foundation. ApolloIDE is designed specifically for data scientists, with built-in support for notebooks, data visualization, and scientific computing.

## Overview

ApolloIDE is based on VS Code's architecture, similar to how Void is structured. The main differences will be:
- **Data Science Focus**: Built-in notebook support, data visualization tools, and scientific computing libraries
- **Custom Extensions**: Pre-configured with data science extensions
- **Workbench Customizations**: Tailored UI for data science workflows

## Prerequisites

### a. Mac - Prerequisites

If you're using a Mac, you need:
- **Python 3.8+** (for data science tooling)
- **XCode Command Line Tools**: `xcode-select --install`
- **Homebrew** (recommended): `/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"`

### b. Windows - Prerequisites

If you're using a Windows computer:
1. Install [Visual Studio 2022](https://visualstudio.microsoft.com/thank-you-downloading-visual-studio/?sku=Community) (recommended) or [VS Build Tools](https://visualstudio.microsoft.com/thank-you-downloading-visual-studio/?sku=BuildTools)

2. Go to the "Workloads" tab and select:
   - `Desktop development with C++`
   - `Node.js build tools`

3. Go to the "Individual Components" tab and select:
   - `MSVC v143 - VS 2022 C++ x64/x86 Spectre-mitigated libs (Latest)`
   - `C++ ATL for latest build tools with Spectre Mitigations`
   - `C++ MFC for latest build tools with Spectre Mitigations`

4. Install Python 3.8+ from [python.org](https://www.python.org/downloads/)

5. Click Install

### c. Linux - Prerequisites

First, run `npm install -g node-gyp`. Then:

- **Debian (Ubuntu, etc)**: 
  ```bash
  sudo apt-get install build-essential g++ libx11-dev libxkbfile-dev libsecret-1-dev libkrb5-dev python3 python3-pip python-is-python3
  ```

- **Red Hat (Fedora, etc)**: 
  ```bash
  sudo dnf install @development-tools gcc gcc-c++ make libsecret-devel krb5-devel libX11-devel libxkbfile-devel python3 python3-pip
  ```

- **SUSE (openSUSE, etc)**: 
  ```bash
  sudo zypper install patterns-devel-C-C++-devel_C_C++ krb5-devel libsecret-devel libxkbfile-devel libX11-devel python3 python3-pip
  ```

## Initial Setup

### Step 1: Fork/Clone VS Code Base

ApolloIDE will be built on VS Code's foundation. You have two options:

**Option A: Fork VS Code (Recommended for customization)**
```bash
# Fork VS Code repository first on GitHub, then:
git clone https://github.com/YOUR_USERNAME/vscode.git apolloide
cd apolloide
```

**Option B: Clone VS Code directly**
```bash
git clone https://github.com/microsoft/vscode.git apolloide
cd apolloide
```

### Step 2: Install Dependencies

```bash
# Install Node.js version manager (if not already installed)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Install and use Node.js 22.20.0 (required by VS Code)
nvm install 22.20.0
nvm use 22.20.0

# Install project dependencies
npm install
```

**Important**: Make sure the path to your ApolloIDE folder does not have any spaces in it.

### Step 3: Set Up ApolloIDE Custom Code

Create the custom ApolloIDE workbench directory:
```bash
mkdir -p src/vs/workbench/contrib/apollo
```

This is where ApolloIDE-specific features will live, similar to how Void uses `src/vs/workbench/contrib/void/`.

### Step 4: Developer Mode

Here's how to start developing ApolloIDE:

1. **Start the Build Process** (takes ~5 minutes):
   
   **Option A: Using VS Code Build Task** (runs in background):
   - Windows: Press <kbd>Ctrl+Shift+B</kbd>
   - Mac: Press <kbd>Cmd+Shift+B</kbd>
   - Linux: Press <kbd>Ctrl+Shift+B</kbd>
   
   This starts the watch processes. You can check the build status in the terminal panel.
   
   **Option B: Using Terminal** (recommended - shows output):
   ```bash
   npm run watch
   ```
   
   Wait until you see compilation complete messages. The build runs continuously and watches for file changes.

2. **Open Developer Mode Window**:
   - Windows: `./scripts/code.bat`
   - Mac: `./scripts/code.sh`
   - Linux: `./scripts/code.sh`

   **Optional**: Add flags for isolated development:
   ```bash
   ./scripts/code.sh --user-data-dir ./.tmp/user-data --extensions-dir ./.tmp/extensions
   ```
   This lets you reset IDE changes by deleting the `.tmp` folder.

3. **Start Editing**:
   - Changes won't appear until you reload: Press <kbd>Ctrl+R</kbd> (<kbd>Cmd+R</kbd> on Mac) or <kbd>Ctrl+Shift+P</kbd> → `Reload Window`
   - Kill build scripts: Press `Ctrl+D` in the terminal (not `Ctrl+C` which keeps it running in background)

### Building from Terminal

Instead of using Developer Mode from VS Code, you can build from terminal:

```bash
npm run watch
```

Build is complete when you see:
```
[watch-extensions] [00:37:39] Finished compilation extensions with 0 errors after 19303 ms
[watch-client    ] [00:38:06] Finished compilation with 0 errors after 46248 ms
```

## ApolloIDE-Specific Features to Implement

### Phase 1: Core Infrastructure
1. **Notebook Integration**: Enhanced Jupyter notebook support
2. **Data Viewer**: Built-in data frame viewer (pandas, polars, etc.)
3. **Plot Viewer**: Interactive plot visualization panel
4. **Variable Explorer**: Real-time variable inspection

### Phase 2: Data Science Tools
1. **SQL Editor**: Integrated SQL query editor with connection management
2. **Data Profiling**: Automatic data quality and profiling tools
3. **Model Training UI**: Visual interface for ML model training
4. **Experiment Tracking**: Integration with MLflow, Weights & Biases

### Phase 3: Advanced Features
1. **Collaborative Editing**: Real-time collaboration for notebooks
2. **Data Pipeline Builder**: Visual workflow builder
3. **API Testing**: Built-in API testing for data science APIs
4. **Deployment Tools**: One-click model deployment

## Common Issues & Fixes

- **Node Version**: Make sure you're using Node.js `22.20.0` (as specified in VS Code's `.nvmrc`). Use `nvm install` and `nvm use` to manage versions.
- **Path Spaces**: Ensure your ApolloIDE folder path has no spaces.
- **Import Errors**: If you get `"TypeError: Failed to fetch dynamically imported module"`, ensure all imports end with `.js`.
- **React Build Errors**: Try `NODE_OPTIONS="--max-old-space-size=8192" npm run buildreact`.
- **Missing Styles**: Wait a few seconds and reload the window.
- **macOS libtool**: If you get `libtool: error: unrecognised option: '-static'`, install GNU libtool:
  ```bash
  brew install libtool
  ```
- **Linux Sandbox**: If you get sandbox errors, run:
  ```bash
  sudo chown root:root .build/electron/chrome-sandbox
  sudo chmod 4755 .build/electron/chrome-sandbox
  ```

## Building Distribution

For distributing ApolloIDE (similar to Void's build pipeline):

1. **Fork VSCodium's build system** or create your own GitHub Actions workflow
2. **Customize branding**: Update product name, icons, and metadata
3. **Pre-install extensions**: Bundle data science extensions
4. **Create installer**: Package for macOS, Windows, and Linux

See Void's [`void-builder`](https://github.com/voideditor/void-builder) repo for reference.

## Next Steps

1. ✅ Set up development environment (this guide)
2. 📝 Read VS Code's [Codebase Guide](https://github.com/microsoft/vscode/wiki/How-to-Contribute)
3. 🔨 Start implementing ApolloIDE features in `src/vs/workbench/contrib/apollo/`
4. 🧪 Test your changes in Developer Mode
5. 📦 Build and distribute your IDE

## Resources

- [VS Code Source Code](https://github.com/microsoft/vscode)
- [VS Code How to Contribute](https://github.com/microsoft/vscode/wiki/How-to-Contribute)
- [Void Codebase Guide](https://github.com/voideditor/void/blob/main/VOID_CODEBASE_GUIDE.md) (helpful reference)
- [Electron Documentation](https://www.electronjs.org/docs)

## Questions?

If you run into issues or have questions:
- Check VS Code's [How to Contribute](https://github.com/microsoft/vscode/wiki/How-to-Contribute) page
- Review Void's setup guide for similar patterns
- Open an issue in your ApolloIDE repository

Happy coding! 🎉

