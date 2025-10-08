export interface Withdrawal {
  _id: string;
  userId: string;
  telegramId: string;
  username: string;
  firstName?: string;
  lastName?: string;
  amount: number;
  method: string;
  walletId: string;
  currency: string;
  status: string;
  transactionId?: string;
  failureReason?: string;
  createdAt: string;
  updatedAt: string;
  processedAt?: string;
  adminNotes?: string;
  ipAddress?: string;
  userAgent?: string;
}

export interface WithdrawalFilters {
  status?: string;
  username?: string;
  startDate?: string;
  endDate?: string;
}

export interface WithdrawalPagination {
  currentPage: number;
  totalCount: number;
  pageSize: number;
}

export interface WithdrawalSummary {
  statusBreakdown: Array<{
    _id: string;
    count: number;
  }>;
  totalCompletedAmount: number;
}

export interface AdminWithdrawalsState {
  withdrawals: Withdrawal[];
  loading: boolean;
  error: string | null;
  pagination: WithdrawalPagination;
  summary: WithdrawalSummary;
  filters: WithdrawalFilters;
  selectedWithdrawal: Withdrawal | null;
  // UI State
  searchText: string;
  statusFilter: string;
  dateRange: [string, string] | null;
  // Individual withdrawal state
  currentWithdrawal: Withdrawal | null;
  currentWithdrawalLoading: boolean;
  currentWithdrawalError: string | null;
  updateModalVisible: boolean;
  updating: boolean;
  newStatus: string;
  transactionId: string;
  failureReason: string;
  adminNotes: string;
  confirmModalVisible: boolean;
}

// Action Types
export const FETCH_WITHDRAWALS_REQUEST = 'admin/withdrawals/FETCH_WITHDRAWALS_REQUEST';
export const FETCH_WITHDRAWALS_SUCCESS = 'admin/withdrawals/FETCH_WITHDRAWALS_SUCCESS';
export const FETCH_WITHDRAWALS_FAILURE = 'admin/withdrawals/FETCH_WITHDRAWALS_FAILURE';

export const APPROVE_WITHDRAWAL_REQUEST = 'admin/withdrawals/APPROVE_WITHDRAWAL_REQUEST';
export const APPROVE_WITHDRAWAL_SUCCESS = 'admin/withdrawals/APPROVE_WITHDRAWAL_SUCCESS';
export const APPROVE_WITHDRAWAL_FAILURE = 'admin/withdrawals/APPROVE_WITHDRAWAL_FAILURE';

export const REJECT_WITHDRAWAL_REQUEST = 'admin/withdrawals/REJECT_WITHDRAWAL_REQUEST';
export const REJECT_WITHDRAWAL_SUCCESS = 'admin/withdrawals/REJECT_WITHDRAWAL_SUCCESS';
export const REJECT_WITHDRAWAL_FAILURE = 'admin/withdrawals/REJECT_WITHDRAWAL_FAILURE';

export const SET_WITHDRAWAL_FILTERS = 'admin/withdrawals/SET_WITHDRAWAL_FILTERS';
export const SET_SELECTED_WITHDRAWAL = 'admin/withdrawals/SET_SELECTED_WITHDRAWAL';
export const CLEAR_WITHDRAWAL_ERROR = 'admin/withdrawals/CLEAR_WITHDRAWAL_ERROR';

// UI State Action Types
export const SET_SEARCH_TEXT = 'admin/withdrawals/SET_SEARCH_TEXT';
export const SET_STATUS_FILTER = 'admin/withdrawals/SET_STATUS_FILTER';
export const SET_DATE_RANGE = 'admin/withdrawals/SET_DATE_RANGE';
export const CLEAR_FILTERS = 'admin/withdrawals/CLEAR_FILTERS';

