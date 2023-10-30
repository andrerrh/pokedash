import { useDispatch, useSelector } from "react-redux"

import { changeName } from "../../../redux/slices/nameSlice"
import styles from "./NameFilter.module.scss"

const NameFilter = () => {
  const selectedName = useSelector((state) => state.name.selected)
  const dispatch = useDispatch()
  console.log(changeName)

  return (
    <>
      <label htmlFor="pokeName">Name</label>
      <span className={styles.pokeNameContainer}>
        <input
          type="text"
          placeholder="Pokemon name"
          className={styles.pokeNameInput}
          onChange={(e) => dispatch(changeName(e.target.value))}
          value={selectedName}
        />
      </span>
    </>
  )
}

export default NameFilter
