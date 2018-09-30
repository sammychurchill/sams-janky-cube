<template>
  <div class="rootDiv">
    <div 
      :class="{ 'is-active': dropDownActive }"
      class="dropdown">
      <div class="dropdown-trigger">
        <button 
          class="button" 
          aria-haspopup="true" 
          @click="dropDownActive = !dropDownActive"
        >
          <span>Order By</span>
          <span class="icon is-small">
            <i 
              class="fas fa-angle-down" 
              aria-hidden="true"/>
          </span>
        </button>
      </div>
      <div 
        id="dropdown-menu4" 
        class="dropdown-menu" 
        role="menu">
        <div class="dropdown-content">
          <div class="dropdown-item">
            <a
              @click="dropDownItemClicked('name')"
            >
              Name
            </a>
          </div>
          <div class="dropdown-item">
            <a
              @click="dropDownItemClicked('rarity')"
            >
              Rarity
            </a>
          </div>
          <div class="dropdown-item">
            <a
              @click="dropDownItemClicked('cmc')"
            >
              Mana Cost
            </a>
          </div>
          <div class="dropdown-item">
            <a
              @click="dropDownItemClicked('colours')"
            >
              Colour
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      dropDownActive: false
    };
  },
  methods: {
    dropDownItemClicked(name) {
      this.dropDownActive = false;
      this.$emit("sort", name);
    }
  }
};
</script>

<style scoped>
.rootDiv {
  padding-bottom: 3%;
}
</style>
