import { useEffect, useState } from "react";
import { FaFileSignature, FaFileAlt, FaSave, FaPaperPlane, FaTimes, FaChevronRight, FaInfoCircle, FaSpinner } from 'react-icons/fa';

import { useDispatch, useSelector } from "react-redux";
import {
  createRegistrationRequest,
  fetchExistingRegistrationRequest,
  updateRegistrationRequest,
} from "../../store/scile/employeeSlice.js";
import LeaderSubmitModal from "./LeaderSubmitModal.jsx";

const RegistrationModal = ({ onClose }) => {
  const dispatch = useDispatch();
  const { selectedDetail, registration } = useSelector(state => state.employee);
  const [showLeaderPopup, setShowLeaderPopup] = useState(false);
  const [activeDoc, setActiveDoc] = useState('application');
  
  const [formData, setFormData] = useState({
    resume: '',
    cvUrl: '',
    note: '',
    jobPosition: '',
  });

  useEffect(() => {
    if (selectedDetail?.id) {
      dispatch(fetchExistingRegistrationRequest(selectedDetail.id));
    }
  }, [selectedDetail?.id, dispatch]);

  useEffect(() => {
    if (registration.currentFormData) {
      setFormData({
        resume: registration.currentFormData.resume || '',
        cvUrl: registration.currentFormData.cvUrl || '',
        note: registration.currentFormData.note || '',
        jobPosition: registration.currentFormData.jobPosition || '',
      });
    }
  }, [registration.currentFormData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateRegistration = () => {
    if (!formData.jobPosition || formData.jobPosition.trim() === '') {
        alert("Vui lòng nhập Vị trí tuyển dụng!"); return false;
    }
    if (!formData.cvUrl || formData.cvUrl.trim() === '') {
        alert("Vui lòng cung cấp Link CV!"); return false;
    }
    if (!formData.resume || formData.resume.trim() === '') {
        alert("Vui lòng nhập Tóm tắt quá trình làm việc!"); return false;
    }
    return true;
  };

  const handleSaveDoc = () => {
    if (!selectedDetail?.id || !validateRegistration()) return;
    
    if (registration.currentFormId) {
      dispatch(updateRegistrationRequest({
        formId: registration.currentFormId,
        data: formData
      }));
    } else {
      dispatch(createRegistrationRequest({ 
        employeeId: selectedDetail.id, 
        data: formData 
      }));
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
    { id: 'application', label: 'Đơn đăng ký nhân viên', icon: <FaFileSignature /> },
    { id: 'cv', label: 'Bản tóm tắt (CV)', icon: <FaFileAlt />, disabled: true },
    { id: 'commitment', label: 'Cam kết bảo mật', icon: <FaFileAlt />, disabled: true },
  ];

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/70 backdrop-blur-sm p-6 animate-fadeIn">
      <div className="bg-white w-full max-w-7xl h-[90vh] rounded-[3rem] shadow-2xl flex overflow-hidden border border-white/20">
        
        <div className="w-80 bg-slate-50 border-r flex flex-col shrink-0">
          <div className="p-10 border-b bg-white">
            <h3 className="text-xl font-black text-slate-800 tracking-tight uppercase">Hồ sơ ứng tuyển</h3>
            <p className="text-[10px] text-slate-400 font-bold tracking-widest mt-1">QUY TRÌNH PHÊ DUYỆT</p>
          </div>
          <div className="flex-1 p-6 space-y-3 overflow-y-auto">
            {docTypes.map(doc => (
              <button
                key={doc.id}
                onClick={() => !doc.disabled && setActiveDoc(doc.id)}
                className={`w-full flex items-center gap-4 p-5 rounded-3xl transition-all text-left relative group ${
                  activeDoc === doc.id 
                    ? 'bg-blue-600 text-white shadow-xl shadow-blue-100 scale-[1.02]' 
                    : doc.disabled ? 'opacity-40 cursor-not-allowed' : 'hover:bg-white text-slate-500 hover:shadow-md'
                }`}
              >
                <span className="text-xl">{doc.icon}</span>
                <span className="text-xs font-black uppercase tracking-tight">{doc.label}</span>
                {activeDoc === doc.id && <FaChevronRight className="ml-auto opacity-50" />}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 flex flex-col bg-white overflow-hidden">
          <div className="px-12 py-10 border-b flex items-center justify-between">
            <div>
               <h2 className="text-2xl font-black text-slate-800 tracking-tight">Chi tiết biểu mẫu</h2>
               <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Vui lòng hoàn thiện tất cả các trường có đánh dấu (*)</p>
            </div>
            <button onClick={onClose} className="w-12 h-12 rounded-2xl bg-slate-50 hover:bg-slate-100 flex items-center justify-center text-slate-400 transition-all border border-slate-100 active:scale-90">
              <FaTimes size={20} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-12 custom-scrollbar bg-[#fcfcfd]">
             {registration.loading && !registration.currentFormData ? (
               <div className="flex flex-col items-center justify-center h-full gap-4 text-slate-400">
                  <FaSpinner className="animate-spin text-4xl" />
                  <p className="text-[10px] font-black uppercase tracking-widest">Đang tải hồ sơ...</p>
               </div>
             ) : (
               <div className="max-w-4xl mx-auto space-y-10">
                  <div className="grid grid-cols-2 gap-10">
                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Vị trí tuyển dụng *</label>
                        <input name="jobPosition" value={formData.jobPosition} onChange={handleChange} placeholder="Ví dụ: Backend Developer" className="w-full px-6 py-4 bg-white border border-slate-200 rounded-2xl outline-none font-bold text-slate-700 shadow-sm"/>
                    </div>
                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Link CV (Google Drive/Dropbox) *</label>
                        <input name="cvUrl" value={formData.cvUrl} onChange={handleChange} placeholder="https://..." className="w-full px-6 py-4 bg-white border border-slate-200 rounded-2xl outline-none font-bold text-slate-700 shadow-sm"/>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tóm tắt quá trình làm việc *</label>
                    <textarea name="resume" value={formData.resume} onChange={handleChange} rows="8" placeholder="Mô tả ngắn gọn kinh nghiệm..." className="w-full px-6 py-4 bg-white border border-slate-200 rounded-[2rem] outline-none font-bold text-slate-700 shadow-sm resize-none"></textarea>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Ghi chú thêm</label>
                    <textarea name="note" value={formData.note} onChange={handleChange} rows="3" className="w-full px-6 py-4 bg-white border border-slate-200 rounded-2xl outline-none font-bold text-slate-700 shadow-sm resize-none"></textarea>
                  </div>
               </div>
             )}
          </div>

          <div className="px-12 py-8 border-t bg-slate-50/50 flex items-center justify-between">
             <button onClick={onClose} className="px-8 py-3 font-black text-slate-400 hover:text-slate-600 transition-all uppercase text-[10px] tracking-widest">Đóng</button>
             <div className="flex items-center gap-5">
                <button onClick={handleSaveDoc} className="flex items-center gap-3 px-10 py-4 font-black bg-white border-4 border-blue-600 text-blue-600 rounded-2xl hover:bg-blue-50 transition-all active:scale-95 text-[10px] uppercase tracking-widest shadow-xl">
                   <FaSave /> LƯU BIỂU MẪU
                </button>
                <button onClick={handleOpenSubmit} className={`flex items-center gap-3 px-10 py-4 font-black rounded-2xl transition-all active:scale-95 text-[10px] uppercase shadow-2xl ${registration.currentFormId ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}>
                   <FaPaperPlane /> GỬI PHÊ DUYỆT
                </button>
             </div>
          </div>
        </div>
      </div>

      {showLeaderPopup && (
        <LeaderSubmitModal onClose={() => setShowLeaderPopup(false)} onSuccess={() => { setShowLeaderPopup(false); onClose(); }} />
      )}
    </div>
  );
};

export default RegistrationModal;
