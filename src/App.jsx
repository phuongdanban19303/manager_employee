import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/navbar/navbar";
import EmployeeManagement from "./pages/Empolyee/EmployeeManagement";
import Login from "./pages/Login/Login";
import { useSelector } from "react-redux";
import ApprovalManagement from "./pages/From/AppManagement";
import EventManagement from "./pages/From/EventManagement";

function App() {
  const { token } = useSelector((state) => state.auth);
  return (
    <BrowserRouter>
      <Routes>
        {/* Trang Login luôn có thể truy cập nếu chưa có token, nếu có rồi thì redirect về home */}
        <Route
          path="/login"
          element={
            !token ? <Login /> : <Navigate to="/management/employees" replace />
          }
        />

        {/* Các Route cần bảo vệ */}
        <Route
          path="/*"
          element={
            token ? (
              <div className="flex h-screen bg-[#f0f2f5] overflow-hidden">
                {/* Sidebar bên trái - Cố định */}
                <Navbar />

                {/* Vùng nội dung chính bên phải - Có thể cuộn */}
                <div className="flex-1 overflow-y-auto custom-scrollbar">
                  <div className="min-h-full p-4 lg:p-8">
                    <Routes>
                      <Route
                        path="/"
                        element={
                          <Navigate to="/management/employees" replace />
                        }
                      />
                      <Route
                        path="/management/approvals"
                        element={<ApprovalManagement />}
                      />

                      <Route
                        path="/management/employees"
                        element={<EmployeeManagement />}
                      />
                      <Route
                        path="/management/events"
                        element={<EventManagement />}
                      />

                      <Route
                        path="*"
                        element={
                          <div className="flex flex-col items-center justify-center h-full text-gray-400">
                            <i className="fas fa-exclamation-circle text-5xl mb-4"></i>
                            <p className="text-xl font-medium">
                              Trang không tồn tại hoặc đang phát triển.
                            </p>
                          </div>
                        }
                      />
                    </Routes>
                  </div>
                </div>
              </div>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
