<template>
  <div class="rootDiv">
    <div 
      :class="{ 'is-active': dropDownActive }"
      class="dropdown">
      <div class="dropdown-trigger">
        <button 
          class="button is-info is-small"
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

<style lang="sass" scoped>
@import "~/assets/vars.sass"

// .button
//   box-shadow: 0px 0px 0px 1px $vapor-purple-75  

</style>
