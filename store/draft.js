import sortBy from "sort-array";
import cardData from "~/assets/json/cardData.json";
import axios from "axios";
import { log } from "util";
const NodeCache = require("node-cache");
const synergyCache = new NodeCache();

export const state = () => ({
  cards: cardData,
  cardList: Object.values(cardData).map(card => {
    for (let i = 0; i < card.count; i++) {
      return card.id;
    }
  }),
  isStarted: true,
  boosters: [],
  players: {},
  playerList: []
});
// players: {
//   0: {
//     id: 0,
//     selectedCards: [],
//     colourIdentity: [],
//     playerType: "human",
//     name: "Player",
//     boosters: [0, 2],
//     initRoundBooster: 0,
//     currentBooster: 0,
//     nextBooster: 3,
//     currentSelectedCard: null,
//     isLoading: false
//   },
//   1: {
//     id: 1,
//     selectedCards: [],
//     colourIdentity: [],
//     playerType: "cpu",
//     name: "CPU1",
//     boosters: [3, 4],
//     initRoundBooster: 3,
//     currentBooster: 3,
//     nextBooster: 5,
//     currentSelectedCard: null,
//     isLoading: false
//   },
//   2: {
//     id: 2,
//     selectedCards: [],
//     colourIdentity: ["g"],
//     playerType: "cpu",
//     name: "CPU2",
//     boosters: [5, 6],
//     initRoundBooster: 5,
//     currentBooster: 5,
//     nextBooster: 7,
//     currentSelectedCard: null,
//     isLoading: false
//   },
//   3: {
//     id: 3,
//     selectedCards: [],
//     colourIdentity: ["w"],
//     playerType: "cpu",
//     name: "CPU3",
//     boosters: [7, 8],
//     initRoundBooster: 7,
//     currentBooster: 7,
//     nextBooster: 9,
//     currentSelectedCard: null,
//     isLoading: false
//   },
//   4: {
//     id: 4,
//     selectedCards: [30],
//     colourIdentity: ["U", "R"],
//     playerType: "cpu",
//     name: "CPU4",
//     boosters: [9, 10],
//     initRoundBooster: 9,
//     currentBooster: 9,
//     nextBooster: 11,
//     currentSelectedCard: null,
//     isLoading: false
//   },
//   5: {
//     id: 5,
//     selectedCards: [28],
//     colourIdentity: ["R", "U"],
//     playerType: "cpu",
//     name: "CPU5",
//     boosters: [11, 12],
//     initRoundBooster: 11,
//     currentBooster: 11,
//     nextBooster: 0,
//     currentSelectedCard: null,
//     isLoading: false
//   }
// },
// playerList: [0, 1, 2, 3, 4, 5]
// boosters: [
//   [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
//   [11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
//   [21, 22, 23, 24, 25, 26, 27, 28, 29, 30],
//   [31, 32, 33, 34, 35, 36, 37, 38, 39, 40],
//   [31, 42, 43, 44, 45, 46, 47, 48, 49, 50],
//   [51, 52, 53, 54, 55, 56, 57, 58, 59, 30],
//   [61, 62, 63, 64, 65, 66, 67, 68, 69, 70]
// ]
// boosters: [[9], [11, 12], [21, 22], [31, 32], [31, 42], [], []]

