import { RpcNodeActionTypes, RpcNodeState, RpcNodeAction } from './types';

const initialState: RpcNodeState = {
  rpcNodes: [],
  loading: false,
  error: null,
  success: null
};

export const rpcNodeReducer = (
  state: RpcNodeState = initialState,
  action: RpcNodeAction
): RpcNodeState => {
  switch (action.type) {
    // Fetch RPC nodes
    case RpcNodeActionTypes.FETCH_RPC_NODES_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };
    
    case RpcNodeActionTypes.FETCH_RPC_NODES_SUCCESS:
      return {
        ...state,
        loading: false,
        rpcNodes: action.payload,
        error: null
      };
    
    case RpcNodeActionTypes.FETCH_RPC_NODES_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      };

    // Create RPC node
    case RpcNodeActionTypes.CREATE_RPC_NODE_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
        success: null
      };
    
    case RpcNodeActionTypes.CREATE_RPC_NODE_SUCCESS:
      return {
        ...state,
        loading: false,
        rpcNodes: [...state.rpcNodes, action.payload],
        success: 'RPC node created successfully',
        error: null
      };
    
    case RpcNodeActionTypes.CREATE_RPC_NODE_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
        success: null
      };

    // Update RPC node
    case RpcNodeActionTypes.UPDATE_RPC_NODE_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
        success: null
      };
    
    case RpcNodeActionTypes.UPDATE_RPC_NODE_SUCCESS:
      return {
        ...state,
        loading: false,
        rpcNodes: state.rpcNodes.map(node =>
          node._id === action.payload._id ? action.payload : node
        ),
        success: 'RPC node updated successfully',
        error: null
      };
    
    case RpcNodeActionTypes.UPDATE_RPC_NODE_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
        success: null
      };

    // Delete RPC node
    case RpcNodeActionTypes.DELETE_RPC_NODE_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
        success: null
      };
    
    case RpcNodeActionTypes.DELETE_RPC_NODE_SUCCESS:
      return {
        ...state,
        loading: false,
        rpcNodes: state.rpcNodes.filter(node => node._id !== action.payload),
        success: 'RPC node deleted successfully',
        error: null
      };
    
    case RpcNodeActionTypes.DELETE_RPC_NODE_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
        success: null
      };

    // Clear messages
    case RpcNodeActionTypes.CLEAR_RPC_NODE_MESSAGES:
      return {
        ...state,
        error: null,
        success: null
      };

    default:
      return state;
  }
};
