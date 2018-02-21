const http = require('http');
const url = require('url');

const query = require('querystring');
const responseHandler = require('./responses.js');

const port = process.env.PORT || process.env.NODE_PORT || 3000;


const onRequest = (request, response) => {
  const parsedUrl = url.parse(request.url);
    const params = query.parse(parsedUrl.query);
  switch (request.method) {

    case 'GET':
      switch (parsedUrl.pathname) {
        case '/':
          responseHandler.getIndex(request, response);
          break;
        case '/style.css':
          responseHandler.getCss(request, response);
          break;
        case '/bundle.js':
          responseHandler.getBundle(request, response);
          break;
        case '/pokeNames':
          responseHandler.getNames(request, response);
          break;
        case '/pokemon':
          responseHandler.getPokemon(request, response, params);
          break;
        default:
          responseHandler.notFound(request, response);
          break;
      }
      break;
    case 'HEAD':
      switch (parsedUrl.pathname) {
        case '/pokeNames':
          responseHandler.getNamesMeta(request, response);
          break;
        default:
          responseHandler.notFoundMeta(request, response);
          break;
      }
      break;
    default:
      responseHandler.notFoundMeta(request, response);
      break;
    case 'POST':
      if (parsedUrl.pathname === '/addSet') {
        const res = response;
        const body = [];

        request.on('error', () => {
          res.statusCode = 400;
          res.end();
        });

        request.on('data', (chunk) => {
          body.push(chunk);
        });

        request.on('end', () => {
          const bodyString = Buffer.concat(body).toString();
          const bodyParams = query.parse(bodyString);

          responseHandler.addSet(request, res, bodyParams);
        });
      } else {
        responseHandler.notFound(request, response);
      }
      break;
  }
};

http.createServer(onRequest).listen(port);

console.log(`Listening on 127.0.0.1: ${port}`);
