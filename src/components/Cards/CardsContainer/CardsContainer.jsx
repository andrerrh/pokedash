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
  const [fetchQueue, setFetchQueue] = useState([])
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
    setFetchQueue([...fetchQueue, "more"])
  }

  useEffect(() => {
    const handleGensChange = async () => {
      const selectedGensArray = convertObjToArray(selectedGens)
      fetchedGens = await fetchSelectedGens(selectedGensArray)
      selectedGensArray.length >= 1
        ? setFetchQueue([...fetchQueue, "new"])
        : setFetchQueue([...fetchQueue, "empty"])
    }
    handleGensChange()
  }, [selectedGens])

  useEffect(() => {
    const selectedTypesArray = convertObjToArray(selectedTypes)
    selectedTypesArray.length >= 1
      ? setFetchQueue([...fetchQueue, "new"])
      : setFetchQueue([...fetchQueue, "empty"])
  }, [selectedTypes])

  useEffect(() => {
    const handleQueryChange = async () => {
      if (!isFetching && fetchQueue.length >= 1) {
        const action = fetchQueue[0]
        if (action === "empty") {
          setPokesToRender((_) => [])
          const shiftedArray = [...fetchQueue.slice(1)]
          setFetchQueue(shiftedArray)
          return
        }
        if (action === "new") resetFetchIndex() //Reset fetching index for a clean fetch and display
        const pokesToShow = await fetchPokeInfo()
        action === "new" 
          ? setPokesToRender((_) => pokesToShow)
          : setPokesToRender((prev) => prev.concat(pokesToShow))
        handleButtonDisplay(pokesToShow.length)
        const shiftedArray = [...fetchQueue.slice(1)] 
        setFetchQueue(shiftedArray)
        setIsFetching(false)
      }
    }
    handleQueryChange()
  }, [fetchQueue, isFetching])

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