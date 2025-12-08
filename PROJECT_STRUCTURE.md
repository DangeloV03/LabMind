# ApolloIDE Project Structure

This document outlines the planned structure for ApolloIDE, a data science IDE built on VS Code's foundation.

## Directory Structure

```
apolloide/
├── .github/
│   └── workflows/              # GitHub Actions for CI/CD
├── .vscode/                    # VS Code workspace settings
├── build/                      # Build output
├── extensions/                 # Built-in extensions
│   ├── apollo-notebook/       # Enhanced notebook support
│   ├── apollo-data-viewer/    # Data frame viewer
│   └── apollo-ml-tools/       # ML workflow tools
├── scripts/                    # Build and utility scripts
│   ├── code.sh                # Launch script (Mac/Linux)
│   └── code.bat               # Launch script (Windows)
├── src/
│   └── vs/
│       ├── workbench/
│       │   └── contrib/
│       │       ├── apollo/            # Core ApolloIDE features
│       │       │   ├── browser/      # Browser-specific code
│       │       │   ├── common/       # Shared utilities
│       │       │   └── electron/     # Electron-specific code
│       │       ├── notebook/         # Enhanced notebook support
│       │       ├── dataViewer/       # Data visualization
│       │       ├── variableExplorer/ # Variable inspection
│       │       └── mlTools/          # ML workflow tools
│       └── ...                       # VS Code core (from upstream)
├── .nvmrc                      # Node.js version specification
├── package.json                # Project dependencies
├── tsconfig.json               # TypeScript configuration
├── apollo_setup.md            # Setup guide
└── README.md                   # Project overview
```

## Key Components

### 1. Core ApolloIDE Features (`src/vs/workbench/contrib/apollo/`)

This is where ApolloIDE-specific features live:

- **Browser**: Web-based UI components
- **Common**: Shared utilities and types
- **Electron**: Desktop-specific implementations

### 2. Notebook Enhancements (`src/vs/workbench/contrib/notebook/`)

Extended notebook support:
- Enhanced cell execution
- Better kernel management
- Improved output rendering
- Collaborative editing

### 3. Data Viewer (`src/vs/workbench/contrib/dataViewer/`)

Data visualization tools:
- DataFrame viewer (pandas, polars, etc.)
- Interactive data tables
- Data profiling views
- Export capabilities

### 4. Variable Explorer (`src/vs/workbench/contrib/variableExplorer/`)

Runtime inspection:
- Variable values and types
- Object inspection
- Memory usage
- Watch expressions

### 5. ML Tools (`src/vs/workbench/contrib/mlTools/`)

Machine learning workflow:
- Model training UI
- Experiment tracking
- Hyperparameter tuning
- Model deployment

## Extension Structure

Built-in extensions follow VS Code's extension API:

```
extensions/apollo-notebook/
├── package.json               # Extension manifest
├── src/
│   └── extension.ts           # Extension entry point
└── README.md                  # Extension documentation
```

## Build System

ApolloIDE uses VS Code's build system:
- **TypeScript**: For all source code
- **Webpack**: For bundling
- **Electron**: For desktop app
- **npm scripts**: For build orchestration

## Development Workflow

1. **Fork VS Code**: Start with VS Code as base
2. **Create ApolloIDE features**: Add to `src/vs/workbench/contrib/apollo/`
3. **Build extensions**: Create built-in extensions
4. **Test**: Use Developer Mode for testing
5. **Build**: Create distributable packages

## Migration from VS Code

When syncing with VS Code upstream:
1. Keep ApolloIDE-specific code in `contrib/apollo/`
2. Avoid modifying core VS Code files when possible
3. Use extension API for new features when feasible
4. Document all customizations

## Next Steps

1. Set up base VS Code repository
2. Create initial `apollo/` directory structure
3. Implement first feature (e.g., enhanced notebook support)
4. Build and test in Developer Mode
5. Iterate and expand features

