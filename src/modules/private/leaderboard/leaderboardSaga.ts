import { call, put, takeEvery } from 'redux-saga/effects';
import { 
  LeaderboardActionTypes, 
  FetchLeaderboardRequestAction 
} from './types';
import { 
  fetchLeaderboardSuccess, 
  fetchLeaderboardFailure 
} from './actions';

interface LeaderboardApiResponse {
  success: boolean;
  data: {
    leaderboard: Array<{
      id: string;
      username: string;
      avatar?: string;
      points: number;
      rank: number;
      isCurrentUser?: boolean;
    }>;
    currentUserRank: {
      id: string;
      username: string;
      avatar?: string;
      points: number;
      rank: number;
      isCurrentUser?: boolean;
    } | null;
    period: 'weekly' | 'monthly' | 'all-time';
    totalUsers: number;
  };
  error?: string;
}

function* fetchLeaderboardSaga(action: FetchLeaderboardRequestAction) {
  try {
    const { period, userId, limit = 10 } = action.payload;
    
    // Build query parameters
    const params = new URLSearchParams({
      period,
      limit: limit.toString(),
    });
    
    if (userId) {
      params.append('userId', userId);
    }

    const response: Response = yield call(fetch, `/api/leaderboard?${params.toString()}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: LeaderboardApiResponse = yield response.json();

    if (!data.success) {
      throw new Error(data.error || 'Failed to fetch leaderboard data');
    }

    yield put(fetchLeaderboardSuccess(
      data.data.leaderboard,
      data.data.currentUserRank,
      data.data.period,
      data.data.totalUsers
    ));

  } catch (error: any) {
    console.error('Leaderboard fetch error:', error);
    yield put(fetchLeaderboardFailure(
      error.message || 'An error occurred while fetching leaderboard data'
    ));
  }
}

export function* leaderboardSaga() {
  yield takeEvery(LeaderboardActionTypes.FETCH_LEADERBOARD_REQUEST, fetchLeaderboardSaga);
}