export const getters = {
  players: state => state.playerList.map(playerID => state.players[playerID]),
  isStarted: state => state.isStarted,
  boosterCards: state => (currentPlayerID, sortProp) => {
    const player = state.players[currentPlayerID];
    const boosterCardsArray = [];
    if (!state.boosters[player.currentBooster]) {
      return [];
    }
    for (let cardID of state.boosters[player.currentBooster]) {
      boosterCardsArray.push(state.cards[cardID]);
    }
    return sortCards(boosterCardsArray, sortProp);
  },
  selectedCards: state => (currentPlayerID, sort) => {
    return sortCards(
      state.players[currentPlayerID].selectedCards.map(
        selectedCardID => state.cards[selectedCardID]
      ),
      sort
    );
  },
  currentSelectedCard: state => playerID => {
    return state.players[playerID].currentSelectedCard;
  },
  getCardByID: state => cardID => {
    if (!cardID) {
      return { name: "error retrieving card" };
    }
    return state.cards[cardID];
  },
  getPlayerByID: state => playerID => {
    return state.players[playerID];
  },
  getColourIdentityByID: state => playerID => {
    return state.players[playerID].colourIdentity;
  },
  playerIsLoading: state => playerID => {
    return state.players[playerID].isLoading;
  }
};

export const mutations = {
  initialisePlayers(state, players) {
    state.players = players;
    state.playerList = Object.keys(players);
  },
  setBoosters(state, boosters) {
    state.boosters = boosters;
  },
  setPlayerBoosters(state, { playerID, boosterID }) {
    state.players[playerID].boosters.push(boosterID);
  },
  setCurrentSelectedCard(state, { playerID, cardID }) {
    const player = state.players[playerID];
    if (!cardID) {
      player.currentSelectedCard = undefined;
    } else {
      player.currentSelectedCard = cardID;
    }
  },
  removeCardFromBooster(state, { boosterID, cardID }) {
    const index = state.boosters[boosterID].indexOf(cardID);
    if (index > -1) {
      state.boosters[boosterID].splice(index, 1);
    }
  },
  playerSelectCard(state, { playerID, cardID }) {
    state.players[playerID].selectedCards.push(cardID);
    state.cards[cardID].colours.forEach(colour => {
      if (
        !state.players[playerID].colourIdentity.includes(
          state.cards[cardID].colour
        )
      ) {
        state.players[playerID].colourIdentity.push(colour);
      }
    });
  },
  clearSelectedCard(state, playerID) {
    state.players[playerID].currentSelectedCard = undefined;
  },
  getNextBooster(state, { playerID, direction }) {
    const dirValue = getNextBoosterDirectionValue(direction);
    let nextPlayerID = playerID + dirValue;
    if (nextPlayerID < 0) {
      nextPlayerID = state.playerList.length - 1;
    }
    if (nextPlayerID > state.playerList.length - 1) {
      nextPlayerID = 0;
    }
    state.players[playerID].nextBooster =
      state.players[nextPlayerID].currentBooster;
  },
  nextBoosterToCurrentBooster(state, playerID) {
    state.players[playerID].currentBooster =
      state.players[playerID].nextBooster;
  },
  removeCurrentBooster(state, playerID) {
    state.players[playerID].boosters = state.players[playerID].boosters.filter(
      boosterID => boosterID !== state.players[playerID].initRoundBooster
    );
  },
  clearCurrentBooster(state, playerID) {
    state.players[playerID].currentBooster = undefined;
  },
  pickBooster(state, playerID) {
    const boosters = state.players[playerID].boosters;
    state.players[playerID].initRoundBooster =
      boosters[Math.floor(Math.random() * boosters.length)];
    state.players[playerID].currentBooster =
      state.players[playerID].initRoundBooster;
  },
  isLoadingStarted(state, playerID) {
    state.players[playerID].isLoading = true;
  },
  isLoadingFinished(state, playerID) {
    state.players[playerID].isLoading = false;
  }
};

