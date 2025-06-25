const { PrismaClient } = require("@prisma/client");
const { reset } = require("nodemon");

const prisma = new PrismaClient();
async function resetDB() {
    await prisma.universityApplication.deleteMany({});
}
module.exports = prisma;