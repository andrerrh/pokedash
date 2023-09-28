import styles from "./FiltersTab.module.scss"
import GenFilter from "./Filters/GenFilter"
import TypeFilter from "./Filters/TypeFilter"
import NameFilter from "./Filters/NameFilter"
import React from "react"

const Filters = () => {

  return (
    <div className={styles.filtersContainer}>
      <div className={styles.filters}>
        <span>
          <GenFilter />
        </span>
        <span>
          <TypeFilter />
        </span>
        <span>
          <NameFilter />
        </span>
      </div>
    </div>
  )
}

export default Filters
