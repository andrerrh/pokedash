import * as P from 'pokeapi-js-wrapper'
const Pokedex = new P.Pokedex(
    {
        cache: true,
        timeout: 5 * 1000
    }
)

export default Pokedex