import Pokedex from "../dexconfig"
import pokeColorMap from "./pokeColorMap"

const getArtwork = (id) => {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`
}

const getPokeInfo = async (id) => {
  const response = await Pokedex.getPokemon(id)
  const pokeType = response.types[0].type.name
  const colorCode = pokeColorMap(pokeType)
  return {
    id: response.id,
    name: response.name,
    type: pokeType,
    typeColor: colorCode,
  }
}

const fetchSelectedGens = async (selectedGensArray) => {
  const response = await Pokedex.getGeneration(selectedGensArray)
  //Reduces all the selected gens arrays into a single one with all the pokemon IDs and URL
  const pokemonsFromFetchedGens = response.reduce((acc, gen) => {
    return acc.concat(
      gen.pokemon_species.map((poke) => {
        const idMatch = poke.url.match(/\/(\d+)\/$/) //Extracts the Pokemon ID from the URL
        const pokeId = parseInt(idMatch[1], 10)
        return {
          id: pokeId,
          url: poke.url,
        }
      })
    )
  }, [])
  return pokemonsFromFetchedGens
}

export { getArtwork, getPokeInfo, fetchSelectedGens }
