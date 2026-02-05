import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
    FaTimes, FaUserAlt, FaUsers, FaGraduationCap, FaFileSignature, 
    FaCheckCircle, FaExclamationCircle, FaBan, FaCalendarAlt, FaLink, FaQuoteLeft, 
    FaChartLine, FaArrowUp, FaLightbulb, FaInfoCircle, FaPowerOff, FaMapMarkerAlt, FaIdCard,
    FaBriefcase, FaUserTie
} from 'react-icons/fa';
import { resetApprovalState,processApprovalRequest } from '../../store/scile/FormSlices.js';

const RegistrationDetail = ({ onClose }) => {
 const dispatch = useDispatch();
    const { selectedForm, selectedEmployeeDetail, selectedFormType, loading } = useSelector(state => state.formSlice);
    const [activeMenu, setActiveMenu] = useState('form');
    const [actionPopup, setActionPopup] = useState(null);

    if (loading || !selectedForm || !selectedEmployeeDetail) return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-md">
        <div className="bg-white p-12 rounded-[3rem] shadow-2xl flex flex-col items-center gap-6 text-center">
          <div className="w-14 h-14 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Đang truy xuất hồ sơ...</p>
        </div>
      </div>
    );

    const employee = selectedEmployeeDetail.employee || {};
    const family = selectedEmployeeDetail.familyRelations || [];
    const certs = selectedEmployeeDetail.certificates || [];

    const handleClose = () => {
      dispatch(resetApprovalState());
      onClose();
    };

    const handleProcess = (actionStatus, extraData) => {
      const payload = {
          formId: selectedForm.id,
          formType: selectedFormType,
          action: actionStatus,
          ...extraData
      };
      dispatch(processApprovalRequest(payload));
      setActionPopup(null);
      handleClose();
    };

    const getFormIcon = () => {
        switch(selectedFormType) {
            case 'SALARY': return <FaChartLine />;
            case 'PROMOTION': return <FaArrowUp />;
            case 'PROPOSAL': return <FaLightbulb />;
            case 'TERMINATION': return <FaPowerOff />;
            default: return <FaFileSignature />;
        }
    };

    return (
      <div className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-900/80 backdrop-blur-sm p-6 animate-fadeIn">
        <div className="bg-white w-full max-w-[1500px] h-[95vh] rounded-[3.5rem] shadow-2xl flex flex-col overflow-hidden">
          
          <div className="px-16 py-10 border-b flex items-center justify-between bg-white shrink-0">
            <div className="flex items-center gap-8">
              <div className={`w-20 h-20 rounded-[2rem] shadow-xl flex items-center justify-center text-white font-black text-2xl ${selectedFormType === 'TERMINATION' ? 'bg-rose-600' : 'bg-blue-600'}`}>
                  {employee.full_name?.charAt(0) || 'U'}
              </div>
              <div>
                <h2 className="text-3xl font-black text-slate-800 tracking-tight">{employee.full_name || selectedForm.employeeName}</h2>
                <div className="flex items-center gap-4 mt-2">
                    <span className="px-4 py-1.5 bg-slate-100 text-slate-500 text-[9px] font-black uppercase rounded-lg tracking-widest border border-slate-200">
                      LOẠI: {selectedFormType}
                    </span>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">#{employee.employee_code || selectedForm.employeeCode}</span>
                </div>
              </div>
            </div>
            <button onClick={handleClose} className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 shadow-sm border border-slate-100 active:scale-95"><FaTimes size={24} /></button>
          </div>

          <div className="flex-1 flex overflow-hidden">
            <div className="w-96 bg-slate-50 border-r flex flex-col p-10 space-y-4 shrink-0 overflow-y-auto">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4 mb-2">Thông tin yêu cầu</p>
              <button onClick={() => setActiveMenu('form')} className={`w-full flex items-center gap-5 p-6 rounded-3xl transition-all ${activeMenu === 'form' ? 'bg-white text-blue-600 shadow-xl' : 'text-slate-400 hover:bg-white/50'}`}>
                  <span className="text-xl">{getFormIcon()}</span>
                  <span className="text-xs font-black uppercase">Nội dung biểu mẫu</span>
              </button>

              <div className="h-px bg-slate-200 mx-4 my-2"></div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4 mb-2">Hồ sơ đính kèm</p>
              
              <button onClick={() => setActiveMenu('profile')} className={`w-full flex items-center gap-5 p-6 rounded-3xl transition-all ${activeMenu === 'profile' ? 'bg-white text-blue-600 shadow-xl' : 'text-slate-400 hover:bg-white/50'}`}>
                  <span className="text-xl"><FaUserAlt /></span>
                  <span className="text-xs font-black uppercase">Thông tin cá nhân</span>
              </button>
              
              <button onClick={() => setActiveMenu('family')} className={`w-full flex items-center gap-5 p-6 rounded-3xl transition-all ${activeMenu === 'family' ? 'bg-white text-blue-600 shadow-xl' : 'text-slate-400 hover:bg-white/50'}`}>
                  <span className="text-xl"><FaUsers /></span>
                  <span className="text-xs font-black uppercase">Quan hệ gia đình</span>
                  {family.length > 0 && <span className="ml-auto w-7 h-7 flex items-center justify-center rounded-xl text-[10px] font-black bg-blue-100 text-blue-600">{family.length}</span>}
              </button>

              <button onClick={() => setActiveMenu('certs')} className={`w-full flex items-center gap-5 p-6 rounded-3xl transition-all ${activeMenu === 'certs' ? 'bg-white text-blue-600 shadow-xl' : 'text-slate-400 hover:bg-white/50'}`}>
                  <span className="text-xl"><FaGraduationCap /></span>
                  <span className="text-xs font-black uppercase">Văn bằng chứng chỉ</span>
                  {certs.length > 0 && <span className="ml-auto w-7 h-7 flex items-center justify-center rounded-xl text-[10px] font-black bg-blue-100 text-blue-600">{certs.length}</span>}
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-16 bg-[#fcfcfd] custom-scrollbar">
              {/* SECTION: FORM CONTENT */}
              {activeMenu === 'form' && (
                  <div className="max-w-4xl space-y-12 animate-fadeIn">
                    
                    {/* 1. TERMINATION VIEW */}
                    {selectedFormType === 'TERMINATION' && (
                        <div className="space-y-10">
                           <div className="bg-rose-50 border-2 border-rose-100 p-10 rounded-[3.5rem] flex items-center gap-10">
                                <div className="w-20 h-20 bg-rose-600 text-white rounded-3xl flex items-center justify-center text-4xl shadow-lg shadow-rose-200"><FaPowerOff /></div>
                                <div>
                                    <h3 className="text-2xl font-black text-rose-900 uppercase tracking-tight">Quyết định chấm dứt hợp đồng</h3>
                                    <p className="text-[10px] text-rose-600 font-bold uppercase tracking-widest mt-1">Trạng thái hiện tại: {selectedForm.status}</p>
                                </div>
                           </div>
                           <div className="grid grid-cols-2 gap-10">
                               <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm">
                                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Ngày kết thúc hiệu lực</p>
                                   <p className="text-2xl font-black text-slate-800 flex items-center gap-4">
                                      <FaCalendarAlt className="text-rose-500" /> 
                                      {selectedForm.terminationDate ? new Date(selectedForm.terminationDate).toLocaleDateString('vi-VN') : '---'}
                                   </p>
                               </div>
                               <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm">
                                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Ngày trình báo</p>
                                   <p className="text-xl font-black text-slate-800">
                                      {selectedForm.submitDate ? new Date(selectedForm.submitDate).toLocaleString('vi-VN') : '---'}
                                   </p>
                               </div>
                           </div>
                           <div className="bg-white p-12 rounded-[3.5rem] border border-slate-100 shadow-sm relative">
                               <FaQuoteLeft className="absolute top-8 left-8 text-slate-100 text-6xl" />
                               <h4 className="text-[10px] font-black text-slate-400 uppercase mb-6 relative">Lý do chấm dứt hồ sơ nhân sự</h4>
                               <p className="text-slate-700 font-bold text-lg leading-relaxed italic relative">"{selectedForm.terminationReason || "Chưa cung cấp lý do chi tiết."}"</p>
                           </div>
                        </div>
                    )}

                    {/* 2. SALARY VIEW */}
                    {selectedFormType === 'SALARY' && (
                        <div className="space-y-10">
                           <div className="bg-blue-50 border-2 border-blue-100 p-10 rounded-[3.5rem] flex items-center gap-10">
                                <div className="w-20 h-20 bg-blue-600 text-white rounded-3xl flex items-center justify-center text-4xl shadow-lg shadow-blue-200"><FaChartLine /></div>
                                <div>
                                    <h3 className="text-2xl font-black text-blue-900 uppercase tracking-tight">Điều chỉnh bậc lương</h3>
                                    <p className="text-[10px] text-blue-600 font-bold uppercase tracking-widest mt-1">Lần tăng thứ: {selectedForm.times}</p>
                                </div>
                           </div>
                           <div className="bg-white p-12 rounded-[3rem] border border-slate-100 shadow-sm flex items-center justify-between">
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase mb-4 tracking-widest">Bậc lương điều chỉnh</p>
                                    <p className="text-4xl font-black text-blue-600 flex items-center gap-4">
                                      {selectedForm.oldLevel} <FaArrowUp className="text-slate-200 text-2xl rotate-90" /> {selectedForm.newLevel}
                                    </p>
                                </div>
                           </div>
                           <div className="bg-white p-12 rounded-[3.5rem] border border-slate-100 shadow-sm">
                               <h4 className="text-[10px] font-black text-slate-400 uppercase mb-6">Lý do điều chỉnh lương</h4>
                               <p className="text-slate-700 font-bold text-lg leading-relaxed italic">"{selectedForm.reason || "N/A"}"</p>
                           </div>
                        </div>
                    )}

                    {/* 3. PROMOTION VIEW */}
                    {selectedFormType === 'PROMOTION' && (
                        <div className="space-y-10">
                           <div className="bg-purple-50 border-2 border-purple-100 p-10 rounded-[3.5rem] flex items-center gap-10">
                                <div className="w-20 h-20 bg-purple-600 text-white rounded-3xl flex items-center justify-center text-4xl shadow-lg shadow-purple-200"><FaArrowUp /></div>
                                <div>
                                    <h3 className="text-2xl font-black text-purple-900 uppercase tracking-tight">Quyết định bổ nhiệm</h3>
                                    <p className="text-[10px] text-purple-600 font-bold uppercase tracking-widest mt-1">Nâng tầm vị trí nhân sự</p>
                                </div>
                           </div>
                           <div className="bg-white p-12 rounded-[3rem] border border-slate-100 shadow-sm">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                    <div className="p-8 bg-slate-50 rounded-2xl border border-slate-100">
                                        <p className="text-[10px] font-black text-slate-400 uppercase mb-4 tracking-widest">Chức vụ cũ</p>
                                        <div className="flex items-center gap-3 text-xl font-black text-slate-400"><FaBriefcase /> {selectedForm.oldPosition}</div>
                                    </div>
                                    <div className="p-8 bg-purple-50 rounded-2xl border border-purple-100">
                                        <p className="text-[10px] font-black text-purple-400 uppercase mb-4 tracking-widest">Chức vụ bổ nhiệm mới</p>
                                        <div className="flex items-center gap-3 text-xl font-black text-purple-600"><FaUserTie /> {selectedForm.newPosition}</div>
                                    </div>
                                </div>
                           </div>
                           <div className="bg-white p-12 rounded-[3.5rem] border border-slate-100 shadow-sm">
                               <h4 className="text-[10px] font-black text-slate-400 uppercase mb-6">Căn cứ thăng chức</h4>
                               <p className="text-slate-700 font-bold text-lg leading-relaxed italic">"{selectedForm.reason || "N/A"}"</p>
                           </div>
                        </div>
                    )}

                    {/* 4. PROPOSAL VIEW */}
                    {selectedFormType === 'PROPOSAL' && (
                        <div className="space-y-10">
                           <div className="bg-orange-50 border-2 border-orange-100 p-10 rounded-[3.5rem] flex items-center gap-10">
                                <div className="w-20 h-20 bg-orange-500 text-white rounded-3xl flex items-center justify-center text-4xl shadow-lg shadow-orange-200"><FaLightbulb /></div>
                                <div>
                                    <h3 className="text-2xl font-black text-orange-900 uppercase tracking-tight">Đề xuất / Tham mưu</h3>
                                    <p className="text-[10px] text-orange-600 font-bold uppercase tracking-widest mt-1">Cải tiến quy trình vận hành</p>
                                </div>
                           </div>
                           <div className="bg-white p-12 rounded-[3.5rem] border border-slate-100 shadow-sm">
                               <h4 className="text-[10px] font-black text-slate-400 uppercase mb-4 tracking-widest">Nội dung đề xuất chính</h4>
                               <p className="text-2xl font-black text-slate-800 tracking-tight leading-tight">{selectedForm.content}</p>
                           </div>
                           <div className="bg-white p-12 rounded-[3.5rem] border border-slate-100 shadow-sm">
                               <h4 className="text-[10px] font-black text-slate-400 uppercase mb-6 tracking-widest">Chi tiết giải pháp thực thi</h4>
                               <p className="text-slate-700 font-bold text-lg leading-relaxed whitespace-pre-wrap">{selectedForm.detail || "Không có chi tiết giải pháp kèm theo."}</p>
                           </div>
                        </div>
                    )}

                    {/* 5. REGISTRATION VIEW */}
                    {selectedFormType === 'REGISTRATION' && (
                        <div className="space-y-12">
                          <div className="bg-indigo-900 p-12 rounded-[3.5rem] text-white shadow-2xl relative overflow-hidden">
                              <div className="absolute top-0 right-0 p-10 opacity-10"><FaFileSignature size={120} /></div>
                              <h3 className="text-2xl font-black uppercase tracking-tight mb-8">Vị trí ứng tuyển: {selectedForm.jobPosition}</h3>
                              <p className="text-lg font-medium text-indigo-100 leading-relaxed whitespace-pre-wrap relative z-10">{selectedForm.resume || "Chưa cập nhật tóm tắt quá trình làm việc."}</p>
                          </div>
                          <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 flex items-center justify-between">
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Hồ sơ đính kèm (CV)</p>
                                <a href={selectedForm.cvUrl} target="_blank" className="flex items-center gap-3 text-blue-600 font-black hover:underline uppercase text-xs"><FaLink /> Xem CV trực tuyến</a>
                            </div>
                            <FaFileSignature className="text-4xl text-blue-100" />
                          </div>
                          {selectedForm.note && (
                              <div className="bg-slate-50 p-10 rounded-[2.5rem] border border-slate-100">
                                 <h4 className="text-[10px] font-black text-slate-400 uppercase mb-4 tracking-widest">Ghi chú từ ứng viên</h4>
                                 <p className="text-slate-600 font-bold italic">"{selectedForm.note}"</p>
                              </div>
                          )}
                        </div>
                    )}
                  </div>
              )}

              {/* SECTION: PROFILE */}
              {activeMenu === 'profile' && (
                  <div className="max-w-5xl grid grid-cols-2 gap-12 animate-fadeIn">
                      {[
                        { label: 'Họ và tên', value: employee.full_name },
                        { label: 'Mã nhân viên', value: employee.employee_code },
                        { label: 'Ngày sinh', value: employee.date_of_birth ? new Date(employee.date_of_birth).toLocaleDateString('vi-VN') : 'N/A' },
                        { label: 'Giới tính', value: employee.gender },
                        { label: 'CCCD/CMND', value: employee.identity_number || 'Chưa cập nhật' },
                        { label: 'Điện thoại', value: employee.phone },
                        { label: 'Email', value: employee.email },
                        { label: 'Địa chỉ thường trú', value: employee.address, full: true },
                      ].map((item, idx) => (
                        <div key={idx} className={`space-y-2 ${item.full ? 'col-span-2' : ''}`}>
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{item.label}</label>
                            <div className="p-6 bg-white rounded-2xl border border-slate-100 font-bold text-slate-700 shadow-sm">{item.value || "---"}</div>
                        </div>
                      ))}
                  </div>
              )}

              {/* SECTION: FAMILY */}
              {activeMenu === 'family' && (
                  <div className="space-y-8 animate-fadeIn">
                      <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight mb-6">Quan hệ nhân thân ({family.length})</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          {family.map(f => (
                              <div key={f.id} className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm relative overflow-hidden group">
                                  <div className="absolute top-0 left-0 w-2 h-full bg-indigo-500"></div>
                                  <div className="flex justify-between items-start mb-6">
                                      <div>
                                          <p className="text-xl font-black text-slate-800 tracking-tight">{f.full_name}</p>
                                          <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mt-1">{f.relationship}</p>
                                      </div>
                                      <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400">
                                          <FaUsers />
                                      </div>
                                  </div>
                                  <div className="space-y-4">
                                      <div className="flex items-center gap-3 text-xs">
                                          <FaCalendarAlt className="text-slate-300" />
                                          <span className="text-slate-400 font-bold">Ngày sinh:</span>
                                          <span className="text-slate-700 font-black">{new Date(f.date_of_birth).toLocaleDateString('vi-VN')}</span>
                                      </div>
                                      <div className="flex items-center gap-3 text-xs">
                                          <FaIdCard className="text-slate-300" />
                                          <span className="text-slate-400 font-bold">Số CCCD:</span>
                                          <span className="text-slate-700 font-black">{f.identity_card_number}</span>
                                      </div>
                                      <div className="flex items-center gap-3 text-xs">
                                          <FaMapMarkerAlt className="text-slate-300" />
                                          <span className="text-slate-400 font-bold">Địa chỉ:</span>
                                          <span className="text-slate-700 font-black line-clamp-1">{f.address}</span>
                                      </div>
                                  </div>
                              </div>
                          ))}
                      </div>
                  </div>
              )}

              {/* SECTION: CERTS */}
              {activeMenu === 'certs' && (
                  <div className="space-y-8 animate-fadeIn">
                      <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight mb-6">Văn bằng & Chứng chỉ ({certs.length})</h3>
                      <div className="grid grid-cols-1 gap-6">
                          {certs.map(c => (
                              <div key={c.id} className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm flex items-center gap-10 hover:shadow-md transition-shadow">
                                  <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-[1.5rem] flex items-center justify-center text-3xl shrink-0">
                                      <FaGraduationCap />
                                  </div>
                                  <div className="flex-1">
                                      <div className="flex items-center justify-between">
                                          <p className="text-xl font-black text-slate-800 tracking-tight">{c.name}</p>
                                          <span className="text-[10px] font-black text-slate-400 uppercase bg-slate-50 px-4 py-1.5 rounded-lg border border-slate-100">
                                              Cấp ngày: {new Date(c.issue_date).toLocaleDateString('vi-VN')}
                                          </span>
                                      </div>
                                      <p className="text-slate-500 font-bold mt-2 leading-relaxed italic">"{c.content}"</p>
                                      {c.field_url && (
                                          <a href={c.field_url} target="_blank" className="inline-flex items-center gap-2 mt-4 text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline">
                                              <FaLink /> Xem tài liệu đính kèm
                                          </a>
                                      )}
                                  </div>
                              </div>
                          ))}
                      </div>
                  </div>
              )}
            </div>
          </div>

          <div className="px-16 py-10 border-t bg-white shrink-0 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className={`w-3 h-3 rounded-full animate-pulse ${selectedFormType === 'TERMINATION' ? 'bg-rose-500' : 'bg-blue-500'}`}></span>
                <div className="text-slate-400 font-black text-[10px] uppercase tracking-widest italic">Hệ thống đang chờ ý kiến chỉ đạo từ lãnh đạo phê duyệt</div>
              </div>
              <div className="flex items-center gap-6">
                  <button onClick={handleClose} className="px-10 py-5 font-black text-slate-400 hover:text-slate-600 uppercase text-[10px] tracking-widest">Hủy</button>
                  <button onClick={() => setActionPopup('update')} className="flex items-center gap-4 px-10 py-5 bg-amber-500 text-white font-black rounded-2xl shadow-xl hover:bg-amber-600 transition-all text-[10px] uppercase tracking-widest">
                      <FaExclamationCircle /> Yêu cầu bổ sung
                  </button>
                  <button onClick={() => setActionPopup('reject')} className="flex items-center gap-4 px-10 py-5 bg-rose-500 text-white font-black rounded-2xl shadow-xl hover:bg-rose-600 transition-all text-[10px] uppercase tracking-widest">
                      <FaBan /> Từ chối
                  </button>
                  <button onClick={() => setActionPopup('approve')} className="flex items-center gap-4 px-12 py-5 bg-blue-600 text-white font-black rounded-2xl shadow-2xl hover:bg-blue-700 transition-all text-[10px] uppercase tracking-widest">
                      <FaCheckCircle /> PHÊ DUYỆT NGAY
                  </button>
              </div>
          </div>

          {actionPopup && (
              <ActionMiniPopup 
                  title={actionPopup === 'approve' ? 'Phê duyệt' : actionPopup === 'reject' ? 'Từ chối' : 'Bổ sung'}
                  icon={actionPopup === 'approve' ? <FaCheckCircle className="text-blue-600" /> : actionPopup === 'reject' ? <FaBan className="text-rose-600" /> : <FaExclamationCircle className="text-amber-500" />}
                  formType={selectedFormType}
                  onClose={() => setActionPopup(null)}
                  onSubmit={(data) => handleProcess(actionPopup === 'approve' ? 'APPROVED' : actionPopup === 'reject' ? 'REJECTED' : 'UPDATE', data)}
              />
          )}
        </div>
      </div>
    );
};

