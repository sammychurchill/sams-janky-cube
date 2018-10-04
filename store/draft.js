import sortBy from "sort-array";
import cardData from "~/assets/json/cardData.json";

export const state = () => ({
  cards: cardData,
  isStarted: true,
  players: {
    1: {
      id: 1,
      selectedCards: [],
      colourIdentity: [],
      playerType: "human",
      name: "Player",
      boosters: [0],
      currentBooster: [0],
      currentSelectedCard: null,
      isLoading: false
    },
    2: {
      id: 2,
      selectedCards: [],
      colourIdentity: [],
      playerType: "cpu",
      name: "CPU1",
      boosters: [1],
      currentBooster: [1],
      currentSelectedCard: null,
      isLoading: false
    },
    3: {
      id: 3,
      selectedCards: [],
      colourIdentity: ["g"],
      playerType: "cpu",
      name: "CPU2",
      boosters: [2],
      currentBooster: [2],
      currentSelectedCard: null,
      isLoading: false
    },
    4: {
      id: 4,
      selectedCards: [],
      colourIdentity: ["w"],
      playerType: "cpu",
      name: "CPU3",
      boosters: [2],
      currentBooster: [2],
      currentSelectedCard: null,
      isLoading: false
    },
    5: {
      id: 5,
      selectedCards: [28, 29, 30],
      colourIdentity: ["U", "R"],
      playerType: "cpu",
      name: "CPU4",
      boosters: [2],
      currentBooster: [2],
      currentSelectedCard: null,
      isLoading: false
    },
    6: {
      id: 6,
      selectedCards: [28, 29, 30],
      colourIdentity: ["R", "U"],
      playerType: "cpu",
      name: "CPU5",
      boosters: [2],
      currentBooster: [2],
      currentSelectedCard: null,
      isLoading: false
    }
  },
  playerList: [1, 2, 3, 4, 5, 6],
  boosters: [
    [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    [11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
    [21, 22, 23, 24, 25, 26, 27, 28, 29, 30]
  ]
});

export const mutations = {
  // selectCard(state, { playerID, card }) {
  //   const player = state.players[playerID];
  //   player.selectedCards.push(card.id);
  //   card.colours.forEach(colour => {
  //     if (!player.colourIdentity.includes(card.colour)) {
  //       player.colourIdentity.push(colour);
  //     }
  //   });
  // },
  setCurrentSelectedCard(state, { playerID, card }) {
    const player = state.players[playerID];
    player.currentSelectedCard = card.id;
  },
  removeCardFromBooster(state, { boosterID, cardID }) {
    const index = state.boosters[boosterID].indexOf(cardID);
    if (index > -1) {
      state.boosters[boosterID].splice(index, 1);
    }
  },
  passBooster(state, directionQuantified) {
    const players = { ...state.players };
    for (let player of players) {
      if (!player.currentBooster) {
        break;
      }
      player.currentBooster = player.currentBooster + directionQuantified;
      if (player.currentBooster < 0) {
        player.currentBooster = state.boosters.length - 1;
      }
      if (player.currentBooster === state.boosters.length) {
        player.currentBooster = 0;
      }
    }
    state.players = players;
  },
  isLoadingStarted(state, playerID) {
    state.players[playerID].isLoading = true;
  },
  isLoadingFinished(state, playerID) {
    state.players[playerID].isLoading = false;
  }
};

export const getters = {
  players: state => state.playerList.map(playerID => state.players[playerID]),
  isStarted: state => state.isStarted,
  boosterCards: state => playerID => {
    //this fires when cards are hovered over. Need to investigate
    const player = state.players[playerID];
    const boosterCardsArray = [];
    state.boosters[player.currentBooster].forEach(cardID => {
      boosterCardsArray.push(state.cards.filter(card => card.id === cardID)[0]);
    });
    return boosterCardsArray;
  },
  selectedCards: state => playerID => {
    return state.players[playerID].selectedCards.map(
      selectedCardID =>
        state.cards.filter(card => card.id === selectedCardID)[0]
    );
  },
  currentSelectedCard: state => playerID => {
    return state.players[playerID].currentSelectedCard;
  },
  getCardByID: state => cardID => {
    return state.cards.filter(card => card.id === cardID)[0];
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

export const actions = {
  logAction() {
    console.log("test");
  },
  async CPUSelectCard({ commit, getters }, playerID) {
    // const player = getters.getPlayerByID(playerID);
    // const currentBoosterID = player.currentBooster;
    const boosterCards = getters.boosterCards(playerID);
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
    commit("isLoadingFinished", playerID);

    // Do not remove from booster untill passed turn
    // commit("removeCardFromBooster", {
    //   boosterID: currentBoosterID,
    //   cardID: selectedCard.id
    // });
    commit("setCurrentSelectedCard", { playerID, card: selectedCard });
  },
  userSelectCard({ commit, state }, { playerID, cardID, direction }) {
    const currentBoosterID = state.getters.currentBooster(playerID);
    let directionQuantified;
    if (direction.toLowerCase() === "l") {
      directionQuantified = -1;
    }
    if (direction.toLowerCase() === "r") {
      directionQuantified = 1;
    }
    commit("removeCardFromBooster", { currentBoosterID, cardID });
    commit("selectCard", { playerID, cardID });
    commit("passBoosters", directionQuantified);
  },
  startDraft({ state, commit }, { noCPUPlayers, players }) {
    console.log(noCPUPlayers, players, state);
    commit();
    //create cpu players
    //add players
    //list players
    //create boosters
    //assign boosters
    //select booster
  }
};

function getRarityValue(card) {
  let value;
  switch (card.rarity) {
    case "mythic":
      value = 3;
      break;
    case "rare":
      value = 2;
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
      console.log(card1, card2);
      resolve(33);
    }, 300)
  );
}

// function synergyDBLookup(card1, card2) {
//   return null;
// }
