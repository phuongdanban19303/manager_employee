import { call, put, takeLatest } from "redux-saga/effects";
import { loginApi } from "../../api/EmpolyeeApi";
import { loginFailure, loginRequest, loginSuccess } from "../scile/authSlice";
function* handleLogin(action) {
  try {
    const response = yield call(loginApi, action.payload);
    const token = response.data.token;

    if (token) {
      localStorage.setItem("token", token);
      yield put(loginSuccess(token));
      window.location.hash = "/management/employees";
    } else {
      yield put(loginFailure("Không nhận được mã truy cập từ server."));
    }
  } catch (error) {
    const errorMsg =
      error.response?.data?.message ||
      "Đăng nhập thất bại. Sai tài khoản hoặc mật khẩu.";
    yield put(loginFailure(errorMsg));
  }
}

export default function* authSaga() {
  yield takeLatest(loginRequest.type, handleLogin);
}
