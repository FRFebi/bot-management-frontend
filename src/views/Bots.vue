<template>
  <div class="bots">
    <div class="header-section">
      <h2>Bot Management</h2>
      <button class="btn">Add New Bot</button>
    </div>

    <div class="card">
      <h3>Your Bots</h3>
      <p>No bots configured yet. Click "Add New Bot" to get started.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
// Bot management component
</script>

<style scoped>
.bots h2 {
  color: #333;
}

.header-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.card h3 {
  margin: 0 0 1rem 0;
  color: #555;
}
</style>