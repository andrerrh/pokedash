import { configureStore } from "@reduxjs/toolkit"
import { logger } from "redux-logger"
import genReducer from "../redux/slices/genSlice"
import typeReducer from "../redux/slices/typeSlice"

export const store = configureStore({
  reducer: {
    gens: genReducer,
    type: typeReducer,
  },
  middleware: [logger],
})
