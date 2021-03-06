const lists = {
    pokeList: [],
    itemList: [],
    natures: ["hardy", "lonely", "adamant", "naughty", "brave", "bold", "docile", "impish", "lax", "relaxed", "modest", "mild", "bashful", "rash", "quiet", "calm", "gentle", "careful", "quirky", "sassy", "timid", "hasty", "jolly", "naive", "serious"],
    stats: ['hp', 'atk', 'def', 'spa', 'spd', 'spe']
};
let pokemon = {};

// parse JSON responses
const parseJSON = (xhr) => {
    const obj = JSON.parse(xhr.response);

    if (obj.message) {
        console.log(obj.message);
    }

    // handle list of pokemon
    if (obj.pokemonNames) {
        lists.pokeList = obj.pokemonNames;
        const pokeName = document.querySelector('#pokeName');
        autocomplete(pokeName, lists.pokeList);
    }

    // handle list of items
    if (obj.itemNames) {
        lists.itemList = obj.itemNames;
        const item = document.querySelector('#item');
        autocomplete(item, lists.itemList);
    }

    // handle pokemon information
    if (obj.pokemon) {
        pokemon = obj.pokemon;
        //console.log(pokemon);

        // set base stats
        const bases = document.getElementsByClassName('base');
        for (let i = 0; i < bases.length; i++) {
            bases[i].value = pokemon.stats[lists.stats[i]];
        }

        // set movepool
        const moves = document.getElementsByClassName('move');
        for (let i = 0; i < moves.length; i++) {
            moves[i].value = "";
            autocomplete(moves[i], pokemon.moves);
        }

        // set possible abilities
        const ability = document.getElementById('ability');
        ability.value = "";
        autocomplete(ability, pokemon.abilities);

        // display list of sets
        //setList.innerHTML = "";
        let a = document.createElement("DIV");

        for (let i = 0; i < pokemon.sets.length; i++) {
            console.log(pokemon.sets[i]);
            let b = document.createElement("DIV");
            b.setAttribute("class", "set");
            let c = document.createElement("DIV");
            c.innerHTML = "<strong>ability: </strong>" + pokemon.sets[i].ability;
            b.appendChild(c);
            c = document.createElement("DIV");
            c.innerHTML = "<strong>item: </strong>" + pokemon.sets[i].item;
            b.appendChild(c);
            c = document.createElement("DIV");
            c.innerHTML += "<strong> nature: </strong>" + pokemon.sets[i].nature;
            b.appendChild(c);
            // IVs
            c = document.createElement("DIV");
            c.innerHTML = "<strong> IVs: </strong>";
            for (let j = 0; j < 6; j++) {
                c.innerHTML += lists.stats[j] + ":" + pokemon.sets[i].ivs[lists.stats[j]] + " ";
            }
            b.appendChild(c);
            // EVs
            c = document.createElement("DIV");
            c.innerHTML = "<strong> EVs: </strong>";
            for (let j = 0; j < 6; j++) {
                c.innerHTML += lists.stats[j] + ":" + pokemon.sets[i].evs[lists.stats[j]] + " ";
            }
            b.appendChild(c);
            // total stats
            c = document.createElement("DIV");
            c.innerHTML = "<strong> stats: </strong>";
            for (let j = 0; j < 6; j++) {
                c.innerHTML += lists.stats[j] + ":" + pokemon.sets[i].totals[lists.stats[j]] + " ";
            }
            b.appendChild(c);
            // moves
            c = document.createElement("DIV");
            c.innerHTML = "<strong> moves: </strong>";
            for (let j = 0; j < 4; j++) {
                c.innerHTML += pokemon.sets[i].moves[j] + "|";
            }
            b.appendChild(c);
            a.appendChild(b);
        }
        document.querySelector('#setList').innerHTML = "<h2>Other Sets</h2>";
        document.querySelector('#setList').appendChild(a);
        console.log(a);

        // display pokemon sprite
        if (pokemon.sprite) {
            document.getElementById('pic').src = pokemon.sprite;
        }
    }

    /*
      const userList = document.createElement('p');
      const users = JSON.stringify(obj.users);
      userList.textContent = users;
      content.appendChild(userList);
    }*/
};

