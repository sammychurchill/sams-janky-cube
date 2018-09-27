<template>
  <section>
    <h2>
      {{ card.name }} 
    </h2>
    <img 
      :src="card.smallImage"
    >
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
<style lang="scss" scoped>
</style>
