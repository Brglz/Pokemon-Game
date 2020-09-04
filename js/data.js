export function createObj(pokemon) {
    const moves = pokemon.moves.slice(0, 4);
    return {
        name: pokemon.name,
        ability: pokemon.abilities.find(x => x.is_hidden === false).ability.name,
        moves: moves.map(x => x.move.name),
        hp: pokemon.stats[0].base_stat,
        attack: pokemon.stats[1].base_stat,
        defense: pokemon.stats[2].base_stat,
        sAttack: pokemon.stats[3].base_stat,
        sDefense: pokemon.stats[4].base_stat,
        speed: pokemon.stats[5].base_stat,
        frontImg: pokemon.sprites.front_default,
        backImg: pokemon.sprites.back_default
    }
}
