var jsonData = require('./assets/json/cards.json')
var fs = require('fs');
var axios = require('axios');
let cardData = [];

jsonData.cards.forEach(element => {
    axios.get(`https://api.scryfall.com/cards/named?fuzzy=${element}`).then(
        (res) => {
            cardData.push({
                name: res.data.name,
                largeImage: res.data.image_uris.large,
                normalImage: res.data.image_uris.normal,
                smallImage: res.data.image_uris.small,
                rarity: res.data.rarity,
                colors: res.data.colors,
                type_line: res.data.type_line,
                cmc: res.data.cmc,
                edhrec_uri: res.data.related_uris.edhrec
            })
        }
    ).then(() => logStuff())
    .catch(err => console.log(err))
});

function logStuff() {
    // console.log(JSON.stringify(cardData))
    fs.writeFile("./assets/json/cardData.json", JSON.stringify(cardData), function(err) {
        if (err) {
            console.log(err);
        }
    });
}