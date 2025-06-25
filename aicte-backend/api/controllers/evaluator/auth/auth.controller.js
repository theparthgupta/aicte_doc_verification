const argon2 = require("argon2");
const { z } = require("zod");
const prisma = require("../../../utils/db");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../../../middlewares/auth");
const EvaluatorSchema = z.object({
  evaluator_id: z.string().uuid().optional(), // UUID, typically generated automatically
  email: z.string().email(),                  // Valid email address
  phone: z.string().min(10).max(15),          // Assuming a range for phone numbers
  password: z.string().min(8),                // Minimum length for password
  state: z.string(),                          // State field
  district: z.string(),                       // District field
  pincode: z.string().min(5).max(10),         // Assuming pincode constraints
  role: z.string(),                           // Role field
  specialization: z.array(z.string()),        // Array of strings for specialization
});
const evaluatorRegister = async (req, res) => {
  const data = req.body;
  const validResult = EvaluatorSchema.safeParse(data);
  if (!validResult.success) {
    return res.status(400).json({ errors: validResult.error.errors });
  }
  const hashedPassword = await argon2.hash(data.password);
  data.password = hashedPassword;
  try {
    const dbEvaluatorRes = await prisma.evaluator.create({ data: data });
    return res.status(200).json({ message: "Evaluator has been created.", evaluator_id: dbEvaluatorRes.evaluator_id })
  }
  catch (err) {
    console.log("evaluation Registration failed", err);
    return res.status(500).json({ errors: "Failed creating the account." })
  }
}
const evaluatorLogin = async (req, res) => {
  const { authKey, password } = req.body;
  try {
    if (!authKey || !password) {
      return res.status(400).json({ errors: "AuthKey or password Missing." })
    }
    const evaluator = await prisma.evaluator.findUnique({ where: { email: authKey } });
    if (!evaluator) {
      return res.status(400).json({ errors: "No institution found with given authkey." })
    }
    const verified = await argon2.verify(evaluator.password, password);
    if (!verified) {
      throw new Error("Not authorized");
    }
    const token = jwt.sign({ evaluator_id: evaluator.evaluator_id, role: evaluator.role }, JWT_SECRET);
    return res.status(200).json({ token: token });
  }
  catch (err) {
    console.log(err);
    return res.status(401).json({ errors: err.message })
  }
}

const evaluatorResetPassword = async (req, res) => {
  const { authKey, password } = req.body;

  if (!authKey || !password) {
    return res.status(400).json({ success: false, message: "Required fields missing." });
  }

  try {
    const hashedPassword = await argon2.hash(password);

    // const updateQuery = `UPDATE institute SET password = $1 WHERE institute_id = $2`;
    // await pool.query(updateQuery, [hashedPassword, institute_id]);

    await prisma.evaluator.update({ where: { email: authKey }, data: { password: hashedPassword } })
    return res.status(200).json({ success: true, message: "Password updated successfully." });
  } catch (error) {
    console.error("Error in resetting password:", error);
    return res.status(500).json({ success: false, message: "An error occurred." });
  }
}

module.exports = { evaluatorLogin, evaluatorRegister, EvaluatorSchema }
