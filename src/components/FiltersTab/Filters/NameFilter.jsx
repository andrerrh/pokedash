import styles from "./NameFilter.module.scss"

const NameFilter = () => {
  return (
    <>
      <label htmlFor="pokeName">Name</label>
      <span className={styles.pokeNameContainer}>
        <input
          type="text"
          placeholder="Pokemon name"
          className={styles.pokeNameInput}
        />
      </span>
    </>
  )
}

export default NameFilter