// Individual Withdrawal Action Types
export const FETCH_WITHDRAWAL_DETAILS_REQUEST = 'admin/withdrawals/FETCH_WITHDRAWAL_DETAILS_REQUEST';
export const FETCH_WITHDRAWAL_DETAILS_SUCCESS = 'admin/withdrawals/FETCH_WITHDRAWAL_DETAILS_SUCCESS';
export const FETCH_WITHDRAWAL_DETAILS_FAILURE = 'admin/withdrawals/FETCH_WITHDRAWAL_DETAILS_FAILURE';

export const UPDATE_WITHDRAWAL_STATUS_REQUEST = 'admin/withdrawals/UPDATE_WITHDRAWAL_STATUS_REQUEST';
export const UPDATE_WITHDRAWAL_STATUS_SUCCESS = 'admin/withdrawals/UPDATE_WITHDRAWAL_STATUS_SUCCESS';
export const UPDATE_WITHDRAWAL_STATUS_FAILURE = 'admin/withdrawals/UPDATE_WITHDRAWAL_STATUS_FAILURE';

// Individual Withdrawal UI Action Types
export const SET_UPDATE_MODAL_VISIBLE = 'admin/withdrawals/SET_UPDATE_MODAL_VISIBLE';
export const SET_CONFIRM_MODAL_VISIBLE = 'admin/withdrawals/SET_CONFIRM_MODAL_VISIBLE';
export const SET_NEW_STATUS = 'admin/withdrawals/SET_NEW_STATUS';
export const SET_TRANSACTION_ID = 'admin/withdrawals/SET_TRANSACTION_ID';
export const SET_FAILURE_REASON = 'admin/withdrawals/SET_FAILURE_REASON';
export const SET_ADMIN_NOTES = 'admin/withdrawals/SET_ADMIN_NOTES';
export const CLEAR_WITHDRAWAL_FORM = 'admin/withdrawals/CLEAR_WITHDRAWAL_FORM';

// Action Interfaces
export interface FetchWithdrawalsRequestAction {
  type: typeof FETCH_WITHDRAWALS_REQUEST;
  payload: {
    page?: number;
    limit?: number;
    filters?: WithdrawalFilters;
  };
}

export interface FetchWithdrawalsSuccessAction {
  type: typeof FETCH_WITHDRAWALS_SUCCESS;
  payload: {
    withdrawals: Withdrawal[];
    pagination: WithdrawalPagination;
    summary: WithdrawalSummary;
  };
}

export interface FetchWithdrawalsFailureAction {
  type: typeof FETCH_WITHDRAWALS_FAILURE;
  payload: string;
}

export interface ApproveWithdrawalRequestAction {
  type: typeof APPROVE_WITHDRAWAL_REQUEST;
  payload: {
    withdrawalId: string;
    transactionId?: string;
  };
}

export interface ApproveWithdrawalSuccessAction {
  type: typeof APPROVE_WITHDRAWAL_SUCCESS;
  payload: Withdrawal;
}

export interface ApproveWithdrawalFailureAction {
  type: typeof APPROVE_WITHDRAWAL_FAILURE;
  payload: string;
}

export interface RejectWithdrawalRequestAction {
  type: typeof REJECT_WITHDRAWAL_REQUEST;
  payload: {
    withdrawalId: string;
    reason: string;
  };
}

export interface RejectWithdrawalSuccessAction {
  type: typeof REJECT_WITHDRAWAL_SUCCESS;
  payload: Withdrawal;
}

export interface RejectWithdrawalFailureAction {
  type: typeof REJECT_WITHDRAWAL_FAILURE;
  payload: string;
}

export interface SetWithdrawalFiltersAction {
  type: typeof SET_WITHDRAWAL_FILTERS;
  payload: WithdrawalFilters;
}

export interface SetSelectedWithdrawalAction {
  type: typeof SET_SELECTED_WITHDRAWAL;
  payload: Withdrawal | null;
}

export interface ClearWithdrawalErrorAction {
  type: typeof CLEAR_WITHDRAWAL_ERROR;
}

