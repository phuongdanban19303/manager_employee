import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  pendingList: [],
  selectedForm: null, // Chi tiết đơn đăng ký
  selectedEmployeeDetail: null,
  selectedFormType: null, // REGISTRATION, SALARY, PROMOTION, PROPOSAL
  // Chi tiết full thông tin nhân viên (Gia đình, Văn bằng...)
  loading: false,
  processing: false,
  error: null,
};

const formSlice = createSlice({
  name: "formSlice",
  initialState,
  reducers: {
    fetchPendingRequest: (state) => {
      state.loading = true;
    },
    fetchPendingSuccess: (state, action) => {
      state.loading = false;
      state.pendingList = action.payload;
    },
    fetchPendingFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    fetchApprovalDetailRequest: (state, action) => {
      state.loading = true;
      state.selectedForm = null;
      state.selectedEmployeeDetail = null;
      state.selectedFormType = action.payload.formType;
    },
    fetchApprovalDetailSuccess: (state, action) => {
      state.loading = false;
      state.selectedForm = action.payload.form;
      state.selectedEmployeeDetail = action.payload.employee;
    },

    processApprovalRequest: (state) => {
      state.processing = true;
    },
    processApprovalSuccess: (state) => {
      state.processing = false;
      state.selectedForm = null;
      state.selectedEmployeeDetail = null;
      state.selectedFormType = null;
    },
    processApprovalFailure: (state, action) => {
      state.processing = false;
      state.error = action.payload;
    },

    resetApprovalState: (state) => {
      state.selectedForm = null;
      state.selectedEmployeeDetail = null;
      state.selectedFormType = null;
    },
  },
});

export const {
  fetchPendingRequest,
  fetchPendingSuccess,
  fetchPendingFailure,
  fetchApprovalDetailRequest,
  fetchApprovalDetailSuccess,
  processApprovalRequest,
  processApprovalSuccess,
  processApprovalFailure,
  resetApprovalState,
} = formSlice.actions;

export default formSlice.reducer;
