var jsonData = require("./assets/json/cards.json");
const { Pool } = require("pg");
var fs = require("fs");
var axios = require("axios");
let cardData = {};
let count = 1;

const pool = new Pool({
  connectionString:
    process.env.DATABASE_URL || "postgres://localhost:5432/synergies",
  ssl: false // why is this false
});

async function query(q) {
  const client = await pool.connect();
  let res;
  try {
    await client.query("BEGIN");
    try {
      res = await client.query(q);
      await client.query("COMMIT");
    } catch (err) {
      await client.query("ROLLBACK");
      throw err;
    }
  } finally {
    client.release();
  }
  return res;
}

const getCardData = async cardName => {
  try {
    return await axios.get(
      `https://api.scryfall.com/cards/named?fuzzy=${encodeURIComponent(
        cardName
      )}`
    );
  } catch (error) {
    console.error(error);
  }
};

async function getCards(card) {
  console.log(card.name);
  const res = await getCardData(card.name);
  let cardCount = 1;
  // cardCount = res.data.rarity === "common" ? 5 : card.count;
  // cardCount = res.data.rarity === "uncommon" ? 3 : cardCount;
  for (let i = 0; i < cardCount; i++) {
    cardData[count] = {
      id: count,
      cardID: res.data.id,
      name: res.data.name,
      count: card.count,
      largeImage: res.data.image_uris.large,
      normalImage: res.data.image_uris.normal,
      smallImage: res.data.image_uris.small,
      rarity: card.rarity || res.data.rarity,
      colours: res.data.colors.length > 0 ? res.data.colors : ["C"],
      cmc: res.data.cmc,
      mana_cost: res.data.mana_cost,
      type_line: res.data.type_line,
      edhrec_uri: res.data.related_uris.edhrec,
      gatherer_uri: res.data.related_uris.gatherer
    };
    count++;
    console.log(Object.keys(cardData).length);
  }
}
async function main() {
  const promises = jsonData.map(card => getCards(card));
  await Promise.all(promises);
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

async function writeToDB(params) {
  //
}

main();
