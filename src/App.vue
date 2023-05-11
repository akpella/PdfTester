<script setup>
import MainCrop from './components/MainCrop.vue'
import Tesseract from './components/Tesseract.vue'
import Home from './components/Home.vue';
import PdfImage from './components/PdfImage.vue';
</script>

<template>
  <!-- <MainCrop />
  <Tesseract /> -->
  <Home />
  <PdfImage />
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
