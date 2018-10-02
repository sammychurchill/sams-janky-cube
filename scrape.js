const rp = require("request-promise");
const cheerio = require("cheerio");

const options = {
  uri: `https://edhrec.com/cards/ponder`,
  transform: function(body) {
    return cheerio.load(body);
  }
};

rp(options)
  .then($ => {
    let unformattedData = $("script")[13].children[0].data;
    unformattedData = unformattedData.replace("}]};", "}]}");
    const data = JSON.parse(unformattedData.replace("const json_dict = ", ""));
    console.log(data.cardlists[4].cardviews[0].label);
    cardViewToCard(data.cardlists[4].cardviews[0]);
  })
  .catch(err => {
    console.log(err);
  });

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
