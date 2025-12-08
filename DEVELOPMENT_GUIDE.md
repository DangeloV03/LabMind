# ApolloIDE Development Guide

This guide explains how ApolloIDE works and where to add new features. ApolloIDE is built on VS Code's architecture, so understanding VS Code's structure is key to building ApolloIDE features.

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Directory Structure](#directory-structure)
3. [How Features Work](#how-features-work)
4. [Where to Add Your Code](#where-to-add-your-code)
5. [Adding a New Feature](#adding-a-new-feature)
6. [Common Patterns](#common-patterns)
7. [Testing Your Changes](#testing-your-changes)

---

## Architecture Overview

### VS Code Architecture

VS Code uses a **contribution-based architecture**. Everything is a "contribution" that gets registered with the workbench. Think of it like plugins, but built into the core.

**Key Concepts:**

1. **Workbench Contributions**: Services or features that run when VS Code starts
2. **Editor Contributions**: Features that extend editors (like notebooks, text editors)
3. **Commands**: Actions users can trigger (keyboard shortcuts, menu items)
4. **Services**: Reusable functionality (file system, configuration, etc.)
5. **Registries**: Central places where contributions are registered

### How It All Fits Together

```
VS Code Startup
    ↓
Load workbench.common.main.ts (common features)
    ↓
Load workbench.desktop.main.ts (desktop-specific)
    ↓
Import all contribution files
    ↓
Register contributions with registries
    ↓
Instantiate contributions based on lifecycle phase
    ↓
VS Code is ready!
```

---

## Directory Structure

### Where Everything Lives

```
apolloide/
├── src/vs/
│   ├── base/                    # Core utilities (events, promises, etc.)
│   ├── platform/                # Platform services (files, storage, etc.)
│   ├── editor/                  # Text editor core
│   └── workbench/
│       ├── common/              # Shared workbench code
│       ├── browser/             # Browser-specific UI
│       ├── electron-browser/    # Electron-specific code
│       ├── services/            # Workbench services
│       └── contrib/              # ⭐ THIS IS WHERE YOU ADD FEATURES ⭐
│           ├── notebook/        # Notebook feature
│           ├── terminal/        # Terminal feature
│           ├── debug/          # Debug feature
│           └── apollo/          # 🚀 YOUR APOLLOIDE FEATURES GO HERE
│               ├── browser/     # Browser UI code
│               ├── common/      # Shared code
│               └── electron/    # Electron-specific code
```

### Key Directories Explained

**`src/vs/workbench/contrib/`** - This is where ALL features live:
- Each folder represents a feature (notebook, terminal, debug, etc.)
- Your ApolloIDE-specific features go in `contrib/apollo/`

**`src/vs/workbench/services/`** - Reusable services:
- File operations, configuration, storage, etc.
- You can use these services in your features

**`src/vs/platform/`** - Platform abstractions:
- File system, storage, configuration, etc.
- These work across different platforms (desktop, web)

---

## How Features Work

### The Contribution Pattern

Every feature follows this pattern:

1. **Create a Contribution Class** - A class that implements `IWorkbenchContribution`
2. **Register It** - Tell VS Code about your contribution
3. **Use Services** - Access VS Code's services through dependency injection

### Example: Simple Feature

```typescript
// src/vs/workbench/contrib/apollo/browser/apolloFeature.contribution.ts

import { Disposable } from '../../../../base/common/lifecycle.js';
import { IWorkbenchContribution } from '../../../common/contributions.js';
import { LifecyclePhase } from '../../../services/lifecycle/common/lifecycle.js';
import { Registry } from '../../../../platform/registry/common/platform.js';
import { Extensions as WorkbenchExtensions, IWorkbenchContributionsRegistry } from '../../../common/contributions.js';

export class ApolloFeatureContribution extends Disposable implements IWorkbenchContribution {
    
    constructor() {
        super();
        // Your initialization code here
        console.log('ApolloIDE feature initialized!');
    }
}

// Register the contribution
Registry.as<IWorkbenchContributionsRegistry>(WorkbenchExtensions.Workbench)
    .registerWorkbenchContribution(ApolloFeatureContribution, LifecyclePhase.Eventually);
```

### Lifecycle Phases

Contributions are instantiated at different times:

- **`LifecyclePhase.Starting`** - Very early, before UI is ready
- **`LifecyclePhase.Ready`** - UI is ready, but not fully initialized
- **`LifecyclePhase.Restored`** - Workbench state is restored
- **`LifecyclePhase.Eventually`** - Everything is ready, lazy initialization

**Most features use `LifecyclePhase.Eventually`** - it's safe and doesn't slow down startup.

---

## Where to Add Your Code

### ApolloIDE-Specific Features

**Location**: `src/vs/workbench/contrib/apollo/`

Create this structure:

```
src/vs/workbench/contrib/apollo/
├── browser/                    # Browser UI code
│   ├── apolloFeature.contribution.ts
│   ├── apolloFeatureView.ts
│   └── apolloFeatureView.css
├── common/                     # Shared code (types, interfaces)
│   ├── apolloFeatureService.ts
│   └── apolloFeatureTypes.ts
└── electron/                   # Electron-specific code (if needed)
    └── apolloFeatureNative.ts
```

### Registering Your Contribution

After creating your contribution file, you need to import it in the main workbench file:

**For Desktop (Electron)**:
Add to `src/vs/workbench/workbench.desktop.main.ts`:

```typescript
// Add this import with other contrib imports
import './contrib/apollo/browser/apolloFeature.contribution.js';
```

**For Web**:
Add to `src/vs/workbench/workbench.web.main.ts`:

```typescript
// Add this import with other contrib imports
import './contrib/apollo/browser/apolloFeature.contribution.js';
```

**For Both**:
Add to `src/vs/workbench/workbench.common.main.ts`:

```typescript
// Add this import with other contrib imports
import './contrib/apollo/browser/apolloFeature.contribution.js';
```

---

## Adding a New Feature

### Step-by-Step Guide

Let's say you want to add a "Data Viewer" feature that shows pandas DataFrames.

#### Step 1: Create the Directory Structure

```bash
mkdir -p src/vs/workbench/contrib/apollo/browser
mkdir -p src/vs/workbench/contrib/apollo/common
```

#### Step 2: Create the Contribution File

**File**: `src/vs/workbench/contrib/apollo/browser/dataViewer.contribution.ts`

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Disposable } from '../../../../base/common/lifecycle.js';
import { IWorkbenchContribution } from '../../../common/contributions.js';
import { LifecyclePhase } from '../../../services/lifecycle/common/lifecycle.js';
import { Registry } from '../../../../platform/registry/common/platform.js';
import { Extensions as WorkbenchExtensions, IWorkbenchContributionsRegistry } from '../../../common/contributions.js';
import { IViewDescriptorService } from '../../../common/views.js';
import { localize } from '../../../../nls.js';

// Your contribution class
export class DataViewerContribution extends Disposable implements IWorkbenchContribution {
    
    constructor(
        @IViewDescriptorService private readonly viewDescriptorService: IViewDescriptorService
    ) {
        super();
        
        // Initialize your feature
        this.initialize();
    }
    
    private initialize(): void {
        // Add your initialization logic here
        console.log('Data Viewer initialized');
    }
}

// Register the contribution
Registry.as<IWorkbenchContributionsRegistry>(WorkbenchExtensions.Workbench)
    .registerWorkbenchContribution(DataViewerContribution, LifecyclePhase.Eventually);
```

#### Step 3: Register in Main File

Add to `src/vs/workbench/workbench.common.main.ts` (around line 200-300 where other contribs are imported):

```typescript
// ApolloIDE Features
import './contrib/apollo/browser/dataViewer.contribution.js';
```

#### Step 4: Test Your Changes

1. **Rebuild**: The watch process should automatically recompile
2. **Reload**: Press `Cmd+R` (Mac) or `Ctrl+R` (Windows/Linux) in the developer window
3. **Check Console**: Open Developer Tools (`Cmd+Option+I` on Mac) to see your console.log

---

## Common Patterns

### Pattern 1: Adding a View (Sidebar Panel)

```typescript
import { IViewsService } from '../../../common/views.js';
import { ViewContainer, IViewDescriptor } from '../../../common/views.js';

export class MyViewContribution extends Disposable implements IWorkbenchContribution {
    constructor(
        @IViewsService private readonly viewsService: IViewsService
    ) {
        super();
        this.registerView();
    }
    
    private registerView(): void {
        // Register your view here
    }
}
```

### Pattern 2: Adding a Command

```typescript
import { Action2, MenuId, registerAction2 } from '../../../../platform/actions/common/actions.js';
import { ServicesAccessor } from '../../../../editor/browser/editorExtensions.js';

registerAction2(class extends Action2 {
    constructor() {
        super({
            id: 'apollo.showDataViewer',
            title: localize('showDataViewer', 'Show Data Viewer'),
            f1: true, // Show in command palette
            menu: {
                id: MenuId.CommandPalette
            }
        });
    }
    
    async run(accessor: ServicesAccessor): Promise<void> {
        // Your command logic here
        const notificationService = accessor.get(INotificationService);
        notificationService.info('Data Viewer opened!');
    }
});
```

### Pattern 3: Using Services

VS Code uses **dependency injection**. Request services in your constructor:

```typescript
export class MyFeature extends Disposable implements IWorkbenchContribution {
    constructor(
        @IFileService private readonly fileService: IFileService,
        @IConfigurationService private readonly configService: IConfigurationService,
        @INotificationService private readonly notificationService: INotificationService
    ) {
        super();
        // Now you can use these services
    }
}
```

**Common Services:**
- `IFileService` - Read/write files
- `IConfigurationService` - Read settings
- `INotificationService` - Show notifications
- `IEditorService` - Work with editors
- `IWorkspaceContextService` - Workspace info
- `IStorageService` - Store data

### Pattern 4: Creating a Service

If you need a reusable service:

**File**: `src/vs/workbench/contrib/apollo/common/dataViewerService.ts`

```typescript
import { createDecorator } from '../../../../platform/instantiation/common/instantiation.js';

export const IDataViewerService = createDecorator<IDataViewerService>('dataViewerService');

export interface IDataViewerService {
    readonly _serviceBrand: undefined;
    showDataFrame(data: any): void;
}

export class DataViewerService implements IDataViewerService {
    readonly _serviceBrand: undefined;
    
    showDataFrame(data: any): void {
        // Your implementation
    }
}
```

**Register it** in your contribution:

```typescript
import { registerSingleton } from '../../../../platform/instantiation/common/extensions.js';

registerSingleton(IDataViewerService, DataViewerService, true);
```

---

## Testing Your Changes

### Development Workflow

1. **Start Build Process**:
   ```bash
   npm run watch
   ```
   Keep this running - it watches for changes and recompiles automatically.

2. **Launch Developer Window**:
   ```bash
   ./scripts/code.sh --user-data-dir ./.tmp/user-data --extensions-dir ./.tmp/extensions
   ```

3. **Make Changes**:
   - Edit your TypeScript files
   - Watch process recompiles automatically
   - Reload window: `Cmd+R` (Mac) or `Ctrl+R` (Windows/Linux)

4. **Debug**:
   - Open Developer Tools: `Cmd+Option+I` (Mac) or `Ctrl+Shift+I` (Windows/Linux)
   - Check Console for errors
   - Use breakpoints in VS Code

### Common Issues

**Changes not appearing?**
- Make sure watch process is running
- Reload the window (`Cmd+R`)
- Check for TypeScript errors in the terminal

**TypeScript errors?**
- Check the terminal running `npm run watch`
- Fix errors and save - it will recompile

**Service not found?**
- Make sure you registered it with `registerSingleton`
- Check that you imported the service file

---

## Example: Complete Feature

Here's a complete example of a simple feature that shows a notification on startup:

**File**: `src/vs/workbench/contrib/apollo/browser/welcome.contribution.ts`

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Disposable } from '../../../../base/common/lifecycle.js';
import { IWorkbenchContribution } from '../../../common/contributions.js';
import { LifecyclePhase } from '../../../services/lifecycle/common/lifecycle.js';
import { Registry } from '../../../../platform/registry/common/platform.js';
import { Extensions as WorkbenchExtensions, IWorkbenchContributionsRegistry } from '../../../common/contributions.js';
import { INotificationService, Severity } from '../../../../platform/notification/common/notification.js';
import { IStorageService, StorageScope } from '../../../../platform/storage/common/storage.js';

const APOLLO_WELCOME_SHOWN_KEY = 'apollo.welcome.shown';

export class ApolloWelcomeContribution extends Disposable implements IWorkbenchContribution {
    
    constructor(
        @INotificationService private readonly notificationService: INotificationService,
        @IStorageService private readonly storageService: IStorageService
    ) {
        super();
        this.showWelcome();
    }
    
    private showWelcome(): void {
        // Only show once
        if (this.storageService.get(APOLLO_WELCOME_SHOWN_KEY, StorageScope.GLOBAL)) {
            return;
        }
        
        this.notificationService.notify({
            severity: Severity.Info,
            message: 'Welcome to ApolloIDE! 🚀',
            actions: {
                primary: [{
                    label: 'Got it',
                    run: () => {
                        this.storageService.store(APOLLO_WELCOME_SHOWN_KEY, true, StorageScope.GLOBAL);
                    }
                }]
            }
        });
    }
}

Registry.as<IWorkbenchContributionsRegistry>(WorkbenchExtensions.Workbench)
    .registerWorkbenchContribution(ApolloWelcomeContribution, LifecyclePhase.Eventually);
```

**Register it** in `workbench.common.main.ts`:

```typescript
// ApolloIDE Features
import './contrib/apollo/browser/welcome.contribution.js';
```

---

## Key Takeaways

1. **All features go in `src/vs/workbench/contrib/apollo/`**
2. **Create a contribution class** that implements `IWorkbenchContribution`
3. **Register it** with the WorkbenchContributionsRegistry
4. **Import it** in the appropriate main file (`workbench.common.main.ts`, etc.)
5. **Use dependency injection** to access VS Code services
6. **Test by reloading** the developer window after changes

---

## Next Steps

1. **Start Small**: Create a simple contribution that logs to console
2. **Explore Existing Features**: Look at `contrib/notebook/` or `contrib/terminal/` for examples
3. **Read VS Code Docs**: Check [VS Code's contribution guide](https://github.com/microsoft/vscode/wiki/How-to-Contribute)
4. **Experiment**: Try adding commands, views, or services

---

## Resources

- **VS Code Source**: `src/vs/workbench/contrib/` - Examples of all features
- **VS Code Contributing Guide**: https://github.com/microsoft/vscode/wiki/How-to-Contribute
- **VS Code API Docs**: https://code.visualstudio.com/api
- **TypeScript**: All code is TypeScript - familiarize yourself with it

Happy coding! 🚀

