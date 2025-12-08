# ApolloIDE Quick Reference

Quick reference for where to code and how things work.

## 🎯 Where to Put Your Code

```
src/vs/workbench/contrib/apollo/
├── browser/          ← UI code (views, panels, etc.)
├── common/           ← Shared code (services, types)
└── electron/        ← Electron-specific code (if needed)
```

## 📝 Adding a New Feature

### 1. Create Contribution File

**Location**: `src/vs/workbench/contrib/apollo/browser/myFeature.contribution.ts`

```typescript
import { Disposable } from '../../../../base/common/lifecycle.js';
import { IWorkbenchContribution } from '../../../common/contributions.js';
import { LifecyclePhase } from '../../../services/lifecycle/common/lifecycle.js';
import { Registry } from '../../../../platform/registry/common/platform.js';
import { Extensions as WorkbenchExtensions, IWorkbenchContributionsRegistry } from '../../../common/contributions.js';

export class MyFeatureContribution extends Disposable implements IWorkbenchContribution {
    constructor() {
        super();
        // Your code here
    }
}

// Register it
Registry.as<IWorkbenchContributionsRegistry>(WorkbenchExtensions.Workbench)
    .registerWorkbenchContribution(MyFeatureContribution, LifecyclePhase.Eventually);
```

### 2. Register in Main File

**File**: `src/vs/workbench/workbench.common.main.ts`

Add import:
```typescript
import './contrib/apollo/browser/myFeature.contribution.js';
```

### 3. Reload Window

Press `Cmd+R` (Mac) or `Ctrl+R` (Windows/Linux) in developer window.

## 🔧 Common Services

```typescript
constructor(
    @IFileService private readonly fileService: IFileService,
    @IConfigurationService private readonly configService: IConfigurationService,
    @INotificationService private readonly notificationService: INotificationService,
    @IEditorService private readonly editorService: IEditorService,
    @IWorkspaceContextService private readonly workspaceService: IWorkspaceContextService,
    @IStorageService private readonly storageService: IStorageService
) {
    super();
}
```

## 📦 Common Imports

```typescript
// Lifecycle
import { Disposable } from '../../../../base/common/lifecycle.js';

// Contributions
import { IWorkbenchContribution } from '../../../common/contributions.js';
import { LifecyclePhase } from '../../../services/lifecycle/common/lifecycle.js';
import { Registry } from '../../../../platform/registry/common/platform.js';
import { Extensions as WorkbenchExtensions, IWorkbenchContributionsRegistry } from '../../../common/contributions.js';

// Services
import { IFileService } from '../../../../platform/files/common/files.js';
import { INotificationService } from '../../../../platform/notification/common/notification.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';

// Localization
import { localize } from '../../../../nls.js';

// Actions/Commands
import { Action2, MenuId, registerAction2 } from '../../../../platform/actions/common/actions.js';
```

## 🚀 Development Commands

```bash
# Start build (watch mode)
npm run watch

# Launch developer window
./scripts/code.sh --user-data-dir ./.tmp/user-data --extensions-dir ./.tmp/extensions

# Reload window (inside VS Code)
Cmd+R (Mac) or Ctrl+R (Windows/Linux)
```

## 📚 File Locations

| What | Where |
|------|-------|
| Your features | `src/vs/workbench/contrib/apollo/` |
| Register contributions | `workbench.common.main.ts` |
| VS Code services | `src/vs/workbench/services/` |
| Platform services | `src/vs/platform/` |
| Examples | `src/vs/workbench/contrib/notebook/` |

## 🎨 Common Patterns

### Add a Command

```typescript
registerAction2(class extends Action2 {
    constructor() {
        super({
            id: 'apollo.myCommand',
            title: localize('myCommand', 'My Command'),
            f1: true // Shows in command palette
        });
    }
    
    async run(accessor: ServicesAccessor): Promise<void> {
        // Command logic
    }
});
```

### Show Notification

```typescript
this.notificationService.notify({
    severity: Severity.Info,
    message: 'Hello from ApolloIDE!'
});
```

### Read Configuration

```typescript
const value = this.configService.getValue<boolean>('apollo.mySetting');
```

### Store Data

```typescript
this.storageService.store('key', 'value', StorageScope.GLOBAL);
const value = this.storageService.get('key', StorageScope.GLOBAL);
```

## ⚠️ Common Mistakes

1. **Forgot to register** - Must add import in main file
2. **Wrong lifecycle phase** - Use `LifecyclePhase.Eventually` for most cases
3. **Not reloading** - Changes need window reload (`Cmd+R`)
4. **TypeScript errors** - Check terminal running `npm run watch`

## 🔍 Debugging

1. **Open DevTools**: `Cmd+Option+I` (Mac) or `Ctrl+Shift+I` (Windows)
2. **Check Console**: Look for errors or your console.log statements
3. **Check Terminal**: TypeScript errors show in `npm run watch` output

## 📖 Full Guide

See [DEVELOPMENT_GUIDE.md](DEVELOPMENT_GUIDE.md) for detailed explanations.

