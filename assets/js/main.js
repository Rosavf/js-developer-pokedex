const pokemonList = document.getElementById('pokemonList')
const loadMoreButton = document.getElementById('loadMoreButton')

const maxRecords = 15
const limit = 10
let offset = 0;

function convertPokemonToLi(pokemon) {
    return `
        <li class="pokemon ${pokemon.type}" data-id="${pokemon.number}"> 
            <span class="number">#${pokemon.number}</span>
            <span class="name">${pokemon.name}</span>

            <div class="detail">
                <ol class="types">
                    ${pokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join('')}
                </ol>

                <img src="${pokemon.photo}"
                     alt="${pokemon.name}">
            </div>
        </li>
    `
}

function loadPokemonItens(offset, limit) {
    pokeApi.getPokemons(offset, limit).then((pokemons = []) => {
        const newHtml = pokemons.map(convertPokemonToLi).join('')
        pokemonList.innerHTML += newHtml
    })
}

loadPokemonItens(offset, limit)

loadMoreButton.addEventListener('click', () => {
    offset += limit
    const qtdRecordsWithNexPage = offset + limit

    if (qtdRecordsWithNexPage >= maxRecords) {
        const newLimit = maxRecords - offset
        loadPokemonItens(offset, newLimit)

        loadMoreButton.parentElement.removeChild(loadMoreButton)
    } else {
        loadPokemonItens(offset, limit)
    }
})


function showPokemonDetail(pokemon) {
    const detailSection = document.getElementById('pokemonDetail');


    
    // Limpiar clases anteriores
    detailSection.className = ''; // elimina clases previas
    detailSection.classList.add(pokemon.type); // agrega la clase del tipo principal

    detailSection.innerHTML = `
        <h2>${pokemon.name} (#${pokemon.number})</h2>
        <img src="${pokemon.photo}" alt="${pokemon.name}" />
        <p><strong>Type:</strong> ${pokemon.types.join(', ')}</p>
        <p><strong>Abilities:</strong> ${pokemon.abilities.join(', ')}</p>
        <p><strong>Experience:</strong> ${pokemon.experience}</p>
        <p><strong>Heigth:</strong> ${pokemon.height}</p>
        <p><strong>Weight:</strong> ${pokemon.weight}</p>
    `;
}


pokemonList.addEventListener('click', (event) => {
    const li = event.target.closest('li[data-id]');
    if (!li) return;

    const pokemonId = li.getAttribute('data-id');

    fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`)
        .then(response => response.json())
        .then(convertPokeApiDetailToPokemon)
        .then(showPokemonDetail);
});
