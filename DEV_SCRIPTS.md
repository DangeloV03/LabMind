# LabMind Development Scripts

Quick reference for building and launching LabMind in development mode.

## Quick Start

After making changes (like updating the app name), rebuild and restart:

### Option 1: Using npm scripts (Recommended)

```bash
# Build and launch (starts watch if not running)
npm run dev

# Restart watch processes and launch
npm run dev:restart

# Launch without checking build status
npm run dev:skip-build
```

### Option 2: Using scripts directly

**Mac/Linux:**
```bash
./scripts/dev.sh
./scripts/dev.sh --restart    # Restart watch processes
./scripts/dev.sh --skip-build # Skip build check
```

**Windows:**
```cmd
scripts\dev.bat
scripts\dev.bat --restart
scripts\dev.bat --skip-build
```

## What These Scripts Do

1. **Check if watch processes are running** - If not, start them automatically
2. **Wait for compilation** - Ensures code is built before launching
3. **Launch LabMind** - Opens the app with isolated user data (in `.tmp` folder)

## Manual Process (If Needed)

If you prefer to do it manually:

1. **Start the build watcher:**
   ```bash
   npm run watch
   ```
   Wait until you see "Finished compilation" messages.

2. **Launch the app:**
   ```bash
   # Mac/Linux
   ./scripts/code.sh --user-data-dir ./.tmp/user-data --extensions-dir ./.tmp/extensions
   
   # Windows
   scripts\code.bat --user-data-dir .\.tmp\user-data --extensions-dir .\.tmp\extensions
   ```

3. **After making changes:**
   - The watch process automatically rebuilds
   - Reload the window: Press `Ctrl+R` (Mac: `Cmd+R`) or `Ctrl+Shift+P` → "Reload Window"

## Stopping Watch Processes

To stop the background watch processes:

```bash
npm run kill-watchd
```

## Tips

- **First time setup**: The initial build takes 5-10 minutes. Subsequent builds are much faster.
- **Reloading**: After code changes, reload the window (`Ctrl+R` / `Cmd+R`) to see updates.
- **Isolated development**: The scripts use `.tmp` folders, so you can delete them to reset your IDE state.
- **Watch in background**: The scripts use `watchd` which runs watch processes in the background using `deemon`.

## Troubleshooting

**Build not starting?**
- Check Node version: `node --version` (should be 22.20.0)
- Try: `npm run kill-watchd` then `npm run dev:restart`

**App not launching?**
- Make sure Electron is downloaded: `npm run electron`
- Check that build completed: Look for "Finished compilation" messages
- **After changing app name**: Delete old Electron and rebuild:
  ```bash
  rm -rf .build/electron/*.app .build/electron/version
  npm run electron
  ```

**Changes not appearing?**
- Make sure watch is running: `npm run watch` (or use `npm run dev`)
- Reload the window: `Ctrl+R` / `Cmd+R`

