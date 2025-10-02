import { call, put, takeEvery } from 'redux-saga/effects';
import { API_CALL, generateSignature } from 'auth-fingerprint';
import {
  RewardsActionTypes,
  FetchRewardsRequestAction,
  UnlockAchievementRequestAction,
  ClaimRewardRequestAction
} from './types';
import {
  fetchRewardsSuccess,
  fetchRewardsFailure,
  unlockAchievementSuccess,
  unlockAchievementFailure,
  claimRewardSuccess,
  claimRewardFailure
} from './actions';
import { getCurrentUser } from '@/lib/api';

// Fetch rewards saga
function* fetchRewardsSaga(action: FetchRewardsRequestAction): Generator<any, void, any> {
  try {
  
     const currentUser = getCurrentUser();
      const { hash , timestamp , signature } = generateSignature(
           JSON.stringify({ telegramId : currentUser?.telegramId }),
           process.env.NEXTAUTH_SECRET || 'app'
         );
    
    const { response, status } = yield call(API_CALL, {
      url: '/rewards',
      method: 'GET',
      params: { hash , timestamp , signature }
    });

    if (status === 200 && response.success) {
      yield put(fetchRewardsSuccess(response.achievements, response.stats));
    } else {
      yield put(fetchRewardsFailure(response.error || 'Failed to fetch rewards'));
    }
  } catch (error: any) {
    yield put(fetchRewardsFailure(error.message || 'Failed to fetch rewards'));
  }
}

// Unlock achievement saga
function* unlockAchievementSaga(action: UnlockAchievementRequestAction): Generator<any, void, any> {
  try {
    const {   achievementId } = action.payload;
    
    const currentUser = getCurrentUser();
    const { hash , timestamp , signature } = generateSignature(
           JSON.stringify({ telegramId : currentUser?.telegramId , action: 'unlock', achievementId }),
           process.env.NEXTAUTH_SECRET || 'app'
         );
    const { response, status } = yield call(API_CALL, {
      url: '/rewards',
      method: 'POST',
      body: {  hash, timestamp, signature }
    });

    if (status === 200 && response.success) {
      // Fetch updated rewards data
      const { response: updatedResponse, status: updatedStatus } = yield call(API_CALL, {
        url: '/rewards',
        method: 'GET',
        params: { hash , timestamp , signature }
      });

      if (updatedStatus === 200 && updatedResponse.success) {
        yield put(unlockAchievementSuccess(updatedResponse.achievements, updatedResponse.stats));
      } else {
        yield put(unlockAchievementFailure('Failed to fetch updated rewards'));
      }
    } else {
      yield put(unlockAchievementFailure(response.error || 'Failed to unlock achievement'));
    }
  } catch (error: any) {
    yield put(unlockAchievementFailure(error.message || 'Failed to unlock achievement'));
  }
}

// Claim reward saga
function* claimRewardSaga(action: ClaimRewardRequestAction): Generator<any, void, any> {
  try {
    const {   achievementId } = action.payload;

    const currentUser = getCurrentUser();
    const { hash , timestamp , signature } = generateSignature(
           JSON.stringify({ telegramId : currentUser?.telegramId , action: 'claim', achievementId }),
           process.env.NEXTAUTH_SECRET || 'app'
         );
    
    const { response, status } = yield call(API_CALL, {
      url: '/rewards',
      method: 'POST',
      body: {  hash, timestamp, signature }
    });

    if (status === 200 && response.success) {
      // Fetch updated rewards data
      const { response: updatedResponse, status: updatedStatus } = yield call(API_CALL, {
        url: '/rewards',
        method: 'GET',
        params: { hash , timestamp , signature }
      });

      if (updatedStatus === 200 && updatedResponse.success) {
        yield put(claimRewardSuccess(
          updatedResponse.achievements,
          updatedResponse.stats,
          response.reward,
          response.newBalance
        ));
      } else {
        yield put(claimRewardFailure('Failed to fetch updated rewards'));
      }
    } else {
      yield put(claimRewardFailure(response.error || 'Failed to claim reward'));
    }
  } catch (error: any) {
    yield put(claimRewardFailure(error.message || 'Failed to claim reward'));
  }
}

// Watcher saga
export function* rewardsSaga() {
  yield takeEvery(RewardsActionTypes.FETCH_REWARDS_REQUEST, fetchRewardsSaga);
  yield takeEvery(RewardsActionTypes.UNLOCK_ACHIEVEMENT_REQUEST, unlockAchievementSaga);
  yield takeEvery(RewardsActionTypes.CLAIM_REWARD_REQUEST, claimRewardSaga);
}
