import { configureStore } from "@reduxjs/toolkit";
import slidesReducer from "./slices/slidesSlice";
import pollReducer from "./slices/pollSlice";

const asyncDispatchMiddleware = (storeAPI) => (next) => (action) => {
  if (typeof action === "function") {
    return action(storeAPI.dispatch, storeAPI.getState);
  }
  if (action.asyncDispatch) {
    return action.asyncDispatch(storeAPI.dispatch);
  }
  return next(action);
};

const store = configureStore({
  reducer: {
    slides: slidesReducer,
    poll: pollReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(asyncDispatchMiddleware),
});

export default store;
