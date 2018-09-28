<template>
  <section>
    <nav class="navbar is-light">
      <div class="navbar-brand">
        <a 
          class="navbar-item"
        >
          <img
            class="logo"
            src="~/assets/sjc-icon.png" 
            alt="Jank AF">
        </a>
        <nuxt-link
          class="navbar-item"
          to="/"
        >
          home
        </nuxt-link>

        <nuxt-link
          class="navbar-item"
          to="/cards"
        >
          cards
        </nuxt-link>
      </div>

      <div
        class="navbar-menu"
      >
        <div class="navbar-start"/>
        <div class="navbar-end" />
      </div>
    </nav>
  </section>
</template>
<script>
</script>
<style scoped>
.logo {
  padding-left: 7%;
}
</style>
