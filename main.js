const { Nuxt, Builder } = require("nuxt");
const express = require("express");
const { getSynergies } = require("./synergies/synergies.js");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(express.urlencoded());

const isProd = process.env.NODE_ENV === "production";
const port = process.env.PORT || 3000;

// We instantiate Nuxt.js with the options
const config = require("./nuxt.config.js");
config.dev = !isProd;
const nuxt = new Nuxt(config);

app.post("/syn", async (req, res) => {
  const cards = [];
  for (let obj of Object.values(req.body)) {
    try {
      cards.push(JSON.parse(obj));
    } catch (error) {
      cards.push(obj);
    }
  }
  if (cards.length < 2) {
    res.status(400);
    res.send("None shall pass");
  }
  const dbLookup = await getSynergies(cards[0], cards[1]);
  console.log("dbLookup", dbLookup);
  res.json(dbLookup);
});

// Render every route with Nuxt.js
app.use(nuxt.render);

// Build only in dev mode with hot-reloading
if (config.dev) {
  new Builder(nuxt)
    .build()
    .then(listen)
    .catch(error => {
      console.error(error);
      process.exit(1);
    });
} else {
  listen();
}

function listen() {
  // Listen the server
  app.listen(port, "0.0.0.0");
  console.log("Server listening on `localhost:" + port + "`.");
}
