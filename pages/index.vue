<template>
  <section class="container">
    <div
      v-for="(card, id) in cards"
      :key="id"
    >
      <p
        v-for="(prop, id) in card"
        :key="id"
      >
        {{ prop }}
      </p>
    </div>
  </section>
</template>

<script>
import AppLogo from "~/components/AppLogo.vue";
import jsonData from "~/assets/json/cardData.json";

export default {
  components: {
    AppLogo
  },
  data() {
    return {
      cards: null
    };
  },
  mounted() {
    this.cards = jsonData;
  }
};
</script>

<style>
.container {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.title {
  font-family: "Quicksand", "Source Sans Pro", -apple-system, BlinkMacSystemFont,
    "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; /* 1 */
  display: block;
  font-weight: 300;
  font-size: 100px;
  color: #35495e;
  letter-spacing: 1px;
}

.subtitle {
  font-weight: 300;
  font-size: 42px;
  color: #526488;
  word-spacing: 5px;
  padding-bottom: 15px;
}

.links {
  padding-top: 15px;
}
</style>
