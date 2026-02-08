import axios from 'axios';

const BASE_URL = 'https://manageremployeebackend-production.up.railway.app';

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
});

apiClient.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

apiClient.interceptors.response.use(
  res => res.data,
  err => {
    const msg = err.response?.data?.message || 'Lỗi kết nối server';
    return Promise.reject(new Error(msg));
  }
);

// Auth
export const loginApi = (credentials) => apiClient.post('/auth/login', credentials);

// Employees
export const getAllEmployeesApi = () => apiClient.get('/api/employees/list');
export const getEmployeeDetailApi = (id) => apiClient.get(`/api/employees/Detail/${id}`);
export const createEmployeeApi = (data) => apiClient.post('/api/employees', data);
export const updateEmployeeApi = (id, data) => apiClient.put(`/api/employees/${id}`, data);
export const deleteEmployeeApi = (id) => apiClient.delete(`/api/employees/${id}`);

// Family - Lưu ý: PUT truyền familyId, POST truyền empId
export const createFamilyApi = (empId, data) => apiClient.post(`/api/employees/${empId}/empolyfamily`, data);
export const updateFamilyApi = (familyId, data) => apiClient.put(`/api/employees/${familyId}/empolyfamily`, data);

// Certificates - Lưu ý: PUT truyền certId, POST truyền empId
export const createCertsApi = (empId, data) => apiClient.post(`/api/employees/${empId}/certificates`, data);
export const updateCertsApi = (certId, data) => apiClient.put(`/api/employees/${certId}/certificates`, data);

// Register
export const registerEmployeeApi = (id) => apiClient.post(`/api/employees/${id}/register`);
//
export const getFamilyByEmployeeApi = (empId) =>
  apiClient.get(`/api/employees/${empId}/family`);

// Certificates detail
export const getCertificatesByEmployeeApi = (empId) =>
  apiClient.get(`/api/employees/${empId}/certificate`);
// Check Registration Requirements
export const checkRegistrationApi = (id) => apiClient.get(`/api/employees/${id}/registration/check`);

// Registration Forms (Biểu mẫu)
export const createRegistrationFormApi = (empId, data) => apiClient.post(`/api/employees/${empId}/registration`, data);
export const getManagersApi = () => apiClient.get('api/employees/users/managers');
export const submitToManagerApi = (formId, data) => apiClient.post(`/api/employees/${formId}/submit`, data);
export const getRegistrationByEmployeeApi = (empId) => apiClient.get(`/api/employees/${empId}/registration`);
export const updateRegistrationFormApi = (data) => apiClient.put(`/api/employees/registration`, data);



//
export const getEmployeeViewDetailApi = (empId) => apiClient.get(`/api/employees/${empId}/view-detail`);
export const processRegistrationApi = (data) => apiClient.post('/api/employees/process', data);


// --- API DANH SÁCH CHỜ (PENDING) ---
export const getPendingRegistrationsApi = () => apiClient.get('/api/employees/registration/pending');
export const getPendingSalaryApi = () => apiClient.get('/api/forms/pending/Salary');
export const getPendingPromotionApi = () => apiClient.get('/api/forms/pending/Promotion');
export const getPendingProposalApi = () => apiClient.get('/api/forms/pending/Proposal');

// --- API CHI TIẾT BIỂU MẪU ---
export const getRegistrationDetailApi = (formId) => apiClient.get(`/api/form-detail/registration/${formId}`);
export const getSalaryDetailApi = (formId) => apiClient.get(`/api/form-detail/salary-increase/${formId}`);
export const getPromotionDetailApi = (formId) => apiClient.get(`/api/form-detail/promotion/${formId}`);
export const getTerminationDetailApi = (formId) => apiClient.get(`/api/contract-termination/${formId}`);
export const getProposalDetailApi = (formId) => apiClient.get(`/api/form-detail/proposal/${formId}`);

// Lấy danh sách nhân viên cho dropdown
export const getActiveEmployeesApi = () => apiClient.get('/api/employees/list/approved');

// Tăng lương (Salary Increase)
export const getSalaryHistoryApi = (empId) => apiClient.get(`/api/forms/${empId}/salary-increases`);
export const updateSalaryIncreaseApi = (id, data) => apiClient.put(`/api/forms/salary-increase/${id}`, data);
export const createSalaryIncreaseApi = (data) => apiClient.post('/api/forms/salary-increase', data);
export const submitSalaryIncreaseApi = (data) => apiClient.post('/api/forms/salary/submit', data); // SubmitFormRequest

// Thăng chức (Promotion)
export const getPromotionHistoryApi = (empId) => apiClient.get(`/api/forms/${empId}/promotions`);
export const updatePromotionApi = (id, data) => apiClient.put(`/api/forms/promotion/${id}`, data);
export const createPromotionApi = (data) => apiClient.post('/api/forms/promotion', data);
export const submitPromotionApi = (data) => apiClient.post('/api/forms/promotion/submit', data);

// Đề xuất (Proposal)
export const getProposalHistoryApi = (empId) => apiClient.get(`/api/forms/${empId}/proposals`);
export const updateProposalApi = (id, data) => apiClient.put(`/api/forms/proposal/${id}`, data);
export const createProposalApi = (data) => apiClient.post('/api/forms/proposal', data);
export const submitProposalApi = (data) => apiClient.post('/api/forms/proposal/submit', data);
// --- API XỬ LÝ PHÊ DUYỆT (CHỈNH SỬA THEO YÊU CẦU) ---
export const processFormApi = (type, data) => {
    // 1. Phê duyệt yêu cầu Đơn xin việc (Registration)
    if (type === 'REGISTRATION') {
        return apiClient.post('/api/employees/registration/process', data);
    }
    
    // 2. Phê duyệt các Diễn biến (Salary, Promotion, Proposal)
    const endpointMap = {
        'SALARY': '/api/forms/salary/process',
        'PROMOTION': '/api/forms/promotion/process',
        'PROPOSAL': '/api/forms/proposal/process',
        'TERMINATION':'/api/contract-termination/leader-handle'
    };
    return apiClient.post(endpointMap[type], data);
};
//
export const getTerminationListApi = () => apiClient.get('/api/contract-termination/all'); // Giả định endpoint lấy danh sách
export const createTerminationApi = (data) => apiClient.post('/api/contract-termination/create', data);
export const submitTerminationApi = (data) => apiClient.post('/api/contract-termination/submit', data);

// --- API LÃNH ĐẠO PHÊ DUYỆT ---
export const leaderHandleTerminationApi = (data) => apiClient.post('/api/contract-termination/leader-handle', data);

// --- API DANH SÁCH CHỜ DUYỆT (CHO APPROVAL MANAGEMENT) ---
export const getPendingTerminationApi = () => apiClient.get('/api/contract-termination/pending');

