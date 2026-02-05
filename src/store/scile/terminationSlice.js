
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  list: [],
  managers: [],
  loading: false,
  submitting: false,
  error: null,
  success: false
};

const terminationSlice = createSlice({
  name: 'termination',
  initialState,
  reducers: {
    fetchTerminationListRequest: (state) => { state.loading = true; },
    fetchTerminationListSuccess: (state, action) => {
      state.loading = false;
      state.list = action.payload;
    },
    
    fetchManagersRequest: (state) => { state.loading = true; },
    fetchManagersSuccess: (state, action) => {
      state.loading = false;
      state.managers = action.payload;
    },

    // Luồng gộp: Create + Submit
    submitTerminationFlowRequest: (state) => { state.submitting = true; state.success = false; },
    submitTerminationFlowSuccess: (state) => {
      state.submitting = false;
      state.success = true;
    },
    
    setTerminationError: (state, action) => {
      state.loading = false;
      state.submitting = false;
      state.error = action.payload;
    },
    resetTerminationState: (state) => {
        state.success = false;
        state.error = null;
    }
  }
});

export const {
  fetchTerminationListRequest, fetchTerminationListSuccess,
  fetchManagersRequest, fetchManagersSuccess,
  submitTerminationFlowRequest, submitTerminationFlowSuccess,
  setTerminationError, resetTerminationState
} = terminationSlice.actions;

export default terminationSlice.reducer;