export const actions = {
  logAction() {
    console.log("test");
    console.log(synergyCache.getStats());
  },
  gameStart({ commit, getters }) {
    commit("initialisePlayers", createUsers("Sam", 5));
    commit("setBoosters", createBoosters(cardData, 6));

    let boosterCount = 0;
    for (let player of getters.players) {
      for (let i = 0; i < 2; i++) {
        commit("setPlayerBoosters", {
          playerID: player.id,
          boosterID: boosterCount
        });
        boosterCount++;
      }
      commit("pickBooster", player.id);
      commit("removeCurrentBooster", player.id);
    }
    for (let player of getters.players) {
      commit("getNextBooster", { playerID: player.id, direction: "L" });
    }
    // create players
    // list players
    // create boosters
    // assign to players
    // select 1st booster
    // pop first booster from booster
    // set next booster
    // start cpu selections
  },
  passTurn({ commit, getters, dispatch }, direction) {
    for (let player of getters.players) {
      if (getters.boosterCards(player.id).length > 0) {
        commit("removeCardFromBooster", {
          boosterID: player.currentBooster,
          cardID: player.currentSelectedCard
        });
        commit("playerSelectCard", {
          playerID: player.id,
          cardID: player.currentSelectedCard
        });
      }
      commit("clearSelectedCard", player.id);
      commit("nextBoosterToCurrentBooster", player.id);
    }
    for (let player of getters.players) {
      if (getters.boosterCards(player.id).length > 0) {
        if (player.playerType !== "human") {
          dispatch("CPUSelectCard", player.id);
        }
      }
      commit("getNextBooster", { playerID: player.id, direction });
    }
  },
  nextPack({ commit, getters, dispatch }, direction) {
    for (let player of getters.players) {
      commit("removeCurrentBooster", player.id);
      commit("clearCurrentBooster", player.id);
      commit("pickBooster", player.id);
      if (player.playerType !== "human") {
        dispatch("CPUSelectCard", player.id);
      }
    }
    for (let player of getters.players) {
      commit("getNextBooster", { playerID: player.id, direction });
    }
  },
  async CPUSelectCard({ commit, getters }, playerID) {
    const boosterCards = getters.boosterCards(playerID);
    if (boosterCards.length < 1) {
      return;
    }
    const selectedCards = getters.selectedCards(playerID);
    const colourIdentity = getters.getColourIdentityByID(playerID);
    //
    const cardValueArrary = boosterCards.map(cardObj => {
      return { card: cardObj, value: 0 };
    });
    //
    commit("isLoadingStarted", playerID);
    console.log("--- loading started", playerID);
    //
    for (let cardValue of cardValueArrary) {
      console.log(cardValue.card.name, cardValue.value);

      cardValue.value += getRarityValue(cardValue.card);
      console.log("rarity", cardValue.card.name, cardValue.value);

      cardValue.value += getColourIdentityValue(cardValue.card, colourIdentity);
      console.log("colour", cardValue.card.name, cardValue.value);

      cardValue.value += getCMCValue(cardValue.card);
      console.log("cmc", cardValue.card.name, cardValue.value);

      const synergies = [];
      for (let card of selectedCards) {
        const synSortedCardArray = arrayAndSort(card, cardValue.card);
        const key = `${synSortedCardArray[0].id}_${synSortedCardArray[1].id}`;
        const cachedValue = synergyCache.get(key);
        if (cachedValue == undefined) {
          console.log("-- Miss", card.name, cardValue.card.name);
          const synergy = await getSynergy(cardValue.card, card);
          synergyCache.set(key, synergy, 60 * 60 * 1);
          synergies.push(synergy);
        } else {
          console.log("-- Hit", card.name, cardValue.card.name);
          synergies.push(cachedValue);
        }
      }
      console.log("synergies", cardValue.card.name, synergies);

      const synergiesSum = synergies.reduce((acc, val) => {
        return val + acc;
      }, 0);
      console.log("synergiesSum", synergiesSum);
      console.log("synergies length", synergies.length);
      console.log("avg", synergiesSum / synergies.length);

      const avg = synergiesSum / synergies.length;
      if (avg && avg > 0) {
        cardValue.value = cardValue.value * ((avg + 100) / 100);
      }
      console.log("after syn", cardValue.card.name, cardValue.value);
      // should test if synergy value is there. if not display error somewhere
    }

    const sortedCardValueArray = sortBy(cardValueArrary, "value").reverse();
    const selectedCard = sortedCardValueArray[0].card;
    console.log("--- loading Finished", playerID);
    commit("isLoadingFinished", playerID);
    commit("setCurrentSelectedCard", {
      playerID,
      cardID: selectedCard.id
    });
  }
};

