import { all, takeLatest, put, call } from "redux-saga/effects";

import {
  fetchPendingRequest,
  fetchPendingSuccess,
  fetchPendingFailure,
  fetchApprovalDetailRequest,
  fetchApprovalDetailSuccess,
  processApprovalRequest,
  processApprovalSuccess,
  processApprovalFailure,
} from "../scile/FormSlices.js";
import * as api from "../../api/EmpolyeeApi.js";

function* handleFetchPending() {
  try {
    const [regRes, salRes, proRes, propRes, termRes] = yield all([
      call(api.getPendingRegistrationsApi),
      call(api.getPendingSalaryApi),
      call(api.getPendingPromotionApi),
      call(api.getPendingProposalApi),
      call(api.getPendingTerminationApi),
    ]);

    const tag = (res, type, label) => {
      const list = Array.isArray(res?.data)
        ? res.data
        : Array.isArray(res)
          ? res
          : [];

      return list.map((item) => ({
        ...item,
        formId: item.formId ?? item.id,
        formType: type,
        formLabel: label,
      }));
    };
    console.log(termRes, propRes, proRes);
    const combined = [
      ...tag(regRes, "REGISTRATION", "Đơn xin việc"),
      ...tag(salRes, "SALARY", "Tăng lương"),
      ...tag(proRes, "PROMOTION", "Thăng chức"),
      ...tag(propRes, "PROPOSAL", "Đề xuất / Tham mưu"),
      ...tag(termRes, "TERMINATION", "Kết thúc hồ sơ"),
    ];

    combined.sort((a, b) => new Date(b.submitDate) - new Date(a.submitDate));
    yield put(fetchPendingSuccess(combined));
  } catch (error) {
    yield put(fetchPendingFailure(error.message));
  }
}

function* handleFetchDetail(action) {
  try {
    const { formId, employeeId, formType } = action.payload;
    console.log(formId);
    let detailApi;

    switch (formType) {
      case "REGISTRATION":
        detailApi = api.getRegistrationDetailApi;
        break;
      case "SALARY":
        detailApi = api.getSalaryDetailApi;
        break;
      case "PROMOTION":
        detailApi = api.getPromotionDetailApi;
        break;
      case "PROPOSAL":
        detailApi = api.getProposalDetailApi;
        break;
      case "TERMINATION":
        detailApi = api.getTerminationDetailApi;
        break;
      default:
        detailApi = api.getRegistrationDetailApi;
    }

    const [formRes, empRes] = yield all([
      call(detailApi, formId),
      call(api.getEmployeeViewDetailApi, employeeId),
    ]);

    yield put(
      fetchApprovalDetailSuccess({
        form: formRes.data || formRes,
        employee: empRes.data || empRes,
      }),
    );
  } catch (error) {
    alert("Lỗi lấy chi tiết hồ sơ: " + error.message);
  }
}

function* handleProcess(action) {
  try {
    const {
      formType,
      formId,
      action: statusAction,
      leaderNote,
      note,
      actionDate,
    } = action.payload;

    let payload = { formId, action: statusAction };

    if (formType === "REGISTRATION") {
      payload.note = note || leaderNote;
      payload.actionDate = actionDate;
    } else if (formType === "TERMINATION") {
      payload.note = leaderNote || note;
    } else {
      payload.leaderNote = leaderNote || note;
    }

    const res = yield call(api.processFormApi, formType, payload);

    if (res?.code !== 200000) {
      throw new Error(res?.message || "Xử lý thất bại");
    }

    yield put(processApprovalSuccess());
    yield put(fetchPendingRequest());
    alert("Hồ sơ đã được xử lý thành công!");
  } catch (error) {
    yield put(processApprovalFailure(error.message));
    alert("Lỗi: " + error.message);
  }
}

export default function* formSaga() {
  yield all([
    takeLatest(fetchPendingRequest.type, handleFetchPending),
    takeLatest(fetchApprovalDetailRequest.type, handleFetchDetail),
    takeLatest(processApprovalRequest.type, handleProcess),
  ]);
}
