const prisma = require("../utils/db");

let unverifiedDocuments = [];
let allUnverifiedDocuments = [];
let ForgeryEvaluator = [];
let LayoutEvaluator = [];
let ContentEvaluator = [];
let allEvaluatorM = [ForgeryEvaluator, LayoutEvaluator, ContentEvaluator];
async function refetch() {
    let layer_index = 0;
    for (const layer of ["FORGERY_CHECKER", "LAYOUT_CHECKER", "CONTENT_CHECKER"]) {
        const data = await prisma.evaluator.findMany({ where: { role: layer }, include: { assigned_document: { where: { status: "ASSIGNED" } } } });
        allEvaluatorM[layer_index] = data.sort((a, b) => a.assigned_document.length - b.assigned_document.length);
        layer_index++;
    };
    const data = await prisma.universityDocuments.findMany({ where: { status: "SUBMITTED", }, include: { document: true, assigned_evaluator: true } });
    console.log("Started Evaluator Matcher.", data);
    unverifiedDocuments = data.sort((doc_a, doc_b) => doc_a.document.deadline.getTime() - doc_b.document.deadline.getTime());
    allUnverifiedDocuments = [new Array(...unverifiedDocuments), new Array(...unverifiedDocuments), new Array(...unverifiedDocuments)]
    return setTimeout(() => { console.log("All data fetched.") }, 1000);
};
refetch().then(() => {
    assignDocumentToEvaluator().then(() => { console.log("Successfully assigned Documents to Evaluators.") });
});
async function assignDocumentToEvaluator(allEvaluator = allEvaluatorM) {
    let assigned = [];
    await refetch();
    for (const doc of unverifiedDocuments) {
        assigned = [];
        let layer_index = 0;
        for (const layer of ["FORGERY_CHECKER", "LAYOUT_CHECKER", "CONTENT_CHECKER"]) {
            let flag = false;
            allEvaluator[layer_index].forEach((eval) => {
                if (eval.specialization.includes(doc.doc_id)) {
                    assigned.push({ evaluator_id: eval.evaluator_id, uni_doc_id: doc.uni_doc_id, check_type: layer });
                    flag = true;
                }
            });
            if (!flag) {
                const index = Math.floor(Math.random() * allEvaluator[layer_index].length);
                const eval = allEvaluator[layer_index][index];
                assigned.push({ evaluator_id: eval.evaluator_id, uni_doc_id: doc.uni_doc_id, check_type: layer });
            }
            layer_index++;
        }
        await pushAssignedToDB(assigned);
    }
    return assigned;
}


async function pushAssignedToDB(assigned) {
    console.log("assigned", assigned);
    try {
        await prisma.$transaction(async (prisma) => {
            for (const assignment of assigned) {
                await prisma.universityDocuments.update({ where: { uni_doc_id: assignment.uni_doc_id }, data: { status: "ASSIGNED" } });
                await prisma.evaluatorDocumentRelation.create({ data: { evaluator_id: assignment.evaluator_id, uni_doc_id: assignment.uni_doc_id, check_type: assignment.check_type, status: "ASSIGNED" } })
            }
        });
    }
    catch (error) {
        console.error(error);
    }
}

module.exports = { assignDocumentToEvaluator };