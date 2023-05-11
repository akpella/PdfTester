<template>
  <div class="flex">
    <div class="w-1/2">
      <div>
        <input type="file" ref="samplePdf" accept="application/pdf,image/png,image/jpg" style="display: none"
          @change="processDocument" />
        <input type="file" ref="template" accept="application/json" style="display: none" @change="processTemplate" />
        <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-auto mr-2"
          @click="$refs.samplePdf.click()">
          Upload Sample PDF
        </button>
        <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-auto"
          @click="$refs.template.click()">
          Upload Template
        </button>
        <button class="ml-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-auto"
          @click="triggerPrompt">
          Add Expected Value
        </button>
        <button class="ml-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-auto"
          @click="triggerSave">
          Save
        </button>
      </div>
      <div v-if="Object.keys(jsonData).length">
        <div>
          <label class="block text-gray-700 text-sm font-bold mb-2" for="templateName">Name:</label>
          <input
            class="shadow appearance-none border rounded w-1/2 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="templateName" v-model="jsonData.name">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="version">Version:</label>
          <input
            class="shadow appearance-none border rounded w-1/2 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="version" v-model="jsonData.version">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="version">Page:</label>
          <input
            class="shadow appearance-none border rounded w-1/2 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="pageNumber" v-model="page">
        </div>
        <span class="mt-2 mb-2">Test Cases</span>
        <div v-for="data in jsonData.pages[page - 1].testCase" v-bind:key="data.id" class="mb-2">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="coordinates">Coordinates:</label>
          <span id="coordinates">width: {{ data.coordinates.width }} | height: {{ data.coordinates.height }} | left: {{
            data.coordinates.left }} | top: {{ data.coordinates.top }}</span>
          <label class="block text-gray-700 text-sm font-bold mb-2" for="expectedValue">Expected Value:</label>
          <input
            class="shadow appearance-none border rounded w-1/2 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="expectedValue" v-model="data.expectedValue">
        </div>
      </div>
    </div>
    <div class="w-1/2">
      <Cropper class="w-[100vw] h-[100vh]" :src="img" @change="processSelection"></Cropper>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { Cropper } from 'vue-advanced-cropper'
import { v4 as uuidv4 } from 'uuid';
import 'vue-advanced-cropper/dist/style.css';

const img = ref("http://localhost:5173/assets/pdf-images/image1/sample-payslip.png")
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
const page = ref(1);
const isImageFullyLoaded = ref(false);
const tempCoordinates = ref({});

const triggerPrompt = () => {
  let expectedValue = prompt("Input expected value");

  if (expectedValue && Object.keys(tempCoordinates.value).length) {
    const newTestCase = {
      id: uuidv4(),
      coordinates: tempCoordinates.value,
      isRegex: false,
      expectedValue,
    }
    jsonData.value.pages[page.value - 1].testCase.push(newTestCase);
    tempCoordinates.value = {};

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
  console.log(URL.createObjectURL(event.target.files[0]));
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
</script>