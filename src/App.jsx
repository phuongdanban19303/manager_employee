import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import Navbar from "./components/navbar/navbar";
import EmployeeManagement from "./pages/Empolyee/EmployeeManagement";
import Login from "./pages/Login/Login";
import { useSelector } from "react-redux";
import ApprovalManagement from "./pages/From/AppManagement";
import EventManagement from "./pages/From/EventManagement";
import Guide from "./pages/Login/Guide";

// Tạo Layout riêng để bao bọc các trang sau khi đăng nhập
const ProtectedLayout = () => {
  const { token } = useSelector((state) => state.auth);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex h-screen bg-[#f0f2f5] overflow-hidden">
      <Navbar />
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <div className="min-h-full p-4 lg:p-8">
          <Outlet /> {/* Nơi hiển thị các component con */}
        </div>
      </div>
    </div>
  );
};

function App() {
  const { token } = useSelector((state) => state.auth);

  return (
    <BrowserRouter>
      <Routes>
        {/* Route Public */}
        <Route 
          path="/login" 
          element={!token ? <Login /> : <Navigate to="/management/employees" replace />} 
        />
            <Route path="/guide" element={<Guide />} />

        {/* Route Protected (Phải đăng nhập mới vào được) */}
        <Route element={<ProtectedLayout />}>
            <Route path="/" element={<Navigate to="/management/employees" replace />} />
            
            <Route path="/management/employees" element={<EmployeeManagement />} />
            <Route path="/management/approvals" element={<ApprovalManagement />} />
            <Route path="/management/events" element={<EventManagement />} />
            
            {/* Route 404 nội bộ (khi đã login nhưng sai đường dẫn) */}
            <Route path="*" element={
               <div className="flex flex-col items-center justify-center h-full text-gray-400">
                  <i className="fas fa-exclamation-circle text-5xl mb-4"></i>
                  <p className="text-xl font-medium">Trang không tồn tại.</p>
               </div>
            } />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;