const { evaluatorLogin, evaluatorRegister } = require("../../controllers/evaluator/auth/auth.controller");
const { resetPassword } = require("../../controllers/institute/auth");

const evaluatorAuth = require("express").Router();
evaluatorAuth.post("/login", evaluatorLogin);
evaluatorAuth.post("/register", evaluatorRegister);
evaluatorAuth.post("/resetPassword", resetPassword);

module.exports = { evaluatorAuth }