const handleResponse = (xhr) => {

    console.log(xhr.status);

    console.log(xhr.response);
    if (xhr.response) {
        const obj = JSON.parse(xhr.response);
        console.log(obj);
        parseJSON(xhr);
    } else {
        console.log('recieved');
    }
};

// get detailed information on a single pokemon 
const getPokemon = (e, name) => {
    const xhr = new XMLHttpRequest();
    xhr.open('get', '/pokemon' + '?pokemon=' + name);
    xhr.setRequestHeader('Accept', 'application/json');

    xhr.onload = () => handleResponse(xhr);
    xhr.send();
    e.preventDefault();
    return false;
};

// get the list of all pokemon names
const getPokemonList = () => {
    const xhr = new XMLHttpRequest();
    xhr.open('get', '/pokeNames')
    xhr.setRequestHeader('Accept', 'application/json');

    xhr.onload = () => handleResponse(xhr);
    xhr.send();
    return false;
};

// get the list of all item names
const getItemList = () => {
    const xhr = new XMLHttpRequest();
    xhr.open('get', '/itemNames')
    xhr.setRequestHeader('Accept', 'application/json');

    xhr.onload = () => handleResponse(xhr);
    xhr.send();
    return false;
};

// post a new set to the server
const sendPost = (e, form) => {

    const action = form.getAttribute('action');
    const method = form.getAttribute('method');

    const xhr = new XMLHttpRequest();
    xhr.open(method, action);

    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.setRequestHeader('Accept', 'application/json');

    xhr.onload = () => handleResponse(xhr);

    const formData = readForm(form);
    const formString = `name=${formData.name}&ability=${formData.ability}&item=${formData.item}&nature=${formData.nature}&ivs=${formData.ivs['hp']}&ivs=${formData.ivs['atk']}&ivs=${formData.ivs['def']}&ivs=${formData.ivs['spa']}&ivs=${formData.ivs['spd']}&ivs=${formData.ivs['spe']}&evs=${formData.evs['hp']}&evs=${formData.evs['atk']}&evs=${formData.evs['def']}&evs=${formData.evs['spa']}&evs=${formData.evs['spd']}&evs=${formData.evs['spe']}&totals=${formData.totals['hp']}&totals=${formData.totals['atk']}&totals=${formData.totals['def']}&totals=${formData.totals['spa']}&totals=${formData.totals['spd']}&totals=${formData.totals['spe']}&moves=${formData.moves['move1']}&moves=${formData.moves['move2']}&moves=${formData.moves['move3']}&moves=${formData.moves['move4']}`;
    xhr.send(formString);

    e.preventDefault();
    return false;
};

// calculate and return nature as a string
const calcNature = () => {
    let nat = 0;

    const pos = document.getElementsByClassName("pos");
    for (let i = 0; i < pos.length; i++) {
        if (pos[i].checked) {
            nat += i * 5;
        }
    }

    const neg = document.getElementsByClassName("neg");
    for (let i = 0; i < neg.length; i++) {
        if (neg[i].checked) {
            nat += i;
        }
    }

    return lists.natures[nat];
};

// return stats as an object
const getStats = (form, stat) => {
    const x = document.getElementsByClassName(stat);
    const stats = {};
    for (let i = 0; i < x.length; i++) {
        stats[x[i].name] = x[i].value;
    }
    return stats;
};

// return form as an object
const readForm = (form) => {
    const pokemon = {
        name: "",
        ability: "",
        item: "",
        nature: "",
        ivs: {},
        evs: {},
        totals: {},
        moves: {}
    };

    pokemon.name = document.getElementById("pokeName").value;
    pokemon.ability = document.getElementById("ability").value;
    pokemon.item = document.getElementById("item").value;
    pokemon.nature = calcNature();
    pokemon.ivs = getStats(form, "iv");
    pokemon.evs = getStats(form, "ev");
    pokemon.totals = getStats(form, "total")
    pokemon.moves = getStats(form, "move");

    return pokemon;
};

