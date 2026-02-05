import { configureStore } from "@reduxjs/toolkit";
import createSagaMiddleware from "redux-saga";
import employeeReducer from "./scile/employeeSlice";
import formSliceReducer from "./scile/FormSlices";
import authReducer from "./scile/authSlice";
import eventReducer from "./scile/eventSlice";
import rootSaga from "./rootSaga";
import terminationReducer from "./scile/terminationSlice";

const sagaMiddleware = createSagaMiddleware();

export const store = configureStore({
  reducer: {
    employee: employeeReducer,
    auth: authReducer,
    formSlice: formSliceReducer,
    event: eventReducer,
    termination: terminationReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ thunk: false, serializableCheck: false }).concat(
      sagaMiddleware,
    ),
});

sagaMiddleware.run(rootSaga);
