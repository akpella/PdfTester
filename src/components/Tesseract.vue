<template>
    <div>
        <PdfImage :url="urlPath" @successfulLoaded="successfulLoaded" v-if="urlPath" />
        <div>
            <div class="flex justify-between">
                <div class="w-2/5">
                    <div class="pb-12">
                        <div class="text-xl pb-4">
                            <span><strong>Select the PDF for validation</strong></span>
                        </div>
                        <div>
                            <input type="file" ref="pdfs" accept="application/pdf" multiple style="display: none" @change="processPdfs" />
                            <button class="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded w-auto mr-2"
                                @click="$refs.pdfs.click()">
                                Select your PDF
                            </button>
                        </div>
                    </div>
                    <div class="pb-8">
                        <div class="text-xl pb-4">
                            <span><strong>Select template validator</strong></span>
                        </div>
                        <div>
                            <input type="file" ref="template" accept="application/json" style="display: none" @change="processTemplate" />
                            <button
                                class="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded w-auto mr-2"
                                @click="$refs.template.click()"
                            >
                                Select your JSON
                            </button>
                        </div>
                    </div>
                    <div class="pb-12" v-if="Object.keys(jsonData).length">
                        <div class="text-lg pb-3">Template details</div>
                        <div>Name: {{ jsonData.name }}</div>
                        <div>Version: {{ jsonData.version }}</div>
                        <div class="space-y-3">
                            <div class="pt-2">Test cases:</div>
                                <div
                                    v-for="data in jsonData.pages[page - 1].testCase"
                                    v-bind:key="data.id"
                                    class="shadow-sm border my-2 p-4 rounded-lg"
                                >
                                <div class="flex space-x-4 pb-2">
                                    <div>
                                        <span class="block text-gray-700 text-xs">Width</span>
                                        <p>{{ data.coordinates.width }}</p>
                                    </div>
                                    <div>
                                        <span class="block text-gray-700 text-xs">Height</span>
                                        <p>{{ data.coordinates.height }}</p>
                                    </div>
                                    <div>
                                        <span class="block text-gray-700 text-xs">Top</span>
                                        <p>{{ data.coordinates.top }}</p>
                                    </div>
                                    <div>
                                        <span class="block text-gray-700 text-xs">Left</span>
                                        <p>{{ data.coordinates.width }}</p>
                                    </div>
                                </div>
                                <div>
                                    <span class="block text-gray-700 text-xs">Expected value</span>
                                    <p>{{ data.expectedValue }}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <button
                        class="text-xl bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full disabled:bg-red-300"
                        @click="runValidator"
                        :disabled="isLoading || isDisabled"
                    >
                        <div class="flex justify-center" v-if="isLoading">
                            <div class="flex items-center space-x-2">
                                <svg class="animate-spin mr-1 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none"
                                    viewBox="0 0 24 24">
                                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                    <path class="opacity-75" fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                                    </path>
                                </svg>
                                <div>Processing...</div>
                            </div>
                        </div>
                        <div v-else>
                            Validate PDF
                        </div>
                    </button>
                </div>
                <div class="w-1/2">
                    <div class="sticky top-8 placeholder border-4 border-dashed border-gray-200 rounded-2xl">
                        <div v-if="!imageSample"></div>
                        <img :src="imageSample" />
                    </div>
                </div>
            </div>
        </div>
        <div v-if="resultSummary?.length" class="py-16 mt-16 border-t border-gray-300">
            <div class="text-4xl text-center pb-8">Results</div>
            <div class="results rounded-xl border border-gray-200">
                <div
                    class="bg-gray-100 px-4 py-4 border-b border-gray-200 grid gap-4 grid-cols-3"
                >
                    <div>File name</div>
                    <div>Page</div>
                    <div>Result</div>
                </div>
                <div
                    class="px-4 py-4 border-b border-gray-200 grid gap-4 grid-cols-3"
                    v-for="data in resultSummary"
                >
                    <div>{{ data.pdfName }}</div>
                    <div>{{ data.page }}</div>
                    <div
                        :class="{
                            'text-red-700': data.mark === 'Failed',
                            'text-blue-700': data.mark === 'Passed'
                        }"
                    >
                        {{ data.mark }}
                    </div>
                </div>
            </div>
        </div>
    </div>
    

    <Teleport to="#modal">
        <div class="bg-slate-400 h-screen w-screen" v-if="isModalOpen">
            <div>
                <ResultModal :resultSummary="resultSummary" />
            </div>
        </div>
    </Teleport>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import Tesseract from 'tesseract.js';
import { createWorker } from 'tesseract.js';
import ResultModal from './Result.vue';
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
const isModalOpen = ref(false);
const resultSummary = ref([]);
const fileNames = ref([]);

const runValidator = async (event) => {
    isLoading.value = true;
    isModalOpen.value = true;


    const worker = await createWorker();

    await worker.loadLanguage('eng');
    await worker.initialize('eng');
    await worker.setParameters({
        tessedit_ocr_engine_mode: Tesseract.TESSERACT_ONLY,
        tessedit_pageseg_mode: Tesseract.SINGLE_WORD
    })

    let isPassed = true;
    
    for (let page = 0; page < templatePages.value.length; page++) {

        const testCases = templatePages.value[page].testCase;
    
        for (let testCase = 0; testCase < testCases.length; testCase++) {
            const { expectedValue, coordinates, confidenceLevel } = testCases[testCase];

            const { data: { text } } = await worker.recognize(imageSample.value, { rectangle: { ...coordinates } });
            
            const textSimilarityPercentage = expectedValue.trim().length > 3 ? stringSimilarity(expectedValue.trim(), text.trim()) * 100 :
                                            stringSimilarity(expectedValue.trim(), text.trim(), 1) * 100;
            console.log(textSimilarityPercentage);
            if (expectedValue.trim() == text.trim()) {
                console.log(`expected value: ${expectedValue} - text ${text} is equal`);
            } else if ( textSimilarityPercentage >= confidenceLevel) {
                console.log(`expected value: ${expectedValue} - text ${text} is equal`);
            } else {
                isPassed = false;
                console.log(`expected value: ${expectedValue} - text ${text} is not equal`);
            }
        }
        resultSummary.value.push({
            pdfName: fileNames.value[page],
            page: page+1,
            mark: isPassed ? "Passed" : "Failed"
        })
    }

    await worker.terminate();
    console.log(resultSummary._rawValue);
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
    let fileNamesTemp = [];
    for(let i = 0; i < event.target.files.length; i++){
        fileNamesTemp.push(event.target.files[i].name)
    }
    fileNames.value=fileNamesTemp;
    urlPath.value = path;

}

const successfulLoaded = () => {
    imageSample.value = JSON.parse(localStorage.getItem('pdfImages'))[0];
}
</script>

<style lang="scss" scoped>
.results > div:last-child {
    border: none;
}
</style>