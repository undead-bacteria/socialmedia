import { createSlice } from "@reduxjs/toolkit";

export const loaderSlice = createSlice({
  name: "loader",
  initialState: {
    isLoading: false,
  },
  reducers: {
    setLoading: (state, action) => {
      console.log("action", action);
      state.value = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setLoading } = loaderSlice.actions;
export default loaderSlice.reducer;
