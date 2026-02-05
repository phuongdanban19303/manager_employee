import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import EmployeeModal from "./EmployeeModal";
import { EmployeeStatus, STATUS_COLORS } from "../../utils/contstants";
import { FaPlus, FaSearch, FaPencilAlt, FaTrash, FaEye, FaPowerOff, FaCircleNotch } from 'react-icons/fa';
import {
  deleteEmployeeRequest,
  fetchEmployeeDetailRequest,
  fetchEmployeesRequest,
} from "../../store/scile/employeeSlice";
import TerminationModal from "../From/TerminationModal";

const EmployeeManagement = () => {
 const dispatch = useDispatch();
  const { list, loading } = useSelector((state) => state.employee);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEmployeeID, setSelectedEmployeeID] = useState(null);
  const [viewMode, setViewMode] = useState("edit");
  const [terminationTarget, setTerminationTarget] = useState(null);

  useEffect(() => {
    dispatch(fetchEmployeesRequest());
  }, [dispatch]);

  const handleAddNew = () => {
    setSelectedEmployeeID(null);
    setViewMode("create");
    setIsModalOpen(true);
  };

  const handleEdit = (id) => {
    setSelectedEmployeeID(id);
    dispatch(fetchEmployeeDetailRequest(id));
    setViewMode("edit");
    setIsModalOpen(true);
  };

  const handleView = (id) => {
    setSelectedEmployeeID(id);
    dispatch(fetchEmployeeDetailRequest(id));
    setViewMode("view");
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa nhân viên này?")) {
      dispatch(deleteEmployeeRequest(id));
    }
  };

  const handleOpenTermination = (emp) => {
    setTerminationTarget(emp);
  };

  // Logic phân quyền nút bấm dựa trên trạng thái
  const canEdit = (status) => [EmployeeStatus.DRAFT, EmployeeStatus.UPDATE, EmployeeStatus.REJECTED].includes(status);
  const canDelete = (status) => status === EmployeeStatus.DRAFT;
  const canTerminate = (status) => status === EmployeeStatus.APPROVED || status === 'APPROVED';

  return (
    <div className="max-w-[1600px] mx-auto animate-fadeIn pb-10">
      {/* Title Section as per Image */}
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-slate-800 tracking-tight">
          Danh sách nhân viên
        </h1>
        <p className="text-slate-400 text-sm mt-1">Manager VR</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Header Actions & Filter */}
        <div className="p-5 border-b border-gray-100 bg-white">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-4 flex-1">
              {/* Search */}
              <div className="relative w-full max-w-xs">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                  <FaSearch className="text-xs" />
                </span>
                <input
                  type="text"
                  placeholder="Tìm mạch tên NV/ID"
                  className="block w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-sm transition-all"
                />
              </div>

              {/* Dropdown Status */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500 font-medium">
                  Trạng thái:
                </span>
                <select className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white outline-none min-w-[120px]">
                  <option>Tất cả</option>
                  <option>{EmployeeStatus.LUU_MOI}</option>
                  <option>{EmployeeStatus.CHO_XU_LY}</option>
                </select>
              </div>

              {/* Status Pills */}
              <div className="flex gap-2 ml-2">
                <button className="px-4 py-1.5 rounded-full bg-[#28a745] text-white text-[11px] font-bold shadow-sm">
                  {EmployeeStatus.LUU_MOI}
                </button>
                <button className="px-4 py-1.5 rounded-full bg-[#ffc107] text-white text-[11px] font-bold shadow-sm">
                  {EmployeeStatus.CHO_XU_LY}
                </button>
                <button className="px-4 py-1.5 rounded-full bg-[#fce4ec] text-[#d81b60] border border-[#f8bbd0] text-[11px] font-bold">
                  {EmployeeStatus.BO_SUNG}
                </button>
                <button className="px-4 py-1.5 rounded-full bg-[#f8d7da] text-[#721c24] border border-[#f5c6cb] text-[11px] font-bold">
                  {EmployeeStatus.TU_CHOI}
                </button>
              </div>
            </div>

            {/* Add Button */}
            <button
              onClick={handleAddNew}
              className="flex items-center gap-2 bg-[#007bff] hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-bold shadow-md transition-all active:scale-95 text-sm"
            >
              <FaPlus /> Thêm mới
            </button>
          </div>
        </div>

        {/* Table Area */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#f8f9fa]">
                <th className="px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider">STT</th>
                <th className="px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Mã NV</th>
                <th className="px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Họ tên</th>
                <th className="px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Phòng ban</th>
                <th className="px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Ngày tạo</th>
                <th className="px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider text-center">Trạng thái</th>
                <th className="px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan="7" className="px-6 py-20 text-center">
                    <div className="flex justify-center">
                      <FaCircleNotch className="animate-spin text-blue-500 text-3xl" />
                    </div>
                  </td>
                </tr>
              ) : list?.length > 0 ? (
                list.filter(e => e.status !== 'TERMINATED').map((emp, index) => (
                  <tr key={emp.id} className="hover:bg-blue-50/30 transition-colors group">
                    <td className="px-6 py-4 text-sm text-gray-500">{index + 1}</td>
                    <td className="px-6 py-4 text-sm text-gray-600 font-medium tracking-tight">
                      {emp.employeeCode || emp.code}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-800 font-semibold">
                      {emp.fullName || emp.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">{emp.team || "Team VR"}</td>
                    <td className="px-6 py-4 text-sm text-gray-400">
                      {new Date(emp.createdAt || Date.now()).toLocaleDateString('vi-VN')}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-4 py-1.5 rounded-full text-[10px] font-extrabold inline-block min-w-[100px] border shadow-sm ${STATUS_COLORS[emp.status] || "bg-gray-100 text-gray-600"}`}>
                        {emp.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-3 opacity-80 group-hover:opacity-100">
                        {canTerminate(emp.status) && (
                          <button onClick={() => handleOpenTermination(emp)} className="text-rose-500 hover:text-rose-700 p-1" title="Kết thúc hồ sơ">
                            <FaPowerOff className="text-lg" />
                          </button>
                        )}
                        {canEdit(emp.status) && (
                          <button onClick={() => handleEdit(emp.id)} className="text-blue-500 hover:text-blue-700 p-1" title="Chỉnh sửa">
                            <FaPencilAlt className="text-lg" />
                          </button>
                        )}
                        {canDelete(emp.status) && (
                          <button onClick={() => handleDelete(emp.id)} className="text-red-500 hover:text-red-700 p-1" title="Xóa">
                            <FaTrash className="text-lg" />
                          </button>
                        )}
                        <button onClick={() => handleView(emp.id)} className="text-slate-400 hover:text-slate-600 p-1" title="Xem chi tiết">
                          <FaEye className="text-lg" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="px-6 py-20 text-center text-gray-300 italic">Dữ liệu trống</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <EmployeeModal
          employeeID={selectedEmployeeID}
          mode={viewMode}
          onClose={() => setIsModalOpen(false)}
        />
      )}

      {terminationTarget && (
        <TerminationModal
            employee={terminationTarget} 
            onClose={() => setTerminationTarget(null)} 
        />
      )}
    </div>
  );
};
export default EmployeeManagement;
