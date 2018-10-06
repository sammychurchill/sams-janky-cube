<template>
  <div>
    <div 
      ref="pageloader"
      class="pageloader">
      <span 
        ref="pageLoaderText" 
        class="title">Pass to the Left</span>
    </div>
    <div
      :class="{'is-active': errorModalShow}"
      class="modal"
    >
      <div class="modal-background"/>
      <div class="modal-content">
        <div class="box">
          <p class="title">Ooof</p>
          <br>
          <p class="subtitle">You knob, </p>
          <p>we are passing the other way!</p>
        </div>
      </div>
      <button 
        class="modal-close is-large"
        @click="errorModalShow = false"/>
    </div>
    <div
      :class="{'is-active': confirmModalShow}"
      class="modal"
    >
      <div class="modal-background"/>
      <div class="modal-content">
        <div class="box">
          <p class="title">Confirm your selection</p>
          <p class="subtitle">fleshbag</p>
          <button class="button is-primary">Confirm</button>
        </div>
      </div>
      <button 
        class="modal-close is-large"
        @click="confirmModalShow = false"/>
    </div>
    <br>
    <div class="buttons is-centered">
      <span 
        v-for="player in players"
        :key="player.id"
        :class="[{'is-active': player.id === currentPlayerID}, {'is-loading': player.isLoading}]"
        class="button is-small is-primary is-unselectable"
        @click="currentPlayerID = player.id; hoveredCardID = null"
      >
        {{ player.name }}
      </span>
    </div>
    <div class="container">
      <div 
        class="field"
        @click="selectedCardsCheckboxChecked = !selectedCardsCheckboxChecked">
        <input 
          :checked="selectedCardsCheckboxChecked"
          type="checkbox" 
          name="selectedCardsCheckbox" 
          class="switch is-small is-rtl is-unselectable"
        >
        <label for="selectedCardsCheckbox is-unselectable">Selected Cards</label>
      </div>
      <transition name="fade">
        <div @click="hoveredCardID = null">
          <img 
            v-if="hoveredCardID" 
            :src="getCardByID(hoveredCardID).smallImage"
            height="300"
            width="100"
          >
        </div>
      </transition>
      <div v-if="selectedCardsCheckboxChecked">
        <p
          v-for="card in selectedCards(currentPlayerID)"
          :key="card.id"
          :class="{'has-text-weight-semibold': hoveredCardID === card.id}"
          class="subtitle is-size-7 is-unselectable card-list-item"
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
          class="is-size-6 is-unselectable card-list-item"
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
          <span
            class="is-size-7"
          >
            {{ card.type_line }}
          </span>
          <br>
        </span>
      </div>
    </div>
    <div class="container footer-button">
      <div 
        v-if="boosterCards(userPlayer).length > 0"
        class="buttons is-centered">
        <span
          :disabled="buttonDisabled"
          class="button is-small is-primary"
          @click="passTurn('L')"
        >
          Pass Left
        </span>
        <span
          :disabled="buttonDisabled"
          class="button is-small is-primary"
          @click="passTurn('R')"
        >
          Pass Right
        </span>
      </div>  
      <div 
        v-else-if="getPlayerByID(currentPlayerID).boosters.length > 0"
        class="buttons is-centered">
        <span
          :disabled="buttonDisabled"
          class="button is-small is-primary"
        >
          Next Pack
        </span>
      </div>
    </div>
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
      passDirections: [
        { dir: "L", text: "Pass to the Left" },
        { dir: "R", text: "Pass to the Right" }
      ],
      passIDX: 0,
      hasStarted: false,
      errorModalShow: false,
      confirmModalShow: false
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
    passDirection() {
      return this.passDirections[this.passIDX];
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
    this.showPageLoader("Pass to the Left");
    this.userPlayer = 1;
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
    showPageLoader(text) {
      const pageloader = this.$refs.pageloader;
      if (pageloader) {
        this.$refs.pageLoaderText.innerText = text;
        pageloader.classList.toggle("is-active");
        const pageloaderTimeout = setTimeout(function() {
          pageloader.classList.toggle("is-active");
          clearTimeout(pageloaderTimeout);
        }, 3000);
      }
    },
    passTurn(direction) {
      const filterDir = this.passDirections.filter(
        el => el.dir.toUpperCase() === direction.toUpperCase()
      );
      const { dir } = filterDir[0];
      if (dir.toUpperCase() !== this.passDirection.dir.toUpperCase()) {
        this.errorModalShow = true;
        return;
      }
      this.confirmModalShow = true;
      // this should be in next turn()
      // this.passIDX = this.passIDX * -1 + 1; // for when no more boosters
      // this.showPageLoader(text);
    },
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

<style scoped lang="sass">
@import "~/assets/vars.sass"

.fade-enter-active,
.fade-leave-active 
  transition: opacity 0.5s;

.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ 
  opacity: 0;


.navbar-brand 
  margin-left: 15%;
  margin-bottom: 10%;


.button.is-small
  border-color: $vapor-green;

.footer-button
  margin-top: 25%

.card-list-item
  margin-top: 5px
  margin-bottom: 5px
</style>
