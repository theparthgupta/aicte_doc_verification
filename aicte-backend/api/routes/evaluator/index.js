const { evaluatorAuth } = require("./auth");
const { evaluatorData } = require("./data");
const { authJWT } = require("../../middlewares/auth");
const evaluatorRouter = require("express").Router();

evaluatorRouter.use("/auth", evaluatorAuth);
evaluatorRouter.use("/data", authJWT, evaluatorData);

module.exports = { evaluatorRouter };