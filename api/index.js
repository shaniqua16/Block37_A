const express = require('express');
const router = express.Router();

const authRouter = require('./auth');
const itemsRouter = require('./items');

router.use('/auth', authRouter);
router.use('/items', itemsRouter);

router.use((req, res, next) => {
    const error = new Error('Not found');
    error.status = 404;
    next(error);
});

module.exports = router; 