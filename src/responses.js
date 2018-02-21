const fs = require('fs');

const index = fs.readFileSync(`${__dirname}/../hosted/client.html`);
const bundle = fs.readFileSync(`${__dirname}/../hosted/bundle.js`);
const css = fs.readFileSync(`${__dirname}/../hosted/style.css`);

// const users = {};
const pokemonNames = [];
// const pokemon = {};

// get main page
const getIndex = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/html' });
  response.write(index);
  response.end();
};

// get style sheet
const getCss = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/css' });
  response.write(css);
  response.end();
};

// get client script
const getBundle = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'application/javascript' });
  response.write(bundle);
  response.end();
};

// send the object
const respond = (request, response, status, content) => {
  response.writeHead(status, { 'Content-Type': 'application/json' });
  response.write(JSON.stringify(content));
  response.end();
};

// send the head
const respondMeta = (request, response, status) => {
  response.writeHead(status, { 'Content-Type': 'application/json' });
  response.end();
};

// get array of pokemon names
const getNames = (request, response) => {
  const responseObj = {
    pokemonNames,
  };

  return respond(request, response, 200, responseObj);
};

const getNamesMeta = (request, response) => respondMeta(request, response, 200);

// get specific pokemon data
/*
const getPokemon = (request, response, params) => {
  // need to figure out how to get query params
  if (pokemon[params.pokemon]) {
    const responseObj = {
      pokemon: pokemon[params.pokemon],
    };
  }

  return respond(request, response, 200, responseObj);
};
*/
// const addSet = (request, response) => {

// };
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
  getNames,
  // getPokemon,
  notFound,
  notFoundMeta,
  getNamesMeta,
};
