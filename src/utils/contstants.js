export const EmployeeStatus = {
  DRAFT: 'DRAFT',
  REJECTED: 'REJECTED',
  UPDATE: 'UPDATE',
  PENDING: 'PENDING',
  APPROVED: 'APPROVED'
};

export const STATUS_COLORS = {
  [EmployeeStatus.LUU_MOI]: 'bg-[#28a745] text-white',
  [EmployeeStatus.TU_CHOI]: 'bg-[#f8d7da] text-[#721c24] border-[#f5c6cb]',
  [EmployeeStatus.BO_SUNG]: 'bg-[#fce4ec] text-[#d81b60] border-[#f8bbd0]',
  [EmployeeStatus.CHO_XU_LY]: 'bg-[#ffc107] text-white',
  [EmployeeStatus.CHO_NOP]: 'bg-[#6f42c1] text-white',
  [EmployeeStatus.CHO_DUYET]: 'bg-[#17a2b8] text-white',
  [EmployeeStatus.DA_DUYET]: 'bg-[#28a745] text-white',
};

// Màu sắc cho các nút lọc trạng thái trên header
export const FILTER_COLORS = {
  [EmployeeStatus.LUU_MOI]: 'bg-[#28a745]',
  [EmployeeStatus.CHO_XU_LY]: 'bg-[#ffc107]',
  [EmployeeStatus.BO_SUNG]: 'bg-[#f8bbd0]',
  [EmployeeStatus.TU_CHOI]: 'bg-[#f5c6cb]',
};

export const TEAMS = ['Phòng ban', 'Frontend', 'Backend', 'Mobile', 'IT', 'QA', 'HR', 'Kỹ thuật'];