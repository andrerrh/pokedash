import { useEffect, useState, useRef } from "react"
import Pokedex from "../../../dexconfig"

import styles from "./GenFilter.module.scss"

const GenFilter = () => {
  const [numOfGens, setNumOfGens] = useState([])
  const [isDropOpen, setIsDropOpen] = useState(false)
  const [checked, setChecked] = useState([{}])
  const [btnText, setBtnText] = useState("Show")

  const dropMenuRef = useRef(null)
  const dropBtnRef = useRef(null)

  let gensInfo = [{}]

  const closeDrop = (e) => {
    if (
      !dropMenuRef?.current?.contains(e.target) &&
      !dropBtnRef?.current?.contains(e.target)
    ) {
      setBtnText("Show")
      setIsDropOpen(false)
    }
  }

  useEffect(() => {
    const fetchGens = async () => {
      const response = await Pokedex.getGenerationsList()
      gensInfo = [...response.results]
      const genCount = Array.from(
        { length: response.count },
        (_, index) => index + 1
      )
      setNumOfGens(genCount)
      setChecked(
        genCount.reduce((acc, key) => {
          return { ...acc, [`gen${key}`]: false }
        }, {})
      )
    }
    fetchGens()

    document.addEventListener("mousedown", closeDrop)

    return () => document.removeEventListener("mousdown", closeDrop)
  }, [])

  const handleGenFilterDisplay = (e) => {
    btnText === "Show" ? setBtnText("Hide") : setBtnText("Show")
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
        return { ...acc, [`gen${key}`]: true }
      }, {})
    )
  }

  const handleUndoGensBtn = () => {
    setChecked(
      numOfGens.reduce((acc, key) => {
        return { ...acc, [`gen${key}`]: false }
      }, {})
    )
  }

  return (
    <>
      <p>Generation</p>
      <div className={styles.generationDisplay}>
        <button onClick={handleGenFilterDisplay} ref={dropBtnRef}>
          {btnText}
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
                      value={`gen${e}`}
                      checked={checked[`gen${e}`]}
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
