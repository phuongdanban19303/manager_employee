import { useEffect, useState } from "react";
import {
  FaCircleNotch,
  FaEye,
  FaPencilAlt,
  FaPlus,
  FaPowerOff,
  FaSearch,
  FaTrash,
} from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteEmployeeRequest,
  fetchEmployeeDetailRequest,
  fetchEmployeesRequest,
  resetSelectedDetail,
} from "../../store/scile/employeeSlice";
import { EmployeeStatus, STATUS_COLORS } from "../../utils/contstants";
import TerminationModal from "../From/TerminationModal";
import EmployeeModal from "./EmployeeModal";

const EmployeeManagement = () => {
  const dispatch = useDispatch();
  const { list, loading } = useSelector((state) => state.employee);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState("edit");
  const [terminationTarget, setTerminationTarget] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    dispatch(fetchEmployeesRequest());
  }, [dispatch]);

  const handleAddNew = () => {
    dispatch(resetSelectedDetail());
    setViewMode("create");
    setIsModalOpen(true);
  };

  const handleEdit = (id) => {
    dispatch(fetchEmployeeDetailRequest(id));
    setViewMode("edit");
    setIsModalOpen(true);
  };

  const handleView = (id) => {
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

  const canEdit = (status) => [EmployeeStatus.DRAFT, EmployeeStatus.UPDATE, EmployeeStatus.REJECTED].includes(status);
  const canDelete = (status) => status === EmployeeStatus.DRAFT;
  const canTerminate = (status) => status === EmployeeStatus.APPROVED || status === 'APPROVED';

  const filteredList = list?.filter(emp => {
    const searchLower = searchTerm.toLowerCase();
    const nameMatch = (emp.fullName || emp.name || "").toLowerCase().includes(searchLower);
    const codeMatch = (emp.employeeCode || emp.code || "").toLowerCase().includes(searchLower);
    return (nameMatch || codeMatch) && emp.status !== 'TERMINATED';
  }) || [];

  return (
    <div className="max-w-[1600px] mx-auto animate-fadeIn pb-10">
      <div className="mb-8 flex justify-between items-end">
        <div>
            <h1 className="text-3xl font-black text-slate-800 tracking-tight">Quản lý nhân sự</h1>
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-1">Hệ thống quản lý vòng đời nhân viên</p>
        </div>
        <button
          onClick={handleAddNew}
          className="flex items-center gap-3 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3.5 rounded-2xl font-black shadow-xl shadow-blue-100 transition-all active:scale-95 text-[10px] uppercase tracking-widest"
        >
          <FaPlus /> Thêm nhân viên mới
        </button>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-8 border-b border-slate-50 bg-white flex items-center justify-between">
          <div className="relative w-full max-w-md">
            <span className="absolute inset-y-0 left-0 pl-5 flex items-center text-slate-300">
              <FaSearch />
            </span>
            <input
              type="text"
              placeholder="Tìm theo tên hoặc mã NV..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-14 pr-6 py-4 bg-slate-50 border-0 rounded-2xl focus:ring-4 focus:ring-blue-500/10 outline-none text-sm font-bold transition-all shadow-inner"
            />
          </div>
          <div className="flex gap-4">
             <div className="px-6 py-3 bg-blue-50 border border-blue-100 rounded-xl">
                <p className="text-[9px] font-black text-blue-600 uppercase tracking-widest">Tổng nhân sự</p>
                <p className="text-sm font-black text-blue-900">{filteredList.length}</p>
             </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">STT</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Thông tin nhân sự</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Phòng ban</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Trạng thái</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-8 py-24 text-center">
                    <FaCircleNotch className="animate-spin text-blue-500 text-3xl mx-auto" />
                  </td>
                </tr>
              ) : filteredList.length > 0 ? (
                filteredList.map((emp, index) => (
                  <tr key={emp.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-8 py-6 text-xs font-black text-slate-300">{index + 1}</td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center font-black text-slate-400 text-sm uppercase">
                            {(emp.fullName || emp.name)?.charAt(0)}
                        </div>
                        <div>
                            <p className="text-sm font-black text-slate-800">{(emp.fullName || emp.name)}</p>
                            <p className="text-[10px] font-bold text-blue-600 uppercase tracking-wider mt-0.5">{emp.employeeCode || emp.code}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-xs font-bold text-slate-500">{emp.team || "---"}</td>
                    <td className="px-8 py-6 text-center">
                      <span className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest inline-block min-w-[110px] shadow-sm ${STATUS_COLORS[emp.status] || "bg-slate-100 text-slate-400"}`}>
                        {emp.status}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center justify-end gap-2">
                        {canTerminate(emp.status) && (
                          <button onClick={() => handleOpenTermination(emp)} className="w-9 h-9 flex items-center justify-center bg-rose-50 text-rose-500 rounded-xl hover:bg-rose-500 hover:text-white transition-all" title="Kết thúc hồ sơ">
                            <FaPowerOff size={14} />
                          </button>
                        )}
                        {canEdit(emp.status) && (
                          <button onClick={() => handleEdit(emp.id)} className="w-9 h-9 flex items-center justify-center bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all" title="Chỉnh sửa">
                            <FaPencilAlt size={14} />
                          </button>
                        )}
                        {canDelete(emp.status) && (
                          <button onClick={() => handleDelete(emp.id)} className="w-9 h-9 flex items-center justify-center bg-slate-50 text-slate-400 hover:bg-rose-500 hover:text-white transition-all" title="Xóa">
                            <FaTrash size={14} />
                          </button>
                        )}
                        <button onClick={() => handleView(emp.id)} className="w-9 h-9 flex items-center justify-center bg-slate-50 text-slate-400 hover:bg-slate-900 hover:text-white transition-all" title="Xem chi tiết">
                          <FaEye size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-8 py-24 text-center text-slate-300 font-bold uppercase tracking-widest text-xs italic">Không tìm thấy nhân viên phù hợp</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <EmployeeModal
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
