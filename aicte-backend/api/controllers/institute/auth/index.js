const { v4: uuid } = require("uuid");
const argon2 = require("argon2");
const { verifyUniversity } = require("../../../services/university_validation");
const prisma = require("../../../utils/db");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../../../middlewares/auth");
async function institute_register(req, res) {
  const { institute_id, institute_data, password } = req.body;

  if (!institute_data || !password) {
    return res.status(400).json({ success: false, message: "All fields are required." });
  }

  try {
    // Extract universityDetails from institute_data
    const uniDetails = institute_data.universityDetails
    const contactDetails = institute_data.contactDetails
    // Verify the university details
    // const verificationResult = await verifyUniversity({
    //   name: uniDetails.universityName,
    //   email: uniDetails.email,
    //   address: `${uniDetails.address} ${uniDetails.district} ${uniDetails.state}, ${uniDetails.pincode}`,
    //   adminPhone: contactDetails.phone,
    //   category: uniDetails.instituteType
    // });
    // console.log(verificationResult)
    // if (!verificationResult.valid) {
    //   return res.status(400).json({
    //     success: false,
    //     message: `University verification failed: ${verificationResult.reason}`,
    //   });
    // }

    // // Generate unique ID for the institute
    // const id = uuid();

    // Hash the password using Argon2
    const hashedPassword = await argon2.hash(password);

    // Insert data into the database
    // const query = `
    //   INSERT INTO institute (id, institute_id, institute_data, password)
    //   VALUES ($1, $2, $3, $4)
    // `;

    // await pool.query(query, [id, institute_id, institute_data, hashedPassword]);

    const transactionResult = await prisma.$transaction(async (prisma) => {
      const universityDetails = await prisma.university.create({
        data: {
          email: uniDetails.email,
          phone: uniDetails.contactNumber,
          password: hashedPassword,
          universityName: uniDetails.universityName,
          universityType: uniDetails.instituteType,
          state: uniDetails.state,
          district: uniDetails.district,
          pincode: parseInt(uniDetails.pincode)
        }
      });
      console.log(contactDetails);
      const contact = await prisma.contactDetails.create({
        data: { ...contactDetails, universityId: universityDetails.id }
      });
      return universityDetails.id;
    })
    const token = jwt.sign({ institute_id: transactionResult }, JWT_SECRET);
    return res.status(201).json({
      success: true,
      message: "Institute registered successfully",
      token: token,
    });
  } catch (error) {
    console.error("Error during institute registration:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred during registration." + error.message,
    });
  }
}

const checkInstituteId = async (req, res) => {
  const { authKey } = req.body;

  if (!authKey) {
    return res.status(400).json({ success: false, message: "authKey is required." });
  }

  try {
    // Query the database to check for the institute_id
    // const query = `SELECT COUNT(*) FROM institute WHERE institute_id = $1`;
    // const result = await pool.query(query, [institute_id]);

    // // Check if the institute_id exists
    const institute = await prisma.university.findUniqueOrThrow({ where: { email: authKey } });
    const exists = institute != null;
    return res.status(200).json({
      success: exists,
      message: exists ? "Institute ID exists." : "Institute ID does not exist.",
    });
  } catch (error) {
    console.error("Error checking institute_id:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while checking the institute ID.",
    });
  }
};

const checkEmailForInstitute = async (id, entity) => {
  try {
    // const query = `
    //   SELECT institute_data->'universityDetails'->>'email' AS email
    //   FROM institute
    //   WHERE institute_id = $1
    // `;
    // const result = await pool.query(query, [institute_id]);
    // return result.rows[0].email
    // prisma.
    let email;
    if (entity == "university") {
      const emailRes = await prisma.university.findUnique({ where: { email: id }, select: { email: true } });
      email = emailRes.email;
    }
    if (entity == "evaluator") {
      const emailRes = await prisma.evaluator.findUnique({ where: { email: id }, select: { email: true } });
      email = emailRes.email;
    }
    if (email) {
      return email;
    }
    return undefined;
  }
  catch (err) {
    return undefined
  }
}

// Function to handle institute login
const loginInstitute = async (req, res) => {
  const { authKey, password } = req.body;

  // Validate input
  if (!authKey || !password) {
    return res.status(400).json({
      success: false,
      message: "Both institute_id and password are required.",
    });
  }

  try {
    // Fetch the stored password hash for the given institute_id
    // const query = `
    //   SELECT password, id
    //   FROM institute
    //   WHERE institute_id = $1
    // `;
    // const result = await pool.query(query, [institute_id]);

    const result = await prisma.university.findUnique({ where: { email: authKey } });
    // Check if the institute_id exists
    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Institute ID not found.",
      });
    }

    const storedPasswordHash = result.password;

    const isPasswordValid = await argon2.verify(storedPasswordHash, password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid password.",
      });
    }
    const token = jwt.sign({ institute_id: result.id }, JWT_SECRET, { expiresIn: "2h" });
    return res.status(200).json({
      success: true,
      message: "Login successful.",
      token: token,
    });
  } catch (error) {
    console.error("Error during institute login:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred during login.",
    });
  }
}


const resetPassword = async (req, res) => {
  const { authKey, password } = req.body;

  if (!authKey || !password) {
    return res.status(400).json({ success: false, message: "Required fields missing." });
  }

  try {
    const hashedPassword = await argon2.hash(password);

    // const updateQuery = `UPDATE institute SET password = $1 WHERE institute_id = $2`;
    // await pool.query(updateQuery, [hashedPassword, institute_id]);

    await prisma.university.update({ where: { email: authKey }, data: { password: hashedPassword } })
    return res.status(200).json({ success: true, message: "Password updated successfully." });
  } catch (error) {
    console.error("Error in resetting password:", error);
    return res.status(500).json({ success: false, message: "An error occurred." });
  }
}


module.exports = {
  institute_register,
  checkInstituteId,
  checkEmailForInstitute,
  loginInstitute,
  resetPassword
}   