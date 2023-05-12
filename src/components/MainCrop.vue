<template>
  <PdfImage :url="urlPath" @successfulLoaded="successfulLoaded" v-if="urlPath"/>
  <div>
    <div class="flex justify-between">
      <div class="w-2/5">
        <div class="pb-12">
          <div class="text-xl pb-4">
            <span class="text-gray-500">Step 1</span> <strong>Select your PDF</strong>
          </div>
          <div>
            <input type="file" ref="samplePdf" accept="application/pdf,image/png,image/jpg" style="display: none"
              @change="processDocument" />
            <button class="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded w-auto mr-2"
              @click="$refs.samplePdf.click()">
              Select and Generate PDF
            </button>
          </div>
        </div>
        <div class="pb-12">
          <div class="text-xl pb-4">
            <span class="text-gray-500">Step 2</span> <strong>Define or use a JSON template</strong>
          </div>
          <div>
            <div>
              <input type="file" ref="template" accept="application/json" style="display: none" @change="processTemplate" />
              <div>
                <input type="file" ref="template" accept="application/json" style="display: none" @change="processTemplate" />
                <div class="space-x-3">
                  <span>You can</span>
                  <button
                    class="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded w-auto disabled:bg-red-300"
                    :disabled="!imageSample"
                    @click="$refs.template.click()"
                  >
                    Choose your JSON
                  </button>
                  <span>to generate initial test cases.</span>
                </div>
              </div>
            </div>
            <div class="uppercase text-center py-6 text-gray-400">or</div>
            <div v-if="Object.keys(jsonData).length">
              <div>Generate your own template below.</div>
              <div class="pt-6">
                <div class="pb-5">
                  <label class="block text-gray-700 text-sm mb-2" for="templateName">Name</label>
                  <input
                    class="shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline"
                    id="templateName" v-model="jsonData.name">
                </div>
                <div class="pb-5">
                  <label class="block text-gray-700 text-sm mb-2" for="version">Version</label>
                  <input
                    class="shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline"
                    id="version" v-model="jsonData.version">
                </div>
                <div>
                  <label class="block text-gray-700 text-sm mb-2" for="page">Page</label>
                  <input
                    class="shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline"
                    id="pageNumber" v-model="page">
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="pb-6">
          <div class="text-xl pb-4">
            <span class="text-gray-500">Step 3</span> <strong>Add test cases</strong>
          </div>
          <div class="pb-4">
            <p class="text-lg">Coordinates</p>
            <p>The coordinates below are updated when PDF selection box is adjusted.</p>
          </div>
          <div class="flex space-x-4 pb-4">
            <div>
              <label class="block text-gray-700 text-sm mb-2" for="width">Width</label>
              <input
                class="shadow-sm appearance-none border rounded w-full py-2 px-3 bg-gray-50 text-gray-700 focus:outline-none focus:shadow-outline"
                id="tempWidth"
                readonly
                v-model="tempCoordinates.width"
              />
            </div>
            <div>
              <label class="block text-gray-700 text-sm mb-2" for="width">Height</label>
              <input
                class="shadow-sm appearance-none border rounded w-full py-2 px-3 bg-gray-50 text-gray-700 focus:outline-none focus:shadow-outline"
                id="tempHeight"
                readonly
                v-model="tempCoordinates.height"
              />
            </div>
            <div>
              <label class="block text-gray-700 text-sm mb-2" for="width">Top</label>
              <input
                class="shadow-sm appearance-none border rounded w-full py-2 px-3 bg-gray-50 text-gray-700 focus:outline-none focus:shadow-outline"
                id="tempTop"
                readonly
                v-model="tempCoordinates.top"
              />
            </div>
            <div>
              <label class="block text-gray-700 text-sm mb-2" for="width">Left</label>
              <input
                class="shadow-sm appearance-none border rounded w-full py-2 px-3 bg-gray-50 text-gray-700 focus:outline-none focus:shadow-outline"
                id="tempLeft"
                readonly
                v-model="tempCoordinates.left"
              />
            </div>
          </div>
          <div class="pb-4">
            <p class="text-lg">Expected value</p>
            <p>What do you expect to see in the set coordinates?</p>
          </div>
          <div class="flex space-x-4 pb-4">
            <textarea
              class="shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline"
              v-model="testCaseValueInput"
            />
          </div>
          <div
            @click="addTestCase"
            class="text-blue-500 cursor-pointer font-semibold"
          >
            + Add as test case
          </div>
        </div>
        <div>
          <div class="text-lg">Test cases</div>
          <div v-if="!jsonData.pages[0].testCase?.length">
            No test cases added. Add some test cases using the form above.
          </div>
          <div v-else class="space-y-3">
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
        <!-- <div>
          <div v-for="data in jsonData.pages[page - 1].testCase" v-bind:key="data.id" class="mb-2">
            <label class="block text-gray-700 text-sm font-bold mb-2" for="coordinates">Coordinates:</label>
            <span id="coordinates">width: {{ data.coordinates.width }} | height: {{ data.coordinates.height }} | left: {{
              data.coordinates.left }} | top: {{ data.coordinates.top }}</span>
            <label class="block text-gray-700 text-sm font-bold mb-2" for="expectedValue">Expected Value:</label>
            <input
              class="shadow appearance-none border rounded w-1/2 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="expectedValue" v-model="data.expectedValue">
            <label class="block text-gray-700 text-sm font-bold mb-2 mt-2" for="expectedValue">Confidence Level:</label>
            <input
              class="shadow appearance-none border rounded w-1/2 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="expectedValue" v-model="data.confidenceLevel">
          </div>
        </div>
        <div>
          <button class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded w-auto"
            @click="triggerPrompt">
            Add Expected Value
          </button>
        </div> -->
        <div class="pt-6">
          <button
            class="text-xl bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded w-full disabled:bg-red-300"
            @click="triggerSave"
          >
            Save template
          </button>
        </div>
      </div>
      <div class="w-1/2">
        <div class="sticky top-8">
          <div
            v-if="!imageSample"
            class="placeholder border-4 border-dashed border-gray-200 rounded-2xl"
          >
          </div>
          <Cropper :src="imageSample" @change="processSelection"></Cropper>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import PdfImage from './PdfImage.vue';
