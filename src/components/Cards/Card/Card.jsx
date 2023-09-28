import styles from "./Card.module.scss"
import pokeExample from "../../../assets/imgs/cardImages/1.png"

const Card = (props) => {
  return (
    <div className={styles.card}>
      <div className={styles.top}></div>
      <div className={styles.bottom}>
        <div className={styles.infoContainer}>
          <p></p>
          <p className={styles.pokeName}>Bulbasaur</p>
        </div>
      </div>
      <div className={styles.imageContainer}>
        <img src={pokeExample} alt="bulba" />
      </div>
    </div>
  )
}

export default Card
