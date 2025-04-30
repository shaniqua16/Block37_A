// api/auth.js
const jwt = require('jsonwebtoken');
const {router} = require('../common');

const {
    login,
    register,
    user
} = require('./authControllers');

async function middleware(req,res,next){
    const authHeader = req.headers?.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).send({ message: 'Access denied. Invalid token format.' });
    }

    const token = authHeader.split(' ')[1];
    
    if (!token){
        return res.status(401).send({ message: 'Access denied. No token provided.' });
    }
    
    try{
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded;
        next();
}
catch(error){
    if (error.name === 'JsonWebTokenError') {
        return res.status(401).send({ message: 'Invalid token.' });
    }
    if (error.name === 'TokenExpiredError') {
        return res.status(401).send({ message: 'Token expired.' });
}
console.error("JWT Verification Error:", error);
   next(error);
}
};


router.post('/register', register);
router.post('/login', login);
router.get('/me', middleware,user );

// router.get('/users', middleware, allUsers);

// router.put('/users/:id', middleware, update);

// router.delete('/users/:id', middleware, removeUser);


    
    
    
    



module.exports = {router, middleware};
