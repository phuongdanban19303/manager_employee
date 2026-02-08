import { useEffect, useState } from "react";
import {
  FaUser, FaIdCard, FaUsers, FaPlus, FaTrash,
  FaSave, FaPaperPlane, FaTimes, FaSpinner, FaCheckCircle, FaExclamationTriangle, FaLock
} from 'react-icons/fa';
import { useDispatch, useSelector } from "react-redux";
import {
  fetchEmployeeDetailRequest,
  saveEmployeeFullRequest,
} from "../../store/scile/employeeSlice";
import { TEAMS } from "../../utils/contstants";
import RegistrationModal from "./RegistrationModal";
const EmployeeModal = ({ employeeID, mode, onClose }) => {
 const dispatch = useDispatch();
  const { selectedDetail, loading, regCheck } = useSelector(state => state.employee);
  const [activeTab, setActiveTab] = useState('info');
  const [showRegProcess, setShowRegProcess] = useState(false);

  const [formData, setFormData] = useState({
    fullName: '',
    employeeCode: '',
    gender: 'Nam',
    dateOfBirth: '',
    address: '',
    team: 'Frontend',
    identityNumber: '',
    phone: '',
    email: '',
    family: [],
    certificates: []
  });

  const isView = mode === 'view';
  const isCreated = !!formData.id; // Kiểm tra xem nhân viên đã được lưu vào DB chưa

  useEffect(() => {
    if (selectedDetail) {
      setFormData({
        ...selectedDetail,
        fullName: selectedDetail.fullName || selectedDetail.full_name || '',
        employeeCode: selectedDetail.employeeCode || selectedDetail.code || '',
        family: selectedDetail.family || [],
        certificates: selectedDetail.certificates || []
      });
    }
  }, [selectedDetail]);

  useEffect(() => {
    if (mode === 'create' && !selectedDetail) {
      setFormData({
        fullName: '',
        employeeCode: '',
        gender: 'Nam',
        dateOfBirth: '',
        address: '',
        team: 'Frontend',
        identityNumber: '',
        phone: '',
        email: '',
        family: [],
        certificates: []
      });
      setActiveTab('info');
    }
  }, [mode, selectedDetail]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddSub = (type) => {
    const tempId = `temp-${Date.now()}`;
    if (type === 'family') {
      setFormData(prev => ({
        ...prev,
        family: [
          ...prev.family,
          { id: tempId, full_name: '', gender: 'Nam', date_of_birth: '', identity_card_number: '', relationship: '', address: '' }
        ]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        certificates: [
          ...prev.certificates,
          { id: tempId, name: '', issue_date: '', content: '', field_url: '' }
        ]
      }));
    }
  };

  const handleRemoveSub = (type, id) => {
    setFormData(prev => ({
      ...prev,
      [type]: prev[type].filter(item => item.id !== id)
    }));
  };

  const handleUpdateSub = (type, id, field, value) => {
    setFormData(prev => {
      const list = [...prev[type]];
      const idx = list.findIndex(item => item.id === id);
      if (idx > -1) {
        list[idx] = { ...list[idx], [field]: value };
      }
      return { ...prev, [type]: list };
    });
  };

  const validateForm = () => {
    const requiredBasic = {
        fullName: 'Họ và tên',
        employeeCode: 'Mã nhân viên',
        identityNumber: 'Số CCCD',
        phone: 'Số điện thoại',
        email: 'Email',
        address: 'Địa chỉ',
        dateOfBirth: 'Ngày sinh'
    };

    for (const [key, label] of Object.entries(requiredBasic)) {
        if (!formData[key] || formData[key].toString().trim() === '') {
            alert(`Trường [${label}] không được để trống!`);
            setActiveTab('info');
            return false;
        }
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
        alert("Định dạng Email không hợp lệ!");
        return false;
    }

    // Validate Certificates
    for (const cert of formData.certificates) {
        if (!cert.name?.trim() || !cert.issue_date || !cert.content?.trim()) {
            alert("Thông tin Văn bằng không được để trống các trường bắt buộc!");
            setActiveTab('certs');
            return false;
        }
    }

    // Validate Family
    for (const fam of formData.family) {
        if (!fam.full_name?.trim() || !fam.relationship?.trim() || !fam.identity_card_number?.trim() || !fam.address?.trim() || !fam.date_of_birth) {
            alert("Thông tin Người thân không được để trống các trường bắt buộc!");
            setActiveTab('family');
            return false;
        }
    }

    return true;
  };

  const handleSave = () => {
    if (!validateForm()) return;
    dispatch(saveEmployeeFullRequest(formData));
  };

  const handleOpenRegistration = () => {
    setShowRegProcess(true);
  };

  const tabs = [
    { id: 'info', label: 'Thông tin chung', icon: <FaUser />, locked: false },
    { id: 'certs', label: 'Văn bằng', icon: <FaIdCard />, locked: !isCreated && mode === 'create' },
    { id: 'family', label: 'Gia đình', icon: <FaUsers />, locked: !isCreated && mode === 'create' },
  ];

  const onTabClick = (tab) => {
    if (tab.locked) {
        alert("Vui lòng 'Lưu thông tin chung' trước khi thiết lập Văn bằng và Gia đình!");
        return;
    }
    setActiveTab(tab.id);
  };

  if (showRegProcess) {
    return <RegistrationModal onClose={() => setShowRegProcess(false)} />;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4 animate-fadeIn">
      <div className="bg-white w-full max-w-6xl rounded-[3rem] shadow-2xl flex flex-col max-h-[92vh] overflow-hidden border border-white/20">

        <div className="px-12 py-10 border-b flex justify-between items-center bg-white">
          <div>
            <h6 className="text-3xl font-black text-slate-800 flex items-center gap-4">
              <span className="w-14 h-14 bg-blue-600 rounded-[1.25rem] flex items-center justify-center text-white shadow-2xl shadow-blue-100">
                {activeTab === 'info' ? <FaUser /> : activeTab === 'certs' ? <FaIdCard /> : <FaUsers />}
              </span>
              {isView ? 'Hồ sơ nhân viên' : (isCreated ? 'Cập nhật hồ sơ' : 'Đăng ký nhân sự mới')}
            </h6>
          </div>
          <button onClick={onClose} className="w-14 h-14 rounded-2xl hover:bg-slate-100 flex items-center justify-center text-slate-900 transition-all border border-slate-100 shadow-sm active:scale-90">
            <FaTimes size={24} />
          </button>
        </div>

        <div className="flex px-12 bg-slate-50/50 border-b overflow-x-auto">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => onTabClick(tab)}
              className={`flex items-center gap-3 px-10 py-6 text-[11px] font-black uppercase tracking-[0.15em] border-b-4 transition-all relative shrink-0 ${
                tab.locked ? 'opacity-40 cursor-not-allowed' : ''
              } ${
                activeTab === tab.id 
                ? 'border-blue-600 text-blue-600 bg-white shadow-[0_-8px_0_inset_#2563eb]' 
                : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
            >
              {tab.locked ? <FaLock className="text-[10px]" /> : tab.icon}
              {tab.label}
              {formData[tab.id]?.length > 0 && tab.id !== 'info' && (
                <span className="ml-2 w-6 h-6 bg-blue-100 text-blue-600 text-[10px] rounded-xl flex items-center justify-center font-black">
                  {formData[tab.id].length}
                </span>
              )}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto p-12 custom-scrollbar bg-[#fcfcfd]">
           {activeTab === 'info' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div className="flex flex-col items-center gap-8 bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm h-fit">
                <div className="w-48 h-48 rounded-[2rem] bg-slate-100 border-8 border-white shadow-inner flex items-center justify-center text-slate-300 overflow-hidden relative group">
                   {formData.avatar_url ? <img src={formData.avatar_url} alt="Avatar" className="w-full h-full object-cover" /> : <FaUser size={80} />}
                </div>
                <div className="text-center">
                   <p className="font-black text-slate-800 text-2xl tracking-tighter leading-none uppercase">{formData.fullName || "HỌ VÀ TÊN"}</p>
                   <p className="text-[11px] font-black text-blue-600 uppercase tracking-[0.2em] mt-3">{formData.team}</p>
                </div>
              </div>

              <div className="md:col-span-2 grid grid-cols-2 gap-10 bg-white p-12 rounded-[2.5rem] border border-slate-100 shadow-sm">
                {[
                    { label: 'Họ và tên *', name: 'fullName' },
                    { label: 'Mã nhân viên *', name: 'employeeCode' },
                    { label: 'Giới tính', name: 'gender', type: 'select', options: ['Nam', 'Nữ'] },
                    { label: 'Ngày sinh *', name: 'dateOfBirth', type: 'date' },
                    { label: 'Bộ phận', name: 'team', type: 'select', options: TEAMS },
                    { label: 'Số CCCD / Passport *', name: 'identityNumber' },
                    { label: 'Số điện thoại *', name: 'phone' },
                    { label: 'Email *', name: 'email' },
                    { label: 'Địa chỉ liên hệ *', name: 'address', colSpan: 2 },
                ].map(field => (
                    <div key={field.name} className={`${field.colSpan ? 'col-span-2' : ''} space-y-3`}>
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.1em]">{field.label}</label>
                        {field.type === 'select' ? (
                            <select name={field.name} value={formData[field.name]} onChange={handleChange} disabled={isView} className="w-full px-6 py-4 bg-slate-50 border-0 rounded-2xl outline-none font-bold text-slate-700">
                                {field.options.map(o => <option key={o} value={o}>{o}</option>)}
                            </select>
                        ) : (
                            <input type={field.type || 'text'} name={field.name} value={formData[field.name]} onChange={handleChange} disabled={isView} className="w-full px-6 py-4 bg-slate-50 border-0 rounded-2xl outline-none font-bold text-slate-700"/>
                        )}
                    </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'certs' && (
            <div className="space-y-10">
              <div className="flex justify-between items-center bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm">
                <h3 className="text-xl font-black text-slate-800 uppercase tracking-tighter">Văn bằng chứng chỉ</h3>
                {!isView && (
                  <button onClick={() => handleAddSub('certificates')} className="flex items-center gap-3 bg-blue-600 text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest">
                    <FaPlus /> Thêm văn bằng
                  </button>
                )}
              </div>
              <div className="grid grid-cols-1 gap-8">
                {formData.certificates.map((c) => (
                  <div key={c.id} className="relative bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase">Tên văn bằng *</label>
                        <input value={c.name} onChange={e => handleUpdateSub('certificates', c.id, 'name', e.target.value)} disabled={isView} className="w-full p-2 border-b-4 border-slate-50 outline-none text-sm font-black"/>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase">Ngày cấp *</label>
                        <input type="date" value={c.issue_date} onChange={e => handleUpdateSub('certificates', c.id, 'issue_date', e.target.value)} disabled={isView} className="w-full p-2 border-b-4 border-slate-50 outline-none text-sm font-black"/>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase">Xếp loại/Nội dung *</label>
                        <input value={c.content} onChange={e => handleUpdateSub('certificates', c.id, 'content', e.target.value)} disabled={isView} className="w-full p-2 border-b-4 border-slate-50 outline-none text-sm font-black"/>
                      </div>
                      <div className="space-y-2 flex items-end justify-between gap-6">
                         <div className="flex-1 space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase">Link đính kèm</label>
                            <input value={c.field_url} onChange={e => handleUpdateSub('certificates', c.id, 'field_url', e.target.value)} disabled={isView} className="w-full p-2 border-b-4 border-slate-50 outline-none text-sm font-black placeholder:text-slate-200" placeholder="https://..."/>
                         </div>
                        {!isView && (
                          <button onClick={() => handleRemoveSub('certificates', c.id)} className="w-12 h-12 flex items-center justify-center text-rose-400 hover:bg-rose-50 rounded-2xl transition-all">
                            <FaTrash />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'family' && (
            <div className="space-y-10">
              <div className="flex justify-between items-center bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm">
                <h3 className="text-xl font-black text-slate-800 uppercase tracking-tighter">Quan hệ nhân thân</h3>
                {!isView && (
                  <button onClick={() => handleAddSub('family')} className="flex items-center gap-3 bg-indigo-600 text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest">
                    <FaPlus /> Thêm người thân
                  </button>
                )}
              </div>
              <div className="grid grid-cols-1 gap-8">
                {formData.family.map((f) => (
                  <div key={f.id} className="relative bg-white p-12 rounded-[3rem] border border-slate-100 shadow-sm">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase">Họ và tên *</label>
                        <input value={f.full_name} onChange={e => handleUpdateSub('family', f.id, 'full_name', e.target.value)} disabled={isView} className="w-full p-2 border-b-4 border-slate-50 outline-none text-sm font-black"/>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase">Mối quan hệ *</label>
                        <input value={f.relationship} onChange={e => handleUpdateSub('family', f.id, 'relationship', e.target.value)} disabled={isView} className="w-full p-2 border-b-4 border-slate-50 outline-none text-sm font-black"/>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase">Ngày sinh *</label>
                        <input type="date" value={f.date_of_birth} onChange={e => handleUpdateSub('family', f.id, 'date_of_birth', e.target.value)} disabled={isView} className="w-full p-2 border-b-4 border-slate-50 outline-none text-sm font-black"/>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase">Số CCCD *</label>
                        <input value={f.identity_card_number} onChange={e => handleUpdateSub('family', f.id, 'identity_card_number', e.target.value)} disabled={isView} className="w-full p-2 border-b-4 border-slate-50 outline-none text-sm font-black"/>
                      </div>
                      <div className="col-span-1 md:col-span-4 flex items-end justify-between gap-8 mt-4 border-t border-slate-50 pt-6">
                         <div className="flex-1 space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase">Địa chỉ thường trú *</label>
                            <input value={f.address} onChange={e => handleUpdateSub('family', f.id, 'address', e.target.value)} disabled={isView} className="w-full p-2 border-b-4 border-slate-50 outline-none text-sm font-black"/>
                         </div>
                        {!isView && (
                          <button onClick={() => handleRemoveSub('family', f.id)} className="w-14 h-14 flex items-center justify-center text-rose-400 hover:bg-rose-50 rounded-[1.25rem] transition-all">
                            <FaTrash />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="px-12 py-10 border-t flex items-center justify-between bg-white shrink-0">
          <div className="flex items-center gap-3">
             {isCreated ? (
               regCheck.loading ? (
                 <div className="flex items-center gap-2 text-slate-400 font-bold text-[10px] uppercase tracking-widest"><FaSpinner className="animate-spin" /> Kiểm tra...</div>
               ) : regCheck.canRegister ? (
                 <div className="flex items-center gap-2 text-green-600 font-bold text-[10px] uppercase tracking-widest bg-green-50 px-4 py-2 rounded-xl border border-green-100"><FaCheckCircle /> Đủ điều kiện phê duyệt</div>
               ) : (
                 <div className="flex items-center gap-2 text-amber-500 font-bold text-[10px] uppercase tracking-widest bg-amber-50 px-4 py-2 rounded-xl border border-amber-100"><FaExclamationTriangle /> Hồ sơ chưa hoàn thiện thêm tab văn bằng và gia đình</div>
               )
             ) : <div className="text-slate-300 font-bold text-[10px] uppercase tracking-widest flex items-center gap-2"><FaLock /> Vui lòng lưu thông tin chung để tiếp tục</div>}
          </div>

          <div className="flex items-center gap-6">
            {!isView && (
              <>
                <button 
                  onClick={handleSave} 
                  disabled={loading}
                  className={`flex items-center gap-4 px-12 py-5 font-black rounded-[1.5rem] transition-all active:scale-95 text-[10px] uppercase tracking-widest ${
                    loading ? 'bg-slate-100 text-slate-300' : 'bg-white border-4 border-blue-600 text-blue-600 hover:bg-blue-50 shadow-xl shadow-blue-50'
                  }`}
                >
                  {loading ? <FaSpinner className="animate-spin text-lg" /> : <FaSave className="text-lg" />}
                  {isCreated ? 'CẬP NHẬT THÔNG TIN' : 'LƯU THÔNG TIN CHUNG'}
                </button>
                {regCheck.canRegister && isCreated && (
                  <button onClick={handleOpenRegistration} className="flex items-center gap-4 px-12 py-5 font-black bg-blue-600 text-white rounded-[1.5rem] shadow-2xl hover:bg-blue-700 transition-all active:scale-95 text-[10px] uppercase tracking-widest shadow-blue-100">
                    <FaPaperPlane className="text-lg" /> ĐĂNG KÝ PHÊ DUYỆT
                  </button>
                )}
              </>
            )}
            {isView && <button onClick={onClose} className="px-16 py-5 font-black bg-slate-900 text-white rounded-[1.5rem] uppercase text-[10px] tracking-widest">Đóng</button>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeModal;

