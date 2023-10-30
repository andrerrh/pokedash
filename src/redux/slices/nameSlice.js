import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  selected: "",
}

export const nameSlice = createSlice({
  name: "name",
  initialState,
  reducers: {
    changeName: (state, action) => {
      state.selected = action.payload
    },
  },
})

export const { changeName } = nameSlice.actions
export default nameSlice.reducer
