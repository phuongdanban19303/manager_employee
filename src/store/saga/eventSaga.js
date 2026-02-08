import { all, call, put, takeLatest } from "redux-saga/effects";
import {
  createPromotionApi,
  createProposalApi,
  createSalaryIncreaseApi,
  getActiveEmployeesApi,
  getPromotionHistoryApi,
  getProposalHistoryApi,
  getSalaryHistoryApi,
  submitPromotionApi,
  submitProposalApi,
  submitSalaryIncreaseApi,
  updatePromotionApi,
  updateProposalApi,
  updateSalaryIncreaseApi,
} from "../../api/EmpolyeeApi";
import {
  createEventRequest,
  createEventSuccess,
  fetchActiveEmployeesRequest,
  fetchActiveEmployeesSuccess,
  setEventError,
  submitEventRequest,
  submitEventSuccess,
  updateEventRequest,
  updateEventSuccess,
} from "../scile/eventSlice";
function* handleFetchActiveEmployees() {
  try {
    const res = yield call(getActiveEmployeesApi);
    yield put(fetchActiveEmployeesSuccess(res.data || res));
  } catch (e) {
    yield put(setEventError(e.message));
  }
}

function* handleFetchHistory(action) {
  try {
    const { empId, type } = action.payload;
    let res;
    if (type === "salary") res = yield call(getSalaryHistoryApi, empId);
    else if (type === "promotion")
      res = yield call(getPromotionHistoryApi, empId);
    else if (type === "proposal")
      res = yield call(getProposalHistoryApi, empId);

    yield put({
      type: `event/fetch${type.charAt(0).toUpperCase() + type.slice(1)}HistorySuccess`,
      payload: res.data || res,
    });
  } catch (e) {
    yield put(setEventError(e.message));
  }
}

function* handleCreateEvent(action) {
  try {
    const { type, data } = action.payload;
    let res;

    if (type === "salary") res = yield call(createSalaryIncreaseApi, data);
    else if (type === "promotion") res = yield call(createPromotionApi, data);
    else if (type === "proposal") res = yield call(createProposalApi, data);

    if (res.code !== 200000) {
      throw new Error(res.message || "Có lỗi xảy ra");
    }

    const createdId = res.data?.formId;

    yield put(createEventSuccess({ id: createdId }));
    yield put({
      type: "event/handleFetchHistory",
      payload: { empId: data.employeeId, type },
    });

    alert("Đã lưu nháp thành công! Bạn có thể trình lãnh đạo ngay.");
  } catch (e) {
    yield put(setEventError(e.message));
    alert(e.message);
  }
}

function* handleUpdateEvent(action) {
  try {
    const { type, id, data } = action.payload;
    if (type === "salary") yield call(updateSalaryIncreaseApi, id, data);
    else if (type === "promotion") yield call(updatePromotionApi, id, data);
    else if (type === "proposal") yield call(updateProposalApi, id, data);

    yield put(updateEventSuccess());
    yield put({
      type: "event/handleFetchHistory",
      payload: { empId: data.employeeId, type },
    });
    alert("Đã cập nhật thay đổi thành công!");
  } catch (e) {
    yield put(setEventError(e.message));
    alert(e.message);
  }
}

function* handleSubmitEvent(action) {
  try {
    const { type, formId, receiverId, empId } = action.payload;
    const submitBody = { formId, receiverId };

    if (type === "salary") yield call(submitSalaryIncreaseApi, submitBody);
    else if (type === "promotion") yield call(submitPromotionApi, submitBody);
    else if (type === "proposal") yield call(submitProposalApi, submitBody);

    yield put(submitEventSuccess());
    yield put({ type: "event/handleFetchHistory", payload: { empId, type } });
    alert("Hồ sơ đã được trình lãnh đạo phê duyệt!");
  } catch (e) {
    yield put(setEventError(e.message));
    alert(e.message);
  }
}

export default function* eventSaga() {
  yield all([
    takeLatest(fetchActiveEmployeesRequest.type, handleFetchActiveEmployees),
    takeLatest("event/handleFetchHistory", handleFetchHistory),
    takeLatest(updateEventRequest.type, handleUpdateEvent),
    takeLatest(createEventRequest.type, handleCreateEvent),
    takeLatest(submitEventRequest.type, handleSubmitEvent),
  ]);
}
