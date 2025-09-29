<template>
  <div class="dashboard">
    <h2>Bot Management Dashboard</h2>

    <div class="stats-grid">
      <div class="card">
        <h3>Total Bots</h3>
        <p class="stat-number">0</p>
      </div>

      <div class="card">
        <h3>Active Bots</h3>
        <p class="stat-number">0</p>
      </div>

      <div class="card">
        <h3>Scheduled Tasks</h3>
        <p class="stat-number">0</p>
      </div>

      <div class="card">
        <h3>Last Run</h3>
        <p class="stat-text">Never</p>
      </div>
    </div>

    <div class="card">
      <h3>Recent Activity</h3>
      <p>No recent activity to display.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
// Dashboard overview component
</script>

<style scoped>
.dashboard h2 {
  margin-bottom: 2rem;
  color: #333;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

.stat-number {
  font-size: 2rem;
  font-weight: bold;
  color: #007bff;
  margin: 0.5rem 0;
}

.stat-text {
  font-size: 1.2rem;
  color: #666;
  margin: 0.5rem 0;
}

.card h3 {
  margin: 0 0 0.5rem 0;
  color: #555;
}
</style>