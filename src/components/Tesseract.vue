<template>
    <div>
        <p>{{ textOcred }}</p>
    </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';
import Tesseract from 'tesseract.js';
import { createWorker } from 'tesseract.js';

const baseUrl = ref(window.location.host);
const textOcred = ref("test");
const rectangleOption = ref({
    left: 19,
    top: 34,
    width: 222,
    height: 50,
});

const expected = [
    {
        coordinates: {
            width: 222,
            height: 50,
            left: 19,
            top: 34,
        },
        value: "exceltemplate.NET"
    },
    {
        coordinates: {
            width: 221,
            height: 69,
            left: 716,
            top: 24,
        },
        value: "CONFIDENTIAL"
    },
    {
        coordinates: {
            width: 95,
            height: 24,
            left: 479,
            top: 158,
        },
        value: "Directorate"
    },
    {
        coordinates: {
            width: 129,
            height: 24,
            left: 15,
            top: 693,
        },
        value: "Bank Account #"
    }
];

// Tesseract.recognize(
//   'http://localhost:5173/assets/pdf-images/image1/sample-payslip.png',
//   'eng',
//   {
//     logger: m => console.log(m),
//     rectangle: {
//         left: 19,
//         top: 34,
//         width: 222,
//         height: 50,
//     }
//   }
// ).then(({ data: { text, blocks } }) => {
//   textOcred.value = text;
//   console.log(text);
//   console.log(blocks);
// })

// const worker = await createWorker({
//   logger: m => console.log(m)
// });

// (async () => {
//   await worker.loadLanguage('eng');
//   await worker.initialize('eng');
//   const { data: { text } } = await worker.recognize('http://localhost:5173/assets/pdf-images/image1/sample-payslip.png', { rectangle: {
//     width: 221,
//     height: 63,
//     left: 361,
//     top: 10,
// }});
//   console.log(text);
//   await worker.terminate();
// })();

onMounted(() => {
    expected.forEach(async (element) => {
        console.log(element);
        
    });

    
});

const worker = await createWorker();

(async () => {
    await worker.loadLanguage('eng');
    await worker.initialize('eng');

    for (let i = 0; i < expected.length; i++) {
        const element = expected[i];
        const { data: { text } } = await worker.recognize('http://localhost:5173/assets/pdf-images/image1/sample-payslip.png', { rectangle: element.coordinates});

        if (element.value.trim() == text.trim()){
            console.log(`element value: ${element.value} - text ${text} is equal`);
        } else {
            console.log(`element value: ${element.value} - text ${text} is not equal`);
        }
    }

    await worker.terminate();
})();

</script>