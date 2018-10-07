import sortBy from "sort-array";
import jsonData from "~/assets/json/cardData.json";

export const state = () => ({
  cards: jsonData,
  cardArray: Object.keys(jsonData),
  selectedColours: [],
  currentSort: ""
});

export const mutations = {
  addColour(state, colour) {
    state.selectedColours.push(colour);
  },
  sortCards(state, sortProp) {
    const slotOrder = ["mythic", "rare", "uncommon", "common"];
    if (sortProp === "rarity") {
      state.cards = sortBy(state.cards, "rarity", { rarity: slotOrder });
    } else {
      state.cards = sortBy(state.cards, sortProp);
    }
  },
  removeColour(state, colour) {
    state.selectedColours = state.selectedColours.filter(el => {
      return el !== colour;
    });
  }
};

export const getters = {
  cards: (state, getters) => {
    if (!getters.selectedColours) {
      return state.cards;
    } else {
      const filteredCards = [];
      for (let cardID of state.cardArray) {
        const card = state.cards[cardID];
        let value = 0;
        getters.selectedColours.forEach(colour => {
          if (card.colours.includes(colour)) {
            value++;
          }
        });
        if (value < card.colours.length) {
          filteredCards.push(card);
        }
      }
      return filteredCards;
    }
  },
  selectedColours: state => {
    return state.selectedColours;
  },
  numAllCards: state => {
    return state.cards.length;
  },
  numFilteredCards: (state, getters) => {
    return getters.cards.length;
  }
};
