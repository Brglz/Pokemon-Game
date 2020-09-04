import get from './api.js';
import { createObj } from './data.js';

window.addEventListener('load', async function () {
    const rootEl = document.querySelector('.root');

    const templateString = await (await fetch('./templates/template.hbs')).text();
    Handlebars.registerPartial('move', await (await fetch('./templates/move.hbs')).text());
    Handlebars.registerPartial('character', await (await fetch('./templates/character.hbs')).text());

    document.querySelector('.load').addEventListener('click', renderCharacters)

    const pokemonsObj = [];
    (async function getAll() {
        const allPokemons = await get('https://pokeapi.co/api/v2/pokemon/');
        for (const el of allPokemons.results) {
            const data = await get(el.url);
            const result = createObj(data);
            pokemonsObj.push(result)
        }

    })();

    function renderCharacters(e) {
        const characters = Object.assign({}, pokemonsObj);
        document.querySelector('.play-button').style.display = 'block';

        const templateFn = Handlebars.compile(templateString);

        const generatedHtml = templateFn({ characters });

        rootEl.innerHTML = generatedHtml;
        const character = document.querySelectorAll('.pick');

        character.forEach(x => x.addEventListener('click', (e) => {
            const target = e.target.parentElement.childNodes[1].innerHTML;

            const player = pokemonsObj.filter(x => x.name == target.split(' ')[1]);
            const randomEnemy = generateEnemy(characters);

            sessionStorage.setItem('enemy', randomEnemy);
            sessionStorage.setItem('pokemon', JSON.stringify(player[0]))
        }))
    }

})

function generateEnemy(characters) {
    return JSON.stringify(characters[Math.floor(Math.random() * 20)]);
}
