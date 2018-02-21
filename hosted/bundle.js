"use strict";

var pokemon = ["bulbasaur", "charmander", "squirtle", "butterfree"];

var parseJSON = function parseJSON(xhr, content) {
    var obj = JSON.parse(xhr.response);

    if (obj.message) {
        var p = document.createElement('p');
        p.textContent = "Message: " + obj.message;
        content.appendChild(p);
    }

    if (obj.users) {
        var userList = document.createElement('p');
        var users = JSON.stringify(obj.users);
        userList.textContent = users;
        content.appendChild(userList);
    }
};

var handleResponse = function handleResponse(xhr) {
    var content = document.querySelector('#content');

    console.log(xhr.status);

    switch (xhr.status) {
        case 200:
            content.innerHTML = '<b>Success</b>';
            break;
        case 201:
            content.innerHTML = '<b>Create</b>';
            break;
        case 204:
            content.innerHTML = '<b>Updated</b>';
            break;
        case 304:
            content.innerHTML = '<b>Not Modified</b>';
            break;
        case 400:
            content.innerHTML = '<b>Bad Request</b>';
            break;
        case 404:
            content.innerHTML = '<b>Not found</b>';
            break;
        default:
            content.innerHTML = 'Unknown error';
            break;
    }
    console.log(xhr.response);
    if (xhr.response) {
        var obj = JSON.parse(xhr.response);
        console.log(obj);
        parseJSON(xhr, content);
    } else {
        console.log('recieved');
    }
};

var requestUpdate = function requestUpdate(e, userForm) {
    var url = userForm.querySelector('#urlField').value;
    var method = userForm.querySelector('#methodSelect').value;

    var xhr = new XMLHttpRequest();
    xhr.open(method, url);
    xhr.setRequestHeader('Accept', 'application/json');

    xhr.onload = function () {
        return handleResponse(xhr);
    };
    xhr.send();
    e.preventDefault();
    return false;
};

var getPokemon = function getPokemon(e, pokeForm) {
    var xhr = new XMLHttpRequest();
    xhr.open('get', '/pokemon');
    xhr.setRequestHeader('Accept', 'application/json');

    xhr.onload = function () {
        return handleResponse(xhr);
    };
    xhr.send();
    e.preventDefault();
    return false;
};

var sendPost = function sendPost(e, setForm) {

    var nameAction = nameForm.getAttribute('action');
    var nameMethod = nameForm.getAttribute('method');
    var nameField = nameForm.querySelector('#nameField');
    var ageField = nameForm.querySelector('#ageField');

    var xhr = new XMLHttpRequest();
    xhr.open(nameMethod, nameAction);

    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.setRequestHeader('Accept', 'application/json');

    xhr.onload = function () {
        return handleResponse(xhr);
    };

    var formData = "name=" + nameField.value + "&age=" + ageField.value;

    xhr.send(formData);

    e.preventDefault();
    return false;
};

//based on w3schools tutorial
var autocomplete = function autocomplete(inp, arr) {

    var currentFocus;

    inp.addEventListener("input", function (e) {
        var a,
            b,
            i,
            val = this.value;

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

                b.addEventListener("click", function (e) {
                    inp.value = this.getElementsByTagName("input")[0].value;
                    closeAllLists();
                });
                a.appendChild(b);
            }
        }
    });

    inp.addEventListener("keydown", function (e) {
        var x = document.getElementById(this.id + "autocomplete-list");
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
            currentFocus = x.length - 1;
        }

        x[currentFocus].classList.add("autocomplete-active");
    }

    function removeActive(x) {
        for (var i = 0; i < x.length; i++) {
            x[i].classList.remove("autocomplete-active");
        }
    }

    function closeAllLists(elmnt) {
        var x = document.getElementsByClassName("autocomplete-items");
        for (var i = 0; i < x.length; i++) {
            if (elmnt != x[i] && elmnt != inp) {
                x[i].parentNode.removeChild(x[i]);
            }
        }
    }

    document.addEventListener("click", function (e) {
        closeAllLists(e.target);
    });
};

var calcStat = function calcStat() {};

var init = function init() {

    var pokeName = document.querySelector("#pokeName");
    autocomplete(pokeName, pokemon);

    var setForm = document.querySelector("#setForm");
    var submitSet = function submitSet(e) {};
    setForm.addEventListener("submit");
};

window.onload = init;
