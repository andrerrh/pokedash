import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  selected: [],
}

export const genSlice = createSlice({
  name: "gen",
  initialState,
  reducers: {
    changeGen: (state, action) => {
      state.selected = action.payload
    },
  },
})

export const { changeGen } = genSlice.actions
export default genSlice.reducer
