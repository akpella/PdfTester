<template>
    <div>
        <input type="file" ref="pdfs" accept="application/pdf" multiple style="display: none" @change="processPdfs" />
        <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-auto mr-2"
            @click="$refs.pdfs.click()">
            Upload PDFs
        </button>
        <input type="file" ref="template" accept="application/json" style="display: none" @change="processTemplate" />
        <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-auto mr-2"
            @click="$refs.template.click()">
            Upload Template
        </button>
        <button class="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded w-fit" type="button" @click="runValidator"
            :disabled="isLoading || isDisabled">
            <div class="flex items-center" v-if="isLoading">
                <svg class="animate-spin mr-1 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none"
                    viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                    </path>
                </svg>
                Processing...
            </div>
            <div v-else>
                Run
            </div>
        </button>
    </div>
    <div v-if="Object.keys(jsonData).length">
        <div>
            <label for="templateName">Name:</label>
            <input id="templateName" v-model="jsonData.name">
            <label for="version">Version:</label>
            <input id="version" v-model="jsonData.version">
            <label for="version">Page:</label>
            <input id="pageNumber" v-model="page">
        </div>
        <div v-for="data in jsonData.pages[page - 1].testCase" v-bind:key="data.id">
            <span>Coordinates: width: {{ data.coordinates.width }} | height: {{ data.coordinates.height }} | left: {{
                data.coordinates.left }} | top: {{ data.coordinates.top }}</span>
            <label for="expectedValue">Expected Value:</label>
            <input id="expectedValue" v-model="data.expectedValue">
        </div>
    </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';
import Tesseract from 'tesseract.js';
import { createWorker } from 'tesseract.js';

const isDisabled = ref(false);
const isLoading = ref(false);
const baseUrl = ref(window.location.host);
const rectangleOption = ref({
    left: 19,
    top: 34,
    width: 222,
    height: 50,
});
const templatePages = ref([]);
const jsonData = ref({});
const page = ref(1);

const runValidator = async () => {
    isLoading.value = true;

    const worker = await createWorker();

    await worker.loadLanguage('eng');
    await worker.initialize('eng');

    for (let page = 0; page < templatePages.value.length; page++) {
        const testCases = templatePages.value[page].testCase;
        for (let testCase = 0; testCase < testCases.length; testCase++) {
            const { expectedValue, coordinates } = testCases[testCase];
            const { data: { text } } = await worker.recognize("http://localhost:5173/assets/pdf-images/image1/sample-payslip.png", { rectangle: { ...coordinates } });

            if (expectedValue.trim() == text.trim()) {
                console.log(`element value: ${expectedValue} - text ${text} is equal`);
            } else {
                console.log(`element value: ${expectedValue} - text ${text} is not equal`);
            }
        }
    }

    await worker.terminate();
    isLoading.value = false;
}

const processTemplate = (event) => {
    var reader = new FileReader();
    reader.onload = onReaderLoad;
    reader.readAsText(event.target.files[0]);
};

const onReaderLoad = (event) => {
    var obj = JSON.parse(event.target.result);

    if (Object.keys(obj).length) {
        templatePages.value = obj.pages;
        jsonData.value = obj;
    }
};

const processPdfs = (event) => {
  console.log(event.target.files[0]);
}
</script>