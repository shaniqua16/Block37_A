const {router} = require('../common');
const {getAllItems, getIemsById} = require('./itemsController');
const {getAllReviewsForItem, postReview, getReviewById} = require('./reviewsControllers');
const {middleware} = require('./auth');


router.get('/', getAllItems);
router.get('/:itemsId', getIemsById);
router.get('/:itemId/reviews', getAllReviewsForItem);


router.get('/:itemId/reviews/:reviewId', getReviewById);
router.post('/:itemId/reviews',middleware, postReview);


module.exports = router;