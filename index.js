const http = require('http');
const maps = require('@google/maps');
const GOOGLE_MAPS_API_KEY = require('./auth').GOOGLE_MAPS_API_KEY;

// Maps Directions API helper function.
function fetch_transit_directions(starting_x, starting_y, ending_x, ending_y) {
    let client = maps.createClient({key: GOOGLE_MAPS_API_KEY, Promise: Promise});
    return client.directions(
        {'origin': [starting_y, starting_x], 'destination': [ending_y, ending_x],
            'mode': 'transit', 'transit_mode': 'subway'},
    ).asPromise();
}

function build_response(url) {
    let params = {};
    url.split("&").map(function(param_pair) {
        param_pair = param_pair.replace("/", "");
        let pivot = param_pair.indexOf("=");
        [param, value] = [param_pair.slice(0, pivot), param_pair.slice(pivot + 1)];
        params[param] = value;
    });
    return fetch_transit_directions(params.starting_x, params.starting_y, params.ending_x, params.ending_y)
        .then(r => r.json)
}

// Create proxy and target servers and set the target in the options.
http.createServer(function (req, res) {
    // Ignore favicon requests.
    // TODO: Tighten permissions to requests from the web-app front-end only.
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Request-Method', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    res.writeHead(200, { 'Content-Type': 'text/json' });

    if (req.url.includes('favicon')) {
        res.end();
    } else {
        build_response(req.url).then((result) => {
            // Set CORS headers to allow front-end requests.
            res.write(JSON.stringify(result));
            res.end();
        });
    }
}).listen(9000);