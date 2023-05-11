<template>
    <PdfImage :url="urlPath" @successfulLoaded="successfulLoaded" v-if="urlPath"/>
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
    <img :src="imageSample" />
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';
import Tesseract from 'tesseract.js';
import { createWorker } from 'tesseract.js';
import PdfImage from './PdfImage.vue';
import { stringSimilarity } from "string-similarity-js";

onMounted(() => {
    localStorage.clear();
});

const isDisabled = ref(false);
const isLoading = ref(false);
const templatePages = ref([]);
const jsonData = ref({});
const page = ref(1);
const imageSample = ref("");
const urlPath = ref("")

const runValidator = async () => {
    isLoading.value = true;

    const worker = await createWorker();

    await worker.loadLanguage('eng');
    await worker.initialize('eng');
    await worker.setParameters({
            tessedit_ocr_engine_mode: Tesseract.TESSERACT_ONLY,
            tessedit_pageseg_mode: Tesseract.SINGLE_WORD
        })

    for (let page = 0; page < templatePages.value.length; page++) {
        const testCases = templatePages.value[page].testCase;
        for (let testCase = 0; testCase < testCases.length; testCase++) {
            const { expectedValue, coordinates, similarityPercentage } = testCases[testCase];

            const { data: { text } } = await worker.recognize(imageSample.value, { rectangle: { ...coordinates } });
            if (expectedValue.trim() == text.trim()) {
                console.log(`expected value: ${expectedValue} - text ${text} is equal`);
            } else if ( stringSimilarity(expectedValue.trim(), text.trim()) * 100 >= similarityPercentage ) {
                console.log(`string similarity: ${stringSimilarity(expectedValue.trim(), text.trim()) * 100}%`)
                console.log(`expected value: ${expectedValue} - text ${text} is equal`);
            } else {
                console.log(`expected value: ${expectedValue} - text ${text} is not equal`);
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
    var path = (window.URL || window.webkitURL).createObjectURL(event.target.files[0]);

    urlPath.value = path;
}

const successfulLoaded = () => {
    imageSample.value = localStorage.getItem('page-0');
}
</script>