import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  selected: [],
}

export const typeSlice = createSlice({
  name: "type",
  initialState,
  reducers: {
    changeType: (state, action) => {
        state.selected = action.payload
    },
  },
})

export const { changeType } = typeSlice.actions
export default typeSlice.reducer
