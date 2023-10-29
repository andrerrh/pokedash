import { useEffect, useState } from "react"
import Pokedex from "../../../dexconfig"
import { useSelector } from "react-redux"

import styles from "./CardsContainer.module.scss"
import Card from "../Card/Card"
import pokeballImg from "../../../assets/imgs/pokeball.svg"
import { getPokeInfo, fetchSelectedGens } from "../../../api/getPokeInfo"

const pokesPerPage = 20
let currentFetchIndex = 0
let fetchedGens = []

const resetFetchIndex = () => (currentFetchIndex = 0)
const fetchQuery = []

const CardsContainer = () => {
  // const [fetchedGens, setFetchedGens] = useState([])
  const [pokesToRender, setPokesToRender] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [displayMoreBtn, setDisplayMoreBtn] = useState(true)
  const selectedGens = useSelector((state) => state.gens.selected)
  const selectedTypes = useSelector((state) => state.type.selected)
  const selectedName = useSelector((state) => state.name.selected)

  const handleButtonDisplay = (numberOfPokesAdded) => {
    if (numberOfPokesAdded === 20) setDisplayMoreBtn(true)
  }

  const convertGensObjToArray = () => {
    const gensArray = []
    for (let key in selectedGens) {
      if (selectedGens[key]) gensArray.push(key)
    }
    return gensArray
  }

  const fetchPokeInfo = async () => {
    const dataArray = []
    while (
      dataArray.length < pokesPerPage &&
      fetchedGens[currentFetchIndex] !== undefined
    ) {
      const data = await getPokeInfo(fetchedGens[currentFetchIndex].id)
      if (selectedTypes[data.type]) dataArray.push(data)
      currentFetchIndex++
    }
    return dataArray
  }

  const handleMoreLoad = async () => {
    setIsLoading(true)
    setDisplayMoreBtn(false)
    try {
      const pokesToAdd = await fetchPokeInfo()
      setPokesToRender((prev) => prev.concat(pokesToAdd))
      handleButtonDisplay(pokesToAdd.length)
    } catch (error) {
      console.error(`Error when fetching poke infos:${error}`)
    }
    setIsLoading(false)
  }

  useEffect(() => {
    const abortController = new AbortController()

    const handleGensChange = async () => {
      setIsLoading(true)
      resetFetchIndex()
      const selectedGensArray = convertGensObjToArray()
      fetchedGens = await fetchSelectedGens(selectedGensArray)
      try {
        const pokesToShow = await fetchPokeInfo(AbortController.signal)
        handleButtonDisplay(pokesToShow.length)
        setIsLoading(false)
        setPokesToRender(pokesToShow)
      } catch (error) {
        console.error(`Error when fetching poke infos:${error}`)
      }
    }
    handleGensChange()
    return () => {
      abortController.abort()
    }
  }, [selectedGens])

  useEffect(() => {
    const abortController = new AbortController()

    const handleTypeChange = async () => {
      currentFetchIndex = 0
      setIsLoading(true)
      setDisplayMoreBtn(false)
      try {
        const pokesToShow = await fetchPokeInfo(AbortController.signal)
        setPokesToRender(pokesToShow)
        handleButtonDisplay(pokesToShow.length)
      } catch (error) {
        console.error(`Error when fetching poke infos:${error}`)
      }
      setIsLoading(false)
    }
    handleTypeChange()
    return () => {
      abortController.abort()
    }
  }, [selectedTypes])

  return (
    <>
      <section className={styles.cardsContainer}>
        {pokesToRender &&
          pokesToRender.map((poke, i) => <Card poke={poke} key={i} />)}
      </section>
      {console.log(pokesToRender)}
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

//   // setFetchedPokes(pokemonsFromFetchedGens.sort((a, b) => a.id - b.id))
// }

// const fetchIndividualPokeInfos = async () => {
//   const dataArray = []
//   while (
//     dataArray.length < numberOfPokesPerPage &&
//     fetchedPokes[currentIndexOfSearch]
//   ) {
//     const data = await getPokeInfo(fetchedPokes[currentIndexOfSearch].id)
//     if (selectedTypes[data.type] === true) dataArray.push(data)
//     currentIndexOfSearch++
//   }
//   return dataArray
// }

// const handlePokemonsToRender = async () => {
//   const fetchedPokesFiltered = await fetchIndividualPokeInfos()
//   fetchedPokesFiltered.length === numberOfPokesPerPage
//     ? setDisplayMoreBtn(true)
//     : setDisplayMoreBtn(false)
//   return fetchedPokesFiltered
// }

// const handleMoreLoad = () => {
//   setDisplayMoreBtn(false)
//   setIsLoading(true)
//   handlePokemonsToRender()
// }

// useEffect(() => {
//   currentIndexOfSearch = 0
//   setPokesToRender((_) => [])
//   const handleGensChange = async () => {
//     selectedGensArray = Object.keys(selectedGens).filter(
//       (key) => selectedGens[key]
//     )
//     await fetchPokemons()
//   }
//   setIsLoading(true)
//   handleGensChange()
//   return () => setPokesToRender((_) => [])
// }, [selectedGens])

// useEffect(() => {
//   const handleFetchedChange = async () => {
//     const pokesToAdd = await handlePokemonsToRender()
//     setPokesToRender(pokesToAdd)
//     setIsLoading(false)
//     handlePokemonsToRender()
//   }
//   handleFetchedChange()
//   return () => setPokesToRender((_) => [])
// }, [fetchedPokes])

// useEffect(() => {
//   const handleTypeChange = async () => {
//     setIsLoading(true)
//     currentIndexOfSearch = 0
//     setPokesToRender((_) => [])
//     const pokesToAdd = await handlePokemonsToRender()
//     setPokesToRender(pokesToAdd)
//     setIsLoading(false)
//   }
//   handleTypeChange()
//   return () => setPokesToRender((_) => [])
// }, [selectedTypes])
