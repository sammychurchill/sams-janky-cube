<template>
  <div>
    <div 
      ref="pageloader" 
      class="pageloader">
      <span class="title">Pass to the Left</span>
    </div>
    <div class="field has-addons">
      <p
        v-for="player in players"
        :key="player.id" 
        class="control"
      >
        <a 
          :class="[{'is-active': player.id === currentPlayerID}, {'is-loading': player.isLoading}]"
          class="button is-primary is-small"
          @click="currentPlayerID = player.id; hoveredCardID = null"
        >
          {{ player.name }}
        </a>
      </p>
    </div>
    <div 
      class="field"
      @click="selectedCardsCheckboxChecked = !selectedCardsCheckboxChecked">
      <input 
        :checked="selectedCardsCheckboxChecked"
        type="checkbox" 
        name="selectedCardsCheckbox" 
        class="switch is-small is-rtl"
      >
      <label for="selectedCardsCheckbox">Selected Cards</label>
    </div>
    <div class="columns is-mobile">
      <div 
        class="column is-three-fifths-mobile is-one-quarter-desktop"
      >
        <div v-if="selectedCardsCheckboxChecked">
          <p
            v-for="card in selectedCards(currentPlayerID)"
            :key="card.id"
            :class="{'has-text-weight-semibold': hoveredCardID === card.id}"
            class="subtitle is-size-7"
            @mouseover="hoveredCardID = card.id"
          >
            {{ card.name }}
          </p>
        </div>
        <div v-else>
          <span
            v-for="card in boosterCards(currentPlayerID)"
            :key="card.id"
            :class="{'has-text-weight-semibold': hoveredCardID === card.id}"
            class="subtitle is-size-7"
            @mouseover="hoveredCardID = card.id"
            @click="selectCard(card.id);$store.dispatch('draft/logAction')"
          >
            <span 
              v-if="currentSelectedCard(currentPlayerID) === card.id"
              class="icon"
            >
              <i class="fas fa-star"/>
            </span>
            {{ card.name }}
            <br>
          </span>
        </div>
      </div>
      <div class="column">
        <transition name="fade">
          <div @click="hoveredCardID = null">
            <img 
              v-if="hoveredCardID" 
              :src="getCardByID(hoveredCardID).normalImage"
              height="400"
              width="200"
            >
          </div>
        </transition>
      </div>
    </div>
    <nav 
      class="navbar is-fixed-bottom"
    >
      <div class="navbar-brand">
        <div class="navbar-item">
          <a 
            :disabled="buttonDisabled"
            class="button is-primary"
          >
            Pass Left
          </a>
        </div>
        <div class="navbar-item">
          <a
            :disabled="buttonDisabled"
            class="button is-primary"
          >
            Pass Right
          </a>
        </div>
      </div>
    </nav>
  </div>
</template>

<script>
import { createNamespacedHelpers } from "vuex";
const { mapGetters, mapActions, mapMutations } = createNamespacedHelpers(
  "draft"
);

export default {
  data() {
    return {
      userPlayer: null,
      currentPlayerID: 1,
      hoveredCardID: null,
      selectedCardID: null,
      selectedCardsCheckboxChecked: false,
      passDirection: "l",
      hasStarted: false
    };
  },
  computed: {
    buttonDisabled() {
      return !(
        this.selectedCardID !== null &&
        this.currentPlayerID === this.userPlayer &&
        this.selectedCardsCheckboxChecked === false
      );
    },
    ...mapGetters([
      "players",
      "boosterCards",
      "selectedCards",
      "getCardByID",
      "getPlayerByID",
      "currentSelectedCard",
      "playerIsLoading"
    ])
  },
  watch: {
    currentPlayerID() {
      const selectedCard = this.currentSelectedCard(this.currentPlayerID);
      if (selectedCard) {
        this.hoveredCardID = selectedCard;
      }
    }
  },
  mounted() {
    const pageloader = this.$refs.pageloader;
    if (pageloader) {
      pageloader.classList.toggle("is-active");
      const pageloaderTimeout = setTimeout(function() {
        pageloader.classList.toggle("is-active");
        clearTimeout(pageloaderTimeout);
      }, 3000);
    }
    this.userPlayer = 1;
    // this.$store.dispatch("draft/CPUSelectCard", 5);
    if (!this.hasStarted) {
      this.hasStarted = true;
      for (let player of this.players) {
        if (player.playerType !== "human") {
          this.CPUSelectCard(player.id);
        }
      }
    }
  },
  methods: {
    selectCard(cardID) {
      if (this.selectedCardID === cardID) {
        this.selectedCardID = null;
        this.hoveredCardID = null;
      } else {
        this.hoveredCardID = cardID;
        this.selectedCardID = cardID;
      }
      if (this.userPlayer === this.currentPlayerID) {
        this.setCurrentSelectedCard({
          playerID: this.currentPlayerID,
          card: this.getCardByID(this.selectedCardID)
        });
      }
    },
    ...mapMutations(["setCurrentSelectedCard"]),
    ...mapActions(["CPUSelectCard"])
  }
};
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}

.navbar-brand {
  margin-left: 15%;
  margin-bottom: 10%;
}
</style>
