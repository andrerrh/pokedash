import { useEffect, useState } from "react"
import Pokedex from "../../../dexconfig"
import { useSelector } from "react-redux"

import styles from "./CardsContainer.module.scss"
import Card from "../Card/Card"
import pokeballImg from "../../../assets/imgs/pokeball.svg"
import { getPokeInfo } from "../../../api/getPokeInfo"

const numberOfPokesPerPage = 20
let numberOfPokesToShow = numberOfPokesPerPage
let currentIndexOfSearch = 0

const CardsContainer = () => {
  const [fetchedPokes, setFetchedPokes] = useState([])
  const [pokesToRender, setPokesToRender] = useState([])
  const [isLoading, setIsLoading] = useState(true)
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

  const fetchIndividualPokeInfos = async () => {
    const dataArray = []
    while (
      dataArray.length < numberOfPokesPerPage &&
      fetchedPokes[currentIndexOfSearch]
    ) {
      const data = await getPokeInfo(fetchedPokes[currentIndexOfSearch].id)
      if (selectedTypes[data.type] === true) dataArray.push(data)
      currentIndexOfSearch++
    }
    return dataArray
  }

  const handlePokemonsToRender = async () => {
    const fetchedPokesFiltered = await fetchIndividualPokeInfos()
    setPokesToRender((prev) => prev.concat(fetchedPokesFiltered))
    setIsLoading(false)
    fetchedPokesFiltered.length === numberOfPokesPerPage
      ? setDisplayMoreBtn(true)
      : setDisplayMoreBtn(false)
  }

  const handleMoreLoad = () => {
    setIsLoading(true)
    handlePokemonsToRender()
  }

  useEffect(() => {
    currentIndexOfSearch = 0
    setPokesToRender([])
    const handleGensChange = async () => {
      selectedGensArray = Object.keys(selectedGens).filter(
        (key) => selectedGens[key]
      )
      await fetchPokemons()
    }
    handleGensChange()
    setIsLoading(true)
  }, [selectedGens])

  useEffect(() => {
    setPokesToRender([])
    handlePokemonsToRender()
  }, [fetchedPokes])

  useEffect(() => {
    // setPokesToRender([])
    currentIndexOfSearch = 0
    handlePokemonsToRender()
    setIsLoading(true)
    // handlePokemonsToRender()
  }, [selectedTypes])

  return (
    <>
      <section className={styles.cardsContainer}>
        {pokesToRender &&
          pokesToRender
            .filter((e) => selectedTypes[e.type])
            .map((poke, i) => <Card poke={poke} key={i} />)}
      </section>
      {isLoading && (
        <img
          className={styles.loadingImg}
          src={pokeballImg}
          alt="pokeball"
        ></img>
      )}
      {displayMoreBtn && (
        <button onClick={handleMoreLoad} className={styles.loadMoreBtn}>
          Load more
        </button>
      )}
    </>
  )
}

export default CardsContainer
