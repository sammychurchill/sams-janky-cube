<template>
  <div class="dropdown is-hoverable">
    <div class="dropdown-trigger">
      <button 
        class="button" 
        aria-haspopup="true" 
        aria-controls="dropdown-menu4">
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
            @click="sort('name'); burgerActive = !burgerActive"
          >
            Name
          </a>
        </div>
        <div class="dropdown-item">
          <a
            @click="sort('rarity'); burgerActive = !burgerActive"
          >
            Rarity
          </a>
        </div>
        <div class="dropdown-item">
          <a
            @click="sort('cmc'); burgerActive = !burgerActive"
          >
            Mana Cost
          </a>
        </div>
        <div class="dropdown-item">
          <a
            @click="sort('colours'); burgerActive = !burgerActive"
          >
            Colour
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style scoped>
.dropdown {
  padding-bottom: 3%;
}
</style>
