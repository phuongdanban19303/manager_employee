
import { all, takeLatest, put, call } from 'redux-saga/effects';
import * as api from '../../api/EmpolyeeApi.js';
import { 
  fetchTerminationListRequest, fetchTerminationListSuccess,
  fetchManagersRequest, fetchManagersSuccess,
  submitTerminationFlowRequest, submitTerminationFlowSuccess,
  setTerminationError
} from '../scile/terminationSlice.js'
import { fetchEmployeesRequest } from '../scile/employeeSlice.js';

function* handleFetchList() {
  try {
    const res = yield call(api.getTerminationListApi);
    yield put(fetchTerminationListSuccess(res.data || res));
  } catch (e) { yield put(setTerminationError(e.message)); }
}

function* handleFetchManagers() {
  try {
    const res = yield call(api.getManagersApi);
    yield put(fetchManagersSuccess(res.data || res));
  } catch (e) { yield put(setTerminationError(e.message)); }
}

function* handleSubmitFlow(action) {
  try {
    const { employeeId, terminationDate, terminationReason, receiverId } = action.payload;
    
    // Bước 1: Tạo bản ghi termination
    const createRes = yield call(api.createTerminationApi, { 
        employeeId, 
        terminationDate, 
        terminationReason 
    });
    
    const formId = createRes.data?.formId;
    if (!formId) throw new Error("Không lấy được Form ID từ server");

    // Bước 2: Trình lãnh đạo ngay lập tức
    yield call(api.submitTerminationApi, { 
        formId, 
        receiverId 
    });

    yield put(submitTerminationFlowSuccess());
    yield put(fetchEmployeesRequest()); // Refresh lại danh sách nhân viên
    alert("Hồ sơ đã được gửi trình lãnh đạo kết thúc!");
  } catch (e) { 
    yield put(setTerminationError(e.message)); 
    alert("Lỗi: " + e.message);
  }
}

export default function* terminationSaga() {
  yield all([
    takeLatest(fetchTerminationListRequest.type, handleFetchList),
    takeLatest(fetchManagersRequest.type, handleFetchManagers),
    takeLatest(submitTerminationFlowRequest.type, handleSubmitFlow),
  ]);
}
