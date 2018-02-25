## About 

This repository defines a reverse proxy service for the [Google Maps Directions API](https://developers.google.com/maps/documentation/directions/intro).
It is a service component used by the [`subway-explorer-webapp`](https://github.com/ResidentMario/subway-explorer-webapp), 
which uses this API to perform route selection in the application front-end.

For more information on why this exists, see the `README.md` in the `subway-explorer-webapp` repository.

## Quickstart

You will need a [Google Maps Directions API](https://developers.google.com/maps/documentation/directions/) key. You will also need to have [Node.JS](https://nodejs.org/en/) installed.

First, clone the repository:

```sh
git clone https://github.com/ResidentMario/subway-explorer-gmaps-proxy.git
```

Install the necessary libraries from the root folder:

```
npm install
```

Populate an `auth.js` file in the root of your copy of this repository with the following contents:

```javascript
module.exports = {GOOGLE_MAPS_API_KEY: 'Your Google Maps Directions API Key'};
```

Then execute `node index.js` to run the service. It will accessible from `localhost:9000`. 

Here's one URL you can try, to make sure the service is up:

```
http://localhost:9000/starting_x=-73.954527&starting_y=40.587243&ending_x=-73.977756&ending_y=40.687163
```

The output should be the same as you would get calling the [Google Maps Directions API](https://developers.google.com/maps/documentation/directions/) key. You will also need to have [Node.JS](https://nodejs.org/en/) directly.

## Using the container

This repo contains a Docker file bundled with Node.JS and this application.

To build the container image, run the following from the root folder:

    docker build -t residentmario/subway-explorer-gmaps-proxy .

Then, to run the container (pointing it to `localhost:49161`):

    docker run -p 49161:9000 -d residentmario/subway-explorer-api

You can visit the following (port-forwarded) URI in the browser to verify that the connection is being served:

```
http://localhost:49161/starting_x=-73.954527&starting_y=40.587243&ending_x=-73.977756&ending_y=40.687163
```

You can also jump inside the container by running `docker exec -it 949cc5d81abe /bin/bash` (replacing the name with the 
name of the running image, discoverable via `docker ps`) and inspect the running processes to verify things are running 
as expected.