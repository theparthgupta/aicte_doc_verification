const jwt = require("jsonwebtoken");
const { JsonWebTokenError } = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET ?? 'holaa';
const authJWT = (req, res, next) => {
    try {
        const token = req.headers.authorization;
        if (!token) {
            throw new JsonWebTokenError("No tokens found");
        }
        const decoded = jwt.verify(token, JWT_SECRET);
        req.authData = decoded;
        next();
    }
    catch (err) {
        console.log(err);
        return res.status(401).json({ error: "not authorized." }); s
    }
}

module.exports = { authJWT, JWT_SECRET };