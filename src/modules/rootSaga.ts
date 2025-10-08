import { all, fork, Effect } from 'redux-saga/effects';
import { withdrawalsSaga} from './private';
import { taskSaga } from './private/task';
import { coinSaga } from './private/coin';
import { botSaga } from './private/bot';
 
import { adsSettingsSaga, rpcNodeSaga } from './public';
import { appSaga } from './public/app/saga';
import { authSaga } from './public/auth';
import { activitySaga } from './private/activity';
import { dailyCheckInSaga } from './private/dailyCheckIn';
import { rewardsSaga } from './private/rewards';
import { leaderboardSaga } from './private/leaderboard';
import { quickActionsSaga } from './private/quickActions';
import { promotionsSaga } from './private/promotions';
import { walletSaga } from './private/wallet/saga';
import { adminWalletsSaga } from './private/adminWallets';
import { swapRootSaga } from './private/swap';
import { pointSelectionRootSaga } from './private/pointSelection';
import { adminWithdrawalsSaga } from './admin/withdrawals';
import { adminActivitiesSaga } from './admin/activities';
import { adminUsersSaga } from './admin/users';
import { watchAdRootSaga } from './private/watchAd';
import { otpSaga } from './public/otp';
// Public sagas
 
export function* rootSaga(): Generator<Effect, void, unknown> {
  yield all([
    fork(withdrawalsSaga),
    fork(taskSaga),
    fork(coinSaga),
    fork(botSaga),
    fork(walletSaga),
    fork(adsSettingsSaga),
    fork(rpcNodeSaga),
    fork(authSaga),
    fork(activitySaga),
    fork(dailyCheckInSaga),
    fork(rewardsSaga),
    fork(leaderboardSaga),
    fork(quickActionsSaga),
    fork(promotionsSaga),
    fork(adminWalletsSaga),
    fork(swapRootSaga),
    fork(pointSelectionRootSaga),
    fork(adminWithdrawalsSaga),
    fork(adminActivitiesSaga),
    fork(adminUsersSaga),
    fork(appSaga),
    fork(watchAdRootSaga),
    fork(otpSaga),
  ]);
}
