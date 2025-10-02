# App Initialization Module

This module provides Redux state management for app initialization, maintenance status, and Telegram WebApp integration using Redux Saga with `API_CALL` from 'auth-fingerprint'.

## Features

- ✅ **Redux Saga Integration**: Uses `API_CALL` with proper authentication
- ✅ **Maintenance Mode**: Checks and handles maintenance status
- ✅ **Telegram WebApp**: Initializes Telegram WebApp with write access
- ✅ **Type Safety**: Full TypeScript support
- ✅ **Memoized Selectors**: Optimized state selection with reselect
- ✅ **Custom Hooks**: Easy-to-use React hooks for components

## Usage

### 1. Using Custom Hooks (Recommended)

```tsx
import { 
  useMaintenanceStatus, 
  useAppInitialization,
  useTelegramState 
} from '@/modules/public/app';

function MyComponent() {
  // Get maintenance status
  const { isEnabled, message } = useMaintenanceStatus();
  
  // Get initialization state
  const { isInitializing, isInitialized, error } = useAppInitialization();
  
  // Get Telegram state
  const { telegramWebAppReady, writeAccessGranted } = useTelegramState();
  
  return (
    <div>
      {isInitializing && <div>Loading...</div>}
      {isEnabled && <div>Maintenance: {message}</div>}
      {error && <div>Error: {error}</div>}
    </div>
  );
}
```

### 2. Using Individual Selectors

```tsx
import { useSelector } from 'react-redux';
import { 
  selectIsMaintenanceEnabled,
  selectMaintenanceMessage,
  selectAppError 
} from '@/modules/public/app';

function MyComponent() {
  const isMaintenanceEnabled = useSelector(selectIsMaintenanceEnabled);
  const maintenanceMessage = useSelector(selectMaintenanceMessage);
  const error = useSelector(selectAppError);
  
  // Component logic...
}
```

### 3. Dispatching Actions

```tsx
import { useDispatch } from 'react-redux';
import { initializeApp, checkMaintenance } from '@/modules/public/app';

function MyComponent() {
  const dispatch = useDispatch();
  
  const handleInitialize = () => {
    dispatch(initializeApp());
  };
  
  const handleCheckMaintenance = () => {
    dispatch(checkMaintenance());
  };
  
  // Component logic...
}
```

## Available Selectors

- `selectIsInitialized` - App initialization status
- `selectIsInitializing` - App initialization loading state
- `selectMaintenanceStatus` - Full maintenance status object
- `selectIsMaintenanceEnabled` - Boolean maintenance status
- `selectMaintenanceMessage` - Maintenance message
- `selectTelegramWebAppReady` - Telegram WebApp ready status
- `selectWriteAccessGranted` - Telegram write access status
- `selectAppError` - App initialization error

## Available Hooks

- `useAppInitialization()` - Returns `{ isInitialized, isInitializing, error }`
- `useMaintenanceStatus()` - Returns `{ isEnabled, message, fullStatus }`
- `useTelegramState()` - Returns `{ telegramWebAppReady, writeAccessGranted }`
- `useAppState()` - Returns complete app state
- `useIsAppInitialized()` - Returns boolean initialization status
- `useIsAppInitializing()` - Returns boolean loading state
- `useAppError()` - Returns error string or null

## Actions

- `initializeApp()` - Start app initialization
- `checkMaintenance()` - Check maintenance status
- `initializeTelegramWebApp()` - Initialize Telegram WebApp
- `resetAppState()` - Reset app state

## State Shape

```typescript
interface AppState {
  isInitialized: boolean;
  isInitializing: boolean;
  maintenanceStatus: MaintenanceStatus | null;
  telegramWebAppReady: boolean;
  writeAccessGranted: boolean;
  error: string | null;
}
```
