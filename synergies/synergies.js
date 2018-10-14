const { Pool } = require("pg");
const { scrapeCards } = require("./scrape.js");

const pool = new Pool({
  connectionString:
    process.env.DATABASE_URL || "postgres://localhost:5432/synergies",
  ssl: false // why is this false
});

async function getSynergies(card1, card2) {
  const cardArray = [card1, card2];
  let foundCard;
  // should check how old res is and update if stale
  const res = await dbLookup(card1.id, card2.id);
  if (res !== undefined) {
    console.log(card1.name, card2.name, "cached");
    return res;
  }

  for (let i = 0; i < cardArray.length; i++) {
    const EDHcards = await scrapeCards(cardArray[i].edhrec_uri);
    const otherCard = i + 1 >= cardArray.length ? cardArray[0] : cardArray[1];
    const found = findOtherCardNameInCards(EDHcards, otherCard);
    if (found) {
      // janky - overriding good res with bad. Need better way
      foundCard = found;
    }
  }

  if (foundCard) {
    console.log("Found Card", foundCard);
    const writeRes = await writeDB(card1.id, card2.id, foundCard);
    return writeRes;
  } else {
    const blankEntry = { noDecks: 0, percentageDecks: 0, synergy: 0 };
    return await writeDB(card1.id, card2.id, blankEntry);
  }
}

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

async function writeDB(cardID1, cardID2, foundCard) {
  const { noDecks, percentageDecks, synergy } = foundCard;
  const cardArraySorted = arrayAndSort(cardID1, cardID2);
  const queryString = `INSERT INTO public.synergies(
	"cardID1", "cardID2", synergy, no_decks, percentage_decks)
	VALUES (
    ${cardArraySorted[0]}, 
    ${cardArraySorted[1]}, 
    ${synergy},
    ${noDecks},
    ${percentageDecks}
  )
  RETURNING *`;
  try {
    const { rows } = await query(queryString);
    return rows[0];
  } catch (err) {
    console.log("Database " + err);
  }
}

async function dbLookup(cardID1, cardID2) {
  const cardArraySorted = arrayAndSort(cardID1, cardID2);
  const queryString = `SELECT * FROM public.synergies 
    WHERE "cardID1" = ${cardArraySorted[0]} 
    AND "cardID2" = ${cardArraySorted[1]}`;
  try {
    const { rows } = await query(queryString);
    return rows[0];
  } catch (err) {
    console.log("Database " + err);
  }
}

function arrayAndSort(cardID1, cardID2) {
  return [cardID1, cardID2].sort((a, b) => a - b);
}

function findOtherCardNameInCards(cards, card2) {
  return cards.find(card => card.name === card2.name);
}

module.exports = {
  getSynergies
};