// based on w3schools tutorial
const autocomplete = (inp, arr) => {

    let currentFocus;

    inp.addEventListener("input", function (e) {
        let a, b, i, val = this.value;

        closeAllLists();
        if (!val) {
            return false;
        }
        currentFocus = -1;
        a = document.createElement("DIV");
        a.setAttribute("id", this.id + "autocomplete-list");
        a.setAttribute("class", "autocomplete-items");

        this.parentNode.appendChild(a);

        for (i = 0; i < arr.length; i++) {
            if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
                b = document.createElement("DIV");
                b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong";
                b.innerHTML += arr[i].substr(val.length);
                b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";

                // handle selecting options
                b.addEventListener("click", function (e) {
                    inp.value = this.getElementsByTagName("input")[0].value;
                    console.log(inp.id + "=" + inp.value);
                    // if the pokemon name field, get the pokemon from the server
                    if (inp.id == "pokeName") {
                        console.log("get " + inp.value);
                        getPokemon(e, inp.value);
                    }
                    // send request for poke data
                    closeAllLists();
                });
                a.appendChild(b);
            }
        }
    });

    // handle keyboard input
    inp.addEventListener("keydown", function (e) {
        let x = document.getElementById(this.id + "autocomplete-list");
        if (x) {
            x = x.getElementsByTagName("div");
        }
        if (e.keyCode == 40) {
            currentFocus++;
            addActive(x);
        } else if (e.keyCode == 38) {
            currentFocus--;
            addActive(x);
        } else if (e.keyCode == 13) {
            e.preventDefault();
            if (currentFocus > -1) {
                if (x) {
                    x[currentFocus].click();
                }
            }
        }
    });

    function addActive(x) {
        if (!x) return false;
        removeActive(x);

        if (currentFocus >= x.length) {
            currentFocus = 0;
        }
        if (currentFocus < 0) {
            currentFocus = (x.length - 1);
        }

        x[currentFocus].classList.add("autocomplete-active");
    }

    function removeActive(x) {
        for (let i = 0; i < x.length; i++) {
            x[i].classList.remove("autocomplete-active");
        }
    }

    function closeAllLists(elmnt) {
        let x = document.getElementsByClassName("autocomplete-items");
        for (let i = 0; i < x.length; i++) {
            if (elmnt != x[i] && elmnt != inp) {
                x[i].parentNode.removeChild(x[i]);
            }
        }
    }

    // clear dropdowns when click anywhere
    document.addEventListener("click", function (e) {
        closeAllLists(e.target);
    });
    console.log("autocomplete " + inp.id + " set up");
};

// calculate updated stats
const calcStats = (e) => {
    // calculate the rest of the stats
    for (let i = 1; i < 6; i++) {
        //console.log(lists.stats[i]);
        let x = document.getElementsByClassName(lists.stats[i]);
        //console.log(x);
        const level = 100;
        const base = parseFloat(x[0].value);
        const IV = parseFloat(x[1].value);
        const EV = parseFloat(x[2].value);
        let natureMod = 1.0;
        if (x[3].checked) {
            natureMod += 0.1;
        }
        if (x[4].checked) {
            natureMod -= 0.1;
        }
        const total = Math.floor((Math.floor(2 * base + IV + Math.floor(EV / 4) * level / 100) + 5) * natureMod);
        x[5].value = total;
    }

    // calculate hp
    let x = document.getElementsByClassName("hp");
    const level = 100;
    const base = parseFloat(x[0].value);
    const IV = parseFloat(x[1].value);
    const EV = parseFloat(x[2].value);
    const total = Math.floor(Math.floor(2 * base + IV + Math.floor(EV / 4) * level / 100) + level + 10);
    x[3].value = total;

    // sum evs
    x = document.getElementsByClassName("ev");
    let sum = 0;
    for (let i = 0; i < x.length; i++) {
        sum += parseInt(x[i].value);
    }
    document.getElementById("evSum").value = sum;

    document.getElementById("nature").value = calcNature();
};

const init = () => {
    getPokemonList();
    getItemList();

    const setForm = document.querySelector("#setForm");
    const submitSet = (e) => {
        sendPost(e, setForm);
        e.preventDefault();
    }
    setForm.addEventListener("submit", submitSet);

    const recalcStats = (e) => {
        calcStats(e);
        e.preventDefault();
    }
    setForm.addEventListener("change", recalcStats);

};

window.onload = init;
