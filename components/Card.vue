<template>
  <section>
    <div class="content">
      <a 
        :href="card.gatherer_uri" 
        class="is-black"
        target="_blank">
        {{ card.name }} 
      </a>
      <br>
      <img 
        :src="card.smallImage"
      >
    </div>
  </section>
</template>
<script>
export default {
  props: {
    card: {
      required: true,
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {};
  },
  mounted() {}
};
</script>
<style scoped>
a {
  padding-bottom: 10%;
}
</style>
