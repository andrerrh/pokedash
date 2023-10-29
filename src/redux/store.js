import { configureStore } from "@reduxjs/toolkit"
import { logger } from "redux-logger"
import genReducer from "../redux/slices/genSlice"
import typeReducer from "../redux/slices/typeSlice"
import nameReducer from "../redux/slices/nameSlice"

export const store = configureStore({
  reducer: {
    gens: genReducer,
    type: typeReducer,
    name: nameReducer,
  },
  middleware: [logger],
})
