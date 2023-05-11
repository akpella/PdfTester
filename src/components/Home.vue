<template>
    <div class="bg-space-bg bg-cover w-[100vw] h-[100vh]">
        <div class="flex items-center justify-center h-screen flex-col">
            <div class="mb-6">
                <span class="font-extrabold text-white text-5xl">PDF Order 66</span>
            </div>
            <div class="flex w-1/2 items-center justify-center">
                <router-link class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-auto mr-5" to="/template">
                    Create Template
                </router-link>
                <router-link class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-auto mr-5" to="/test">
                    Validate PDFs
                </router-link>
            </div>
        </div>
    </div>
    <router-view></router-view>
</template>

<script setup>

</script>