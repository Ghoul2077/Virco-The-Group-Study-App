import { createSlice } from "@reduxjs/toolkit";
import { createAction } from "@reduxjs/toolkit";

const INITIAL_STATE = {
  data: null,
  isLoading: true,
};

const slice = createSlice({
  name: "user",
  initialState: INITIAL_STATE,
  reducers: {
    setUser: (user, action) => {
      user.data = action.payload.userData;
      user.isLoading = false;
    },
    logout: () => ({ ...INITIAL_STATE, isLoading: false }),
    startAuthLoading: (user) => {
      user.isLoading = true;
    },
    stopAuthLoading: (user) => {
      user.isLoading = false;
    },
  },
});

export const { setUser, logout, startAuthLoading, stopAuthLoading } =
  slice.actions;
export const login = createAction("user/login");
export const createAccount = createAction("user/createAccount");
export default slice.reducer;
