const http = require('http');
const maps = require('@google/maps');
const url  = require('url');

require('dotenv').config({silent: true});
let GOOGLE_MAPS_DIRECTIONS_API_KEY = process.env.GOOGLE_MAPS_DIRECTIONS_API_KEY;

// https://stackoverflow.com/q/49155199/1993206
GOOGLE_MAPS_DIRECTIONS_API_KEY = GOOGLE_MAPS_DIRECTIONS_API_KEY.replace(/\n$/, '');

// Maps Directions API helper function.
function fetch_transit_directions(starting_x, starting_y, ending_x, ending_y) {
    let client = maps.createClient({key: GOOGLE_MAPS_DIRECTIONS_API_KEY, Promise: Promise});
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
    // TODO: Tighten permissions to requests from the web-app front-end only.
    // Set CORS headers to allow front-end requests.
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Request-Method', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    res.writeHead(200, {'Content-Type': 'text/json'});

    // Ignore favicon requests.
    if (req.url.includes('favicon')) {
        res.end();
    // Populate a status page.
    } else if (url.parse(req.url).href === '/status') {
        res.write(JSON.stringify({status: 'OK'}));
        res.end();
    // Handle bad requests.
    } else if (!((req.url.includes('starting_x')) && (req.url.includes('starting_y')) &&
            (req.url.includes('ending_x')) && (req.url.includes('ending_y')))) {
        res.write(JSON.stringify({status: "BAD_API_CALL"}));
        res.end();
    // Handle good requests.
    } else {
        build_response(req.url).then((result) => {
            res.write(JSON.stringify(result));
            res.end();
        });
    }
}).listen(9000);