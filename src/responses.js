const fs = require('fs');
const Pokedex = require('pokedex-promise-v2');

const P = new Pokedex();

const index = fs.readFileSync(`${__dirname}/../hosted/client.html`);
const bundle = fs.readFileSync(`${__dirname}/../hosted/bundle.js`);
const css = fs.readFileSync(`${__dirname}/../hosted/style.css`);
const pokeball = fs.readFileSync(`${__dirname}/../hosted/media/pokeball.png`);

const pokemonNames = [];
// ['bulbasaur', 'charmander', 'squirtle', 'butterfree'];
const itemNames = [];
// ['leftovers', 'life orb', 'focus sash'];
const pokemon = {};
/*
    "bulbasaur": {
        "abilities": ["overgrow", "chlorophyll"],
        "stats": {
            "hp": 45,
            "atk": 49,
            "def": 49,
            "spa": 65,
            "spd": 65,
            "spe": 40,
        },
        "types": ["grass", "poison"],
        "moves":["razor-wind","swords-dance","cut","bind","vine-whip","headbutt","tackle","body-slam","take-down","double-edge","growl","strength","mega-drain","leech-seed","growth","razor-leaf","solar-beam","poison-powder","sleep-powder","petal-dance","string-shot","toxic","rage","mimic","double-team","defense-curl","light-screen","reflect","bide","sludge","skull-bash","amnesia","flash","rest","substitute","snore","curse","protect","sludge-bomb","mud-slap","giga-drain","endure","charm","swagger","fury-cutter","attract","sleep-talk","return","frustration","safeguard","sweet-scent","synthesis","hidden-power","sunny-day","rock-smash","facade","nature-power","ingrain","knock-off","secret-power","grass-whistle","bullet-seed","magical-leaf","natural-gift","worry-seed","seed-bomb","energy-ball","leaf-storm","power-whip","captivate","grass-knot","venoshock","round","echoed-voice","grass-pledge","work-up","grassy-terrain","confide"],    "sprite":"https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png",
        "sets": [
            {

                "ability":"chlorophyll",
                "item":"life orb","nature":"modest",
                "ivs":{
                    "hp":"31",
                    "atk":"31",
                    "def":"31",
                    "spa":"31",
                    "spd":"31",
                    "spe":"31"
                    },
                "evs":{
                    "hp":"24",
                    "atk":"0",
                    "def":"184",
                    "spa":"252",
                    "spd":"48",
                    "spe":"0"
                    },
                "totals":{
                    "hp":"237",
                    "atk":"120",
                    "def":"180",
                    "spa":"251",
                    "spd":"178",
                    "spe":"116"
                    },
                "moves":["sludge-bomb","leaf-storm","leech-seed","sleep-powder"]

            }
        ]
    }
};
/* */

// ----UTILITIES----


// get main page
const getIndex = (request, response) => {
  console.log('index requested');
  response.writeHead(200, {
    'Content-Type': 'text/html',
  });
  response.write(index);
  response.end();
};

// get style sheet
const getCss = (request, response) => {
  console.log('css requested');
  response.writeHead(200, {
    'Content-Type': 'text/css',
  });
  response.write(css);
  response.end();
};

// get client script
const getBundle = (request, response) => {
  console.log('bundle requested');
  response.writeHead(200, {
    'Content-Type': 'application/javascript',
  });
  response.write(bundle);
  response.end();
};

const getPokeball = (request, response) => {
  console.log('pokeball requested');
  response.writeHead(200, {
    'Content-Type': 'image/png',
  });
  response.write(pokeball);
  response.end();
};

// send json response
const respond = (request, response, status, content) => {
  response.writeHead(status, {
    'Content-Type': 'application/json',
  });
  response.write(JSON.stringify(content));
  response.end();
};

// send head response
const respondMeta = (request, response, status) => {
  response.writeHead(status, {
    'Content-Type': 'application/json',
  });
  response.end();
};


// ----GET responses----

// get array of pokemon names
const getNames = (request, response) => {
  console.log('names requested');
  if (pokemonNames.length <= 0) {
    return P.getPokemonsList()
      .then((res) => {
        const count = res.results.length;
        for (let i = 0; i < count; i++) {
          pokemonNames.push(res.results[i].name);
        }
        console.log('pokemon names downloaded');
        const responseObj = {
          pokemonNames,
        };
        return respond(request, response, 200, responseObj);
      })
      .catch((error) => {
        console.log('There was an ERROR: ', error);
      });
  }
  const responseObj = {
    pokemonNames,
  };
  return respond(request, response, 200, responseObj);
};

// get array of item names
const getItems = (request, response) => {
  console.log('items requested');
  if (itemNames.length <= 0) {
    return P.getItemsList()
      .then((res) => {
        const count = res.results.length;
        for (let i = 0; i < count; i++) {
          itemNames.push(res.results[i].name);
        }
        console.log('items downloaded');
        const responseObj = {
          itemNames,
        };
        return respond(request, response, 200, responseObj);
      })
      .catch((error) => {
        console.log('There was an ERROR: ', error);
      });
  }
  const responseObj = {
    itemNames,
  };
  return respond(request, response, 200, responseObj);
};

