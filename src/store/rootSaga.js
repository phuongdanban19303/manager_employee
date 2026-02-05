import authSaga from "./saga/authSaga";
import employeeSaga from "./saga/employeeSaga";
import { all } from 'redux-saga/effects';
import formSaga from "./saga/formSaga";
import eventSaga from "./saga/eventSaga";
import terminationSaga from './saga/terminationSaga.js';
export default function* rootSaga() {
  yield all([
    employeeSaga(),
    authSaga(),
    formSaga(),
    eventSaga(),
    terminationSaga(),
  ]);
}