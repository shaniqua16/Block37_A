// api/users.js
const router = require("express").Router();
const { middleware } = require('./auth'); 
const { updateReview, deleteReview } = require('./reviewsController'); 


router.put('/:userId/reviews/:reviewId', middleware, updateReview);
router.delete('/:userId/reviews/:reviewId', middleware, deleteReview);


module.exports = router;
