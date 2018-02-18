## About 

This repository defines a reverse proxy service for the [Google Maps Directions API](https://developers.google.com/maps/documentation/directions/intro).

It is used by the Subway Explorer frontend.

Populate an `auth.js` file in the root of this directory with the following contents:

```javascript
module.exports = {GOOGLE_MAPS_API_KEY: 'Your Google Maps Directions API Key'};
```

Then execute `node index.js` to run the service. It will accessible from `localhost:9000`. One test URL you can try:

```
http://localhost:9000/starting_x=-73.954527&starting_y=40.587243&ending_x=-73.977756&ending_y=40.687163
```