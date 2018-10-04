<template>
  <section class="section">
    <div class="container">
      <template v-if="isStarted">
        <DraftStarted />
      </template>
      <template v-else>
        <DraftInit 
          @start="currentPlayer = currentPlayer"
        />
      </template>
    </div>
  </section>
</template>

<script>
import DraftInit from "~/components/DraftInit.vue";
import DraftStarted from "~/components/DraftStarted.vue";
import { createNamespacedHelpers } from "vuex";
const { mapGetters } = createNamespacedHelpers("draft");

export default {
  components: {
    DraftInit,
    DraftStarted
  },
  computed: {
    ...mapGetters(["isStarted"])
  }
  // methods: {
  //   ...mapMutations()
  // }
};
</script>

<style scoped>
.container {
  padding-top: 10px;
}
</style>
