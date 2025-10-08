import {
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
  CLEAR_WITHDRAWAL_FORM,
  FetchWithdrawalsRequestAction,
  FetchWithdrawalsSuccessAction,
  FetchWithdrawalsFailureAction,
  ApproveWithdrawalRequestAction,
  ApproveWithdrawalSuccessAction,
  ApproveWithdrawalFailureAction,
  RejectWithdrawalRequestAction,
  RejectWithdrawalSuccessAction,
  RejectWithdrawalFailureAction,
  SetWithdrawalFiltersAction,
  SetSelectedWithdrawalAction,
  ClearWithdrawalErrorAction,
  SetSearchTextAction,
  SetStatusFilterAction,
  SetDateRangeAction,
  ClearFiltersAction,
  FetchWithdrawalDetailsRequestAction,
  FetchWithdrawalDetailsSuccessAction,
  FetchWithdrawalDetailsFailureAction,
  UpdateWithdrawalStatusRequestAction,
  UpdateWithdrawalStatusSuccessAction,
  UpdateWithdrawalStatusFailureAction,
  SetUpdateModalVisibleAction,
  SetConfirmModalVisibleAction,
  SetNewStatusAction,
  SetTransactionIdAction,
  SetFailureReasonAction,
  SetAdminNotesAction,
  ClearWithdrawalFormAction,
  WithdrawalFilters,
  Withdrawal,
  WithdrawalPagination,
  WithdrawalSummary
} from './types';

// Fetch Withdrawals Actions
export const fetchWithdrawalsRequest = (
  page?: number,
  limit?: number,
  filters?: WithdrawalFilters
): FetchWithdrawalsRequestAction => ({
  type: FETCH_WITHDRAWALS_REQUEST,
  payload: { page, limit, filters }
});

export const fetchWithdrawalsSuccess = (
  withdrawals: Withdrawal[],
  pagination: WithdrawalPagination,
  summary: WithdrawalSummary
): FetchWithdrawalsSuccessAction => ({
  type: FETCH_WITHDRAWALS_SUCCESS,
  payload: { withdrawals, pagination, summary }
});

export const fetchWithdrawalsFailure = (error: string): FetchWithdrawalsFailureAction => ({
  type: FETCH_WITHDRAWALS_FAILURE,
  payload: error
});

// Approve Withdrawal Actions
export const approveWithdrawalRequest = (
  withdrawalId: string,
  transactionId?: string
): ApproveWithdrawalRequestAction => ({
  type: APPROVE_WITHDRAWAL_REQUEST,
  payload: { withdrawalId, transactionId }
});

export const approveWithdrawalSuccess = (withdrawal: Withdrawal): ApproveWithdrawalSuccessAction => ({
  type: APPROVE_WITHDRAWAL_SUCCESS,
  payload: withdrawal
});

export const approveWithdrawalFailure = (error: string): ApproveWithdrawalFailureAction => ({
  type: APPROVE_WITHDRAWAL_FAILURE,
  payload: error
});

// Reject Withdrawal Actions
export const rejectWithdrawalRequest = (
  withdrawalId: string,
  reason: string
): RejectWithdrawalRequestAction => ({
  type: REJECT_WITHDRAWAL_REQUEST,
  payload: { withdrawalId, reason }
});

export const rejectWithdrawalSuccess = (withdrawal: Withdrawal): RejectWithdrawalSuccessAction => ({
  type: REJECT_WITHDRAWAL_SUCCESS,
  payload: withdrawal
});

export const rejectWithdrawalFailure = (error: string): RejectWithdrawalFailureAction => ({
  type: REJECT_WITHDRAWAL_FAILURE,
  payload: error
});

// UI Actions
export const setWithdrawalFilters = (filters: WithdrawalFilters): SetWithdrawalFiltersAction => ({
  type: SET_WITHDRAWAL_FILTERS,
  payload: filters
});

export const setSelectedWithdrawal = (withdrawal: Withdrawal | null): SetSelectedWithdrawalAction => ({
  type: SET_SELECTED_WITHDRAWAL,
  payload: withdrawal
});

export const clearWithdrawalError = (): ClearWithdrawalErrorAction => ({
  type: CLEAR_WITHDRAWAL_ERROR
});

// UI State Actions
export const setSearchText = (searchText: string): SetSearchTextAction => ({
  type: SET_SEARCH_TEXT,
  payload: searchText
});

export const setStatusFilter = (statusFilter: string): SetStatusFilterAction => ({
  type: SET_STATUS_FILTER,
  payload: statusFilter
});

export const setDateRange = (dateRange: [string, string] | null): SetDateRangeAction => ({
  type: SET_DATE_RANGE,
  payload: dateRange
});

export const clearFilters = (): ClearFiltersAction => ({
  type: CLEAR_FILTERS
});

// Individual Withdrawal Actions
export const fetchWithdrawalDetailsRequest = (withdrawalId: string): FetchWithdrawalDetailsRequestAction => ({
  type: FETCH_WITHDRAWAL_DETAILS_REQUEST,
  payload: withdrawalId
});

export const fetchWithdrawalDetailsSuccess = (withdrawal: Withdrawal): FetchWithdrawalDetailsSuccessAction => ({
  type: FETCH_WITHDRAWAL_DETAILS_SUCCESS,
  payload: withdrawal
});

export const fetchWithdrawalDetailsFailure = (error: string): FetchWithdrawalDetailsFailureAction => ({
  type: FETCH_WITHDRAWAL_DETAILS_FAILURE,
  payload: error
});

export const updateWithdrawalStatusRequest = (
  withdrawalId: string,
  status: string,
  transactionId?: string,
  failureReason?: string,
  adminNotes?: string
): UpdateWithdrawalStatusRequestAction => ({
  type: UPDATE_WITHDRAWAL_STATUS_REQUEST,
  payload: { withdrawalId, status, transactionId, failureReason, adminNotes }
});

export const updateWithdrawalStatusSuccess = (withdrawal: Withdrawal): UpdateWithdrawalStatusSuccessAction => ({
  type: UPDATE_WITHDRAWAL_STATUS_SUCCESS,
  payload: withdrawal
});

export const updateWithdrawalStatusFailure = (error: string): UpdateWithdrawalStatusFailureAction => ({
  type: UPDATE_WITHDRAWAL_STATUS_FAILURE,
  payload: error
});

// Individual Withdrawal UI Actions
export const setUpdateModalVisible = (visible: boolean): SetUpdateModalVisibleAction => ({
  type: SET_UPDATE_MODAL_VISIBLE,
  payload: visible
});

export const setConfirmModalVisible = (visible: boolean): SetConfirmModalVisibleAction => ({
  type: SET_CONFIRM_MODAL_VISIBLE,
  payload: visible
});

export const setNewStatus = (status: string): SetNewStatusAction => ({
  type: SET_NEW_STATUS,
  payload: status
});

export const setTransactionId = (transactionId: string): SetTransactionIdAction => ({
  type: SET_TRANSACTION_ID,
  payload: transactionId
});

export const setFailureReason = (reason: string): SetFailureReasonAction => ({
  type: SET_FAILURE_REASON,
  payload: reason
});

export const setAdminNotes = (notes: string): SetAdminNotesAction => ({
  type: SET_ADMIN_NOTES,
  payload: notes
});

export const clearWithdrawalForm = (): ClearWithdrawalFormAction => ({
  type: CLEAR_WITHDRAWAL_FORM
});