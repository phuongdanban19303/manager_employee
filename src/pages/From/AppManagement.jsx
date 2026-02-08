import { useEffect, useState } from "react";
import { FaCalendarDay, FaClock, FaFileAlt, FaSearch } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchApprovalDetailRequest,
  fetchPendingRequest,
} from "../../store/scile/FormSlices.js";
import RegistrationDetail from "./RegiDetail.jsx";

const ApprovalManagement = () => {
  const dispatch = useDispatch();
  const { pendingList, loading } = useSelector((state) => state.formSlice);
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    dispatch(fetchPendingRequest());
  }, [dispatch]);

  const handleOpenDetail = (item) => {
    dispatch(
      fetchApprovalDetailRequest({
        formId: item.formId,
        employeeId: item.employeeId,
        formType: item.formType,
      }),
    );
    setSelectedItem(item);
  };

  const getFormTypeStyle = (type) => {
    switch (type) {
      case "REGISTRATION":
        return "bg-blue-500 text-white";
      case "SALARY":
        return "bg-green-500 text-white";
      case "PROMOTION":
        return "bg-purple-500 text-white";
      case "PROPOSAL":
        return "bg-orange-500 text-white";
      default:
        return "bg-slate-500 text-white";
    }
  };

  return (
    <div className="animate-fadeIn">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-4xl font-black text-slate-800 tracking-tight">
          Hộp thư phê duyệt
        </h1>
        <div className="flex items-center gap-2 mt-2">
          <span className="w-8 h-1 bg-blue-600 rounded-full"></span>
          <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest">
            Trung tâm xử lý yêu cầu nhân sự tập trung
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 mb-8 flex items-center justify-between">
        <div className="relative w-full max-w-md">
          <FaSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" />
          <input
            type="text"
            placeholder="Tìm kiếm tên, mã nhân sự..."
            className="w-full pl-14 pr-6 py-4 bg-slate-50 border-0 rounded-2xl outline-none text-sm font-bold shadow-inner"
          />
        </div>
        <div className="flex items-center gap-6">
          <div className="px-6 py-3 bg-blue-50 rounded-2xl border border-blue-100 flex items-center gap-3">
            <FaClock className="text-blue-600" />
            <span className="text-xs font-black text-blue-700 uppercase tracking-widest">
              {pendingList.length} Yêu cầu đang chờ
            </span>
          </div>
        </div>
      </div>

      {/* Combined Table */}
      <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50/50">
              <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                Loại yêu cầu
              </th>
              <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                Nhân viên
              </th>
              <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">
                Ngày trình duyệt
              </th>
              <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">
                Trạng thái
              </th>
              <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {loading ? (
              <tr>
                <td
                  colSpan="5"
                  className="py-20 text-center text-slate-300 font-black uppercase tracking-widest animate-pulse"
                >
                  Đang truy vấn hộp thư...
                </td>
              </tr>
            ) : pendingList.length > 0 ? (
              pendingList.map((item) => (
                <tr
                  key={`${item.formType}-${item.formId}`}
                  className="hover:bg-slate-50/80 transition-all group"
                >
                  <td className="px-10 py-6">
                    <span
                      className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest shadow-sm ${getFormTypeStyle(item.formType)}`}
                    >
                      {item.formLabel}
                    </span>
                  </td>
                  <td className="px-10 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-slate-900 text-white rounded-2xl flex items-center justify-center font-black shadow-lg">
                        {item.employeeName?.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-black text-slate-800">
                          {item.employeeName}
                        </p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase mt-0.5">
                          #{item.employeeCode}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-10 py-6 text-center text-[11px] font-bold text-slate-400">
                    <div className="flex items-center justify-center gap-2">
                      <FaCalendarDay />{" "}
                      {new Date(item.submitDate).toLocaleDateString("vi-VN")}
                    </div>
                  </td>
                  <td className="px-10 py-6 text-center">
                    <span className="px-4 py-1.5 bg-amber-50 text-amber-600 border border-amber-100 rounded-full text-[9px] font-black uppercase tracking-widest">
                      {item.status}
                    </span>
                  </td>
                  <td className="px-10 py-6 text-right">
                    <button
                      onClick={() => handleOpenDetail(item)}
                      className="flex items-center gap-2 ml-auto px-6 py-3 bg-white border-2 border-slate-900 text-slate-900 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all active:scale-95"
                    >
                      <FaFileAlt /> Xem xét hồ sơ
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="5"
                  className="py-20 text-center text-slate-300 font-bold uppercase tracking-widest opacity-20 italic text-xs"
                >
                  Hiện tại không có yêu cầu nào cần phê duyệt
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {selectedItem && (
        <RegistrationDetail onClose={() => setSelectedItem(null)} />
      )}
    </div>
  );
};

export default ApprovalManagement;
