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

export { getArtwork, getPokeInfo }
