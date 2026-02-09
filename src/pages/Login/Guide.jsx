
import React from 'react';
import { Link } from 'react-router-dom';
import { FaChevronLeft, FaUserTie, FaUserShield, FaCheckCircle, FaTimesCircle, FaInfoCircle, FaPlus, FaSave, FaPaperPlane } from 'react-icons/fa';

const Guide = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center py-20 px-4">
      <div className="w-full max-w-4xl space-y-10 animate-fadeIn">
        
        <div className="flex justify-between items-center mb-4">
            <Link to="/login" className="flex items-center gap-2 text-slate-400 hover:text-blue-600 font-black text-[10px] uppercase tracking-widest transition-colors">
                <FaChevronLeft /> Quay lại đăng nhập
            </Link>
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg">
                    <span className="font-black">M</span>
                </div>
                <span className="text-xl font-black text-slate-800 tracking-tighter uppercase">HR Master Guide</span>
            </div>
        </div>

        <div className="text-center space-y-4">
            <h1 className="text-4xl font-black text-slate-800 tracking-tight">Hướng dẫn & Tài khoản Test</h1>
            <p className="text-slate-500 font-medium max-w-xl mx-auto">Vui lòng sử dụng thông tin dưới đây để truy cập và trải nghiệm các tính năng của hệ thống Quản trị Nhân sự.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Account 1: LEADER */}
            <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-white p-10 flex flex-col group hover:shadow-2xl transition-all duration-500">
                <div className="flex items-center gap-5 mb-8">
                    <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center text-white text-2xl shadow-lg group-hover:rotate-6 transition-transform">
                        <FaUserTie />
                    </div>
                    <div>
                        <h3 className="text-2xl font-black text-slate-800 leading-none">TEAM LEADER</h3>
                        <span className="text-[10px] text-indigo-600 font-black uppercase tracking-widest mt-2 block">Tài khoản Nhân sự</span>
                    </div>
                </div>

                <div className="space-y-4 bg-slate-50 p-6 rounded-2xl border border-slate-100 mb-8">
                    <div className="flex justify-between items-center">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Username</span>
                        <span className="font-black text-slate-800 tracking-tight select-all">leader</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Password</span>
                        <span className="font-black text-slate-800 tracking-tight select-all">123456</span>
                    </div>
                </div>

                <div className="flex-1 space-y-6">
                    <div>
                        <p className="text-[10px] font-black text-green-600 uppercase tracking-widest mb-3 flex items-center gap-2">
                            <FaCheckCircle /> Tính năng chính
                        </p>
                        <ul className="grid grid-cols-1 gap-2">
                            {['Tạo mới & Cập nhật nhân viên', 'Khai báo Văn bằng, Gia đình', 'Soạn thảo Đơn xin việc (Registration)', 'Tạo Đề xuất, Nâng lương, Thăng chức', 'Trình lãnh đạo phê duyệt hồ sơ'].map((text, i) => (
                                <li key={i} className="flex items-center gap-3 text-xs font-bold text-slate-600">
                                    <div className="w-1 h-1 bg-slate-300 rounded-full"></div>
                                    {text}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-rose-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                            <FaTimesCircle /> Hạn chế
                        </p>
                        <p className="text-xs font-bold text-slate-400 italic">Không có quyền Phê duyệt/Từ chối các bản ghi của chính mình hoặc nhân viên khác.</p>
                    </div>
                </div>
            </div>

            {/* Account 2: MANAGER */}
            <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-white p-10 flex flex-col group hover:shadow-2xl transition-all duration-500">
                <div className="flex items-center gap-5 mb-8">
                    <div className="w-14 h-14 bg-slate-900 rounded-2xl flex items-center justify-center text-white text-2xl shadow-lg group-hover:rotate-6 transition-transform">
                        <FaUserShield />
                    </div>
                    <div>
                        <h3 className="text-2xl font-black text-slate-800 leading-none">MANAGER</h3>
                        <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest mt-2 block">Cấp quản lý cao nhất</span>
                    </div>
                </div>

                <div className="space-y-4 bg-slate-50 p-6 rounded-2xl border border-slate-100 mb-8">
                    <div className="flex justify-between items-center">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Username</span>
                        <span className="font-black text-slate-800 tracking-tight select-all">manager</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Password</span>
                        <span className="font-black text-slate-800 tracking-tight select-all">123456</span>
                    </div>
                </div>

                <div className="flex-1 space-y-6">
                    <div>
                        <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-3 flex items-center gap-2">
                            <FaCheckCircle /> Tính năng chính
                        </p>
                        <ul className="grid grid-cols-1 gap-2">
                            {['Tiếp nhận Hộp thư phê duyệt', 'Xem chi tiết các yêu cầu từ Leader', 'Thực hiện Phê duyệt hồ sơ', 'Yêu cầu Bổ sung nội dung', 'Từ chối các bản ghi không hợp lệ'].map((text, i) => (
                                <li key={i} className="flex items-center gap-3 text-xs font-bold text-slate-600">
                                    <div className="w-1 h-1 bg-slate-300 rounded-full"></div>
                                    {text}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100 flex gap-4">
                        <FaInfoCircle className="text-blue-500 shrink-0 mt-1" />
                        <p className="text-[10px] text-blue-700 font-bold leading-relaxed uppercase">
                            MANAGER chỉ có quyền xử lý các yêu cầu được trình lên từ Leader. Không trực tiếp khởi tạo dữ liệu nhân sự.
                        </p>
                    </div>
                </div>
            </div>
        </div>

        <div className="bg-white p-12 rounded-[3.5rem] shadow-sm border border-slate-100">
            <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight mb-8">Mô phỏng quy trình (Workflow)</h3>
            <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="flex-1 p-6 bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-center">
                    <FaPlus className="text-blue-500 mx-auto mb-3" />
                    <p className="text-[10px] font-black uppercase text-slate-400 mb-1">Bước 1 (Leader)</p>
                    <p className="text-xs font-bold text-slate-700">Tạo mới & Lưu nháp</p>
                </div>
                <div className="text-slate-300 hidden md:block">→</div>
                <div className="flex-1 p-6 bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-center">
                    <FaPaperPlane className="text-indigo-500 mx-auto mb-3" />
                    <p className="text-[10px] font-black uppercase text-slate-400 mb-1">Bước 2 (Leader)</p>
                    <p className="text-xs font-bold text-slate-700">Trình lãnh đạo phê duyệt</p>
                </div>
                <div className="text-slate-300 hidden md:block">→</div>
                <div className="flex-1 p-6 bg-blue-50 rounded-2xl border border-dashed border-blue-200 text-center">
                    <FaUserShield className="text-blue-600 mx-auto mb-3" />
                    <p className="text-[10px] font-black uppercase text-blue-400 mb-1">Bước 3 (Manager)</p>
                    <p className="text-xs font-bold text-slate-700">Xét duyệt & Phê duyệt</p>
                </div>
                <div className="text-slate-300 hidden md:block">→</div>
                <div className="flex-1 p-6 bg-green-50 rounded-2xl border border-dashed border-green-200 text-center">
                    <FaSave className="text-green-600 mx-auto mb-3" />
                    <p className="text-[10px] font-black uppercase text-green-400 mb-1">Bước 4</p>
                    <p className="text-xs font-bold text-slate-700">Hoàn tất & Lưu trữ</p>
                </div>
            </div>
        </div>

        <div className="text-center pt-10">
            <Link to="/login" className="inline-flex items-center gap-4 bg-slate-900 text-white px-12 py-5 rounded-[1.5rem] font-black text-[10px] uppercase tracking-widest shadow-2xl active:scale-95 transition-all">
                Tôi đã hiểu, đi tới Đăng nhập
            </Link>
        </div>
      </div>
    </div>
  );
};

export default Guide;
