const { getAssignedDocuments, actionOnAssignedApplications, getEvaluatorData, actionOnAssignedDocuments } = require("../../controllers/evaluator/data/data.controller");

const evaluatorData = require("express").Router();
evaluatorData.get("/data", getEvaluatorData);
evaluatorData.get("/assigned_docs", getAssignedDocuments);
evaluatorData.post("/action_on_doc", actionOnAssignedDocuments);

module.exports = { evaluatorData };