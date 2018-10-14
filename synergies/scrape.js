const rp = require("promise-request-retry");
const cheerio = require("cheerio");

async function scrapeCards(cardURI) {
  console.log("URI", cardURI);
  const options = {
    uri: cardURI,
    retry: 2,
    transform: function(body) {
      return cheerio.load(body);
    }
  };
  try {
    const $ = await rp(options);
    let unformattedData;
    $("script").each((i, el) => {
      // loops over script tags finds 1st with no attribures and has children
      const { attribs, children } = el;
      if (Object.keys(attribs).length === 0 && children.length > 0) {
        // 1st child's data
        unformattedData = el.children[0].data;
      }
    });
    unformattedData = unformattedData.replace("}]};", "}]}");
    const data = JSON.parse(unformattedData.replace("const json_dict = ", ""));
    const cards = [];
    for (let cardlist of data.cardlists) {
      if (cardlist.tag !== "topcommanders") {
        let cardviews = cardlist.cardviews;
        cardviews.forEach(cardview => {
          cards.push(cardViewToCard(cardview));
        });
      }
    }
    return cards;
  } catch (error) {
    console.log(error);
  }
}

function cardViewToCard(cardview) {
  let label = cardview.label;
  let card = {
    name: null,
    noDecks: 0,
    percentageDecks: 0,
    synergy: 0
  };
  card.name = cardview.name;
  label = label.split(/^[^\d]*(\d+)/);
  card.percentageDecks = label[1];
  label = label[2].split(/^[^\d]*(\d+)/);
  card.noDecks = label[1];
  label = label[2].split(/^[^\d]*(\d+)/);
  card.synergy = label[1];
  return card;
}

module.exports = {
  scrapeCards
};
