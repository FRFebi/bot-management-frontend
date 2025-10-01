<template>
  <div class="profile-page">
    <h2>My Profile</h2>
    <UserProfile />
  </div>
</template>

<script setup lang="ts">
import UserProfile from '../components/UserProfile.vue'
</script>

<style scoped>
.profile-page h2 {
  margin-bottom: 2rem;
  color: #333;
}
</style>
