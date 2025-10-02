'use client';

import { createStore, applyMiddleware, Store, combineReducers } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { composeWithDevTools } from '@redux-devtools/extension';

// Private reducers
 
// Public reducers
 
// Root saga
import { rootSaga } from './rootSaga';
import { authReducer, adsSettingsReducer, rpcNodeReducer, appReducer, popupReducer } from './public';
import { userReducer, withdrawalsReducer, activityReducer } from './private';
import { taskReducer } from './private/task';
import { coinReducer } from './private/coin';
import { botReducer } from './private/bot';
 
import { dailyCheckInReducer } from './private/dailyCheckIn';
import { rewardsReducer } from './private/rewards';
import { leaderboardReducer } from './private/leaderboard';
import { quickActionsReducer } from './private/quickActions';
import { promotionsReducer } from './private/promotions';
import { walletReducer } from './private/wallet/reducer';
import { adminWalletsReducer } from './private/adminWallets';
import { swapReducer } from './private/swap';
import { pointSelectionReducer } from './private/pointSelection';
import { withdrawalFormReducer } from './private/withdrawalForm';

// Create saga middleware
const sagaMiddleware = createSagaMiddleware();

// Combine private reducers
const privateReducers = combineReducers({
  user: userReducer,
  withdrawals: withdrawalsReducer,
  task: taskReducer,
  coin: coinReducer,
  activity: activityReducer,
  bot: botReducer,
  wallet: walletReducer,
  dailyCheckIn: dailyCheckInReducer,
  rewards: rewardsReducer,
  leaderboard: leaderboardReducer,
  quickActions: quickActionsReducer,
  promotions: promotionsReducer,
  adminWallets: adminWalletsReducer,
  swap: swapReducer,
  pointSelection: pointSelectionReducer,
  withdrawalForm: withdrawalFormReducer,
});

// Combine public reducers
const publicReducers = combineReducers({
  auth: authReducer,
  adsSettings: adsSettingsReducer,
  rpcNodes: rpcNodeReducer,
  app: appReducer,
  popup: popupReducer,
});

// Root reducer
const rootReducer = combineReducers({
  private: privateReducers,
  public: publicReducers,
});

// Define RootState type
export type RootState = ReturnType<typeof rootReducer>;

// Create store
const store = createStore(
  rootReducer as any,
  composeWithDevTools(applyMiddleware(sagaMiddleware))
);

// Define AppDispatch type
export type AppDispatch = typeof store.dispatch;

// Run saga middleware
sagaMiddleware.run(rootSaga);

export default store;
