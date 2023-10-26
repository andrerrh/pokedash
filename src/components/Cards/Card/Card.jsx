import { useEffect, useState } from "react"
import Pokedex from "../../../dexconfig"

import styles from "./Card.module.scss"
import getArtwork from "../../../api/getArtwork"
import pokeExample from "../../../assets/imgs/cardImages/1.png"

const Card = ({ poke }) => {
  const [currentPoke, setCurrentPoke] = useState({})
  const [pokeImg, setPokeImg] = useState("")

  useEffect(() => {
    const fetchPokemon = async () => {
      const response = await Pokedex.getPokemon(poke.id)
      setCurrentPoke(response)
      setPokeImg(getArtwork(poke.id))
    }
    fetchPokemon()
  }, [poke])

  return (
    <div className={styles.card}>
      {currentPoke && (
        <>
          <div className={styles.top}></div>
          <div className={styles.bottom}>
            <div className={styles.infoContainer}>
              <p className={styles.pokeName}>{currentPoke.name}</p>
            </div>
          </div>
          <div className={styles.imageContainer}>
            <img src={pokeImg} alt="bulba" />
          </div>
        </>
      )}
    </div>
  )
}

export default Card
