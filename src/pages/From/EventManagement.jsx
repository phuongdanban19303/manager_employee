import { useEffect, useRef, useState } from "react";
import { FaChartLine, FaArrowUp, FaLightbulb, FaSave, FaSearch, FaHistory, FaPaperPlane } from 'react-icons/fa';
import { useDispatch, useSelector } from "react-redux";
import EventHistoryTable from "../../components/navbar/EventHistoryTable.jsx";
import {
  createEventRequest,
  fetchActiveEmployeesRequest,
  resetEventState,
  setEditingRecord,
  setSelectedEmployee,
  submitEventRequest,
  updateEventRequest,
} from "../../store/scile/eventSlice.js";
import EventSubmitModal from "./EventSubmitModal.jsx";

const EventManagement = () => {
 const dispatch = useDispatch();
  const formRef = useRef(null);
  const { activeEmployees, selectedEmployee, isSaved, currentFormId, editingRecordId } = useSelector(state => state.event);
  
  const [activeTab, setActiveTab] = useState('salary');
  const [searchTerm, setSearchTerm] = useState('');
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  
  const [formData, setFormData] = useState({
    salary: { times: 1, oldLevel: '', newLevel: '', reason: '' },
    promotion: { oldPosition: '', newPosition: '', reason: '' },
    proposal: { content: '', detail: '' }
  });

  useEffect(() => {
    dispatch(fetchActiveEmployeesRequest());
  }, [dispatch]);

  const handleSelectEmployee = (emp) => {
    dispatch(setSelectedEmployee(emp));
    dispatch({ type: 'event/handleFetchHistory', payload: { empId: emp.id, type: activeTab } });
    
    if (activeTab === 'promotion') {
        handleInputChange('promotion', 'oldPosition', emp.jobPosition || 'Nhân viên');
    }

    setTimeout(() => {
        if (formRef.current) formRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    dispatch(resetEventState());
    if (selectedEmployee) {
        dispatch({ type: 'event/handleFetchHistory', payload: { empId: selectedEmployee.id, type: tab } });
        if (tab === 'promotion') handleInputChange('promotion', 'oldPosition', selectedEmployee.jobPosition || 'Nhân viên');
    }
  };

  const handleInputChange = (tab, field, value) => {
    setFormData(prev => ({
        ...prev,
        [tab]: { ...prev[tab], [field]: value }
    }));
  };

  // Hàm xử lý sửa bản ghi từ bảng lịch sử
  const handleEditFromTable = (item) => {
    dispatch(setEditingRecord({ id: item.id }));
    
    // Đổ dữ liệu vào form tương ứng với Tab đang mở
    setFormData(prev => {
        const newData = { ...prev };
        if (activeTab === 'salary') {
            newData.salary = { 
                times: item.times || 1, 
                oldLevel: item.oldLevel || '', 
                newLevel: item.newLevel || '', 
                reason: item.reason || '' 
            };
        } else if (activeTab === 'promotion') {
            newData.promotion = { 
                oldPosition: item.oldPosition || '', 
                newPosition: item.newPosition || '', 
                reason: item.reason || '' 
            };
        } else if (activeTab === 'proposal') {
            newData.proposal = { 
                content: item.content || '', 
                detail: item.detail || '' 
            };
        }
        return newData;
    });

    // Cuộn lên form
    if (formRef.current) {
        formRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const validateEventForm = () => {
    const data = formData[activeTab];
    if (activeTab === 'salary') {
        if (!data.times || !data.newLevel || !data.reason) {
            alert("Vui lòng nhập đầy đủ: Lần tăng, Bậc lương mới và Lý do!"); return false;
        }
    } else if (activeTab === 'promotion') {
        if (!data.newPosition || !data.reason) {
            alert("Vui lòng nhập đầy đủ: Chức vụ mới và Lý do thăng chức!"); return false;
        }
    } else if (activeTab === 'proposal') {
        if (!data.content || !data.detail) {
            alert("Vui lòng nhập đầy đủ: Nội dung đề xuất và Chi tiết giải pháp!"); return false;
        }
    }
    return true;
  };

  const handleSave = () => {
    if (!selectedEmployee) return alert("Vui lòng chọn nhân viên!");
    if (!validateEventForm()) return;
    
    const currentData = formData[activeTab];
    if (editingRecordId) {
        dispatch(updateEventRequest({ type: activeTab, id: editingRecordId, data: { ...currentData, employeeId: selectedEmployee.id } }));
    } else {
        dispatch(createEventRequest({ type: activeTab, data: { ...currentData, employeeId: selectedEmployee.id } }));
    }
  };

  const handleOpenSubmit = () => {
    if (!isSaved || !currentFormId) return alert("Vui lòng nhấn 'LƯU NHÁP' thông tin trước khi trình lãnh đạo phê duyệt!");
    setShowSubmitModal(true);
  };

  const handleSubmitFinal = (payload) => {
    dispatch(submitEventRequest(payload));
    setShowSubmitModal(false);
  };

  const filteredEmployees = activeEmployees.filter(emp => 
    emp.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    emp.employeeCode?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="animate-fadeIn pb-24">
      <div className="mb-12">
        <h1 className="text-4xl font-black text-slate-800 tracking-tight">Diễn biến nhân sự</h1>
        <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest mt-1">Quản lý nâng lương, thăng chức và tham mưu</p>
      </div>

      <div className="bg-white rounded-[3rem] shadow-sm border border-slate-100 overflow-hidden mb-12">
        <div className="p-10 border-b border-slate-50 flex flex-col md:flex-row items-center justify-between gap-6">
           <div className="relative w-full max-w-md">
              <FaSearch className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" />
              <input type="text" placeholder="Tìm tên hoặc mã nhân viên..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-16 pr-8 py-4 bg-slate-50 border-0 rounded-2xl outline-none font-bold text-slate-700 shadow-inner focus:ring-4 focus:ring-blue-500/5 transition-all" />
           </div>
        </div>
        <div className="overflow-x-auto max-h-[350px] custom-scrollbar">
           <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Nhân viên</th>
                  <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredEmployees.map(emp => (
                  <tr key={emp.id} className={`hover:bg-blue-50/30 transition-all ${selectedEmployee?.id === emp.id ? 'bg-blue-50/50' : ''}`}>
                    <td className="px-10 py-4">
                      <div className="flex items-center gap-4">
                         <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black ${selectedEmployee?.id === emp.id ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
                            {emp.fullName?.charAt(0)}
                         </div>
                         <div>
                            <p className="text-sm font-black text-slate-800">{emp.fullName}</p>
                            <p className="text-[10px] font-bold text-slate-400 uppercase">#{emp.employeeCode}</p>
                         </div>
                      </div>
                    </td>
                    <td className="px-10 py-4 text-right">
                       <button onClick={() => handleSelectEmployee(emp)} className="px-6 py-2 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase transition-all shadow-lg active:scale-95">Chọn</button>
                    </td>
                  </tr>
                ))}
              </tbody>
           </table>
        </div>
      </div>

      {selectedEmployee && (
        <div ref={formRef} className="space-y-12 animate-fadeIn">
           <div className="bg-white rounded-[3.5rem] shadow-2xl border border-slate-100 overflow-hidden">
              <div className="px-12 py-8 bg-slate-900 text-white flex items-center justify-between">
                 <p className="text-lg font-black uppercase tracking-tight">Thiết lập: {selectedEmployee.fullName}</p>
                 {editingRecordId && <span className="px-4 py-1.5 bg-amber-500 text-white text-[9px] font-black rounded-lg uppercase tracking-widest">Chế độ sửa #{editingRecordId}</span>}
              </div>

              <div className="flex bg-slate-50 border-b">
                 {[
                    { id: 'salary', label: 'Tăng lương', icon: <FaChartLine /> },
                    { id: 'promotion', label: 'Thăng chức', icon: <FaArrowUp /> },
                    { id: 'proposal', label: 'Đề xuất', icon: <FaLightbulb /> },
                 ].map(tab => (
                    <button key={tab.id} onClick={() => handleTabChange(tab.id)} className={`flex-1 flex items-center justify-center gap-4 py-8 text-[11px] font-black uppercase tracking-widest transition-all ${activeTab === tab.id ? 'bg-white text-blue-600 shadow-[0_-8px_0_inset_#2563eb]' : 'text-slate-400 hover:text-slate-600'}`}>
                       {tab.icon} {tab.label}
                    </button>
                 ))}
              </div>

              <div className="p-16 bg-white">
                 <div className="max-w-5xl mx-auto space-y-10">
                    {activeTab === 'salary' && (
                        <div className="grid grid-cols-2 gap-10">
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-slate-400 uppercase">Lần tăng thứ *</label>
                                <input type="number" value={formData.salary.times} onChange={e => handleInputChange('salary', 'times', e.target.value)} className="w-full px-6 py-4 bg-slate-50 border-0 rounded-2xl font-bold text-slate-700"/>
                            </div>
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-400 uppercase">Bậc lương cũ</label>
                                    <input value={formData.salary.oldLevel} onChange={e => handleInputChange('salary', 'oldLevel', e.target.value)} className="w-full px-6 py-4 bg-slate-50 border-0 rounded-2xl font-bold text-slate-400"/>
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-400 uppercase">Bậc lương mới *</label>
                                    <input value={formData.salary.newLevel} onChange={e => handleInputChange('salary', 'newLevel', e.target.value)} className="w-full px-6 py-4 bg-slate-50 border-2 border-blue-100 rounded-2xl font-bold text-slate-700 outline-none"/>
                                </div>
                            </div>
                            <div className="col-span-2 space-y-3">
                                <label className="text-[10px] font-black text-slate-400 uppercase">Lý do điều chỉnh *</label>
                                <textarea rows="3" value={formData.salary.reason} onChange={e => handleInputChange('salary', 'reason', e.target.value)} className="w-full px-6 py-4 bg-slate-50 border-0 rounded-2xl font-bold text-slate-700 outline-none resize-none shadow-inner"></textarea>
                            </div>
                        </div>
                    )}

                    {activeTab === 'promotion' && (
                        <div className="grid grid-cols-2 gap-10">
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-slate-400 uppercase">Chức vụ hiện tại</label>
                                <input value={formData.promotion.oldPosition} onChange={e => handleInputChange('promotion', 'oldPosition', e.target.value)} className="w-full px-6 py-4 bg-slate-50 border-0 rounded-2xl font-bold text-slate-700"/>
                            </div>
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-slate-400 uppercase">Chức vụ bổ nhiệm mới *</label>
                                <input value={formData.promotion.newPosition} onChange={e => handleInputChange('promotion', 'newPosition', e.target.value)} className="w-full px-6 py-4 bg-slate-50 border-2 border-purple-100 rounded-2xl font-bold text-slate-700 outline-none"/>
                            </div>
                            <div className="col-span-2 space-y-3">
                                <label className="text-[10px] font-black text-slate-400 uppercase">Lý do thăng chức *</label>
                                <textarea rows="3" value={formData.promotion.reason} onChange={e => handleInputChange('promotion', 'reason', e.target.value)} className="w-full px-6 py-4 bg-slate-50 border-0 rounded-2xl font-bold text-slate-700 outline-none resize-none shadow-inner"></textarea>
                            </div>
                        </div>
                    )}

                    {activeTab === 'proposal' && (
                        <div className="space-y-10">
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-slate-400 uppercase">Nội dung đề xuất chính *</label>
                                <input value={formData.proposal.content} onChange={e => handleInputChange('proposal', 'content', e.target.value)} className="w-full px-8 py-6 bg-white border-2 border-indigo-100 rounded-3xl font-black text-slate-800 text-xl tracking-tight outline-none shadow-sm"/>
                            </div>
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-slate-400 uppercase">Chi tiết giải pháp thực thi *</label>
                                <textarea rows="6" value={formData.proposal.detail} onChange={e => handleInputChange('proposal', 'detail', e.target.value)} className="w-full px-8 py-6 bg-slate-50 border-0 rounded-[2.5rem] font-bold text-slate-700 outline-none resize-none shadow-inner"></textarea>
                            </div>
                        </div>
                    )}
                 </div>
              </div>

              <div className="px-16 py-10 bg-slate-50/50 border-t flex items-center justify-end gap-6">
                    <button onClick={handleSave} className="flex items-center gap-3 px-10 py-4 bg-white border-4 border-slate-900 text-slate-900 font-black rounded-2xl hover:bg-slate-50 transition-all active:scale-95 text-[10px] uppercase shadow-xl">
                       <FaSave /> LƯU NHÁP
                    </button>
                    <button onClick={handleOpenSubmit} className={`flex items-center gap-3 px-10 py-4 font-black rounded-2xl transition-all active:scale-95 text-[10px] uppercase shadow-2xl ${isSaved ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}>
                       <FaPaperPlane /> GỬI LÃNH ĐẠO
                    </button>
              </div>
           </div>

           <div className="bg-white rounded-[3.5rem] shadow-sm border border-slate-100 overflow-hidden">
              <div className="px-12 py-10 border-b flex items-center gap-4 bg-slate-50/30">
                 <div className="w-12 h-12 bg-blue-600 text-white rounded-2xl flex items-center justify-center shadow-lg"><FaHistory /></div>
                 <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight">Lịch sử diễn biến</h3>
              </div>
              <EventHistoryTable type={activeTab} onEdit={handleEditFromTable} />
           </div>
        </div>
      )}

      {showSubmitModal && (
        <EventSubmitModal type={activeTab} formId={currentFormId} empId={selectedEmployee.id} onClose={() => setShowSubmitModal(false)} onSubmit={handleSubmitFinal} />
      )}
    </div>
  );
};


export default EventManagement;
