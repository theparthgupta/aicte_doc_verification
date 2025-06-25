const { get_institute_data, start_new_application, get_applications, get_application_document_by_id, availableApplication, document_analysis, validate_university_image, validate_blueprint } = require("../../controllers/institute/data")

const InstitueData = require("express").Router()
InstitueData.post("/", get_institute_data)
InstitueData.post("/available_application", availableApplication)
InstitueData.post("/new_application", start_new_application)
InstitueData.get("/get_applications", get_applications)
InstitueData.get("/get_documents", get_application_document_by_id)
InstitueData.post("/document_analysis", document_analysis)
// InstitueData.post("/validate_image", validate_university_image)
// InstitueData.post("/validate_blueprint", validate_blueprint)


module.exports = { InstitueData }