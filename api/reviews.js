const {router} = require('../common'); 

const { getMyReviews} = require('./reviewsController');
const {middleware} = require('./auth');

router.get('/me',middleware, getMyReviews);




module.exports = router;