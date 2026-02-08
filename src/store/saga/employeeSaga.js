import { all, takeLeading, put, call } from "redux-saga/effects";
import {
  fetchEmployeesRequest,
  fetchEmployeesSuccess,
  deleteEmployeeRequest,
  deleteEmployeeSuccess,
  registerEmployeeRequest,
  registerEmployeeSuccess,
  saveEmployeeFullRequest,
  saveEmployeeFullSuccess,
  saveEmployeeFullFailure,
  checkRegistrationRequest,
  checkRegistrationSuccess,
  checkRegistrationFailure,
  fetchEmployeeDetailSuccess,
  fetchEmployeeDetailFailure,
  fetchEmployeeDetailRequest,
  createRegistrationSuccess,
  fetchManagersSuccess,
  createRegistrationRequest,
  fetchManagersRequest,
  submitToManagerRequest,
  submitToManagerSuccess,
  updateRegistrationSuccess,
  updateRegistrationRequest,
  fetchExistingRegistrationSuccess,
  fetchExistingRegistrationRequest,
} from "../scile/employeeSlice.js";
import {
  checkRegistrationApi,
  createCertsApi,
  createEmployeeApi,
  createFamilyApi,
  createRegistrationFormApi,
  deleteEmployeeApi,
  getAllEmployeesApi,
  getCertificatesByEmployeeApi,
  getEmployeeDetailApi,
  getFamilyByEmployeeApi,
  getManagersApi,
  getRegistrationByEmployeeApi,
  registerEmployeeApi,
  submitToManagerApi,
  updateCertsApi,
  updateEmployeeApi,
  updateFamilyApi,
  updateRegistrationFormApi,
} from "../../api/EmpolyeeApi.js";

function* handleFetchEmployees() {
  try {
    const res = yield call(getAllEmployeesApi);
    yield put(fetchEmployeesSuccess(res.data || res));
  } catch (error) {
    console.error(error.message);
  }
}
function* handleSaveFull(action) {
  try {
    const { family = [], certificates = [], ...empData } = action.payload;

    let employeeId = empData.id;

    const employeePayload = {
      fullName: empData.fullName,
      gender: empData.gender === "Nam" ? "MALE" : "FEMALE",
      dateOfBirth: empData.dateOfBirth,
      address: empData.address,
      team: empData.team,
      avatarUrl: empData.avatarUrl || "",
      identityNumber: empData.identityNumber,
      phone: empData.phone,
      email: empData.email,
    };
    console.log("ID here", empData);

    if (employeeId) {
      yield call(updateEmployeeApi, employeeId, employeePayload);
    } else {
      const res = yield call(createEmployeeApi, employeePayload);
      employeeId = res.data.employeeId;
    }

    if (!employeeId) throw new Error("Không lấy được ID nhân viên");

    const familyCalls = [];
    const newFamilyPayload = [];

    for (const f of family) {
      const payload = {
        full_name: f.full_name,
        gender: f.gender === "Nam" ? "1" : "0",
        date_of_birth: f.date_of_birth,
        identity_card_number: f.identity_card_number,
        relationship: f.relationship,
        address: f.address,
      };

      if (typeof f.id === "number") {
        familyCalls.push(call(updateFamilyApi, f.id, payload));
      } else {
        newFamilyPayload.push(payload);
      }
    }

    if (newFamilyPayload.length > 0) {
      familyCalls.push(call(createFamilyApi, employeeId, newFamilyPayload));
    }

    const certCalls = [];
    const newCertPayload = [];

    for (const c of certificates) {
      const payload = {
        name: c.name,
        issue_date: c.issue_date,
        content: c.content,
        field_url: c.field_url,
      };

      if (typeof c.id === "number") {
        certCalls.push(call(updateCertsApi, c.id, payload));
      } else {
        newCertPayload.push(payload);
      }
    }

    if (newCertPayload.length > 0) {
      certCalls.push(call(createCertsApi, employeeId, newCertPayload));
    }

    yield all([...familyCalls, ...certCalls]);

    const [empDetail, familyDetail, certDetail] = yield all([
      call(getEmployeeDetailApi, employeeId),
      call(getFamilyByEmployeeApi, employeeId),
      call(getCertificatesByEmployeeApi, employeeId),
    ]);
    console.log("decheck", empDetail);
    yield put(
      saveEmployeeFullSuccess({
        ...empDetail.data,
        family: familyDetail.data || [],
        certificates: certDetail.data || [],
      }),
    );

    yield put(fetchEmployeesRequest());
    yield put(checkRegistrationRequest(employeeId));
  } catch (err) {
    console.error("🔥 LỖI BẮT ĐƯỢC TRONG SAGA:", err);
    yield put(saveEmployeeFullFailure(err.message));
  }
}