const ActionMiniPopup = ({ title, icon, onClose, onSubmit, formType }) => {
    const [note, setNote] = useState('');
    const [actionDate, setActionDate] = useState(new Date().toISOString().split('T')[0]);
    const isRegistration = formType === 'REGISTRATION';
    const todayStr = new Date().toLocaleDateString('vi-VN');

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
            <div className="bg-white w-full max-w-md rounded-[3rem] shadow-2xl overflow-hidden">
                <div className="p-10 border-b flex items-center justify-between bg-slate-50/50">
                  <div className="flex items-center gap-4">
                      <span className="text-2xl">{icon}</span>
                      <h4 className="text-xl font-black text-slate-800 uppercase tracking-tight">{title}</h4>
                  </div>
                  <button onClick={onClose} className="text-slate-400 hover:text-slate-600 active:scale-95"><FaTimes /></button>
                </div>
                <div className="p-10 space-y-8">
                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                           <FaCalendarAlt size={10} /> Ngày thực hiện phê duyệt
                        </label>
                        <div className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl font-black text-slate-500 flex justify-between items-center">
                           {todayStr}
                           <span className="text-[8px] bg-slate-200 px-2 py-0.5 rounded text-slate-400 uppercase">Hôm nay</span>
                        </div>
                    </div>

                    {isRegistration && (
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Ngày hiệu lực (Body Date) *</label>
                            <input type="date" value={actionDate} onChange={e => setActionDate(e.target.value)} className="w-full p-4 bg-white border-2 border-slate-100 rounded-2xl font-bold text-slate-700 outline-none focus:border-blue-600 transition-all shadow-sm"/>
                        </div>
                    )}

                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Ý kiến lãnh đạo / Phản hồi *</label>
                        <textarea rows="4" value={note} onChange={e => setNote(e.target.value)} className="w-full p-4 bg-slate-50 border-0 rounded-2xl outline-none font-bold text-slate-700 shadow-inner resize-none" placeholder="Nhập ý kiến chỉ đạo cụ thể..."></textarea>
                    </div>
                </div>
                <div className="p-10 bg-slate-50/50 flex gap-4">
                    <button onClick={onClose} className="flex-1 py-4 font-black text-slate-400 text-[10px] uppercase tracking-widest">Hủy</button>
                    <button onClick={() => onSubmit({ leaderNote: note, note: note, actionDate: isRegistration ? actionDate : undefined })} className="flex-1 py-4 bg-slate-900 text-white font-black rounded-2xl shadow-xl text-[10px] uppercase tracking-widest active:scale-95 transition-all">Xác nhận</button>
                </div>
            </div>
        </div>
    );
};

export default RegistrationDetail;
