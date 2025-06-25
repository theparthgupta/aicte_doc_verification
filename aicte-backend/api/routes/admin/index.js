const { getAdminDashboardData } = require("../../controllers/admin/data");

const adminRouter = require("express").Router();

adminRouter.get("/data", getAdminDashboardData);

module.exports = { adminRouter };