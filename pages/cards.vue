<template>
  <section class="section">
    <div class="container">
      <div class="columns">
        <div class="column is-two-thirds">
          <Card
            v-for="(card, id) in filteredCards"
            :key="id"
            :card="card"
            class="title"
          />
        </div>
        <div class="column">
          <div 
            :class="{ 'is-active': isOrderDropdownActive }"
            class="dropdown is-pulled-right"
          >
            <div class="dropdown-trigger">
              <button 
                class="button" 
                aria-haspopup="true" 
                aria-controls="dropdown-menu"
                @click="toggleOrderDropdown"
              >
                <span>Sort By</span>
                <span class="icon is-small">
                  <i 
                    class="fas fa-angle-down" 
                    aria-hidden="true"/>
                </span>
              </button>
            </div>
            <div 
              id="dropdown-menu" 
              class="dropdown-menu" 
              role="menu">
              <div class="dropdown-content">
                <a 
                  class="dropdown-item"
                  @click="sort('name'); toggleOrderDropdown()"
                >
                  Name
                </a>
                <a 
                  class="dropdown-item"
                  @click="sort('rarity'); toggleOrderDropdown()"
                >
                  Rarity
                </a>
                <a 
                  class="dropdown-item"
                  @click="sort('cmc'); toggleOrderDropdown()"
                >
                  Mana Cost
                </a>
                <a 
                  class="dropdown-item"
                  @click="sort('colours'); toggleOrderDropdown()"
                >
                  Colour
                </a>
              </div>
            </div>
          </div>
          <div>
            <br>
            <br>
            <br>
            <h2 class="is-pulled-right">Filter Colours:</h2>
            <br>
            <br>
            <nav class="level">
              <div class="level-item has-text-centered">
                <label class="checkbox">
                  <input 
                    ref="W" 
                    type="checkbox"
                    @change="colourCheckboxUpdated($event, 'W')"
                  >
                  W
                </label>
              </div>
              <div class="level-item has-text-centered">
                <label class="checkbox">
                  <input 
                    ref="R" 
                    type="checkbox"
                    @change="colourCheckboxUpdated($event, 'R')"
                  >
                  R
                </label>
              </div>
              <div class="level-item has-text-centered">
                <label class="checkbox">
                  <input 
                    ref="G" 
                    type="checkbox"
                    @change="colourCheckboxUpdated($event, 'G')"
                  >
                  G
                </label>
              </div>
              <div class="level-item has-text-centered">
                <label class="checkbox">
                  <input 
                    ref="U" 
                    type="checkbox"
                    @change="colourCheckboxUpdated($event, 'U')"
                  >
                  U
                </label>
              </div>
              <div class="level-item has-text-centered">
                <label class="checkbox">
                  <input 
                    ref="B" 
                    type="checkbox"
                    @change="colourCheckboxUpdated($event, 'B')"
                  >
                  B
                </label>
              </div>
              <div class="level-item has-text-centered">
                <label class="checkbox">
                  <input 
                    ref="C" 
                    type="checkbox"
                    @change="colourCheckboxUpdated($event, 'C')"
                  >
                  C
                </label>
              </div>
            </nav>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import Card from "~/components/Card.vue";
var jsonData = require("~/assets/json/cardData.json");
var arraySort = require("array-sort");

export default {
  components: {
    Card
  },
  data() {
    return {
      filteredColours: [],
      size: "small",
      isOrderDropdownActive: false,
      allCards: []
    };
  },
  computed: {
    filteredCards() {
      console.log(this.filteredColours);
      if (!this.filteredColours) {
        return this.allCards;
      }
      const filteredCards = [];
      this.allCards.forEach(card => {
        let value = 0;
        this.filteredColours.forEach(c => {
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
  mounted() {
    this.allCards = jsonData;
  },
  methods: {
    sort(property) {
      this.allCards = arraySort(this.allCards, property);
    },
    toggleOrderDropdown() {
      this.isOrderDropdownActive = !this.isOrderDropdownActive;
    },
    colourCheckboxUpdated(e, ref) {
      if (e.target.checked) {
        this.filteredColours.push(ref);
      } else {
        this.filteredColours = this.filteredColours.filter(el => {
          console.log(el);
          return el !== ref;
        });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
// .title {
//   color: $info;
// }
</style>
