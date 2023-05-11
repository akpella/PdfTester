<template>
    <div>
        {{ hello }}
    </div>
</template>

<script setup>
import {ref, onMounted} from 'vue'

const hello = ref("Hello World");

onMounted(() => {
    // Triggered when page loaded
    console.log(hello.value);
});

</script>