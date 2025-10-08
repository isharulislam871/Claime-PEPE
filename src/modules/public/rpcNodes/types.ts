// RPC Node data types
export interface RpcNode {
  _id: string;
  name: string;
  url: string;
  network: string;
  isActive: boolean;
  isDefault: boolean;
  priority: number;
  lastChecked?: string;
  status: 'online' | 'offline' | 'error';
  responseTime?: number;
  blockHeight?: number;
  createdAt: string;
  updatedAt: string;
}

export interface RpcNodeState {
  rpcNodes: RpcNode[];
  loading: boolean;
  error: string | null;
  success: string | null;
}

export enum RpcNodeActionTypes {
  // Fetch RPC nodes
  FETCH_RPC_NODES_REQUEST = 'FETCH_RPC_NODES_REQUEST',
  FETCH_RPC_NODES_SUCCESS = 'FETCH_RPC_NODES_SUCCESS',
  FETCH_RPC_NODES_FAILURE = 'FETCH_RPC_NODES_FAILURE',
  
  // Create RPC node
  CREATE_RPC_NODE_REQUEST = 'CREATE_RPC_NODE_REQUEST',
  CREATE_RPC_NODE_SUCCESS = 'CREATE_RPC_NODE_SUCCESS',
  CREATE_RPC_NODE_FAILURE = 'CREATE_RPC_NODE_FAILURE',
  
  // Update RPC node
  UPDATE_RPC_NODE_REQUEST = 'UPDATE_RPC_NODE_REQUEST',
  UPDATE_RPC_NODE_SUCCESS = 'UPDATE_RPC_NODE_SUCCESS',
  UPDATE_RPC_NODE_FAILURE = 'UPDATE_RPC_NODE_FAILURE',
  
  // Delete RPC node
  DELETE_RPC_NODE_REQUEST = 'DELETE_RPC_NODE_REQUEST',
  DELETE_RPC_NODE_SUCCESS = 'DELETE_RPC_NODE_SUCCESS',
  DELETE_RPC_NODE_FAILURE = 'DELETE_RPC_NODE_FAILURE',
  
  // Clear messages
  CLEAR_RPC_NODE_MESSAGES = 'CLEAR_RPC_NODE_MESSAGES'
}

// Fetch RPC nodes interfaces
export interface FetchRpcNodesRequestPayload {
  network?: string;
  isActive?: boolean;
  isDefault?: boolean;
}

export interface FetchRpcNodesRequestAction {
  type: RpcNodeActionTypes.FETCH_RPC_NODES_REQUEST;
  payload?: FetchRpcNodesRequestPayload;
}

export interface FetchRpcNodesSuccessAction {
  type: RpcNodeActionTypes.FETCH_RPC_NODES_SUCCESS;
  payload: RpcNode[];
}

export interface FetchRpcNodesFailureAction {
  type: RpcNodeActionTypes.FETCH_RPC_NODES_FAILURE;
  payload: string;
}

// Create RPC node interfaces
export interface CreateRpcNodeRequestPayload {
  name: string;
  url: string;
  network: string;
  isActive?: boolean;
  isDefault?: boolean;
  priority?: number;
}

export interface CreateRpcNodeRequestAction {
  type: RpcNodeActionTypes.CREATE_RPC_NODE_REQUEST;
  payload: CreateRpcNodeRequestPayload;
}

export interface CreateRpcNodeSuccessAction {
  type: RpcNodeActionTypes.CREATE_RPC_NODE_SUCCESS;
  payload: RpcNode;
}

export interface CreateRpcNodeFailureAction {
  type: RpcNodeActionTypes.CREATE_RPC_NODE_FAILURE;
  payload: string;
}

// Update RPC node interfaces
export interface UpdateRpcNodeRequestPayload {
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
}

export interface UpdateRpcNodeRequestAction {
  type: RpcNodeActionTypes.UPDATE_RPC_NODE_REQUEST;
  payload: UpdateRpcNodeRequestPayload;
}

export interface UpdateRpcNodeSuccessAction {
  type: RpcNodeActionTypes.UPDATE_RPC_NODE_SUCCESS;
  payload: RpcNode;
}

export interface UpdateRpcNodeFailureAction {
  type: RpcNodeActionTypes.UPDATE_RPC_NODE_FAILURE;
  payload: string;
}

// Delete RPC node interfaces
export interface DeleteRpcNodeRequestAction {
  type: RpcNodeActionTypes.DELETE_RPC_NODE_REQUEST;
  payload: string; // RPC node ID
}

export interface DeleteRpcNodeSuccessAction {
  type: RpcNodeActionTypes.DELETE_RPC_NODE_SUCCESS;
  payload: string; // RPC node ID
}

export interface DeleteRpcNodeFailureAction {
  type: RpcNodeActionTypes.DELETE_RPC_NODE_FAILURE;
  payload: string;
}

// Clear messages action
export interface ClearRpcNodeMessagesAction {
  type: RpcNodeActionTypes.CLEAR_RPC_NODE_MESSAGES;
}

// Union type for all RPC node actions
export type RpcNodeAction =
  | FetchRpcNodesRequestAction
  | FetchRpcNodesSuccessAction
  | FetchRpcNodesFailureAction
  | CreateRpcNodeRequestAction
  | CreateRpcNodeSuccessAction
  | CreateRpcNodeFailureAction
  | UpdateRpcNodeRequestAction
  | UpdateRpcNodeSuccessAction
  | UpdateRpcNodeFailureAction
  | DeleteRpcNodeRequestAction
  | DeleteRpcNodeSuccessAction
  | DeleteRpcNodeFailureAction
  | ClearRpcNodeMessagesAction;
