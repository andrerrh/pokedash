import { useEffect, useState } from "react"
import Pokedex from "../../../dexconfig"

import styles from "./CardsContainer.module.scss"
import Card from "../Card/Card"

const CardsContainer = (props) => {
  const [pokes, setPokes] = useState([])
  useEffect(() => {

    const interval = {
      offset: 34,
      limit: 10
    }

    const fetchPokes = async () => {
      const response = await Pokedex.getEndpointsList()
      console.log(response)
    }

    fetchPokes()
  }, [])

  return (
    <section className={styles.cardsContainer}>
      {console.log(pokes)}
      <Card></Card>
      <Card></Card>
    </section>
  )
}

export default CardsContainer
