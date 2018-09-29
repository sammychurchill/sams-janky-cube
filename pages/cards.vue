<template>
  <section class="section">
    <div class="container">
      <div class="columns">
        <div class="column is-one-third">
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
            <p>Nubmer of cards: {{ numAllCards }}</p>
            <p>Displayed Cards: {{ numFilteredCards }}</p>
          </div>
        </div> 
      </div>
      <OrderDropDown @sort="setCurrentSort($event)"/>
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
import Card from "~/components/Card.vue";
import OrderDropDown from "~/components/OrderDropDown.vue";
import { mapGetters, mapMutations } from "vuex";

export default {
  components: {
    Card,
    OrderDropDown
  },
  data() {
    return {
      size: "small",
      isOrderDropdownActive: false
    };
  },
  computed: {
    ...mapGetters([
      "selectedColours",
      "cards",
      "numAllCards",
      "numFilteredCards"
    ])
  },
  mounted() {
    this.selectedColours.forEach(colour => {
      this.$refs[colour].checked = true;
    });
  },
  methods: {
    toggleOrderDropdown() {
      this.isOrderDropdownActive = !this.isOrderDropdownActive;
    },
    colourCheckboxUpdated(e, ref) {
      console.log(e);
      if (e.target.checked) {
        this.addColour(ref);
      } else {
        this.removeColour(ref);
      }
    },
    setCurrentSort(e) {
      this.sortCards(e);
    },
    ...mapMutations(["addColour", "sortCards", "removeColour"])
  }
};
</script>

<style lang="scss" scoped>
</style>
