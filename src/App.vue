<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <div class="container pb-24">
    <LottieAnimation class="rocket-lottie"/>
    <div class="nav-container py-8 flex justify-between z-10 relative">
      <div class="title text-2xl font-semibold">PDF Order 66</div>
      <nav class="nav-items flex items-center space-x-8 text-lg">
        <div class="nav-item hover:text-blue-500"><RouterLink to="/">Home</RouterLink></div>
        <div class="nav-item hover:text-blue-500"><RouterLink to="/template">Create a template</RouterLink></div>
        <div class="nav-item hover:text-blue-500"><RouterLink to="/test">Validate my PDF</RouterLink></div>
      </nav>
    </div>
    <div class="flex items-center flex-col pt-8 pb-4">
			<div class="text-center mb-6">
				<div class="font-semibold text-xl pb-2 text-blue-600">Create. Upload. Validate.</div>
				<div class="text-5xl font-semibold">What would you like to do?</div>
			</div>
			<div class="actions flex items-center justify-center pt-8 space-x-8">
				<div
					@click="$router.push({ name: 'MainCrop' })"
          :class="{ 'bg-blue-100 hover:bg-blue-100 text-blue-800 hover:text-blue-800': $route.name === 'MainCrop' }"
					class="action max-h-8 cursor-pointer px-3 py-1 text-blue-600 hover:bg-blue-100 flex space-x-1"
				>
					<div>
						<svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="1" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
							<path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"></path>
						</svg>
					</div>
					<div>Create a template</div>
				</div>
				<div
					@click="$router.push({ name: 'Tesseract' })"
					class="action max-h-8 cursor-pointer px-3 py-1 text-blue-600 hover:bg-blue-100 flex space-x-1"
				>
					<div>
						<svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="1" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
							<path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m5.231 13.481L15 17.25m-4.5-15H5.625c-.621 0-1.125.504-1.125 1.125v16.5c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9zm3.75 11.625a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"></path>
						</svg>
					</div>
					<span>Validate my PDF</span>
				</div>
			</div>
		</div>
    <div
      v-if="$route.name !== 'Home'"
      class="bg-white border-t-8 border-blue-100 rounded-md p-8 mt-4 relative z-10"
    >
      <RouterView/>
    </div>
  </div>
</template>

<script>
import LottieAnimation from './components/LottieAnimation.vue';

export default {
  name: 'App',
  components: {
    LottieAnimation,
  },
};
</script>

<style lang="scss" scoped>
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
.container {
  margin: auto;
  &.nav {
    display: block;
  }
}
.nav-item {
  text-decoration: none;
  transition: 0.4s;
}
.rocket-lottie {
  position: absolute;
  right: -200px;
  width: 800px;
  top: 20px;
}
</style>
