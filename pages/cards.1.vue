<template>
  <section class="section">
    <div class="container">
      <nav class="navbar">
        <div class="navbar-brand">
          <a 
            class="navbar-item"
          />
          <a 
            :class="{ 'is-active': burgerActive }"
            class="navbar-burger"
            role="button"
            data-target="navbarExampleTransparentExample"
            @click="burgerActive = !burgerActive"
          >
            <span/>
            <span/>
            <span/>
          </a>
        </div>
        <div 
          :class="{ 'is-active': burgerActive }"
          class="navbar-menu"
        >
          <!-- <div class="navbar-start" /> -->
          <div class="navbar-end">
            <div class="navbar-item has-dropdown is-hoverable">
              <a 
                class="navbar-link"
              >
                Order By
              </a>
              <div class="navbar-dropdown is-boxed">
                <a 
                  class="navbar-item"
                  @click="sort('name'); burgerActive = !burgerActive"
                >
                  Name
                </a>
                <a 
                  class="navbar-item"
                  @click="sort('rarity'); burgerActive = !burgerActive"
                >
                  Rarity
                </a>
                <a 
                  class="navbar-item"
                  @click="sort('cmc'); burgerActive = !burgerActive"
                >
                  Mana Cost
                </a>
                <a 
                  class="navbar-item"
                  @click="sort('colours'); burgerActive = !burgerActive"
                >
                  Colour
                </a>
              </div>
            </div>
          </div>
        </div>
      </nav>
      <div class="columns">
        <div class="column is-one-quarter">
          <h3>Filter selected colours</h3>
          <nav class="level is-mobile">
            <div class="level-item">
              <label class="checkbox">
                <input 
                  ref="W" 
                  type="checkbox"
                  @change="colourCheckboxUpdated($event, 'W')"
                >
                W
              </label>
            </div>
            <div class="level-item">
              <label class="checkbox">
                <input 
                  ref="R" 
                  type="checkbox"
                  @change="colourCheckboxUpdated($event, 'R')"
                >
                R
              </label>
            </div>
            <div class="level-item">
              <label class="checkbox">
                <input 
                  ref="G" 
                  type="checkbox"
                  @change="colourCheckboxUpdated($event, 'G')"
                >
                G
              </label>
            </div>
            <div class="level-item">
              <label class="checkbox">
                <input 
                  ref="U" 
                  type="checkbox"
                  @change="colourCheckboxUpdated($event, 'U')"
                >
                U
              </label>
            </div>
            <div class="level-item">
              <label class="checkbox">
                <input 
                  ref="B" 
                  type="checkbox"
                  @change="colourCheckboxUpdated($event, 'B')"
                >
                B
              </label>
            </div>
            <div class="level-item">
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
        <div class="column">
          <div class="is-pulled-right">
            <h3 class="">Stats:</h3>
            <p>Nubmer of cards: {{ allCards.length }}</p>
            <p>Displayed Cards: {{ filteredCards.length }}</p>
          </div>
        </div>
      </div>
      <Card
        v-for="(card, id) in filteredCards"
        :key="id"
        :card="card"
        class="title"
      />
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
      allCards: [],
      burgerActive: false
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