import { ref, onMounted, computed } from 'vue'
import { Cropper } from 'vue-advanced-cropper'
import { v4 as uuidv4 } from 'uuid';
import 'vue-advanced-cropper/dist/style.css';

const sel = ref({})
const option = ref({})
const jsonName = ref("");
const jsonData = ref({
  id: uuidv4(),
  name: "",
  "version": "1",
  "pagesize": "",
  "pages": [
    {
      "page": 1,
      "testCase": []
    }
  ]
});
const isFound = ref(false);
const page = ref(1);
const isImageFullyLoaded = ref(false);
const tempCoordinates = ref({});
const urlPath = ref("")
const imageSample = ref("");
const testCaseValueInput = ref("");

onMounted(() => {
    localStorage.clear();
});

const isTemplateValid = computed(() => {
  return !!(jsonData.name && jsonData.version);
})

const triggerPrompt = () => {
  let expectedValue = prompt("Input expected value");

  if (expectedValue && Object.keys(tempCoordinates.value).length) {
    const newTestCase = {
      id: uuidv4(),
      coordinates: tempCoordinates.value,
      isRegex: false,
      expectedValue,
      confidenceLevel: 90,
    }
    jsonData.value.pages[page.value - 1].testCase.push(newTestCase);
    tempCoordinates.value = {};

    console.log(jsonData.value);
  }
};

const addTestCase = () => {
  if (testCaseValueInput && Object.keys(tempCoordinates.value).length) {
    const expectedValue = String(testCaseValueInput.value);;

    const newTestCase = {
      id: uuidv4(),
      coordinates: tempCoordinates.value,
      isRegex: false,
      expectedValue,
    }
    jsonData.value.pages[page.value - 1].testCase.push(newTestCase);

    console.log(jsonData.value);
  }
};

const processSelection = ({ coordinates, canvas }) => {
  if (!isImageFullyLoaded.value) {
    isImageFullyLoaded.value = true;
    return;
  };

  tempCoordinates.value = {
    width: coordinates.width,
    height: coordinates.height,
    left: coordinates.left,
    top: coordinates.top
  };
};

const processDocument = (event) => {
  var path = (window.URL || window.webkitURL).createObjectURL(event.target.files[0]);
    console.log('path: ', path);

    urlPath.value = path;
}

const processTemplate = (event) => {
  var reader = new FileReader();
  reader.onload = onReaderLoad;
  reader.readAsText(event.target.files[0]);
};

const onReaderLoad = (event) => {
  var obj = JSON.parse(event.target.result);

  if (obj) {
    console.log(obj);

    jsonData.value = obj;
  }
};

const triggerSave = () => {
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([JSON.stringify(jsonData.value, null, 2)], {
    type: "application/json"
  }));
  a.setAttribute("download", `${jsonData.value.name}`);
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}


const successfulLoaded = () => {
  console.log('successfulLoaded');
  imageSample.value = JSON.parse(localStorage.getItem("pdfImages"))[0];
  urlPath.value = "";
}
</script>

<style lang="scss">
.placeholder {
  height: 500px;
}
</style>