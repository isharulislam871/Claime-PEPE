import { call, put, takeLatest, Effect } from 'redux-saga/effects';
import { BotActionTypes } from './types';
import {
  fetchBotConfigRequest,
  fetchBotConfigSuccess,
  fetchBotConfigFailure,
  updateBotConfigRequest,
  updateBotConfigSuccess,
  updateBotConfigFailure
} from './actions';
import { toast } from 'react-toastify';
import axios from 'axios';
import { API_CALL } from '@/lib/client';

// Fetch bot config saga
function* fetchBotConfigSaga(): Generator<Effect, void, unknown> {
  try {
    const { response , status  } = (yield call(API_CALL, { url : '/bot' , method : 'GET'})) as any;
  
    if ( status === 200) {
      yield put(fetchBotConfigSuccess(response.data));
    } else {
      throw new Error(response.data?.error || 'Failed to fetch bot configuration');
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      toast.error(error.message);
      yield put(fetchBotConfigFailure(error.message));
    } else {
      toast.error('Failed to fetch bot configuration');
      yield put(fetchBotConfigFailure('An unknown error occurred'));
    }
  }
}

// Update bot config saga
function* updateBotConfigSaga(action: ReturnType<typeof updateBotConfigRequest>): Generator<Effect, void, unknown> {
  try {
    const response = (yield call(axios.put, '/api/bot', action.payload)) as any;
    
    if (response.status === 200) {
      yield put(updateBotConfigSuccess(response.data));
      toast.success('Bot configuration updated successfully');
    } else {
      throw new Error(response.data?.error || 'Failed to update bot configuration');
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      toast.error(error.message);
      yield put(updateBotConfigFailure(error.message));
    } else {
      toast.error('Failed to update bot configuration');
      yield put(updateBotConfigFailure('An unknown error occurred'));
    }
  }
}

// Root bot saga
export function* botSaga(): Generator<Effect, void, unknown> {
  yield takeLatest(BotActionTypes.FETCH_BOT_CONFIG_REQUEST, fetchBotConfigSaga);
  yield takeLatest(BotActionTypes.UPDATE_BOT_CONFIG_REQUEST, updateBotConfigSaga);
}
