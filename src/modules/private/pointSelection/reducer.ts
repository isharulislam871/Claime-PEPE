import { PointSelectionState, PointSelectionAction, PointSelectionActionTypes } from './types';

const initialState: PointSelectionState = {
  // UI State
  showAmountSheet: false,
  
  // Data State
  quickAmounts: [
    { 
      id: '1000', 
      title: '1K Points', 
      description: '1,000 points',
      category: 'Fixed Amounts',
      icon: '🎯'
    },
    { 
      id: '5000', 
      title: '5K Points', 
      description: '5,000 points',
      category: 'Fixed Amounts',
      icon: '🎯'
    },
    { 
      id: '10000', 
      title: '10K Points', 
      description: '10,000 points',
      category: 'Fixed Amounts',
      icon: '🎯'
    },
    { 
      id: '25000', 
      title: '25K Points', 
      description: '25,000 points',
      category: 'Fixed Amounts',
      icon: '🎯'
    },
    { 
      id: '50000', 
      title: '50K Points', 
      description: '50,000 points',
      category: 'Fixed Amounts',
      icon: '🎯'
    },
    { 
      id: '100000', 
      title: '100K Points', 
      description: '100,000 points',
      category: 'Fixed Amounts',
      icon: '🎯'
    }
  ],
  loading: false,
  error: null
};

export const pointSelectionReducer = (
  state = initialState, 
  action: PointSelectionAction
): PointSelectionState => {
  switch (action.type) {
    // UI Actions
    case PointSelectionActionTypes.SET_SHOW_AMOUNT_SHEET:
      return {
        ...state,
        showAmountSheet: action.payload
      };

    // Quick Amounts Actions
    case PointSelectionActionTypes.FETCH_QUICK_AMOUNTS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };

    case PointSelectionActionTypes.FETCH_QUICK_AMOUNTS_SUCCESS:
      return {
        ...state,
        loading: false,
        quickAmounts: action.payload.quickAmounts,
        error: null
      };

    case PointSelectionActionTypes.FETCH_QUICK_AMOUNTS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      };

    // Clear Error
    case PointSelectionActionTypes.CLEAR_POINT_SELECTION_ERROR:
      return {
        ...state,
        error: null
      };

    default:
      return state;
  }
};
