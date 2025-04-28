// api/auth.js
const {router} = require('../common');

const {
    login,
    register,
    getUser,
    update,
    allUsers,
    removeUser
} = require('./authControllers');
const { route } = require('.');

function middleware(req,res,next){
    if (req.headers?.authorization?.split('')[1]){
        next();
}
else {
    res.send('Please login again')
}
}

router.post('/register', register);
router.post('/login', login);

router.get('/users', middleware, allUsers);
router.get('/users/:id', middleware, getUser);

router.put('/users/:id', middleware, update);

router.delete('/users/:id', middleware, removeUser);


    
    
    
    



module.exports = router;
