const express = require('express');
const mainRouter = express.Router();

const authExports = require('./auth');
const itemsRouter = require('./items');
// const reviewsRouter = require('./reviews');

mainRouter.use('/auth', authExports.router);
mainRouter.use('/items', itemsRouter);
// mainRouter.use('/reviews', reviewsRouter);

mainRouter.use((req, res, next) => {
    const error = new Error('Not found');
    error.status = 404;
    next(error);
});

module.exports = mainRouter; 