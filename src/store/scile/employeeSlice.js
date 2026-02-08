import { createSlice } from "@reduxjs/toolkit";
import { EmployeeStatus } from "../../utils/contstants";

const initialState = {
  list: [],
  selectedDetail: null,
  loading: false,
  error: null,
  isSaveSuccess: false,
  regCheck: {
    canRegister: false,
    message: "",
    loading: false,
  },
  registration: {
    currentFormData: null,
    currentFormId: null,
    managers: [],
    loading: false,
    success: false,
  },
};

const employeeSlice = createSlice({
  name: "employee",
  initialState,
  reducers: {
    fetchEmployeesRequest: (state) => {
      state.loading = true;
    },
    fetchEmployeesSuccess: (state, action) => {
      state.loading = false;
      state.list = action.payload;
    },
    fetchEmployeesFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    fetchEmployeeDetailRequest: (state) => {
      state.loading = true;
    },
    fetchEmployeeDetailSuccess: (state, action) => {
      state.loading = false;
      state.selectedDetail = action.payload;
    },

    resetSelectedDetail: (state) => {
      state.selectedDetail = null;
      state.isSaveSuccess = false;
    },

    fetchEmployeeDetailFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    saveEmployeeFullRequest: (state) => {
      state.loading = true;
      state.isSaveSuccess = false;
    },
    saveEmployeeFullSuccess: (state, action) => {
      state.loading = false;
      state.selectedDetail = action.payload;
      state.isSaveSuccess = true;
    },
    saveEmployeeFullFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      console.log("decheck222", action.payload);
    },

    deleteEmployeeRequest: (state) => {
      state.loading = true;
    },
    deleteEmployeeSuccess: (state, action) => {
      state.loading = false;
      state.list = state.list.filter((e) => e.id !== action.payload);
    },

    registerEmployeeRequest: (state) => {
      state.loading = true;
    },
    registerEmployeeSuccess: (state, action) => {
      state.loading = false;
      const emp = state.list.find((e) => e.id === action.payload);
      if (emp) emp.status = EmployeeStatus.CHO_XU_LY;
    },
    checkRegistrationRequest: (state, action) => {
      state.regCheck.loading = true;
      state.regCheck.message = "";
    },
    checkRegistrationSuccess: (state, action) => {
      state.regCheck.loading = false;
      state.regCheck.canRegister = action.payload.data === true;
      state.regCheck.message = action.payload.message || "Success";
    },
    checkRegistrationFailure: (state, action) => {
      state.regCheck.loading = false;
      state.regCheck.canRegister = false;
      state.regCheck.message = action.payload;
    },
    fetchExistingRegistrationRequest: (state) => {
      state.registration.loading = true;
    },
    fetchExistingRegistrationSuccess: (state, action) => {
      state.registration.loading = false;
      state.registration.currentFormId = action.payload?.id || null;
      state.registration.currentFormData = action.payload || null;
    },
    updateRegistrationRequest: (state) => {
      state.registration.loading = true;
    },
    updateRegistrationSuccess: (state, action) => {
      state.registration.loading = false;
      state.registration.success = true;
    },

    createRegistrationRequest: (state) => {
      state.registration.loading = true;
    },
    createRegistrationSuccess: (state, action) => {
      state.registration.loading = false;
      state.registration.currentFormId = action.payload.id;
      state.registration.success = true;
    },
    fetchManagersRequest: (state) => {
      state.registration.loading = true;
    },
    fetchManagersSuccess: (state, action) => {
      state.registration.loading = false;
      state.registration.managers = action.payload;
    },
    submitToManagerRequest: (state) => {
      state.registration.loading = true;
    },
    submitToManagerSuccess: (state) => {
      state.registration.loading = false;
      state.registration.currentFormId = null;
    },

    resetSelectedDetail: (state) => {
      state.selectedDetail = null;
      state.isSaveSuccess = false;
      state.regCheck = { canRegister: false, message: "", loading: false };
      state.registration.currentFormId = null;
    },

    deleteEmployeeRequest: (state) => {
      state.loading = true;
    },
    deleteEmployeeSuccess: (state, action) => {
      state.loading = false;
      state.list = state.list.filter((e) => e.id !== action.payload);
    },

    registerEmployeeRequest: (state) => {
      state.loading = true;
    },
    registerEmployeeSuccess: (state, action) => {
      state.loading = false;
      const emp = state.list.find((e) => e.id === action.payload);
      if (emp) emp.status = EmployeeStatus.CHO_XU_LY;
    },
  },
});

export const {
  fetchEmployeesRequest,
  fetchEmployeesSuccess,
  fetchEmployeesFailure,
  fetchEmployeeDetailRequest,
  fetchEmployeeDetailSuccess,
  saveEmployeeFullRequest,
  saveEmployeeFullSuccess,
  checkRegistrationRequest,
  checkRegistrationSuccess,
  checkRegistrationFailure,
  createRegistrationRequest,
  createRegistrationSuccess,
  fetchManagersRequest,
  fetchManagersSuccess,
  submitToManagerRequest,
  submitToManagerSuccess,
  resetSelectedDetail,
  deleteEmployeeRequest,
  deleteEmployeeSuccess,
  registerEmployeeRequest,
  registerEmployeeSuccess,
  fetchEmployeeDetailFailure,
  saveEmployeeFullFailure,
  updateRegistrationSuccess,
  updateRegistrationRequest,
  fetchExistingRegistrationRequest,
  fetchExistingRegistrationSuccess,
} = employeeSlice.actions;

export default employeeSlice.reducer;
