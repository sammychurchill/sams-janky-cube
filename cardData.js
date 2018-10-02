var jsonData = require("./assets/json/cards.json");
var fs = require("fs");
var axios = require("axios");
let cardData = [];

jsonData.cards.forEach(element => {
  axios
    .get(
      `https://api.scryfall.com/cards/named?fuzzy=${encodeURIComponent(
        element.name
      )}`
    )
    .then(res => {
      cardData.push({
        name: res.data.name,
        count: element.count,
        largeImage: res.data.image_uris.large,
        normalImage: res.data.image_uris.normal,
        smallImage: res.data.image_uris.small,
        rarity: element.rarity || res.data.rarity,
        colours: res.data.colors.length > 0 ? res.data.colors : ["C"],
        type_line: res.data.type_line,
        cmc: res.data.cmc,
        edhrec_uri: res.data.related_uris.edhrec,
        gatherer_uri: res.data.related_uris.gatherer
      });
    })
    .then(() => logStuff())
    .catch(err => console.log(err));
});

function logStuff() {
  // console.log(JSON.stringify(cardData))
  fs.writeFile(
    "./assets/json/cardData.json",
    JSON.stringify(cardData),
    function(err) {
      if (err) {
        console.log(err);
      }
    }
  );
}
