import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  FaTimes,
  FaCalendarAlt,
  FaFileAlt,
  FaUserTie,
  FaPaperPlane,
  FaSpinner,
  FaExclamationTriangle,
} from "react-icons/fa";
import {
  fetchManagersRequest,
  submitTerminationFlowRequest,
} from "../../store/scile/terminationSlice";

const TerminationModal = ({ employee, onClose }) => {
  const dispatch = useDispatch();
  const { managers, submitting } = useSelector((state) => state.termination);
  const [formData, setFormData] = useState({
    terminationDate: new Date().toISOString().split("T")[0],
    terminationReason: "",
    receiverId: "",
  });

  useEffect(() => {
    dispatch(fetchManagersRequest());
  }, [dispatch]);

  const handleSubmit = () => {
    if (!formData.terminationReason || !formData.receiverId) {
      return alert("Vui lòng điền đầy đủ lý do và chọn lãnh đạo!");
    }
    dispatch(
      submitTerminationFlowRequest({
        employeeId: employee.id,
        ...formData,
      }),
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-100">
        <div className="px-10 py-8 border-b bg-rose-50/30 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-rose-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-rose-200">
              <FaFileAlt size={20} />
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight">
                Quyết định kết thúc
              </h3>
              <p className="text-[10px] text-rose-600 font-bold uppercase tracking-widest mt-1">
                Nhân viên: {employee.fullName || employee.name}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors"
          >
            <FaTimes size={20} />
          </button>
        </div>

        <div className="p-10 space-y-8">
          <div className="bg-amber-50 p-5 rounded-2xl border border-amber-100 flex gap-4">
            <FaExclamationTriangle className="text-amber-500 shrink-0 mt-1" />
            <p className="text-[10px] text-amber-700 font-bold leading-relaxed uppercase">
              Lưu ý: Hành động này sẽ trình lãnh đạo phê duyệt việc chấm dứt hồ
              sơ nhân sự của nhân viên này.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6">
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <FaCalendarAlt /> Ngày kết thúc hiệu lực *
              </label>
              <input
                type="date"
                value={formData.terminationDate}
                onChange={(e) =>
                  setFormData((p) => ({
                    ...p,
                    terminationDate: e.target.value,
                  }))
                }
                className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold text-slate-700 outline-none focus:border-rose-500 transition-all"
              />
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <FaUserTie /> Lãnh đạo phê duyệt kết thúc *
              </label>
              <select
                value={formData.receiverId}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, receiverId: e.target.value }))
                }
                className="w-full px-6 py-4 bg-white border-2 border-slate-100 rounded-2xl font-bold text-slate-700 outline-none focus:border-rose-500 transition-all shadow-sm"
              >
                <option value="">-- Chọn lãnh đạo --</option>
                {managers.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.fullname} ({m.team})
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                Lý do kết thúc hồ sơ *
              </label>
              <textarea
                rows="4"
                value={formData.terminationReason}
                onChange={(e) =>
                  setFormData((p) => ({
                    ...p,
                    terminationReason: e.target.value,
                  }))
                }
                placeholder="Nhập lý do cụ thể về việc kết thúc hợp đồng / hồ sơ..."
                className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold text-slate-700 outline-none focus:border-rose-500 resize-none transition-all shadow-inner placeholder:font-medium"
              ></textarea>
            </div>
          </div>
        </div>

        <div className="px-10 py-8 bg-slate-50/50 border-t flex gap-4">
          <button
            onClick={onClose}
            className="flex-1 py-4 font-black text-slate-400 uppercase text-[10px] tracking-widest"
          >
            Hủy bỏ
          </button>
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="flex-1 py-4 bg-slate-900 text-white font-black rounded-2xl shadow-xl hover:bg-rose-700 active:scale-95 transition-all text-[10px] uppercase tracking-widest flex items-center justify-center gap-3"
          >
            {submitting ? (
              <FaSpinner className="animate-spin" />
            ) : (
              <FaPaperPlane />
            )}{" "}
            TRÌNH LÃNH ĐẠO
          </button>
        </div>
      </div>
    </div>
  );
};

export default TerminationModal;
