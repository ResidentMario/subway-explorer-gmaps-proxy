const http = require('http');
const httpProxy = require('http-proxy');
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
// TODO: this forward proxy is unnecessary. Use an Express service instead.
httpProxy.createProxyServer({target:'http://localhost:9000'}).listen(8000);
http.createServer(function (req, res) {
    // Ignore favicon requests.
    if (req.url.includes('favicon')) {
        res.end();
    } else {
        build_response(req.url).then((result) => {
            res.writeHead(200, { 'Content-Type': 'text/json' });
            res.write(JSON.stringify(result));
            res.end();
        });
    }
}).listen(9000);