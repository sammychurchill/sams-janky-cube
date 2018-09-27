<template>
    <section class="section">
        <div class="container">
            <div 
                class="dropdown is-pulled-right"
                :class="{ 'is-active': isOrderDropdownActive }"
            >
                <div class="dropdown-trigger">
                    <button class="button" aria-haspopup="true" aria-controls="dropdown-menu"
                        @click="toggleOrderDropdown"
                    >
                    <span>Sort By</span>
                    <span class="icon is-small">
                        <i class="fas fa-angle-down" aria-hidden="true"></i>
                    </span>
                    </button>
                </div>
                <div class="dropdown-menu" id="dropdown-menu" role="menu">
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
                            @click="sort('colour'); toggleOrderDropdown()"
                        >
                            <span style="text-decoration: line-through">Colours</span>
                        </a>
                    </div>
                </div>
            </div>
            <!-- <a @click="sort('cmc')">cmc</a> -->
            <Card
                v-for="(card, id) in cards"
                :key="id"
                :card="card"
                class="title"
            />
        </div>
    </section>
</template>

<script>
import Card from '~/components/Card.vue'
var json = require('~/assets/json/cardData.json')
var arraySort = require('array-sort');

export default {
  components: {
    Card
  },
  data() {
      return {
          cards: null,
          size: 'small',
          isOrderDropdownActive: false
      }
  },
  mounted() {
      this.cards = json;
  },
  updated() {
      console.log(this.cards)
  },
  methods: {
      sort(property) {
          if (property === 'colour'){
              this.cards = arraySort(this.cards, property[0]);
          } else {
            this.cards = arraySort(this.cards, property);
          }
      },
      toggleOrderDropdown() {
          this.isOrderDropdownActive = !this.isOrderDropdownActive;
      }
  }
}
</script>

<style lang="scss" scoped>
// .title {
//   color: $info;
// }
</style>

