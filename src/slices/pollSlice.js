import { createSlice } from "@reduxjs/toolkit";

const pollSlice = createSlice({
  name: "poll",
  initialState: {
    poll: [],
  },
  reducers: {
    setPoll: (state, action) => {
      state.poll = action.payload;
    },
    resetPoll: (state) => {
      state.poll = [];
    },
  },
});

export const { setPoll, resetPoll } = pollSlice.actions;
export default pollSlice.reducer;
