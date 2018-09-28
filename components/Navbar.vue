<template>
  <section>
    <nav class="navbar is-fixed-top">
      <div class="navbar-brand">
        <a 
          class="navbar-item"
        >
          <img 
            src="http://bulma.io/images/bulma-logo.png" 
            alt="Bulma: a modern CSS framework based on Flexbox" 
            width="112" 
            height="28">
        </a>
      </div>

      <div 
        id="navMenubd-example" 
        class="navbar-menu"
      >
        <div class="navbar-start">
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
        <div class="navbar-end" />
      </div>
    </nav>
  </section>
</template>
<script>
</script>
<style>
</style>
