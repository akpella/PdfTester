<template>
  <div>
    <Cropper
      class="h-[600px]"
      :src="img"
      @change="change"
    ></Cropper>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Cropper } from 'vue-advanced-cropper'
import 'vue-advanced-cropper/dist/style.css';

const props = defineProps({
  msg: String,
})

const img = ref("http://localhost:5173/assets/pdf-images/image1/sample-payslip.png")
const sel = ref({})
const option = ref({})

const change = ({ coordinates, canvas }) => {
  console.log(coordinates, canvas);
};
</script>