import { useEffect, useState } from "react"
import Pokedex from "../../../dexconfig"
import { useSelector } from "react-redux"

import styles from "./CardsContainer.module.scss"
import Card from "../Card/Card"

const CardsContainer = (props) => {
  const [pokes, setPokes] = useState([])
  const selectedGens = useSelector((state) => state.gens.selected)
  const selectedTypes = useSelector((state) => state.type.selected)

  let selectedGensArray = []

  const fetchPokemons = async () => {
    const response = await Pokedex.getGeneration([1, 2])
    const pokemonsFromFetchedGens = response.reduce((acc, gen) => {
      return acc.concat(
        gen.pokemon_species.map((poke) => {
          const idMatch = poke.url.match(/\/(\d+)\/$/) //Extracts the Pokemon ID from the URL
          const pokeId = parseInt(idMatch[1], 10)
          return {
            id: pokeId,
            url: poke.url,
          }
        })
      )
    }, [])
    setPokes(pokemonsFromFetchedGens)
  }

  useEffect(() => {
    selectedGensArray = Object.keys(selectedGens).filter(
      (key) => selectedGens[key]
    )
  }, [selectedGens])

  return (
    <>
      {console.log(pokes)}
      <section className={styles.cardsContainer}>
        {pokes.slice(0, 20).map((poke, i) => (
          <Card poke={poke} key={i} />
        ))}
      </section>
      <button onClick={fetchPokemons} className={styles.loadMoreBtn}>
        Load more
      </button>
    </>
  )
}

export default CardsContainer
