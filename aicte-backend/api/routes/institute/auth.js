const { institute_register, checkInstituteId, loginInstitute, resetPassword } = require("../../controllers/institute/auth")

const InstitueAuth = require("express").Router()

InstitueAuth.post("/login", loginInstitute)
InstitueAuth.post("/register", institute_register)
InstitueAuth.post("/institute_exists", checkInstituteId)
InstitueAuth.post("/forgot", resetPassword)


module.exports = { InstitueAuth }