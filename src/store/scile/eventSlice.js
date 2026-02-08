import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  activeEmployees: [],
  selectedEmployee: null,
  salaryHistory: [],
  promotionHistory: [],
  proposalHistory: [],
  currentFormId: null, 
  editingRecordId: null, 
  isSaved: false, 
  submitting: false,
  error: null,
};

const eventSlice = createSlice({
  name: "event",
  initialState,
  reducers: {
    fetchActiveEmployeesRequest: (state) => {
      state.loading = true;
    },
    fetchActiveEmployeesSuccess: (state, action) => {
      state.loading = false;
      state.activeEmployees = action.payload;
    },

    setSelectedEmployee: (state, action) => {
      state.selectedEmployee = action.payload;
      state.currentFormId = null;
      state.editingRecordId = null;
      state.isSaved = false;
    },

    setEditingRecord: (state, action) => {
      state.editingRecordId = action.payload.id;
      state.currentFormId = action.payload.id;
      state.isSaved = false; // Reset saved state khi bắt đầu sửa nội dung mới
    },

    fetchSalaryHistoryRequest: (state) => {
      state.loading = true;
    },
    fetchSalaryHistorySuccess: (state, action) => {
      state.loading = false;
      state.salaryHistory = action.payload;
    },

    fetchPromotionHistoryRequest: (state) => {
      state.loading = true;
    },
    fetchPromotionHistorySuccess: (state, action) => {
      state.loading = false;
      state.promotionHistory = action.payload;
    },

    fetchProposalHistoryRequest: (state) => {
      state.loading = true;
    },
    fetchProposalHistorySuccess: (state, action) => {
      state.loading = false;
      state.proposalHistory = action.payload;
    },

    createEventRequest: (state) => {
      state.submitting = true;
    },
    createEventSuccess: (state, action) => {
      state.submitting = false;
      state.isSaved = true;
      state.currentFormId = action.payload?.id ;
    },

    updateEventRequest: (state) => {
      state.submitting = true;
    },
    updateEventSuccess: (state) => {
      state.submitting = false;
      state.isSaved = true;
    },

    submitEventRequest: (state) => {
      state.submitting = true;
    },
    submitEventSuccess: (state) => {
      state.submitting = false;
      state.isSaved = false;
      state.currentFormId = null;
      state.editingRecordId = null;
    },

    setEventError: (state, action) => {
      state.submitting = false;
      state.loading = false;
      state.error = action.payload;
    },

    resetEventState: (state) => {
      state.currentFormId = null;
      state.editingRecordId = null;
      state.isSaved = false;
    },
  },
});

export const {
  fetchActiveEmployeesRequest,
  fetchActiveEmployeesSuccess,
  setSelectedEmployee,
  setEditingRecord,
  fetchSalaryHistoryRequest,
  fetchSalaryHistorySuccess,
  fetchPromotionHistoryRequest,
  fetchPromotionHistorySuccess,
  fetchProposalHistoryRequest,
  fetchProposalHistorySuccess,
  createEventRequest,
  createEventSuccess,
  updateEventRequest,
  updateEventSuccess,
  submitEventRequest,
  submitEventSuccess,
  setEventError,
  resetEventState,
} = eventSlice.actions;

export default eventSlice.reducer;
