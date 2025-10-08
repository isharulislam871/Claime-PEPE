import { 
  RpcNodeActionTypes, 
  RpcNode,
  FetchRpcNodesRequestPayload,
  CreateRpcNodeRequestPayload,
  UpdateRpcNodeRequestPayload
} from './types';

// Fetch RPC nodes actions
export const fetchRpcNodesRequest = (payload?: FetchRpcNodesRequestPayload) => ({
  type: RpcNodeActionTypes.FETCH_RPC_NODES_REQUEST,
  payload
});

export const fetchRpcNodesSuccess = (rpcNodes: RpcNode[]) => ({
  type: RpcNodeActionTypes.FETCH_RPC_NODES_SUCCESS,
  payload: rpcNodes
});

export const fetchRpcNodesFailure = (error: string) => ({
  type: RpcNodeActionTypes.FETCH_RPC_NODES_FAILURE,
  payload: error
});

// Create RPC node actions
export const createRpcNodeRequest = (payload: CreateRpcNodeRequestPayload) => ({
  type: RpcNodeActionTypes.CREATE_RPC_NODE_REQUEST,
  payload
});

export const createRpcNodeSuccess = (rpcNode: RpcNode) => ({
  type: RpcNodeActionTypes.CREATE_RPC_NODE_SUCCESS,
  payload: rpcNode
});

export const createRpcNodeFailure = (error: string) => ({
  type: RpcNodeActionTypes.CREATE_RPC_NODE_FAILURE,
  payload: error
});

// Update RPC node actions
export const updateRpcNodeRequest = (payload: UpdateRpcNodeRequestPayload) => ({
  type: RpcNodeActionTypes.UPDATE_RPC_NODE_REQUEST,
  payload
});

export const updateRpcNodeSuccess = (rpcNode: RpcNode) => ({
  type: RpcNodeActionTypes.UPDATE_RPC_NODE_SUCCESS,
  payload: rpcNode
});

export const updateRpcNodeFailure = (error: string) => ({
  type: RpcNodeActionTypes.UPDATE_RPC_NODE_FAILURE,
  payload: error
});

// Delete RPC node actions
export const deleteRpcNodeRequest = (id: string) => ({
  type: RpcNodeActionTypes.DELETE_RPC_NODE_REQUEST,
  payload: id
});

export const deleteRpcNodeSuccess = (id: string) => ({
  type: RpcNodeActionTypes.DELETE_RPC_NODE_SUCCESS,
  payload: id
});

export const deleteRpcNodeFailure = (error: string) => ({
  type: RpcNodeActionTypes.DELETE_RPC_NODE_FAILURE,
  payload: error
});

// Clear messages action
export const clearRpcNodeMessages = () => ({
  type: RpcNodeActionTypes.CLEAR_RPC_NODE_MESSAGES
});
