import Pokedex from "../dexconfig"
import pokeColorMap from "./pokeColorMap"

const getArtwork = (id) => {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`
}

const getPokeInfo = async (id) => {
  try {
    const response = await Pokedex.getPokemon(id)
    const pokeType = response.types[0].type.name
    const colorCode = pokeColorMap(pokeType)
    return {
      id: response.id,
      name: response.name,
      type: pokeType,
      typeColor: colorCode,
    }
  } catch (error) {
    console.error(`Error fetching Poke info: ${error}`)
  }
}

const getPokeFullInfo = async (id) => {
  try {
    const response = await Pokedex.getPokemon(1)
    const colorCode = pokeColorMap(pokeType)
    const types = response.types.map((e) => e.type.name)
    const stats = response.stats.map((e) => {
      return {
        name: e.stat.name,
        value: e.base_stat,
      }
    })
    return {
      id: response.id,
      name: response.name,
      typeColor: colorCode,
      height: response.height,
      weight: response.weight,
      types,
      stats,
    }
  } catch (error) {
    console.log(`Error fetching full Poke info: ${error}`)
  }
}

const getPokeIdFromSpeciesURL = (url) => {
  if(!url) return
  const idMatch = url.match(/\/(\d+)\/$/)
  return parseInt(idMatch[1], 10)
}
const getEvolutionChain = async (id) => {
  const response = await Pokedex.getEvolutionChain(id)
  const basis = { ...response.chain }

  const getEvolution = (basis, prev) => {
    const newInfo = {
      id: getPokeIdFromSpeciesURL(basis.species.url),
      name: basis.species.name,
      evolvesFrom: prev
      // evolvesFromId: getPokeIdFromSpeciesURL(prev?.species?.url) || null,
      // evolvesFromName: prev?.species?.name || null,
    }
    if(basis.evolves_to.length === 0) return newInfo
    const evolutions = []
    basis.evolves_to.forEach(evol => {
      evolutions.push(getEvolution(evol, newInfo))
    })
    newInfo['evolutions'] = [...evolutions]
    return newInfo
  }

  

  const evolChain = getEvolution(basis)
  console.log(evolChain)

  // const evolChain = []

  // const getEvolution = (currentPoke) => {
  //   const directEvolutionsIds = []
  //   currentPoke.evolves_to.forEach((evolution) => {
  //     directEvolutionsIds.push(getPokeIdFromSpeciesURL(evolution.species.url))
  //   })
  //   const pokeInfo = {
  //     name: currentPoke.species.name,
  //     id: getPokeIdFromSpeciesURL(currentPoke.species.url),
  //     directEvolutionsIds,
  //   }
  //   evolChain.push(pokeInfo)
  //   currentPoke.evolves_to.forEach(evolution => getEvolution(evolution))
  // }

  // getEvolution(basis)
  // console.log(evolChain)
}

const fetchSelectedGens = async (selectedGensArray) => {
  try {
    const response = await Pokedex.getGeneration(selectedGensArray)
    //Reduces all the selected gens arrays into a single one with all the pokemon IDs and URL
    const pokemonsFromFetchedGens = response.reduce((acc, gen) => {
      return acc.concat(
        gen.pokemon_species.map((poke) => {
          const pokeId = getPokeIdFromSpeciesURL(poke.url)
          return {
            id: pokeId,
            url: poke.url,
          }
        })
      )
    }, [])
    return pokemonsFromFetchedGens
  } catch (error) {
    console.error(`Error fetching Poke generations: ${error}`)
  }
}

getEvolutionChain(1)

export { getArtwork, getPokeInfo, fetchSelectedGens }
