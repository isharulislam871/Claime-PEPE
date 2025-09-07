'use client';

import { createStore, applyMiddleware, Store, combineReducers } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { composeWithDevTools } from '@redux-devtools/extension';

// Private reducers
 
// Public reducers
 
// Root saga
import { rootSaga } from './rootSaga';
import { authReducer, adsSettingsReducer, rpcNodeReducer } from './public';
import { userReducer, withdrawalsReducer, activityReducer } from './private';
import { taskReducer } from './private/task';
import { coinReducer } from './private/coin';
import { botReducer } from './private/bot';
import { walletReducer } from './private/wallet';

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
});

// Combine public reducers
const publicReducers = combineReducers({
  auth: authReducer,
  adsSettings: adsSettingsReducer,
  rpcNodes: rpcNodeReducer,
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
