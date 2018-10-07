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
      <div 
        class="modal-background"
        @click="confirmModalShow = false"
      />
      <div class="modal-content">
        <div class="box">
          <p class="title">{{ modalTitle }}</p>
          <p class="subtitle">{{ modalSubtitle }}</p>
          <button 
            class="button is-primary"
            @click="confirmSelection">
            {{ modalButtonText }}
          </button>
        </div>
      </div>
      <button 
        class="modal-close is-large"
        @click="confirmModalShow = false"/>
    </div>
    <br>
    <div 
      ref="playerBox"
      class="buttons is-centered">
      <span 
        v-for="player in players"
        :key="player.id"
        :class="[{'is-active': player.id === currentPlayerID}, {'is-loading': player.isLoading}]"
        class="button is-small is-primary is-unselectable"
        @click="currentPlayerID = player.id"
      >
        {{ player.name }}
      </span>
    </div>
    <div 
      :class="{sticky: scrollSticky}"
      class="container">
      <nav class="level is-mobile">
        <OrderDropDown @sort="setCurrentSort($event)"/>
        <div class="level-right">
          <div 
            class="field level-item has-text-centered is-unselectable"
            @click="selectedCardsCheckboxChecked = !selectedCardsCheckboxChecked">
            <input 
              :checked="selectedCardsCheckboxChecked"
              type="checkbox" 
              name="selectedCardsCheckbox" 
              class="switch is-info is-rtl"
            >
            <label 
              class="is-size-6 is-unselectable" 
              for="selectedCardsCheckbox">
              <small>Selected Cards</small>
            </label>
          </div>
        </div>
      </nav>
      <div class="">
        <div 
          v-if="cardsLeft"
          class="buttons is-centered">
          <span
            :disabled="buttonDisabled"
            class="button is-small is-primary"
            @click="passTurnClicked('L')"
          >
            Pass Left
          </span>
          <span
            :disabled="buttonDisabled"
            class="button is-small is-primary"
            @click="passTurnClicked('R')"
          >
            Pass Right
          </span>
        </div>  
        <div 
          v-else-if="getPlayerByID(currentPlayerID).boosters.length > 0"
          class="buttons is-centered"
          @click="nextPackClicked">
          <span
            class="button is-small is-primary"
          >
            Next Pack
          </span>
        </div>
      </div>
    </div>
    <div class="container">
      <br>
      <div v-if="selectedCardsCheckboxChecked">
        <div class="columns is-mobile is-centered">
          <div class="column is-half is-narrow">
            <article 
              v-for="card in selectedCards(currentPlayerID, sortProp)"
              :key="card.id"
              class="media"
            >
              <figure class="image">
                <img
                  :src="card.normalImage"
                  class="image card-selected"
                >
              </figure>
            </article>
          </div>
        </div>
      </div>
      <div v-else> <!-- this should broken down into mobile and desktop components
                        and hidden if breakpoint -->
        <div class="columns is-mobile is-centered">
          <div class="column is-half is-narrow">
            <article 
              v-for="card in getBoosterCards"
              :key="card.id"
              class="media"
              @click="selectCard(card.id);$store.dispatch('draft/logAction')"
            >
              <figure class="image">
                <img
                  :src="card.normalImage"
                  :class="{'card-selected': card.id === selectedCardID}"
                  class="image"
                >
              </figure>
            </article>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import OrderDropDown from "~/components/OrderDropDown.vue";
import { createNamespacedHelpers } from "vuex";
const { mapGetters, mapActions, mapMutations } = createNamespacedHelpers(
  "draft"
);

export default {
  components: {
    OrderDropDown
  },
  data() {
    return {
      userPlayer: 0,
      currentPlayerID: 0,
      selectedCardsCheckboxChecked: false,
      sortProp: "",
      passDirections: [
        { dir: "L", text: "Pass to the Left" },
        { dir: "R", text: "Pass to the Right" }
      ],
      passIDX: 0,
      hasStarted: false,
      errorModalShow: false,
      confirmModalShow: false,
      modalTitle: "",
      modalSubtitle: "",
      modalButtonText: "",
      scrollSticky: false
    };
  },
  computed: {
    getBoosterCards() {
      console.log(this.boosterCards(this.currentPlayerID));
      return this.boosterCards(this.currentPlayerID, this.sortProp);
    },
    buttonDisabled() {
      if (this.cardsLeft && this.boosterCards(this.userPlayer) < 1) {
        return false;
      }
      return !(
        this.selectedCardID !== undefined &&
        this.currentPlayerID === this.userPlayer &&
        this.selectedCardsCheckboxChecked === false
      );
    },
    passDirection() {
      return this.passDirections[this.passIDX];
    },
    cardsLeft() {
      for (let player of this.players) {
        if (this.boosterCards(player.id).length > 0) {
          return true;
        }
      }
      return false;
    },
    selectedCardID: {
      get: function() {
        return this.currentSelectedCard(this.currentPlayerID);
      },
      set: function(cardID) {
        this.setCurrentSelectedCard({
          playerID: this.currentPlayerID,
          cardID: cardID
        });
      }
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
  created() {
    this.gameStart();
  },
  mounted() {
    // this.showPageLoader("Pass to the Left");
    this.userPlayer = 0;
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
    setCurrentSort(sort) {
      this.sortProp = sort;
    },
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
    passTurnClicked(direction) {
      if (this.buttonDisabled) {
        return;
      }
      if (this.currentPlayerID !== this.userPlayer) {
        this.confirmSelection();
        return;
      }
      const filterDir = this.passDirections.filter(
        el => el.dir.toUpperCase() === direction.toUpperCase()
      );
      const { dir } = filterDir[0];
      if (dir.toUpperCase() !== this.passDirection.dir.toUpperCase()) {
        this.errorModalShow = true;
        return;
      }
      this.modalTitle = "Confirm your selection";
      this.modalSubtitle = this.getCardByID(this.selectedCardID).name;
      this.modalButtonText = "Confirm";
      this.confirmModalShow = true;
    },
    confirmSelection() {
      this.passTurn(this.passDirection.dir);
      this.showPageLoader(this.passDirection.text);
      this.confirmModalShow = false;
    },
    nextPackClicked() {
      this.passIDX = this.passIDX * -1 + 1;
      this.nextPack(this.passDirection.dir);
      this.showPageLoader(this.passDirection.text);
    },
    selectCard(cardID) {
      if (this.userPlayer !== this.currentPlayerID) {
        return;
      }
      if (this.selectedCardID === cardID) {
        this.selectedCardID = undefined;
      } else {
        this.selectedCardID = cardID;
      }
    },
    ...mapMutations(["setCurrentSelectedCard"]),
    ...mapActions(["gameStart", "CPUSelectCard", "passTurn", "nextPack"])
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


.button
  border-color: $vapor-green;

.card-selected
  box-shadow: 0px 0px 10px 4px $vapor-green-75
  border-radius: 5px;

.sticky
  background-color: #fff
  position: fixed;
  top: 57px;
  z-index: 10;
</style>
