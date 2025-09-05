import { all, fork, Effect } from 'redux-saga/effects';
import { withdrawalsSaga , userSaga } from './private';
import { taskSaga } from './private/task';

// Public sagas
 
export function* rootSaga(): Generator<Effect, void, unknown> {
  yield all([
    fork(withdrawalsSaga),
    fork(userSaga),
    fork(taskSaga)
  ]);
}
