# ApolloIDE 🚀

A modern IDE built specifically for data science, powered by VS Code's foundation.

## Overview

ApolloIDE is a data science-focused integrated development environment that combines the power of VS Code with specialized tools for data scientists, machine learning engineers, and researchers. Built on the same architecture as VS Code (similar to Void), ApolloIDE provides:

- **Enhanced Notebook Support**: Seamless Jupyter notebook integration with advanced editing capabilities
- **Data Visualization**: Built-in data frame viewers and interactive plot panels
- **Scientific Computing**: Optimized for Python, R, Julia, and other data science languages
- **ML Workflow Tools**: Model training, experiment tracking, and deployment interfaces
- **Collaborative Features**: Real-time collaboration for data science teams

## Features (Planned)

### Core Features
- ✅ VS Code-based architecture
- 🔄 Enhanced Jupyter notebook support
- 🔄 Interactive data frame viewer
- 🔄 Variable explorer
- 🔄 Plot visualization panel

### Advanced Features (Roadmap)
- 📋 SQL editor with connection management
- 📋 Data profiling and quality tools
- 📋 Visual ML model training interface
- 📋 Experiment tracking (MLflow, W&B integration)
- 📋 Collaborative notebook editing
- 📋 Data pipeline builder
- 📋 Model deployment tools

## Getting Started

### Quick Start

1. **Prerequisites**: See [Setup Guide](apollo_setup.md) for platform-specific requirements
2. **Clone VS Code base**:
   ```bash
   git clone https://github.com/microsoft/vscode.git apolloide
   cd apolloide
   ```
3. **Install dependencies**:
   ```bash
   nvm install 22.20.0
   nvm use 22.20.0
   npm install
   ```
4. **Start Build Process**:
   ```bash
   npm run watch
   ```
   Wait for compilation to complete (you'll see "Finished compilation" messages).

5. **Launch Developer Window**:
   ```bash
   ./scripts/code.sh --user-data-dir ./.tmp/user-data --extensions-dir ./.tmp/extensions
   ```
   (Mac/Linux) or `./scripts/code.bat` (Windows)

For detailed setup instructions, see [apollo_setup.md](apollo_setup.md).

## Architecture

ApolloIDE follows VS Code's architecture:

```
apolloide/
├── src/
│   └── vs/
│       └── workbench/
│           └── contrib/
│               └── apollo/          # ApolloIDE-specific features
├── scripts/                         # Build scripts
└── package.json                     # Project configuration
```

## Development

### Getting Started

1. **Read the Development Guide**: [DEVELOPMENT_GUIDE.md](DEVELOPMENT_GUIDE.md) - Comprehensive guide on how ApolloIDE works and where to add features
2. **Quick Reference**: [QUICK_REFERENCE.md](QUICK_REFERENCE.md) - Quick lookup for common patterns and commands
3. **Project Structure**: [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md) - Detailed architecture overview

### Project Structure

- `src/vs/workbench/contrib/apollo/` - **ApolloIDE custom features go here**
- `src/vs/workbench/contrib/notebook/` - Enhanced notebook support
- `src/vs/workbench/contrib/dataViewer/` - Data visualization tools

### Building

```bash
# Watch mode (for development)
npm run watch

# Launch developer window
./scripts/code.sh --user-data-dir ./.tmp/user-data --extensions-dir ./.tmp/extensions
```

### Testing

```bash
npm test
```

## Contributing

We welcome contributions! See [apollo_setup.md](apollo_setup.md) for development setup instructions.

## License

[To be determined - depends on VS Code base license]

## Acknowledgments

- Built on [VS Code](https://github.com/microsoft/vscode)
- Inspired by [Void](https://github.com/voideditor/void) and other VS Code forks
- Designed for the data science community

## Roadmap

See [Issues](https://github.com/YOUR_USERNAME/apolloide/issues) for planned features and improvements.

---

**Status**: 🚧 Early Development