// UI State Action Interfaces
export interface SetSearchTextAction {
  type: typeof SET_SEARCH_TEXT;
  payload: string;
}

export interface SetStatusFilterAction {
  type: typeof SET_STATUS_FILTER;
  payload: string;
}

export interface SetDateRangeAction {
  type: typeof SET_DATE_RANGE;
  payload: [string, string] | null;
}

export interface ClearFiltersAction {
  type: typeof CLEAR_FILTERS;
}

// Individual Withdrawal Action Interfaces
export interface FetchWithdrawalDetailsRequestAction {
  type: typeof FETCH_WITHDRAWAL_DETAILS_REQUEST;
  payload: string; // withdrawalId
}

export interface FetchWithdrawalDetailsSuccessAction {
  type: typeof FETCH_WITHDRAWAL_DETAILS_SUCCESS;
  payload: Withdrawal;
}

export interface FetchWithdrawalDetailsFailureAction {
  type: typeof FETCH_WITHDRAWAL_DETAILS_FAILURE;
  payload: string;
}

export interface UpdateWithdrawalStatusRequestAction {
  type: typeof UPDATE_WITHDRAWAL_STATUS_REQUEST;
  payload: {
    withdrawalId: string;
    status: string;
    transactionId?: string;
    failureReason?: string;
    adminNotes?: string;
  };
}

export interface UpdateWithdrawalStatusSuccessAction {
  type: typeof UPDATE_WITHDRAWAL_STATUS_SUCCESS;
  payload: Withdrawal;
}

export interface UpdateWithdrawalStatusFailureAction {
  type: typeof UPDATE_WITHDRAWAL_STATUS_FAILURE;
  payload: string;
}

// Individual Withdrawal UI Action Interfaces
export interface SetUpdateModalVisibleAction {
  type: typeof SET_UPDATE_MODAL_VISIBLE;
  payload: boolean;
}

export interface SetConfirmModalVisibleAction {
  type: typeof SET_CONFIRM_MODAL_VISIBLE;
  payload: boolean;
}

export interface SetNewStatusAction {
  type: typeof SET_NEW_STATUS;
  payload: string;
}

export interface SetTransactionIdAction {
  type: typeof SET_TRANSACTION_ID;
  payload: string;
}

export interface SetFailureReasonAction {
  type: typeof SET_FAILURE_REASON;
  payload: string;
}

export interface SetAdminNotesAction {
  type: typeof SET_ADMIN_NOTES;
  payload: string;
}

export interface ClearWithdrawalFormAction {
  type: typeof CLEAR_WITHDRAWAL_FORM;
}

export type AdminWithdrawalsActionTypes =
  | FetchWithdrawalsRequestAction
  | FetchWithdrawalsSuccessAction
  | FetchWithdrawalsFailureAction
  | ApproveWithdrawalRequestAction
  | ApproveWithdrawalSuccessAction
  | ApproveWithdrawalFailureAction
  | RejectWithdrawalRequestAction
  | RejectWithdrawalSuccessAction
  | RejectWithdrawalFailureAction
  | SetWithdrawalFiltersAction
  | SetSelectedWithdrawalAction
  | ClearWithdrawalErrorAction
  | SetSearchTextAction
  | SetStatusFilterAction
  | SetDateRangeAction
  | ClearFiltersAction
  | FetchWithdrawalDetailsRequestAction
  | FetchWithdrawalDetailsSuccessAction
  | FetchWithdrawalDetailsFailureAction
  | UpdateWithdrawalStatusRequestAction
  | UpdateWithdrawalStatusSuccessAction
  | UpdateWithdrawalStatusFailureAction
  | SetUpdateModalVisibleAction
  | SetConfirmModalVisibleAction
  | SetNewStatusAction
  | SetTransactionIdAction
  | SetFailureReasonAction
  | SetAdminNotesAction
  | ClearWithdrawalFormAction;