function* handleDelete(action) {
  try {
    yield call(deleteEmployeeApi, action.payload);
    yield put(deleteEmployeeSuccess(action.payload));
  } catch (error) {
    alert(error.message);
  }
}
function* handleFetchEmployeeDetail(action) {
  try {
    const employeeId = action.payload;

    const [empDetail, familyDetail, certDetail] = yield all([
      call(getEmployeeDetailApi, employeeId),
      call(getFamilyByEmployeeApi, employeeId),
      call(getCertificatesByEmployeeApi, employeeId),
    ]);

    yield put(
      fetchEmployeeDetailSuccess({
        ...empDetail.data,
        family: familyDetail.data || [],
        certificates: certDetail.data || [],
      }),
    );

    yield put(checkRegistrationRequest(employeeId));
  } catch (err) {
    yield put(fetchEmployeeDetailFailure(err.message));
  }
}
//
function* handleCheckRegistration(action) {
  try {
    const res = yield call(checkRegistrationApi, action.payload);
    yield put(checkRegistrationSuccess(res));
  } catch (error) {
    const errorMsg = error.message || "Chưa đủ điều kiện đăng ký";
    yield put(checkRegistrationFailure(errorMsg));
  }
}

function* handleRegister(action) {
  try {
    yield call(registerEmployeeApi, action.payload);
    yield put(registerEmployeeSuccess(action.payload));
    yield put(fetchEmployeesRequest());
  } catch (error) {
    alert(error.message);
  }
}
//
function* handleCreateRegistration(action) {
  try {
    const { employeeId, data } = action.payload;

    const res = yield call(createRegistrationFormApi, employeeId, data);

    if (res.code !== 200000) {
      throw new Error(res.message || "Permission denied");
    }

    yield put(
      createRegistrationSuccess({
        id: res.data?.form_id,
      }),
    );

    alert("Đã lưu biểu mẫu đăng ký thành công!");
  } catch (error) {
    alert("Lỗi tạo biểu mẫu: " + (error?.message || "Không rõ nguyên nhân"));
  }
}

function* handleFetchManagers() {
  try {
    const res = yield call(getManagersApi);
    yield put(fetchManagersSuccess(res.data || res));
  } catch (error) {
    console.error("Lỗi lấy danh sách lãnh đạo:", error);
  }
}

function* handleFetchExistingReg(action) {
  try {
    const res = yield call(getRegistrationByEmployeeApi, action.payload);
    yield put(fetchExistingRegistrationSuccess(res.data || res));
  } catch (e) {
    yield put(fetchExistingRegistrationSuccess(null));
  }
}

function* handleUpdateReg(action) {
  try {
    const { formId, data } = action.payload;
    const updatePayload = {
      ...data,
      id: formId,
    };
    yield call(updateRegistrationFormApi, updatePayload);
    yield put(updateRegistrationSuccess());
    alert("Đã cập nhật bản ghi đăng ký!");
  } catch (e) {
    alert(e.message);
  }
}

function* handleSubmitToManager(action) {
  try {
    const { formId, data } = action.payload;
    yield call(submitToManagerApi, formId, data);
    yield put(submitToManagerSuccess());
    yield put(fetchEmployeesRequest());
    alert("Đã trình lãnh đạo phê duyệt thành công!");
  } catch (error) {
    alert("Lỗi trình duyệt: " + (error.message || "Server Error"));
  }
}

export default function* employeeSaga() {
  yield all([
    takeLeading(fetchEmployeesRequest.type, handleFetchEmployees),
    takeLeading(saveEmployeeFullRequest.type, handleSaveFull),
    takeLeading(deleteEmployeeRequest.type, handleDelete),
    takeLeading(registerEmployeeRequest.type, handleRegister),
    takeLeading(fetchEmployeeDetailRequest.type, handleFetchEmployeeDetail),
    takeLeading(checkRegistrationRequest.type, handleCheckRegistration),
    takeLeading(createRegistrationRequest.type, handleCreateRegistration),
    takeLeading(fetchManagersRequest.type, handleFetchManagers),
    takeLeading(submitToManagerRequest.type, handleSubmitToManager),
    takeLeading(updateRegistrationRequest.type, handleUpdateReg),
    takeLeading(fetchExistingRegistrationRequest.type, handleFetchExistingReg),
  ]);
}
