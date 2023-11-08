//Name-Done
//Types-Done
//Gen
//Height
//Weight
//Evolution Chain Mapping

import styles from "./Poke.module.scss"

const Poke = () => {
  return (
    <main className={styles.poke}>
      <div className={styles.mainContainer}>
        <div className={styles.leftCol}></div>
        <div className={styles.centerCol}>
          <div className={styles.imageContainer}>
            <img src="" alt="" className={styles.pokeImage} />
          </div>
        </div>
        <div className={styles.rightCol}></div>
      </div>
    </main>
  )
}


export default Poke
