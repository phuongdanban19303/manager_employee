import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { TEAMS } from "../../utils/contstants";
import {
  saveEmployeeFullRequest,
  registerEmployeeRequest,
  fetchEmployeeDetailRequest,
} from "../../store/scile/employeeSlice";
import {
  FaUser,
  FaIdCard,
  FaUsers,
  FaPlus,
  FaTrash,
  FaSave,
  FaPaperPlane,
  FaTimes,
  FaSpinner,
  FaInfoCircle,
  FaCheckCircle,
  FaLink,
  FaMapMarkerAlt,
  FaCalendarAlt,
} from "react-icons/fa";
import RegistrationModal from "./RegistrationModal";
const EmployeeModal = ({ employeeID, mode, onClose }) => {
  const isView = mode === "view";

  const dispatch = useDispatch();
  const { selectedDetail, loading, regCheck } = useSelector(
    (state) => state.employee,
  );
  const [activeTab, setActiveTab] = useState("info");
  const [formData, setFormData] = useState({
    fullName: "",
    employeeCode: "",
    gender: "Nam",
    dateOfBirth: "",
    address: "",
    team: "Frontend",
    identityNumber: "",
    phone: "",
    email: "",
    family: [],
    certificates: [],
  });

  const [showRegProcess, setShowRegProcess] = useState(false);

  /* LOAD DETAIL */
  useEffect(() => {
    if (employeeID && (mode === "edit" || mode === "view")) {
      dispatch(fetchEmployeeDetailRequest(employeeID));
    }
  }, [employeeID, mode, dispatch]);

  /* SET DATA FROM REDUX */
  useEffect(() => {
    console.log(mode)
    if (!selectedDetail ) return;
     
    setFormData({
      ...selectedDetail,

      fullName: selectedDetail.fullName || "",
      dateOfBirth: selectedDetail.dateOfBirth || "",
      address: selectedDetail.address || "",
      identityNumber: selectedDetail.identityNumber || "",
      phone: selectedDetail.phone || "",
      email: selectedDetail.email || "",

      family: (selectedDetail.family || []).map((f) => ({
        id: f.id,
        full_name: f.full_name || "",
        gender: f.gender || "Nam",
        date_of_birth: f.date_of_birth || "",
        identity_card_number: f.identity_card_number || "",
        relationship: f.relationship || "",
        address: f.address || "",
      })),

      certificates: (selectedDetail.certificates || []).map((c) => ({
        id: c.id,
        name: c.name || "",
        issue_date: c.issue_date || "",
        content: c.content || "",
        field_url: c.field_url || "",
      })),
    });
  }, [selectedDetail, mode]);
  /* RESET FORM */
  useEffect(() => {
    if (mode === "create") {
      setFormData({
        fullName: "",
        employeeCode: "",
        gender: "Nam",
        dateOfBirth: "",
        address: "",
        team: "Frontend",
        identityNumber: "",
        phone: "",
        email: "",
        family: [],
        certificates: [],
      });
    }
  }, [mode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddSub = (type) => {
    const tempId = `temp-${Date.now()}`;
    if (type === "family") {
      setFormData((prev) => ({
        ...prev,
        family: [
          ...prev.family,
          {
            id: tempId,
            full_name: "",
            gender: "Nam",
            date_of_birth: "",
            identity_card_number: "",
            relationship: "",
            address: "",
          },
        ],
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        certificates: [
          ...prev.certificates,
          {
            id: tempId,
            name: "",
            issue_date: "",
            content: "",
            field_url: "",
          },
        ],
      }));
    }
  };

  const handleRemoveSub = (type, id) => {
    setFormData((prev) => ({
      ...prev,
      [type]: prev[type].filter((item) => item.id !== id),
    }));
  };

  const handleUpdateSub = (type, id, field, value) => {
    setFormData((prev) => {
      const list = [...prev[type]];
      const idx = list.findIndex((item) => item.id === id);
      if (idx > -1) {
        list[idx] = { ...list[idx], [field]: value };
      }
      return { ...prev, [type]: list };
    });
  };

  const handleSave = () => {
    dispatch(saveEmployeeFullRequest(formData));
  };

  const handleOpenRegistration = () => {
    setShowRegProcess(true);
  };
  const tabs = [
    { id: "info", label: "Thông tin chung", icon: <FaUser /> },
    { id: "certs", label: "Văn bằng", icon: <FaIdCard /> },
    { id: "family", label: "Gia đình", icon: <FaUsers /> },
  ];

  if (showRegProcess) {
    return <RegistrationModal onClose={() => setShowRegProcess(false)} />;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4 animate-fadeIn">
      <div className="bg-white w-full max-w-6xl rounded-[3rem] shadow-[0_30px_100px_rgba(0,0,0,0.3)] flex flex-col max-h-[92vh] overflow-hidden border border-white/20">
        {/* HEADER */}
        <div className="px-12 py-10 border-b flex justify-between items-center bg-white">
          <div>
            <h6 className="text-3xl font-semibold text-slate-800 flex items-center gap-4">
              <span className="w-14 h-14 bg-blue-600 rounded-[1.25rem] flex items-center justify-center text-white shadow-2xl shadow-blue-100">
                {activeTab === "info" ? (
                  <FaUser />
                ) : activeTab === "certs" ? (
                  <FaIdCard />
                ) : (
                  <FaUsers />
                )}
              </span>
              {isView
                ? "Hồ sơ nhân viên"
                : formData.id
                  ? "Cập nhật hồ sơ"
                  : "Đăng ký nhân sự mới"}
            </h6>
            {formData.id && (
              <p className="text-slate-900 text-[10px] font-semibold mt-2 uppercase tracking-[0.3em] ml-18">
                Mã định danh hệ thống: #{formData.id}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="w-14 h-14 rounded-2xl hover:bg-slate-100 flex items-center justify-center text-slate-900 transition-all border border-slate-100 shadow-sm active:scale-90"
          >
            <FaTimes size={24} />
          </button>
        </div>

        {/* TABS */}
        <div className="flex px-12 bg-slate-50/50 border-b">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-3 px-10 py-6 text-[11px] font-black uppercase tracking-[0.15em] border-b-4 transition-all relative ${
                activeTab === tab.id
                  ? "border-blue-600 text-blue-600 bg-white shadow-[0_-8px_0_inset_#2563eb]"
                  : "border-transparent text-slate-400 hover:text-slate-600"
              }`}
            >
              {tab.icon}
              {tab.label}
              {formData[tab.id]?.length > 0 && tab.id !== "info" && (
                <span className="ml-2 w-6 h-6 bg-blue-100 text-blue-600 text-[10px] rounded-xl flex items-center justify-center font-black">
                  {formData[tab.id].length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* CONTENT */}
        <div className="flex-1 overflow-y-auto p-12 custom-scrollbar bg-[#fcfcfd]">
          {activeTab === "info" && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div className="flex flex-col items-center gap-8 bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm h-fit">
                <div className="w-48 h-48 rounded-[2rem] bg-slate-100 border-8 border-white shadow-inner flex items-center justify-center text-slate-300 overflow-hidden relative group">
                  {formData.avatar_url ? (
                    <img
                      src={formData.avatar_url}
                      alt="Avatar"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <FaUser size={80} />
                  )}
                </div>
                <div className="text-center">
                  <p className="font-black text-slate-800 text-2xl tracking-tighter leading-none uppercase">
                    {formData.fullName || "HỌ VÀ TÊN"}
                  </p>
                  <p className="text-[11px] font-black text-blue-600 uppercase tracking-[0.2em] mt-3">
                    {formData.team}
                  </p>
                </div>
              </div>

              <div className="md:col-span-2 grid grid-cols-2 gap-10 bg-white p-12 rounded-[2.5rem] border border-slate-100 shadow-sm">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.1em]">
                    Họ và tên *
                  </label>
                  <input
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    disabled={isView}
                    className="w-full px-6 py-4 bg-slate-50 border-0 rounded-2xl outline-none font-bold text-slate-700"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.1em]">
                    Mã nhân viên *
                  </label>
                  <h6
                    className="className={`
  w-full px-6 py-4 border-0 rounded-2xl outline-none font-bold text-red-700
  ${formData?.employeeCode ? 'bg-slate-50' : ''}
`}"
                  >
                    {formData?.employeeCode}
                  </h6>
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.1em]">
                    Giới tính
                  </label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    disabled={isView}
                    className="w-full px-6 py-4 bg-slate-50 border-0 rounded-2xl outline-none font-bold text-slate-700"
                  >
                    <option value="Nam">Nam</option>
                    <option value="Nữ">Nữ</option>
                  </select>
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.1em]">
                    Ngày sinh
                  </label>
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                    disabled={isView}
                    className="w-full px-6 py-4 bg-slate-50 border-0 rounded-2xl outline-none font-bold text-slate-700"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.1em]">
                    Bộ phận
                  </label>
                  <select
                    name="team"
                    value={formData.team}
                    onChange={handleChange}
                    disabled={isView}
                    className="w-full px-6 py-4 bg-slate-50 border-0 rounded-2xl outline-none font-bold text-slate-700"
                  >
                    {TEAMS.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.1em]">
                    Số CCCD / Passport
                  </label>
                  <input
                    name="identityNumber"
                    value={formData.identityNumber}
                    onChange={handleChange}
                    disabled={isView}
                    className="w-full px-6 py-4 bg-slate-50 border-0 rounded-2xl outline-none font-bold text-slate-700"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.1em]">
                    Số điện thoại
                  </label>
                  <input
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    disabled={isView}
                    className="w-full px-6 py-4 bg-slate-50 border-0 rounded-2xl outline-none font-bold text-slate-700"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.1em]">
                    Email
                  </label>
                  <input
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={isView}
                    className="w-full px-6 py-4 bg-slate-50 border-0 rounded-2xl outline-none font-bold text-slate-700"
                  />
                </div>
                <div className="col-span-2 space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.1em]">
                    Địa chỉ liên hệ
                  </label>
                  <input
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    disabled={isView}
                    className="w-full px-6 py-4 bg-slate-50 border-0 rounded-2xl outline-none font-bold text-slate-700"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === "certs" && (
            <div className="space-y-10">
              <div className="flex justify-between items-center bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm">
                <h3 className="text-xl font-black text-slate-800 uppercase tracking-tighter">
                  Văn bằng chứng chỉ
                </h3>
                {!isView && (
                  <button
                    onClick={() => handleAddSub("certificates")}
                    className="flex items-center gap-3 bg-blue-600 text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest"
                  >
                    <FaPlus /> Thêm văn bằng
                  </button>
                )}
              </div>
              <div className="grid grid-cols-1 gap-8">
                {formData.certificates.map((c) => (
                  <div
                    key={c.id}
                    className="relative bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase">
                          Tên văn bằng
                        </label>
                        <input
                          value={c.name}
                          onChange={(e) =>
                            handleUpdateSub(
                              "certificates",
                              c.id,
                              "name",
                              e.target.value,
                            )
                          }
                          disabled={isView}
                          className="w-full p-2 border-b-4 border-slate-50 outline-none text-sm font-black"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase">
                          Ngày cấp
                        </label>
                        <input
                          type="date"
                          value={c.issue_date}
                          onChange={(e) =>
                            handleUpdateSub(
                              "certificates",
                              c.id,
                              "issue_date",
                              e.target.value,
                            )
                          }
                          disabled={isView}
                          className="w-full p-2 border-b-4 border-slate-50 outline-none text-sm font-black"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase">
                          Xếp loại/Nội dung
                        </label>
                        <input
                          value={c.content}
                          onChange={(e) =>
                            handleUpdateSub(
                              "certificates",
                              c.id,
                              "content",
                              e.target.value,
                            )
                          }
                          disabled={isView}
                          className="w-full p-2 border-b-4 border-slate-50 outline-none text-sm font-black"
                        />
                      </div>
                      <div className="space-y-2 flex items-end justify-between gap-6">
                        <div className="flex-1 space-y-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase flex items-center gap-1">
                            <FaLink size={8} /> Link đính kèm
                          </label>
                          <input
                            value={c.field_url}
                            onChange={(e) =>
                              handleUpdateSub(
                                "certificates",
                                c.id,
                                "field_url",
                                e.target.value,
                              )
                            }
                            disabled={isView}
                            className="w-full p-2 border-b-4 border-slate-50 outline-none text-sm font-black placeholder:text-slate-200"
                            placeholder="https://..."
                          />
                        </div>
                        {!isView && (
                          <button
                            onClick={() =>
                              handleRemoveSub("certificates", c.id)
                            }
                            className="w-12 h-12 flex items-center justify-center text-rose-400 hover:bg-rose-50 rounded-2xl transition-all"
                          >
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

          {activeTab === "family" && (
            <div className="space-y-10">
              <div className="flex justify-between items-center bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm">
                <h3 className="text-xl font-black text-slate-800 uppercase tracking-tighter">
                  Quan hệ nhân thân
                </h3>
                {!isView && (
                  <button
                    onClick={() => handleAddSub("family")}
                    className="flex items-center gap-3 bg-indigo-600 text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest"
                  >
                    <FaPlus /> Thêm người thân
                  </button>
                )}
              </div>
              <div className="grid grid-cols-1 gap-8">
                {formData.family.map((f) => (
                  <div
                    key={f.id}
                    className="relative bg-white p-12 rounded-[3rem] border border-slate-100 shadow-sm"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase">
                          Họ và tên
                        </label>
                        <input
                          value={f.full_name}
                          onChange={(e) =>
                            handleUpdateSub(
                              "family",
                              f.id,
                              "full_name",
                              e.target.value,
                            )
                          }
                          disabled={isView}
                          className="w-full p-2 border-b-4 border-slate-50 outline-none text-sm font-black"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase">
                          Mối quan hệ
                        </label>
                        <input
                          value={f.relationship}
                          onChange={(e) =>
                            handleUpdateSub(
                              "family",
                              f.id,
                              "relationship",
                              e.target.value,
                            )
                          }
                          disabled={isView}
                          className="w-full p-2 border-b-4 border-slate-50 outline-none text-sm font-black"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase flex items-center gap-1">
                          <FaCalendarAlt size={8} /> Ngày sinh
                        </label>
                        <input
                          type="date"
                          value={f.date_of_birth}
                          onChange={(e) =>
                            handleUpdateSub(
                              "family",
                              f.id,
                              "date_of_birth",
                              e.target.value,
                            )
                          }
                          disabled={isView}
                          className="w-full p-2 border-b-4 border-slate-50 outline-none text-sm font-black"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase">
                          Số CCCD
                        </label>
                        <input
                          value={f.identity_card_number}
                          onChange={(e) =>
                            handleUpdateSub(
                              "family",
                              f.id,
                              "identity_card_number",
                              e.target.value,
                            )
                          }
                          disabled={isView}
                          className="w-full p-2 border-b-4 border-slate-50 outline-none text-sm font-black"
                        />
                      </div>
                      <div className="col-span-1 md:col-span-4 flex items-end justify-between gap-8 mt-4 border-t border-slate-50 pt-6">
                        <div className="flex-1 space-y-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase flex items-center gap-1">
                            <FaMapMarkerAlt size={8} /> Địa chỉ thường trú
                          </label>
                          <input
                            value={f.address}
                            onChange={(e) =>
                              handleUpdateSub(
                                "family",
                                f.id,
                                "address",
                                e.target.value,
                              )
                            }
                            disabled={isView}
                            className="w-full p-2 border-b-4 border-slate-50 outline-none text-sm font-black"
                          />
                        </div>
                        {!isView && (
                          <button
                            onClick={() => handleRemoveSub("family", f.id)}
                            className="w-14 h-14 flex items-center justify-center text-rose-400 hover:bg-rose-50 rounded-[1.25rem] transition-all"
                          >
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

        {/* FOOTER */}
        <div className="px-12 py-10 border-t flex items-center justify-between bg-white shrink-0">
          <div className="flex items-center gap-3">
            {formData.id ? (
              regCheck.loading ? (
                <div className="flex items-center gap-2 text-slate-400 font-bold text-[10px] uppercase tracking-widest">
                  <FaSpinner className="animate-spin" /> Kiểm tra hồ sơ...
                </div>
              ) : regCheck.canRegister ? (
                <div className="flex items-center gap-2 text-green-600 font-bold text-[10px] uppercase tracking-widest bg-green-50 px-4 py-2 rounded-xl border border-green-100">
                  <FaCheckCircle /> Đã đủ điều kiện đăng ký
                </div>
              ) : (
                <div className="flex items-center gap-2 text-rose-500 font-bold text-[10px] uppercase tracking-widest bg-rose-50 px-4 py-2 rounded-xl border border-rose-100 group relative">
                  <FaInfoCircle />{" "}
                  {regCheck.message || "Hồ sơ chưa đủ điều kiện"}
                  <div className="absolute bottom-full mb-2 left-0 w-64 bg-slate-800 text-white p-3 rounded-lg text-[9px] normal-case opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-xl">
                    Cần bổ sung nhân thân và bằng cấp trước khi trình duyệt.
                  </div>
                </div>
              )
            ) : (
              <div className="text-slate-300 font-bold text-[10px] uppercase tracking-widest">
                Hồ sơ mới
              </div>
            )}
          </div>

          <div className="flex items-center gap-6">
            {!isView && (
              <>
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className={`flex items-center gap-4 px-12 py-5 font-black rounded-[1.5rem] transition-all active:scale-95 text-[10px] uppercase tracking-widest ${
                    loading
                      ? "bg-slate-100 text-slate-300"
                      : "bg-white border-4 border-blue-600 text-blue-600 hover:bg-blue-50 shadow-xl shadow-blue-50"
                  }`}
                >
                  {loading ? (
                    <FaSpinner className="animate-spin text-lg" />
                  ) : (
                    <FaSave className="text-lg" />
                  )}
                  {formData.id ? "Cập nhật hồ sơ" : "Lưu hồ sơ tạm"}
                </button>

                {regCheck.canRegister && (
                  <button
                    onClick={handleOpenRegistration}
                    disabled={loading}
                    className="flex items-center gap-4 px-12 py-5 font-black bg-blue-600 text-white rounded-[1.5rem] shadow-2xl hover:bg-blue-700 transition-all active:scale-95 text-[10px] uppercase tracking-widest shadow-blue-100"
                  >
                    <FaPaperPlane className="text-lg" /> ĐĂNG KÝ PHÊ DUYỆT
                  </button>
                )}
              </>
            )}
            {isView && (
              <button
                onClick={onClose}
                className="px-16 py-5 font-black bg-slate-900 text-white rounded-[1.5rem] uppercase text-[10px] tracking-widest"
              >
                Đóng
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeModal;
