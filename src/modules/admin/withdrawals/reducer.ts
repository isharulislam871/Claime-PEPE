import {
  AdminWithdrawalsState,
  AdminWithdrawalsActionTypes,
  FETCH_WITHDRAWALS_REQUEST,
  FETCH_WITHDRAWALS_SUCCESS,
  FETCH_WITHDRAWALS_FAILURE,
  APPROVE_WITHDRAWAL_REQUEST,
  APPROVE_WITHDRAWAL_SUCCESS,
  APPROVE_WITHDRAWAL_FAILURE,
  REJECT_WITHDRAWAL_REQUEST,
  REJECT_WITHDRAWAL_SUCCESS,
  REJECT_WITHDRAWAL_FAILURE,
  SET_WITHDRAWAL_FILTERS,
  SET_SELECTED_WITHDRAWAL,
  CLEAR_WITHDRAWAL_ERROR,
  SET_SEARCH_TEXT,
  SET_STATUS_FILTER,
  SET_DATE_RANGE,
  CLEAR_FILTERS,
  FETCH_WITHDRAWAL_DETAILS_REQUEST,
  FETCH_WITHDRAWAL_DETAILS_SUCCESS,
  FETCH_WITHDRAWAL_DETAILS_FAILURE,
  UPDATE_WITHDRAWAL_STATUS_REQUEST,
  UPDATE_WITHDRAWAL_STATUS_SUCCESS,
  UPDATE_WITHDRAWAL_STATUS_FAILURE,
  SET_UPDATE_MODAL_VISIBLE,
  SET_CONFIRM_MODAL_VISIBLE,
  SET_NEW_STATUS,
  SET_TRANSACTION_ID,
  SET_FAILURE_REASON,
  SET_ADMIN_NOTES,
  CLEAR_WITHDRAWAL_FORM
} from './types';

const initialState: AdminWithdrawalsState = {
  withdrawals: [],
  loading: false,
  error: null,
  pagination: {
    currentPage: 1,
    totalCount: 0,
    pageSize: 25
  },
  summary: {
    statusBreakdown: [],
    totalCompletedAmount: 0
  },
  filters: {},
  selectedWithdrawal: null,
  // UI State
  searchText: '',
  statusFilter: 'all',
  dateRange: null,
  // Individual withdrawal state
  currentWithdrawal: null,
  currentWithdrawalLoading: false,
  currentWithdrawalError: null,
  updateModalVisible: false,
  updating: false,
  newStatus: '',
  transactionId: '',
  failureReason: '',
  adminNotes: '',
  confirmModalVisible: false
};

export const adminWithdrawalsReducer = (
  state = initialState,
  action: AdminWithdrawalsActionTypes
): AdminWithdrawalsState => {
  switch (action.type) {
    case FETCH_WITHDRAWALS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };

    case FETCH_WITHDRAWALS_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
        withdrawals: action.payload.withdrawals,
        pagination: action.payload.pagination,
        summary: action.payload.summary
      };

    case FETCH_WITHDRAWALS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
        withdrawals: []
      };

    case APPROVE_WITHDRAWAL_REQUEST:
    case REJECT_WITHDRAWAL_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };

    case APPROVE_WITHDRAWAL_SUCCESS:
    case REJECT_WITHDRAWAL_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
        withdrawals: state.withdrawals.map(withdrawal =>
          withdrawal._id === action.payload._id ? action.payload : withdrawal
        )
      };

    case APPROVE_WITHDRAWAL_FAILURE:
    case REJECT_WITHDRAWAL_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      };

    case SET_WITHDRAWAL_FILTERS:
      return {
        ...state,
        filters: action.payload
      };

    case SET_SELECTED_WITHDRAWAL:
      return {
        ...state,
        selectedWithdrawal: action.payload
      };

    case CLEAR_WITHDRAWAL_ERROR:
      return {
        ...state,
        error: null
      };

    case SET_SEARCH_TEXT:
      return {
        ...state,
        searchText: action.payload
      };

    case SET_STATUS_FILTER:
      return {
        ...state,
        statusFilter: action.payload
      };

    case SET_DATE_RANGE:
      return {
        ...state,
        dateRange: action.payload
      };

    case CLEAR_FILTERS:
      return {
        ...state,
        searchText: '',
        statusFilter: 'all',
        dateRange: null,
        filters: {}
      };

    case FETCH_WITHDRAWAL_DETAILS_REQUEST:
      return {
        ...state,
        currentWithdrawalLoading: true,
        currentWithdrawalError: null
      };

    case FETCH_WITHDRAWAL_DETAILS_SUCCESS:
      return {
        ...state,
        currentWithdrawalLoading: false,
        currentWithdrawalError: null,
        currentWithdrawal: action.payload,
        newStatus: action.payload.status,
        transactionId: action.payload.transactionId || '',
        failureReason: action.payload.failureReason || ''
      };

    case FETCH_WITHDRAWAL_DETAILS_FAILURE:
      return {
        ...state,
        currentWithdrawalLoading: false,
        currentWithdrawalError: action.payload,
        currentWithdrawal: null
      };

    case UPDATE_WITHDRAWAL_STATUS_REQUEST:
      return {
        ...state,
        updating: true,
        currentWithdrawalError: null
      };

    case UPDATE_WITHDRAWAL_STATUS_SUCCESS:
      return {
        ...state,
        updating: false,
        currentWithdrawalError: null,
        currentWithdrawal: action.payload,
        updateModalVisible: false,
        confirmModalVisible: false,
        // Update the withdrawal in the list if it exists
        withdrawals: state.withdrawals.map(withdrawal =>
          withdrawal._id === action.payload._id ? action.payload : withdrawal
        )
      };

    case UPDATE_WITHDRAWAL_STATUS_FAILURE:
      return {
        ...state,
        updating: false,
        currentWithdrawalError: action.payload
      };

    case SET_UPDATE_MODAL_VISIBLE:
      return {
        ...state,
        updateModalVisible: action.payload
      };

    case SET_CONFIRM_MODAL_VISIBLE:
      return {
        ...state,
        confirmModalVisible: action.payload
      };

    case SET_NEW_STATUS:
      return {
        ...state,
        newStatus: action.payload
      };

    case SET_TRANSACTION_ID:
      return {
        ...state,
        transactionId: action.payload
      };

    case SET_FAILURE_REASON:
      return {
        ...state,
        failureReason: action.payload
      };

    case SET_ADMIN_NOTES:
      return {
        ...state,
        adminNotes: action.payload
      };

    case CLEAR_WITHDRAWAL_FORM:
      return {
        ...state,
        newStatus: state.currentWithdrawal?.status || '',
        transactionId: state.currentWithdrawal?.transactionId || '',
        failureReason: state.currentWithdrawal?.failureReason || '',
        adminNotes: '',
        updateModalVisible: false,
        confirmModalVisible: false
      };

    default:
      return state;
  }
};