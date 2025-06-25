const { InstitueAuth } = require("./auth")
const { InstitueData } = require("./data")
const { authJWT } = require("../../middlewares/auth");
const InstitueRouter = require("express").Router()

InstitueRouter.use("/auth", InstitueAuth)
InstitueRouter.use("/data", authJWT, InstitueData)

module.exports = InstitueRouter