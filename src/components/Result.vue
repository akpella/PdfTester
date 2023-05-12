<template>
    <div class="h-screen w-screen flex items-center justify-center text-black">
        <div class=" w-5/6 h-5/6 rounded-xl">
            <div class="grid grid-cols-4 grid-rows-7 h-full gap-3">
                <section class="bg-slate-300 col-span-4 flex items-center justify-center text-3xl font-bold">
                    Test Result
                </section>
                <section class="bg-slate-300 row-span-6 col-span-3">
                    <table class="w-full text-left">
                        <thead>
                            <tr>
                                <th class="font-bold">PDF FileName</th>
                                <th class="font-bold">PDF Page</th>
                                <th class="font-bold">Result</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="result in resultSummary" :key="resultSummary.id">
                                <td>{{ result.pdfName }}</td>
                                <td>{{ result.page }}</td>
                                <td>{{ result.mark }}</td>
                            </tr>
                        </tbody>

                    </table>
                </section>
                <section class="bg-slate-300 row-span-3">
                    <div class="h-1/6 w-full">Passed</div>
                    <div class="h-5/6 w-full flex items-center justify-center">
                        {{
                            resultSummary.filter(result => result.mark
                                === "Passed").length
                        }}
                    </div>
                </section>
                <section class="bg-slate-300 row-span-3">
                    <div class="h-1/6 w-full">Failed</div>
                    <div class="h-5/6 w-full flex items-center justify-center">
                        {{
                            resultSummary.filter(result => result.mark
                                === "Failed").length
                        }}
                    </div>
                </section>

            </div>
        </div>
    </div>
</template>

<script >
// const resultSumms = [
//     {
//         pdfName: "pdfA.pdf",
//         page: "1",
//         mark: "Passed"
//     },
//     {
//         pdfName: "pdfB.pdf",
//         page: "2",
//         mark: "Passed"
//     },
//     {
//         pdfName: "pdfC.pdf",
//         page: "3",
//         mark: "Failed"
//     }
// ]

export default{
    props: ['resultSummary']
}
</script>