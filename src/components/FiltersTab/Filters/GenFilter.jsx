import { useEffect, useState, useRef } from "react"
import Pokedex from "../../../dexconfig"
import { useDispatch } from "react-redux"
import { changeGen } from "../../../redux/slices/genSlice"
import styles from "./GenFilter.module.scss"

const GenFilter = () => {
  const dispatch = useDispatch()
  const [numOfGens, setNumOfGens] = useState([])
  const [isDropOpen, setIsDropOpen] = useState(false)
  const [checked, setChecked] = useState([{}])
  const [dropBtnText, setDropBtnText] = useState("Show")

  const dropMenuRef = useRef(null)
  const dropBtnRef = useRef(null)

  const closeDrop = (e) => {
    if (
      !dropMenuRef?.current?.contains(e.target) &&
      !dropBtnRef?.current?.contains(e.target)
    ) {
      setDropBtnText("Show")
      setIsDropOpen(false)
    }
  }

  useEffect(() => {
    const fetchGens = async () => {
      const response = await Pokedex.getGenerationsList()
      const genCount = Array.from(
        { length: response.count },
        (_, index) => index + 1
      )
      setNumOfGens(genCount)
      //Set the default checkbox state on page load
      setChecked(
        genCount.reduce((acc, key) => {
          return { ...acc, [`${key}`]: false }
        }, {})
      )
      //Set the first gen to be the one showing on page load
      setChecked((prev) => ({ ...prev, 1: true }))
    }
    fetchGens()

    document.addEventListener("mousedown", closeDrop)

    return () => document.removeEventListener("mousdown", closeDrop)
  }, [])

  useEffect(() => {
    dispatch(changeGen(checked))
  }, [checked])

  const handleGenFilterDisplay = (e) => {
    dropBtnText === "Show" ? setDropBtnText("Hide") : setDropBtnText("Show")
    setIsDropOpen(!isDropOpen)
  }

  const handleCheckClick = (e) => {
    setChecked((prev) => ({
      ...prev,
      [e.target.value]: !prev[e.target.value],
    }))
  }

  const handleAllGensBtn = () => {
    setChecked(
      numOfGens.reduce((acc, key) => {
        return { ...acc, [`${key}`]: true }
      }, {})
    )
  }

  const handleUndoGensBtn = () => {
    setChecked(
      numOfGens.reduce((acc, key) => {
        return { ...acc, [`${key}`]: false }
      }, {})
    )
  }

  return (
    <>
      <p>Generation</p>
      <div className={styles.generationDisplay}>
        <button onClick={handleGenFilterDisplay} ref={dropBtnRef}>
          {dropBtnText}
        </button>
        {isDropOpen && (
          <div className={styles.generationDropdown} ref={dropMenuRef}>
            {numOfGens &&
              numOfGens.map((e) => {
                return (
                  <div key={e} className={styles.genRow}>
                    <input
                      type="checkbox"
                      id={`gen${e}`}
                      name="gens"
                      value={`${e}`}
                      checked={checked[`${e}`]}
                      onChange={handleCheckClick}
                    />
                    <label htmlFor={`gen${e}`}>{`Gen ${e}`}</label>
                  </div>
                )
              })}
            {numOfGens.length > 1 && (
              <div className={styles.selectBtns}>
                <button
                  className={styles.allGensBtn}
                  onClick={handleAllGensBtn}
                >
                  Select All
                </button>
                <button
                  className={styles.undoGensBtn}
                  onClick={handleUndoGensBtn}
                >
                  Undo All
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  )
}

export default GenFilter
