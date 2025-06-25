const { on } = require("nodemon");
const prisma = require("../../../utils/db")

const getAdminDashboardData = async (req, res) => {
    try {
        const evaluator = await prisma.evaluator.findMany({});
        const university = await prisma.university.findMany({});
        const application = await prisma.application.findMany({});
        const adminDashboardData = { evaluator: evaluator, university: university, application: application };
        return res.json({ data: adminDashboardData });
    }
    catch (err) {
        console.error(err);
        res.status(500).send("Failed To fetch admin data.");
    }
}

module.exports = { getAdminDashboardData }