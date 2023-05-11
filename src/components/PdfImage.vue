<template>
</template>

<script>
const pdfjs = await import('pdfjs-dist/build/pdf');
const pdfjsWorker = await import('pdfjs-dist/build/pdf.worker.entry');
pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker;

const url = 'pdf/QuickStartGuide.pdf';

// init variables
var pages = [], heights = [], width = 0, height = 0, currentPage = 1;
// scale = 1 is equivalent to 1:1
var scale = 1;

function draw() {
    var index = currentPage - 1;
    var canvas = document.createElement('canvas'), ctx = canvas.getContext('2d');
    canvas.width = width;
    canvas.height = height;

    // add page to canvas context 
    ctx.putImageData(pages[index], 0, 0);
    var dataUrl = canvas.toDataURL();
    // save the base64 images to local storage
    localStorage.setItem(`page-${index}`, dataUrl);

    // Uncomment if you want to download the pages as PNG
    // const downloadLink = document.createElement("a");
    // downloadLink.href = dataUrl;
    // downloadLink.download = `QuickStartGuide${currentPage}.png`;
    // downloadLink.click();
    // downloadLink.remove();

    // Display pages
    document.body.appendChild(canvas);
}

// get the pdf document
const thisdoc = pdfjs.getDocument(url);

thisdoc.promise.then(function (pdf) {
    getPage();

    function getPage() {
        pdf.getPage(currentPage).then(function (page) {
            // save totalpages to local storage
            localStorage.setItem("totalPages", pdf.numPages);
            console.log("Printing:" + currentPage);

            // create a canvas from the page
            var viewport = page.getViewport({scale});
            var canvas = document.createElement('canvas'), ctx = canvas.getContext('2d');
            var renderContext = { canvasContext: ctx, viewport: viewport };

            canvas.height = viewport.height;
            canvas.width = viewport.width;

            const mypage = page.render(renderContext)
            mypage.promise.then(function () {
                // save the image data of the page in array
                pages.push(ctx.getImageData(0, 0, canvas.width, canvas.height));

                heights.push(height);
                height = canvas.height;
                if (width < canvas.width) width = canvas.width;

                // draw the page and save as image
                if (currentPage < pdf.numPages) {
                    draw();
                    currentPage++;
                    getPage();
                }
                else {
                    draw();
                }
            });
        });
    }
});

</script>