// get specific pokemon data
const getPokemon = (request, response, params) => {
  let responseObj = {
    message: 'Missing Params',
  };
  if (!params.pokemon) {
    responseObj.id = 'missingParams';
    return respond(request, response, 400, responseObj);
  }

  console.log(`${params.pokemon} requested`);
  if (!pokemon[params.pokemon]) {
    // get pokemon info from pokeapi
    console.log(`${params.pokemon} downloading`);
    return P.getPokemonByName(params.pokemon)
      .then((res) => {
        const tempPoke = {
          name: res.name,
          number: res.id,
          types: [],
          abilities: ['', '', ''],
          moves: [],
          stats: {
            hp: res.stats[0].base_stat,
            atk: res.stats[1].base_stat,
            def: res.stats[2].base_stat,
            spa: res.stats[3].base_stat,
            spd: res.stats[4].base_stat,
            spe: res.stats[5].base_stat,
          },
          sprite: res.sprites.front_default,
          sets: [],
        };

        for (let i = 0; i < res.types.length; i++) {
          tempPoke.types[res.types[i].slot - 1] = res.types[i].type.name;
        }
        for (let i = 0; i < res.abilities.length; i++) {
          tempPoke.abilities[res.abilities[i].slot - 1] = res.abilities[i].ability.name;
        }
        for (let i = 0; i < res.moves.length; i++) {
          tempPoke.moves.push(res.moves[i].move.name);
        }
        pokemon[tempPoke.name] = tempPoke;

        responseObj = {
          pokemon: pokemon[params.pokemon],
        };

        console.log('pokemon downloaded');
        return respond(request, response, 200, responseObj);
      })
      .catch((error) => {
        console.log('There was an ERROR: ', error);
        // return respond(request, response, 408, responseObj);
      });
    // pokemon[params.pokemon] = {sets: []};
  }
  responseObj = {
    pokemon: pokemon[params.pokemon],
  };
  return respond(request, response, 200, responseObj);
};


// ----POST responses----

const addSet = (request, response, body) => {
  console.log('set posted');
  console.dir(body);
  console.log(body.ivs[0]);
  const responseObj = {
    message: 'Missing Params',
  };
  if (!body.name) {
    responseObj.id = 'missingParams';
    return respond(request, response, 400, responseObj);
  }

  const responseCode = 201;

  if (!pokemon[body.name]) {
    // get pokemon info from pokeapi
    pokemon[body.name] = {
      sets: [],
    };
  }
  const newSet = {
    ability: body.ability,
    item: body.item,
    nature: body.nature,
    ivs: {
      hp: body.ivs[0],
      atk: body.ivs[1],
      def: body.ivs[2],
      spa: body.ivs[3],
      spd: body.ivs[4],
      spe: body.ivs[5],
    },
    evs: {
      hp: body.evs[0],
      atk: body.evs[1],
      def: body.evs[2],
      spa: body.evs[3],
      spd: body.evs[4],
      spe: body.evs[5],
    },
    totals: {
      hp: body.totals[0],
      atk: body.totals[1],
      def: body.totals[2],
      spa: body.totals[3],
      spd: body.totals[4],
      spe: body.totals[5],
    },
    moves: body.moves,
  };
  pokemon[body.name].sets.push(newSet);
  console.dir(pokemon[body.name].sets);
  responseObj.message = 'Created Successfully';
  responseObj.pokemon = pokemon[body.name];
  return respond(request, response, responseCode, responseObj);
};
/*
const addUser = (request, response, body) => {
  const responseObj = {
    message: 'Name and age are both required.',
  };

  if (!body.name || !body.age) {
    responseObj.id = 'missingParams';
    return respond(request, response, 400, responseObj);
  }

  let responseCode = 201;

  if (users[body.name]) {
    responseCode = 204;
  } else {
    users[body.name] = {};
  }

  users[body.name].name = body.name;
  users[body.name].age = body.age;

  if (responseCode === 201) {
    responseObj.message = 'Created Successfully';
    return respond(request, response, responseCode, responseObj);
  }
  return respondMeta(request, response, responseCode);
};
*/


// ----HEAD responses----

const getNamesMeta = (request, response) => respondMeta(request, response, 200);
const getItemsMeta = (request, response) => respondMeta(request, response, 200);

const getPokemonMeta = (request, response) => respondMeta(request, response, 200);

const notFound = (request, response) => {
  const responseObj = {
    message: 'The page you are looking for was not found.',
    id: 'notFound',
  };

  return respond(request, response, 404, responseObj);
};

const notFoundMeta = (request, response) => respond(request, response, 404);

module.exports = {
  getIndex,
  getCss,
  getBundle,
  getPokeball,
  getNames,
  getItems,
  getPokemon,
  addSet,
  getNamesMeta,
  getItemsMeta,
  getPokemonMeta,
  notFound,
  notFoundMeta,
};
