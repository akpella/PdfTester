<template>
	<div ref="lottieContainer"></div>
  </template>
  
  <script>
  import lottie from 'lottie-web';
  
  export default {
	name: 'LottieAnimation',
  
	mounted() {
	  this.loadAnimation();
	},
  
	methods: {
	  loadAnimation() {
		const container = this.$refs.lottieContainer;
		const options = {
		  container: container,
		  path: 'src/assets/lottie/92393-moon.json',
		  loop: true,
		  autoplay: true,
		};
  
		const animation = lottie.loadAnimation(options);
		animation.setSpeed(0.5);
		animation.setSubframe(false);
  
		if (animation.setLocationHref) {
		  animation.setLocationHref(window.location.href);
		}
	  },
	},
  };
  </script>