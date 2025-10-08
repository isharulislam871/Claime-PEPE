import { call, put, takeLatest, Effect } from 'redux-saga/effects';
import { toast } from 'react-toastify';
 
import { getCurrentUser } from '@/lib/api';
import { generateSignature , API_CALL  } from 'auth-fingerprint';
import {
   
  WATCH_AD_REQUEST
} from './constants';
import {
  
  watchAdSuccess,
  watchAdFailure
} from './actions';
import { updateUserSuccess } from '@/modules/public';
 

 
// Watch Ad Saga
function* watchAdSaga(): Generator<Effect, void, unknown> {
  try {
    const tg = getCurrentUser();

    const { hash, signature, timestamp } = generateSignature(
      JSON.stringify({ ...tg }),
      process.env.NEXTAUTH_SECRET || 'app'
    );

    const { response, status }: any = yield call(API_CALL, {
      url: '/ads',
      method: 'POST',
      body: { hash, signature, timestamp }
    });
    
    if (status === 200 && response) {
      toast.success('Ad watched successfully');
      yield put(watchAdSuccess());
      yield put(updateUserSuccess(response.user));
    } else {
      yield put(watchAdFailure('Failed to watch ad'));
      toast.error('Failed to watch ad');
    }
  } catch (error) {
    yield put(watchAdFailure('Failed to watch ad'));
    toast.error('Failed to watch ad');
  }
}

// Root Watch Ad Saga
export function* watchAdRootSaga(): Generator<Effect, void, unknown> {
  yield takeLatest(WATCH_AD_REQUEST, watchAdSaga);
}
