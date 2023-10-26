import { useState, useEffect, useRef } from "react"

import styles from "./CardsPage.module.scss"
import FiltersTab from "../../FiltersTab/FiltersTab"
import CardsContainer from "../CardsContainer/CardsContainer"

const CardsPage = () => {
  return (
    <div className={styles.CardsPage}>
      <FiltersTab />
      <CardsContainer />
    </div>
  )
}

export default CardsPage
