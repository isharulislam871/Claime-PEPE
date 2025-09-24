import { all, fork, Effect } from 'redux-saga/effects';
import { withdrawalsSaga , userSaga } from './private';
import { taskSaga } from './private/task';
import { coinSaga } from './private/coin';
import { botSaga } from './private/bot';
import { walletSaga } from './private/wallet';
import { adsSettingsSaga, rpcNodeSaga } from './public';
import { appSaga } from './public/app/saga';
import { activitySaga } from './private/activity';
import { dailyCheckInSaga } from './private/dailyCheckIn';
// Public sagas
 
export function* rootSaga(): Generator<Effect, void, unknown> {
  yield all([
    fork(withdrawalsSaga),
    fork(userSaga),
    fork(taskSaga),
    fork(coinSaga),
    fork(botSaga),
    fork(walletSaga),
    fork(adsSettingsSaga),
    fork(rpcNodeSaga),
    fork(activitySaga),
    fork(dailyCheckInSaga),
    fork(appSaga),
  ]);
}
