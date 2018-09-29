import Vuex from "vuex";
import arraySort from "array-sort";
import jsonData from "~/assets/json/cardData.json";

const createStore = () => {
  return new Vuex.Store({
    state: {
      cards: jsonData,
      selectedColours: [],
      currentSort: ""
    },
    mutations: {
      addColour(state, colour) {
        state.selectedColours.push(colour);
      },
      sortCards(state, sortProp) {
        state.cards = arraySort(state.cards, sortProp);
      },
      removeColour(state, colour) {
        state.selectedColours = state.selectedColours.filter(el => {
          return el !== colour;
        });
      }
    },
    getters: {
      cards: (state, getters) => {
        if (!getters.selectedColours) {
          return state.cards;
        } else {
          const filteredCards = [];
          state.cards.forEach(card => {
            let value = 0;
            getters.selectedColours.forEach(c => {
              if (card.colours.includes(c)) {
                value++;
              }
            });
            if (value < card.colours.length) {
              filteredCards.push(card);
            }
          });
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
    }
  });
};

export default createStore;
