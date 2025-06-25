const { LogAction, Doer, LogObject } = require("../../../services/enums");
const { assignDocumentToEvaluator } = require("../../../services/evaluatorMatching");
const { actionLogger, Log } = require("../../../services/logging");
const prisma = require("../../../utils/db");

const allowedStatusActions = ['IN_REVIEW', 'APPROVED', 'REJECTED'];

const getEvaluatorData = async (req, res) => {
    const authData = req.authData;
    try {
        const evaluator = await prisma.evaluator.findUnique({ where: { evaluator_id: authData.evaluator_id }, include: { assigned_document: { include: { document: { include: { application: { include: { university: true } } } } } } } });
        console.log(evaluator);
        res.json({ evaluator });
    }
    catch (err) {
        console.log(err);
    }
}

const getAssignedDocuments = async (req, res) => {
    const authData = req.authData;
    if (!authData.role.includes("evaluator")) {
        res.status(401).json({ errors: "Not authorized as Evaluator." })
    }
    try {
        let assignedDocuments = await prisma.universityDocuments.findMany({ where: { evaluator_id: authData.evaluator_id } });
        console.log("assignedDocument", assignedDocuments);
        if (assignedDocuments.length == 0) {
            await assignDocumentToEvaluator([authData.evaluator_id]);
        }
        assignedDocuments = await prisma.universityDocuments.findMany({ where: { evaluator_id: authData.evaluator_id } });
        return res.status(200).json({ data: assignedDocuments });
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ errors: "Internal Server Error. Try again after some time." });
    }
}

const getAssignedDocumentById = async (req, res) => {
    const { evaluator_id } = req.authData;
    const { uni_doc_id } = req.params;
    try {
        const uniDoc = await prisma.universityDocuments.findUniqueOrThrow({ where: { uni_doc_id: uni_doc_id }, include: { document: { include: { application_type: true } } } });
        actionLogger.log(new Log(new Date(), undefined, uni_doc_id, evaluator_id, LogAction.DOC_VIEWED, Doer.EVALUATOR, LogObject.DOCUMENT));
        return res.status(200).json({ data: uniDoc });
    }
    catch (err) {
        console.error(err);
        return res.status(400).json({ errors: "Document not found." });
    }
}


const actionOnAssignedDocuments = async (req, res) => {
    const { uni_doc_id, messages, status } = req.body;
    const { evaluator_id } = req.authData;
    if (!allowedStatusActions.includes(status)) {
        return res.status(401).json({ errors: "You are not allowed to perform this actions." });
    }
    let data = {};
    if (status === "REJECTED" && !messages) {
        return res.status(400).json({ errors: "Please Provide reason for rejection." });
    }
    if (messages) {
        data = { messages: messages };
    }
    if (status) {
        data['status'] = status;
    }
    let updateDoc
    try {
        const response = await prisma.$transaction(async (prisma) => {
            updateDoc = await prisma.evaluatorDocumentRelation.updateMany({ where: { evaluator_id: evaluator_id, uni_doc_id: uni_doc_id }, data: { status: status } });
            return await prisma.universityDocuments.update({ where: { uni_doc_id }, data: { messages: [{ message: { id: Math.random().toString(36), content: messages, timestamp: new Date().toString() } }] } });
        })
        actionLogger.log(new Log(new Date(), undefined, uni_doc_id, evaluator_id, status, Doer.EVALUATOR, LogObject.DOCUMENT));
        return res.status(200).json({ data: updateDoc, message: "Document Updated Successfully." })
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ errors: "Failed To update the document" });
    }
}

const actionOnAssignedApplications = async (req, res) => {
    //TODO if time left then implement
}

module.exports = { actionOnAssignedApplications, actionOnAssignedDocuments, getAssignedDocuments, getEvaluatorData }