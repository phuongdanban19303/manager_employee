import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, Navigate } from "react-router-dom";
import { loginRequest } from "../../store/scile/authSlice";

const Login = () => {
   const dispatch = useDispatch();
  const { token, loading, error } = useSelector(state => state.auth);
  const [credentials, setCredentials] = useState({ username: '', password: '' });

  if (token) {
    return <Navigate to="/management/employees" replace />;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!credentials.username || !credentials.password) return;
    dispatch(loginRequest(credentials));
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#f4f7fa] p-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/5 rounded-full blur-[100px]"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-500/5 rounded-full blur-[100px]"></div>

      <div className="w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-white/20 animate-fadeIn relative z-10">
        <div className="p-10">
          <div className="flex justify-center mb-8">
            <div className="w-20 h-20 bg-blue-600 rounded-[1.5rem] flex items-center justify-center text-white shadow-2xl shadow-blue-200">
              <i className="fas fa-users-cog text-4xl"></i>
            </div>
          </div>
          
          <h2 className="text-3xl font-black text-center text-slate-800 mb-2 tracking-tight">Chào mừng trở lại</h2>
          <p className="text-center text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em] mb-10">Hệ thống Quản trị Nhân sự HR Master</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-rose-50 border-l-4 border-rose-500 p-4 rounded-xl text-rose-700 text-xs font-bold animate-fadeIn">
                <i className="fas fa-exclamation-triangle mr-2"></i>
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Tài khoản</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-5 flex items-center text-slate-300">
                  <i className="fas fa-user text-sm"></i>
                </span>
                <input
                  type="text"
                  name="username"
                  value={credentials.username}
                  onChange={handleChange}
                  placeholder="Nhập tên đăng nhập"
                  className="w-full pl-14 pr-6 py-4 bg-slate-50 border-0 rounded-2xl focus:ring-4 focus:ring-blue-500/10 outline-none font-bold text-slate-700 transition-all shadow-inner"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Mật khẩu</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-5 flex items-center text-slate-300">
                  <i className="fas fa-lock text-sm"></i>
                </span>
                <input
                  type="password"
                  name="password"
                  value={credentials.password}
                  onChange={handleChange}
                  placeholder="Nhập mật khẩu"
                  className="w-full pl-14 pr-6 py-4 bg-slate-50 border-0 rounded-2xl focus:ring-4 focus:ring-blue-500/10 outline-none font-bold text-slate-700 transition-all shadow-inner"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-5 px-4 rounded-2xl shadow-xl shadow-blue-100 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3 text-[10px] uppercase tracking-widest"
            >
              {loading ? <i className="fas fa-circle-notch fa-spin text-lg"></i> : <i className="fas fa-sign-in-alt text-lg"></i>}
              {loading ? 'Đang xác thực...' : 'Đăng nhập hệ thống'}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-slate-50 flex flex-col items-center gap-4">
             <Link 
                to="/guide" 
                className="flex items-center gap-3 px-6 py-3 bg-white border-2 border-slate-900 text-red-900 rounded-xl font-black text-[9px] uppercase tracking-[0.15em] hover:bg-slate-900 hover:text-white transition-all shadow-md active:scale-95"
             >
                <i className="fas fa-info-circle text-sm"></i>
                Thông tin đăng nhập & Hướng dẫn
             </Link>
          </div>
        </div>
        
        <div className="bg-slate-50 px-8 py-5 text-center">
          <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">
            &copy; 2024 HR Master System • VERSION 2.5.0
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
