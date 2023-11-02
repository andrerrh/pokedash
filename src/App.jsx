import { createBrowserRouter, RouterProvider } from "react-router-dom"

import styles from "./App.module.scss"
import CardsPage from "./components/Cards/CardsPage/CardsPage"
import Poke from "./components/Poke/Poke"

const router = createBrowserRouter([
  { path: "/", element: <CardsPage /> },
  { path: "/poke/:pokeId", element: <Poke />},
])

function App() {
  return (
    <div className={styles.app}>
      <RouterProvider router={router} />
    </div>
  )
}

export default App