function createUsers(humanPlayerName, noCPUPlayers) {
  const players = {};
  players[0] = {
    id: 0,
    selectedCards: [],
    colourIdentity: [],
    playerType: "human",
    name: humanPlayerName,
    boosters: [],
    initRoundBooster: undefined,
    currentBooster: undefined,
    nextBooster: undefined,
    currentSelectedCard: undefined,
    isLoading: false
  };
  for (let i = 1; i < noCPUPlayers + 1; i++) {
    players[i] = {
      id: i,
      selectedCards: [],
      colourIdentity: [],
      playerType: "cpu",
      name: `CPU${i}`,
      boosters: [],
      initRoundBooster: undefined,
      currentBooster: undefined,
      nextBooster: undefined,
      currentSelectedCard: undefined,
      isLoading: false
    };
  }
  return players;
}

function createBoosters(cards, noPlayers) {
  const boosters = [];
  nothing(noPlayers);
  let { rares, uncommons, commons } = groupRarity(cards);

  for (let index = 0; index < 6 * 4; index++) {
    let booster = Array.concat(
      fillBooster(rares, 1),
      fillBooster(uncommons, 3),
      fillBooster(commons, 10)
    );
    boosters.push(booster);
    booster = [];
  }
  return boosters;
}

function getRand(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function groupRarity(cards) {
  const commons = [];
  const uncommons = [];
  const rares = [];
  Object.values(cards).forEach(card => {
    card.rarity === "mythic" || card.rarity === "rare"
      ? rares.push(card)
      : null;
    card.rarity === "uncommon" ? uncommons.push(card) : null;
    card.rarity === "common" ? commons.push(card) : null;
  });
  return { rares, uncommons, commons };
}

function fillBooster(cards, numberOfChoices) {
  const booster = [];
  while (booster.length < numberOfChoices) {
    let choice = getRand(cards);
    if (!booster.includes(choice.id)) {
      booster.push(choice.id);
    }
  }
  return booster;
}

function getNextBoosterDirectionValue(direction) {
  if (direction.toUpperCase() === "L") {
    return 1;
  }
  if (direction.toUpperCase() === "R") {
    return -1;
  }
}

function getRarityValue(card) {
  let value;
  switch (card.rarity) {
    case "mythic":
      value = 5;
      break;
    case "rare":
      value = 3;
      break;
    case "uncommon":
      value = 1;
      break;
    default:
      value = 0;
      break;
  }
  return value;
}

function getColourIdentityValue(card, colourIdentity) {
  let value = 0;
  card.colours.forEach(colour => {
    if (colourIdentity.includes(colour)) {
      value++;
    }
  });
  return value;
}

function getCMCValue(card) {
  let value = 4;
  if (card.cmc === 0) {
    value = 1;
  } else {
    value = value - card.cmc;
  }
  return value;
}

function getSynergy(card1, card2) {
  return axios
    .post("/syn", { card1, card2 })
    .then(res => {
      console.log("getSynergyRes", res);
      return res.data.synergy;
    })
    .catch(err => {
      console.log(err);
    });
}

function arrayAndSort(card1, card2) {
  return [card1, card2].sort((a, b) => a.id - b.id);
}

function nothing(o) {
  return o;
}

function sortCards(cardArray, sortProp) {
  if (!sortProp) {
    return cardArray;
  }
  const slotOrder = ["mythic", "rare", "uncommon", "common"];
  if (sortProp === "rarity") {
    cardArray = sortBy(cardArray, "rarity", { rarity: slotOrder });
  } else {
    cardArray = sortBy(cardArray, sortProp);
  }
  return cardArray;
}

// function synergyDBLookup(card1, card2) {
//   return null;
// }
