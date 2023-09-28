import { useState, useEffect , useRef} from "react"
import Pokedex from "../../../dexconfig"

import styles from "./TypeFilter.module.scss"

const TypeFilter = () => {
  const [types, setTypes] = useState([])
  const [isDropOpen, setIsDropOpen] = useState(false)
  const [availableTypes, setAvailableTypes] = useState([])
  const [checked, setChecked] = useState([{}])

  const dropMenu = useRef(null)

  const closeDrop = (e) => {
    if (!dropMenu?.current?.contains(e.target)) setIsDropOpen(false)
  }

  useEffect(() => {
    const fetchGens = async () => {
      const response = await Pokedex.getTypesList()
      console.log(response)
      const typesInfo = [...response.results]
      setTypes(typesInfo)
      setAvailableTypes(typesInfo.map((e) => e.name))
      setChecked(
        typesInfo.reduce((acc, key) => {
          return { ...acc, [key.name]: false }
        }, {})
      )
    }
    fetchGens()

    document.addEventListener("mousedown", closeDrop)

    return () => document.removeEventListener("mousdown", closeDrop)
  }, [])

  const handleTypeFilterDisplay = (e) => {
    e.target.innerHTML === "Show"
      ? (e.target.innerHTML = "Hide")
      : (e.target.innerHTML = "Show")
    setIsDropOpen(!isDropOpen)
  }

  const handleCheckClick = (e) => {
    setChecked((prevChecked) => ({
      ...prevChecked,
      [e.target.value]: !prevChecked[e.target.value],
    }))
  }

  const handleAllTypesBtn = () => {
    setChecked(
      availableTypes.reduce((acc, key) => {
        return { ...acc, [`${key}`]: true }
      }, {})
    )
  }

  const handleUndoTypesBtn = () => {
    setChecked(
      availableTypes.reduce((acc, key) => {
        return { ...acc, [`${key}`]: false }
      }, {})
    )
  }

  return (
    <>
      <p>Types</p>
      <div className={styles.typeDisplay}>
        <button onClick={(e) => handleTypeFilterDisplay(e)}>Show</button>
        {isDropOpen && (
          <div className={styles.typeDropdown} ref={dropMenu}>
            {availableTypes &&
              availableTypes.map((e) => {
                return (
                  <div key={e} className={styles.typeRow}>
                    <input
                      type="checkbox"
                      id={`type${e}`}
                      name="types"
                      value={e}
                      checked={checked[e]}
                      onChange={handleCheckClick}
                    />
                    <label htmlFor={`type${e}`}>{`${e}`}</label>
                  </div>
                )
              })}
            {availableTypes.length > 1 && (
              <div className={styles.selectBtns}>
                <button
                  className={styles.alltypesBtn}
                  onClick={handleAllTypesBtn}
                >
                  Select All
                </button>
                <button
                  className={styles.undotypesBtn}
                  onClick={handleUndoTypesBtn}
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

export default TypeFilter
