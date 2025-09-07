"use client";

import { call, put, takeLatest, Effect, all, fork } from 'redux-saga/effects';
import { 
  RpcNodeActionTypes, 
  RpcNode,
  FetchRpcNodesRequestAction,
  CreateRpcNodeRequestAction,
  UpdateRpcNodeRequestAction,
  DeleteRpcNodeRequestAction
} from './types';
import {
  fetchRpcNodesSuccess,
  fetchRpcNodesFailure,
  createRpcNodeSuccess,
  createRpcNodeFailure,
  updateRpcNodeSuccess,
  updateRpcNodeFailure,
  deleteRpcNodeSuccess,
  deleteRpcNodeFailure
} from './actions';

// API Response interfaces
interface RpcNodeResponse {
  success: boolean;
  rpcNodes?: RpcNode[];
  rpcNode?: RpcNode;
  message?: string;
}

// API Functions
const fetchRpcNodesAPI = async (params?: { network?: string; isActive?: boolean; isDefault?: boolean }): Promise<RpcNodeResponse> => {
  const searchParams = new URLSearchParams();
  
  if (params?.network) searchParams.append('network', params.network);
  if (params?.isActive !== undefined) searchParams.append('isActive', params.isActive.toString());
  if (params?.isDefault !== undefined) searchParams.append('isDefault', params.isDefault.toString());
  
  const queryString = searchParams.toString();
  const url = `/api/rpcnodes${queryString ? `?${queryString}` : ''}`;
  
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Failed to fetch RPC nodes');
  return data;
};

const createRpcNodeAPI = async (payload: {
  name: string;
  url: string;
  network: string;
  isActive?: boolean;
  isDefault?: boolean;
  priority?: number;
}): Promise<RpcNodeResponse> => {
  const response = await fetch('/api/rpcnodes', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload)
  });
  
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Failed to create RPC node');
  return data;
};

const updateRpcNodeAPI = async (payload: {
  id: string;
  name?: string;
  url?: string;
  network?: string;
  isActive?: boolean;
  isDefault?: boolean;
  priority?: number;
  status?: 'online' | 'offline' | 'error';
  responseTime?: number;
  blockHeight?: number;
}): Promise<RpcNodeResponse> => {
  const response = await fetch('/api/rpcnodes', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload)
  });
  
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Failed to update RPC node');
  return data;
};

const deleteRpcNodeAPI = async (id: string): Promise<RpcNodeResponse> => {
  const response = await fetch(`/api/rpcnodes?id=${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Failed to delete RPC node');
  return data;
};

// Saga Functions
function* fetchRpcNodesSaga(action: FetchRpcNodesRequestAction): Generator<Effect, void, unknown> {
  try {
    const response = (yield call(fetchRpcNodesAPI, action.payload)) as RpcNodeResponse;
    yield put(fetchRpcNodesSuccess(response.rpcNodes || []));
  } catch (error: unknown) {
    if (error instanceof Error) {
      yield put(fetchRpcNodesFailure(error.message));
    } else {
      yield put(fetchRpcNodesFailure('An unknown error occurred while fetching RPC nodes'));
    }
  }
}

function* createRpcNodeSaga(action: CreateRpcNodeRequestAction): Generator<Effect, void, unknown> {
  try {
    const response = (yield call(createRpcNodeAPI, action.payload)) as RpcNodeResponse;
    if (response.rpcNode) {
      yield put(createRpcNodeSuccess(response.rpcNode));
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      yield put(createRpcNodeFailure(error.message));
    } else {
      yield put(createRpcNodeFailure('An unknown error occurred while creating RPC node'));
    }
  }
}

function* updateRpcNodeSaga(action: UpdateRpcNodeRequestAction): Generator<Effect, void, unknown> {
  try {
    const response = (yield call(updateRpcNodeAPI, action.payload)) as RpcNodeResponse;
    if (response.rpcNode) {
      yield put(updateRpcNodeSuccess(response.rpcNode));
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      yield put(updateRpcNodeFailure(error.message));
    } else {
      yield put(updateRpcNodeFailure('An unknown error occurred while updating RPC node'));
    }
  }
}

function* deleteRpcNodeSaga(action: DeleteRpcNodeRequestAction): Generator<Effect, void, unknown> {
  try {
    yield call(deleteRpcNodeAPI, action.payload);
    yield put(deleteRpcNodeSuccess(action.payload));
  } catch (error: unknown) {
    if (error instanceof Error) {
      yield put(deleteRpcNodeFailure(error.message));
    } else {
      yield put(deleteRpcNodeFailure('An unknown error occurred while deleting RPC node'));
    }
  }
}

// Watcher Sagas
function* watchFetchRpcNodes() {
  yield takeLatest(RpcNodeActionTypes.FETCH_RPC_NODES_REQUEST, fetchRpcNodesSaga);
}

function* watchCreateRpcNode() {
  yield takeLatest(RpcNodeActionTypes.CREATE_RPC_NODE_REQUEST, createRpcNodeSaga);
}

function* watchUpdateRpcNode() {
  yield takeLatest(RpcNodeActionTypes.UPDATE_RPC_NODE_REQUEST, updateRpcNodeSaga);
}

function* watchDeleteRpcNode() {
  yield takeLatest(RpcNodeActionTypes.DELETE_RPC_NODE_REQUEST, deleteRpcNodeSaga);
}

// Root RPC node saga
export function* rpcNodeSaga(): Generator<Effect, void, unknown> {
  yield all([
    fork(watchFetchRpcNodes),
    fork(watchCreateRpcNode),
    fork(watchUpdateRpcNode),
    fork(watchDeleteRpcNode),
  ]);
}
