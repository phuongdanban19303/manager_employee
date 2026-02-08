import { useEffect, useState } from "react";
import {
  FaChevronRight,
  FaFileAlt,
  FaFileSignature,
  FaInfoCircle,
  FaPaperPlane,
  FaSave,
  FaSpinner,
  FaTimes,
} from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import {
  createRegistrationRequest,
  fetchExistingRegistrationRequest,
  updateRegistrationRequest,
} from "../../store/scile/employeeSlice.js";
import LeaderSubmitModal from "./LeaderSubmitModal.jsx";

const RegistrationModal = ({ onClose }) => {
  const dispatch = useDispatch();
  const { selectedDetail, registration } = useSelector(
    (state) => state.employee,
  );
  const [showLeaderPopup, setShowLeaderPopup] = useState(false);
  const [activeDoc, setActiveDoc] = useState("application");

  const [formData, setFormData] = useState({
    resume: "",
    cv_url: "",
    note: "",
    job_position: "",
  });

  useEffect(() => {
    if (selectedDetail?.id) {
      dispatch(fetchExistingRegistrationRequest(selectedDetail.id));
    }
  }, [selectedDetail?.id, dispatch]);

  useEffect(() => {
    if (registration.currentFormData) {
      setFormData({
        resume: registration.currentFormData.resume || "",
        cv_url: registration.currentFormData.cv_url || "",
        note: registration.currentFormData.note || "",
        job_position: registration.currentFormData.job_position || "",
      });
    }
  }, [registration.currentFormData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveDoc = () => {
    if (!selectedDetail?.id) return;

    if (registration.currentFormId) {
      dispatch(
        updateRegistrationRequest({
          formId: registration.currentFormId,
          data: formData,
        }),
      );
    }
    else {
      dispatch(
        createRegistrationRequest({
          employeeId: selectedDetail.id,
          data: formData,
        }),
      );
    }
  };

  const handleOpenSubmit = () => {
    if (!registration.currentFormId) {
      alert("Vui lòng 'Lưu' thông tin biểu mẫu trước khi gửi lãnh đạo!");
      return;
    }
    setShowLeaderPopup(true);
  };

  const docTypes = [
    {
      id: "application",
      label: "Đơn đăng ký nhân viên",
      icon: <FaFileSignature />,
    },
    {
      id: "cv",
      label: "Bản tóm tắt (CV)",
      icon: <FaFileAlt />,
      disabled: true,
    },
    {
      id: "commitment",
      label: "Cam kết bảo mật",
      icon: <FaFileAlt />,
      disabled: true,
    },
  ];

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/70 backdrop-blur-sm p-6 animate-fadeIn">
      <div className="bg-white w-full max-w-7xl h-[90vh] rounded-[3rem] shadow-2xl flex overflow-hidden border border-white/20">
        {/* Left Sidebar */}
        <div className="w-80 bg-slate-50 border-r flex flex-col shrink-0">
          <div className="p-10 border-b bg-white">
            <h3 className="text-xl font-black text-slate-800 tracking-tight uppercase">
              Danh sách hồ sơ
            </h3>
            <p className="text-[10px] text-slate-400 font-bold tracking-widest mt-1">
              QUY TRÌNH PHÊ DUYỆT
            </p>
          </div>
          <div className="flex-1 p-6 space-y-3 overflow-y-auto">
            {docTypes.map((doc) => (
              <button
                key={doc.id}
                onClick={() => !doc.disabled && setActiveDoc(doc.id)}
                className={`w-full flex items-center gap-4 p-5 rounded-3xl transition-all text-left relative group ${
                  activeDoc === doc.id
                    ? "bg-blue-600 text-white shadow-xl shadow-blue-100 scale-[1.02]"
                    : doc.disabled
                      ? "opacity-40 cursor-not-allowed"
                      : "hover:bg-white text-slate-500 hover:shadow-md"
                }`}
              >
                <span className="text-xl">{doc.icon}</span>
                <span className="text-xs font-black uppercase tracking-tight">
                  {doc.label}
                </span>
                {activeDoc === doc.id && (
                  <FaChevronRight className="ml-auto opacity-50" />
                )}
              </button>
            ))}
          </div>
          <div className="p-8 bg-blue-50/50 m-6 rounded-3xl border border-blue-100/50">
            <div className="flex items-center gap-2 text-blue-600 font-black text-[10px] uppercase">
              <FaInfoCircle /> Hướng dẫn
            </div>
            <p className="text-[10px] text-slate-500 mt-2 font-medium leading-relaxed">
              {registration.currentFormId
                ? "Hệ thống đã tìm thấy bản nháp cũ. Mọi thay đổi sẽ được cập nhật vào bản ghi này."
                : "Vui lòng điền đầy đủ các thông tin bắt buộc và nhấn lưu trước khi gửi lãnh đạo."}
            </p>
          </div>
        </div>

        {/* Right Content */}
        <div className="flex-1 flex flex-col bg-white overflow-hidden">
          <div className="px-12 py-10 border-b flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-black text-slate-800 tracking-tight">
                Chi tiết biểu mẫu
              </h2>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1 flex items-center gap-2">
                ĐANG CHỈNH SỬA:{" "}
                {docTypes.find((d) => d.id === activeDoc)?.label}
                {registration.currentFormId && (
                  <span className="bg-amber-100 text-amber-600 px-2 py-0.5 rounded text-[8px] tracking-normal font-black">
                    CHẾ ĐỘ CẬP NHẬT (ID: {registration.currentFormId})
                  </span>
                )}
              </p>
            </div>
            <button
              onClick={onClose}
              className="w-12 h-12 rounded-2xl bg-slate-50 hover:bg-slate-100 flex items-center justify-center text-slate-400 transition-all border border-slate-100 active:scale-90"
            >
              <FaTimes size={20} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-12 custom-scrollbar bg-[#fcfcfd]">
            {registration.loading && !registration.currentFormData ? (
              <div className="flex flex-col items-center justify-center h-full gap-4 text-slate-400">
                <FaSpinner className="animate-spin text-4xl" />
                <p className="text-[10px] font-black uppercase tracking-widest">
                  Đang kiểm tra lịch sử đăng ký...
                </p>
              </div>
            ) : (
              <div className="max-w-4xl mx-auto space-y-10">
                <div className="grid grid-cols-2 gap-10">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      Vị trí tuyển dụng *
                    </label>
                    <input
                      name="job_position"
                      value={formData.job_position}
                      onChange={handleChange}
                      placeholder="Ví dụ: Senior Frontend Developer"
                      className="w-full px-6 py-4 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none font-bold text-slate-700 transition-all shadow-sm"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      Link CV (Google Drive/Dropbox) *
                    </label>
                    <input
                      name="cv_url"
                      value={formData.cv_url}
                      onChange={handleChange}
                      placeholder="https://..."
                      className="w-full px-6 py-4 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none font-bold text-slate-700 transition-all shadow-sm"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Tóm tắt quá trình làm việc (Resume)
                  </label>
                  <textarea
                    name="resume"
                    value={formData.resume}
                    onChange={handleChange}
                    rows="8"
                    placeholder="Mô tả ngắn gọn kinh nghiệm..."
                    className="w-full px-6 py-4 bg-white border border-slate-200 rounded-[2rem] focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none font-bold text-slate-700 transition-all shadow-sm resize-none"
                  ></textarea>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Ghi chú cho lãnh đạo
                  </label>
                  <textarea
                    name="note"
                    value={formData.note}
                    onChange={handleChange}
                    rows="3"
                    className="w-full px-6 py-4 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none font-bold text-slate-700 transition-all shadow-sm resize-none"
                  ></textarea>
                </div>
              </div>
            )}
          </div>

          {/* Action Bar */}
          <div className="px-12 py-8 border-t bg-slate-50/50 flex items-center justify-between">
            <button
              onClick={onClose}
              className="px-8 py-3 font-black text-slate-400 hover:text-slate-600 transition-all uppercase text-[10px] tracking-[0.2em]"
            >
              Hủy bỏ
            </button>
            <div className="flex items-center gap-5">
              <button
                onClick={handleSaveDoc}
                disabled={registration.loading}
                className="flex items-center gap-3 px-10 py-4 font-black bg-white border-4 border-blue-600 text-blue-600 rounded-[1.25rem] hover:bg-blue-50 transition-all active:scale-95 text-[10px] uppercase tracking-widest shadow-xl shadow-blue-50"
              >
                {registration.loading ? (
                  <FaSpinner className="animate-spin" />
                ) : (
                  <FaSave />
                )}
                {registration.currentFormId
                  ? "CẬP NHẬT THÔNG TIN"
                  : "LƯU THÔNG TIN"}
              </button>
              <button
                onClick={handleOpenSubmit}
                className={`flex items-center gap-3 px-10 py-4 font-black rounded-[1.25rem] transition-all active:scale-95 text-[10px] uppercase shadow-2xl ${
                  registration.currentFormId
                    ? "bg-blue-600 text-white shadow-blue-200 hover:bg-blue-700"
                    : "bg-slate-200 text-slate-400 cursor-not-allowed"
                }`}
              >
                <FaPaperPlane /> GỬI PHÊ DUYỆT
              </button>
            </div>
          </div>
        </div>
      </div>

      {showLeaderPopup && (
        <LeaderSubmitModal
          onClose={() => setShowLeaderPopup(false)}
          onSuccess={() => {
            setShowLeaderPopup(false);
            onClose();
          }}
        />
      )}
    </div>
  );
};

export default RegistrationModal;
