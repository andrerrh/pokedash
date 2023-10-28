import { useEffect, useState } from "react"
import Pokedex from "../../../dexconfig"
import { useSelector } from "react-redux"

import styles from "./CardsContainer.module.scss"
import Card from "../Card/Card"
import { getPokeInfo } from "../../../api/getPokeInfo"

let numberOfPokesToShow = 20
let allPokesToRender = []  //Store all the pokes that are enabled to be rendered
//in order to enable dynamic type filter selection

const CardsContainer = () => {
  const [fetchedPokes, setFetchedPokes] = useState([])
  useState(20)
  const [pokesToRender, setPokesToRender] = useState([])
  const [displayMoreBtn, setDisplayMoreBtn] = useState(true)
  const selectedGens = useSelector((state) => state.gens.selected)
  const selectedTypes = useSelector((state) => state.type.selected)

  let selectedGensArray = []

  const fetchPokemons = async () => {
    if (selectedGensArray[0] === "0") return
    const response = await Pokedex.getGeneration(selectedGensArray)
    //Reduces all the selected gens arrays into a single one with all the pokemon IDs and URL
    const pokemonsFromFetchedGens = response.reduce((acc, gen) => {
      return acc.concat(
        gen.pokemon_species.map((poke) => {
          const idMatch = poke.url.match(/\/(\d+)\/$/) //Extracts the Pokemon ID from the URL
          const pokeId = parseInt(idMatch[1], 10)
          return {
            id: pokeId,
            url: poke.url,
            type: poke.type,
          }
        })
      )
    }, [])
    console.log(pokemonsFromFetchedGens)
    setFetchedPokes(pokemonsFromFetchedGens)
    // setFetchedPokes(pokemonsFromFetchedGens.sort((a, b) => a.id - b.id))
  }

  const fetchIndividualPokeInfos = async (pokes) => {
    const dataArray = []
    let i = numberOfPokesToShow - 20
    while (dataArray.length < 20 && pokes[i]) {
      const data = await getPokeInfo(pokes[i].id)
      if (selectedTypes[data.type] === true) dataArray.push(data)
      i++
    }
    return dataArray
  }

  const handlePokemonsToRender = async () => {
    const fetchedPokesFiltered = await fetchIndividualPokeInfos(fetchedPokes)
    setPokesToRender((prev) => prev.concat(fetchedPokesFiltered))
    allPokesToRender = allPokesToRender.concat(fetchedPokesFiltered)
    return fetchedPokesFiltered.length
  }

  const handleMoreLoad = async () => {
    numberOfPokesToShow += 20
    const numberToAdd = await handlePokemonsToRender()
    numberToAdd === 20 ? setDisplayMoreBtn(true) : setDisplayMoreBtn(false)
  }

  useEffect(() => {
    const handleGensChange = async () => {
      selectedGensArray = Object.keys(selectedGens).filter(
        (key) => selectedGens[key]
      )
      await fetchPokemons()
    }
    handleGensChange()
  }, [selectedGens])

  useEffect(() => {
    setPokesToRender([])
    handlePokemonsToRender()
  }, [fetchedPokes])

  useEffect(() => {
    numberOfPokesToShow = 20
    setPokesToRender(allPokesToRender.filter((e) => selectedTypes[e.type] === true))
    setDisplayMoreBtn(true)
  }, [selectedTypes])

  return (
    <>
      <section className={styles.cardsContainer}>
        {pokesToRender &&
          pokesToRender.map((poke, i) => <Card poke={poke} key={i} />)}
      </section>
      {displayMoreBtn && (
        <button onClick={handleMoreLoad} className={styles.loadMoreBtn}>
          Load more
        </button>
      )}
    </>
  )
}

export default CardsContainer
