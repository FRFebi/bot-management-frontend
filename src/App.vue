<template>
  <div id="app">
    <header class="header">
      <h1>Bot Management Dashboard</h1>
      <nav>
        <router-link to="/">Dashboard</router-link>
        <router-link to="/bots">Bots</router-link>
      </nav>
    </header>

    <main class="main">
      <router-view />
    </main>
  </div>
</template>

<script setup lang="ts">
// Main app component for Bot Management Dashboard
</script>

<style scoped>
.header {
  background: #1a1a1a;
  color: white;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header h1 {
  margin: 0;
  font-size: 1.5rem;
}

.header nav {
  display: flex;
  gap: 1rem;
}

.header nav a {
  color: white;
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.header nav a:hover,
.header nav a.router-link-active {
  background-color: #333;
}

.main {
  padding: 2rem;
  min-height: calc(100vh - 80px);
}
</style>