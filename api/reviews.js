const {router} = require('../common'); 

const {getAllReviewsForItem, postReview, getReviewById} = require('./reviewsController');
const {middleware} = require('./auth');


router.get('/:itemId/reviews', getAllReviewsForItem);

router.get('/:itemId/reviews/:reviewId', getReviewById);
router.post('/:itemId/reviews',middleware, postReview);


module.exports = router;