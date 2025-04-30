const {router} = require('../common'); 

const { getMyReviews} = require('./reviewsController');

async function middleware(req, res, next) {
  const authHeader = req.headers?.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .send({ message: "Access denied. Invalid token format." });
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return res
      .status(401)
      .send({ message: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    
    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return res.status(401).send({ message: "Invalid token." });
    }
    if (error.name === "TokenExpiredError") {
      return res.status(401).send({ message: "Token expired." });
    }
    console.error("JWT Verification Error:", error);
    next(error);
  }
}

router.get('/me',middleware, getMyReviews);




module.exports = router;