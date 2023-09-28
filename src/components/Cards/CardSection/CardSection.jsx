import { useState, useEffect, useRef } from "react"

import styles from "./CardSection.module.scss"
import FiltersTab from "../../FiltersTab/FiltersTab"
import CardsContainer from "../CardsContainer/CardsContainer"

const CardSection = () => {
  return (
    <div className={styles.cardSection}>
      <FiltersTab />
      <CardsContainer />
    </div>
  )
}

export default CardSection
