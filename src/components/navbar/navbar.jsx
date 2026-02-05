import { FaHome, FaUsers, FaFileSignature, FaChartBar, FaCog, FaSignOutAlt } from 'react-icons/fa';
import { Link, useLocation } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { logout } from "../../store/scile/authSlice";

const Navbar = () => {
   const location = useLocation();
  const dispatch = useDispatch();
  const isActive = (path) => location.pathname.startsWith(path);

  const handleLogout = () => {
    if (window.confirm('Bạn có chắc chắn muốn đăng xuất?')) {
      dispatch(logout());
    }
  };

  const menuItems = [
    { icon: <FaHome />, path: '/home', label: 'Trang chủ' },
    { icon: <FaUsers />, path: '/management/employees', label: 'Nhân sự' },
    { icon: <FaFileSignature />, path: '/management/approvals', label: 'Phê duyệt' },
    { icon: <FaChartBar />, path: '/management/events', label: 'Diễn biến' },
  ];

  return (
    <div className="w-20 lg:w-24 bg-[#0a2540] h-full flex flex-col shrink-0 items-center py-8 shadow-2xl z-20 border-r border-white/5">
      <div className="mb-12">
        <Link to="/" className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-blue-900/40 hover:rotate-12 transition-all group">
          <span className="text-2xl font-black">M</span>
        </Link>
      </div>

      <nav className="flex-1 flex flex-col gap-5">
        {menuItems.map((item, idx) => (
          <Link
            key={idx}
            to={item.path}
            title={item.label}
            className={`w-14 h-14 flex flex-col items-center justify-center rounded-2xl transition-all relative group ${
              isActive(item.path)
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50'
                : 'text-slate-400 hover:bg-white/5 hover:text-white'
            }`}
          >
            <span className="text-xl">{item.icon}</span>
            <span className="text-[9px] font-black uppercase mt-1 tracking-tighter scale-0 group-hover:scale-100 transition-transform">
              {item.label}
            </span>
            {isActive(item.path) && (
              <div className="absolute -left-1 w-1 h-8 bg-white rounded-full"></div>
            )}
          </Link>
        ))}
      </nav>

      <div className="flex flex-col gap-6 mt-auto">
        <button title="Cài đặt" className="w-14 h-14 flex items-center justify-center text-slate-500 hover:text-white transition-colors">
          <FaCog size={20} />
        </button>
        <button 
          onClick={handleLogout}
          title="Đăng xuất"
          className="w-14 h-14 flex items-center justify-center text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-all rounded-2xl"
        >
          <FaSignOutAlt size={20} />
        </button>
      </div>
    </div>
  );
};

export default Navbar;