
import { useEffect, useState } from 'react';
import { FaInfoCircle, FaPaperPlane, FaTimes, FaUserTie } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { fetchManagersRequest } from '../../store/scile/employeeSlice';

const EventSubmitModal = ({ type, formId, empId, onClose, onSubmit }) => {
  const dispatch = useDispatch();
  const { registration } = useSelector(state => state.employee);
  const [receiverId, setReceiverId] = useState('');

  useEffect(() => {
    dispatch(fetchManagersRequest());
  }, [dispatch]);

  const handleConfirm = () => {
    if (!receiverId) return alert("Vui lòng chọn lãnh đạo phê duyệt!");
    onSubmit({ type, formId, receiverId, empId });
    onClose();
  };

  const getLabel = () => {
    switch(type) {
        case 'salary': return 'Tăng lương';
        case 'promotion': return 'Thăng chức';
        case 'proposal': return 'Đề xuất';
        default: return 'Diễn biến';
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-100">
        <div className="px-10 py-8 border-b bg-slate-50/50 flex items-center justify-between">
          <div className="flex items-center gap-4">
             <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg"><FaPaperPlane /></div>
             <div>
                <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight">Trình phê duyệt</h3>
                <p className="text-[10px] text-blue-600 font-bold uppercase tracking-widest">Loại: {getLabel()}</p>
             </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors"><FaTimes size={20} /></button>
        </div>

        <div className="p-10 space-y-8">
          <div className="bg-blue-50/50 p-6 rounded-2xl border border-blue-100 flex items-start gap-3">
             <FaInfoCircle className="text-blue-600 mt-1" />
             <p className="text-[10px] text-slate-500 font-bold leading-relaxed">
                Bạn đang trình duyệt bản ghi <span className="text-blue-600">#{formId}</span>. 
                Vui lòng chọn cấp trên có thẩm quyền để xử lý yêu cầu này.
             </p>
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <FaUserTie /> Lãnh đạo tiếp nhận *
            </label>
            <select 
                value={receiverId}
                onChange={(e) => setReceiverId(e.target.value)}
                className="w-full px-6 py-5 bg-white border-2 border-slate-100 rounded-2xl font-black text-slate-700 outline-none focus:border-blue-600 transition-all shadow-sm"
            >
                <option value="">-- Chọn lãnh đạo --</option>
                {registration.managers.map(m => (
                    <option key={m.id} value={m.id}>{m.username}</option>
                ))}
            </select>
          </div>

          <div className="flex items-center justify-between px-2">
             <span className="text-[10px] font-black text-slate-300 uppercase">Ngày trình duyệt</span>
             <span className="text-[10px] font-black text-slate-500 uppercase">{new Date().toLocaleDateString('vi-VN')}</span>
          </div>
        </div>

        <div className="px-10 py-8 bg-slate-50/50 border-t flex gap-4">
           <button onClick={onClose} className="flex-1 py-4 font-black text-slate-400 uppercase text-[10px] tracking-widest">Quay lại</button>
           <button 
              onClick={handleConfirm}
              className="flex-1 py-4 bg-blue-600 text-white font-black rounded-2xl shadow-xl shadow-blue-100 hover:bg-blue-700 active:scale-95 transition-all text-[10px] uppercase tracking-widest"
           >
              Xác nhận trình
           </button>
        </div>
      </div>
    </div>
  );
};

export default EventSubmitModal;
