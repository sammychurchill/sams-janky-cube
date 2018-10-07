import sortBy from "sort-array";
import cardData from "~/assets/json/cardData.json";

export const state = () => ({
  cards: cardData,
  isStarted: true,
  players: {
    0: {
      id: 0,
      selectedCards: [],
      colourIdentity: [],
      playerType: "human",
      name: "Player",
      boosters: [0, 2],
      initRoundBooster: 0,
      currentBooster: 0,
      nextBooster: 3,
      currentSelectedCard: null,
      isLoading: false
    },
    1: {
      id: 1,
      selectedCards: [],
      colourIdentity: [],
      playerType: "cpu",
      name: "CPU1",
      boosters: [3, 4],
      initRoundBooster: 3,
      currentBooster: 3,
      nextBooster: 5,
      currentSelectedCard: null,
      isLoading: false
    },
    2: {
      id: 2,
      selectedCards: [],
      colourIdentity: ["g"],
      playerType: "cpu",
      name: "CPU2",
      boosters: [5, 6],
      initRoundBooster: 5,
      currentBooster: 5,
      nextBooster: 7,
      currentSelectedCard: null,
      isLoading: false
    },
    3: {
      id: 3,
      selectedCards: [],
      colourIdentity: ["w"],
      playerType: "cpu",
      name: "CPU3",
      boosters: [7, 8],
      initRoundBooster: 7,
      currentBooster: 7,
      nextBooster: 9,
      currentSelectedCard: null,
      isLoading: false
    },
    4: {
      id: 4,
      selectedCards: [30],
      colourIdentity: ["U", "R"],
      playerType: "cpu",
      name: "CPU4",
      boosters: [9, 10],
      initRoundBooster: 9,
      currentBooster: 9,
      nextBooster: 11,
      currentSelectedCard: null,
      isLoading: false
    },
    5: {
      id: 5,
      selectedCards: [28],
      colourIdentity: ["R", "U"],
      playerType: "cpu",
      name: "CPU5",
      boosters: [11, 12],
      initRoundBooster: 11,
      currentBooster: 11,
      nextBooster: 0,
      currentSelectedCard: null,
      isLoading: false
    }
  },
  playerList: [0, 1, 2, 3, 4, 5], //
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
  boosters: []
});

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
    console.log("removeCardFromBooster - boosterID, CardID", {
      boosterID,
      cardID
    });
    const index = state.boosters[boosterID].indexOf(cardID);
    console.log("removeCardFromBooster index", index);
    if (index > -1) {
      state.boosters[boosterID].splice(index, 1);
    }
    console.log(
      "removeCardFromBooster bossterID, boosterpack",
      boosterID,
      state.boosters[boosterID]
    );
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
  },
  gameStart({ commit, getters }) {
    const outer = [];
    let inner = [];
    for (let index = 1; index < 51; index++) {
      inner.push(index);
      if (index % 2 === 0) {
        outer.push(inner);
        inner = [];
      }
    }
    commit("setBoosters", outer);

    let boosterCount = 13;
    for (let player of getters.players) {
      for (let i = 0; i < 2; i++) {
        commit("setPlayerBoosters", {
          playerID: player.id,
          boosterID: boosterCount
        });
        boosterCount++;
      }
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
      console.log(
        "passturn - player.selectedcard",
        player.name,
        player.currentSelectedCard
      );
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
    console.log("CPUSelectCard - playerID", playerID);
    const boosterCards = getters.boosterCards(playerID);
    if (boosterCards.length < 1) {
      return;
    }
    console.log(
      "CPUSelectCard - playerID, boosterCards",
      playerID,
      boosterCards
    );
    const selectedCards = getters.selectedCards(playerID);
    const colourIdentity = getters.getColourIdentityByID(playerID);
    //
    const cardValueArrary = boosterCards.map(cardObj => {
      return { card: cardObj, value: 0 };
    });
    //
    commit("isLoadingStarted", playerID);
    //
    for (let cardValue of cardValueArrary) {
      cardValue.value += getRarityValue(cardValue.card);
      cardValue.value += getColourIdentityValue(cardValue.card, colourIdentity);
      cardValue.value += getCMCValue(cardValue.card);
      for (let card of selectedCards) {
        const synergyPercentage =
          (await getTimeoutSynergy(cardValue.card, card)) / 100;
        cardValue.value += cardValue.value * synergyPercentage;
      }
    }
    // check db if recorded synergy (card1, card2)
    // if not recorded synergy
    //   set isLoading true
    //   api lookup synergy
    //   write synergy to db

    const sortedCardValueArray = sortBy(cardValueArrary, "value").reverse();
    const selectedCard = sortedCardValueArray[0].card;
    console.log("selectedCard", playerID, selectedCard);
    commit("isLoadingFinished", playerID);
    commit("setCurrentSelectedCard", {
      playerID,
      cardID: selectedCard.id
    });
  }
};

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

function getTimeoutSynergy(card1, card2) {
  return new Promise(resolve =>
    setTimeout(() => {
      nothing({ card1, card2 });
      resolve(33);
    }, 300)
  );
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
