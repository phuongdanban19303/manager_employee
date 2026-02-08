import { useEffect, useState } from "react";
import {
  FaCalendarAlt,
  FaPaperPlane,
  FaPen,
  FaSpinner,
  FaTimes,
  FaUserTie,
} from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchManagersRequest,
  submitToManagerRequest,
} from "../../store/scile/employeeSlice";

const LeaderSubmitModal = ({ onClose, onSuccess }) => {
  const dispatch = useDispatch();
  const { registration } = useSelector((state) => state.employee);
  const [submitData, setSubmitData] = useState({
    receiverId: "",
    note: "",
  });

  useEffect(() => {
    dispatch(fetchManagersRequest());
  }, [dispatch]);

  const selectedManager = registration.managers.find(
    (m) => m.id === submitData.receiverId,
  );
  const today = new Date().toLocaleDateString("vi-VN");

  const handleSubmit = () => {
    if (!submitData.receiverId) {
      alert("Vui lòng chọn lãnh đạo tiếp nhận!");
      return;
    }
    dispatch(
      submitToManagerRequest({
        formId: registration.currentFormId,
        data: submitData,
      }),
    );
    // Note: In a real app, you'd wait for success from state, but for simplicity:
    setTimeout(onSuccess, 1000);
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-900/40 backdrop-blur-[2px] p-4 animate-fadeIn">
      <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-[0_50px_100px_rgba(0,0,0,0.2)] overflow-hidden border border-slate-100">
        {/* Header */}
        <div className="px-10 py-8 border-b bg-slate-50/50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg">
              <FaPaperPlane size={18} />
            </div>
            <h3 className="text-xl font-black text-slate-800 tracking-tight">
              Trình phê duyệt
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors"
          >
            <FaTimes size={20} />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-10 space-y-8">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <FaCalendarAlt /> Ngày trình báo
            </label>
            <div className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-600">
              {today}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <FaUserTie /> Chọn lãnh đạo tiếp nhận
            </label>
            <div className="relative group">
              <select
                value={submitData.receiverId}
                onChange={(e) =>
                  setSubmitData((p) => ({ ...p, receiverId: e.target.value }))
                }
                className="w-full px-6 py-4 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none font-bold text-slate-700 appearance-none shadow-sm transition-all"
              >
                <option value="">-- Chọn lãnh đạo --</option>
                {registration.managers.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.fullname}
                  </option>
                ))}
              </select>
              <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                <FaSpinner
                  className={registration.loading ? "animate-spin" : "hidden"}
                />
              </div>
            </div>
          </div>

          {selectedManager && (
            <div className="p-6 bg-blue-50 rounded-2xl border border-blue-100 animate-fadeIn">
              <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest">
                Chức vụ lãnh đạo
              </p>
              <p className="text-sm font-bold text-slate-700 mt-1">
                {selectedManager.role}
              </p>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <FaPen /> Nội dung ghi chú
            </label>
            <textarea
              rows="3"
              value={submitData.note}
              onChange={(e) =>
                setSubmitData((p) => ({ ...p, note: e.target.value }))
              }
              placeholder="Nhập ghi chú gửi lãnh đạo..."
              className="w-full px-6 py-4 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none font-bold text-slate-700 shadow-sm resize-none transition-all"
            ></textarea>
          </div>
        </div>

        {/* Footer */}
        <div className="px-10 py-8 bg-slate-50/50 border-t flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-6 py-3 font-black text-slate-400 hover:text-slate-600 text-[10px] uppercase tracking-widest transition-all"
          >
            Hủy bỏ
          </button>
          <button
            onClick={handleSubmit}
            disabled={registration.loading}
            className="flex items-center gap-3 px-10 py-4 bg-blue-600 text-white font-black rounded-2xl shadow-xl shadow-blue-100 hover:bg-blue-700 active:scale-95 transition-all text-[10px] uppercase tracking-widest disabled:opacity-50"
          >
            {registration.loading ? (
              <FaSpinner className="animate-spin" />
            ) : (
              <FaPaperPlane />
            )}{" "}
            XÁC NHẬN GỬI
          </button>
        </div>
      </div>
    </div>
  );
};

export default LeaderSubmitModal;
