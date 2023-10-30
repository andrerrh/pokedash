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

const CardsContainer = () => {
  // const [fetchedGens, setFetchedGens] = useState([])
  const [pokesToRender, setPokesToRender] = useState([])
  const [isFetching, setIsFetching] = useState(false)
  const [fetchQuery, setFetchQuery] = useState([])
  const [displayMoreBtn, setDisplayMoreBtn] = useState(true)
  const selectedGens = useSelector((state) => state.gens.selected)
  const selectedTypes = useSelector((state) => state.type.selected)
  const selectedName = useSelector((state) => state.name.selected)

  const handleButtonDisplay = (numberOfPokesAdded) => {
    numberOfPokesAdded === pokesPerPage
      ? setDisplayMoreBtn(true)
      : setDisplayMoreBtn(false)
  }

  const convertObjToArray = (selectedObj) => {
    const array = []
    for (let key in selectedObj) {
      if (selectedObj[key]) array.push(key)
    }
    return array
  }

  const fetchPokeInfo = async () => {
    setIsFetching(true)
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
    setFetchQuery([...fetchQuery, "more"])
  }

  useEffect(() => {
    const handleGensChange = async () => {
      const selectedGensArray = convertObjToArray(selectedGens)
      fetchedGens = await fetchSelectedGens(selectedGensArray)
      selectedGensArray.length >= 1
        ? setFetchQuery([...fetchQuery, "new"])
        : setFetchQuery([...fetchQuery, "empty"])
    }
    handleGensChange()
  }, [selectedGens])

  useEffect(() => {
    const selectedTypesArray = convertObjToArray(selectedTypes)
    selectedTypesArray.length >= 1
      ? setFetchQuery([...fetchQuery, "new"])
      : setFetchQuery([...fetchQuery, "empty"])
  }, [selectedTypes])

  useEffect(() => {
    const handleQueryChange = async () => {
      if (!isFetching && fetchQuery.length >= 1) {
        const action = fetchQuery[0]
        if (action === "empty") {
          setPokesToRender((_) => [])
          const shiftedArray = [...fetchQuery.slice(1)]
          setFetchQuery(shiftedArray)
          return
        }
        if (action === "new") resetFetchIndex()
        const pokesToShow = await fetchPokeInfo()
        action === "new"
          ? setPokesToRender((_) => pokesToShow)
          : setPokesToRender((prev) => prev.concat(pokesToShow))
        handleButtonDisplay(pokesToShow.length)
        const shiftedArray = [...fetchQuery.slice(1)]
        setFetchQuery(shiftedArray)
        setIsFetching(false)
      }
    }
    handleQueryChange()
  }, [fetchQuery, isFetching])

  return (
    <>
      <section className={styles.cardsContainer}>
        {pokesToRender &&
        pokesToRender.filter((poke) => {
          return poke.name.includes(selectedName)
        })
          .map((poke, i) => <Card poke={poke} key={i} />)}
      </section>
      {isFetching && (
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
