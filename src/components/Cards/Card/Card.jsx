import { useEffect, useState } from "react"
import Pokedex from "../../../dexconfig"

import styles from "./Card.module.scss"
import { getArtwork } from "../../../api/getPokeInfo"

const Card = (props) => {
  const [currentPoke, setCurrentPoke] = useState({})
  const [pokeImg, setPokeImg] = useState("")

  useEffect(() => {
    const fetchPokemon = async () => {
      setCurrentPoke(props.poke)
      setPokeImg(getArtwork(props.poke.id))
    }
    fetchPokemon()
  }, [props.poke])

  return (
    <>
      {currentPoke && (
        <div
          className={styles.card}
          style={{ "--pokeColor": currentPoke.typeColor }}
        >
          <div className={styles.top}></div>
          <div className={styles.bottom}>
            <div className={styles.infoContainer}>
              <p className={styles.pokeName}>{currentPoke.name}</p>
            </div>
          </div>
          <div className={styles.imageContainer}>
            <img src={pokeImg} alt={currentPoke.name} />
          </div>
        </div>
      )}
    </>
  )
}

export default Card
