const {prisma} = require('../common');

const getAllReviewsForItem = async (req,res,next) => {
    try{
    const itemId = req.params.itemId;
    const itemExist = await prisma.item.findUnique({
        where: {
            id: itemId
        },
        select: {
            id: true
        }
    });
    if (!itemExist){
        return res.send({message: "Item does not exist"});
    }
    const reviews = await prisma.review.findMany({
        where: {
            id: itemId
        },
    })
    res.send(reviews);
    }catch(error){
        next(error);
    }
};

const postReview = async (req,res,next) => {
    try{ 
    const itemId = req.params.itemId;
    const userId = req.user.userId;
    const {text,rating} = req.body;

    if (!text || rating === undefined) {
        return res.status(400).send({ message: 'Review text and rating are required.' });
    }
    if (typeof rating !== 'number' || !Number.isInteger(rating) || rating < 1 || rating > 5) {
        
        return res.status(400).send({ message: 'Rating must be an number  between 1 and 5.' });
    }
    const itemExists = await prisma.item.findUnique({
        where: { id: itemId },
        select: { id: true }
    });
    if (!itemExists) {
        return res.status(404).send({ message: 'Cannot review an item that does not exist.' });
    }
    const newReview = await prisma.review.create({
        data: {
            text: text,
            rating: rating,
            userId: userId, // Link to the logged-in user
            itemId: itemId  // Link to the item being reviewed
        },
        include: { // Include user info in the response
            user: {
                select: { id: true, username: true }
            }
        }
    });
    res.status(201).send(newReview);
    }catch(error){
        if (error.code === 'P2002' && error.meta?.target?.includes('userId') && error.meta?.target?.includes('itemId')) {
            return res.status(409).send({ message: 'You have already reviewed this item.' }); // 409 Conflict
        }
        next(error);
    }
};

const getReviewById= async (req,res,next) => {
    try{
        const {itemId, reviewId} = req.params;
        const review = await prisma.review.findUnique({
            where:{
            id: reviewId,
                itemId:itemId
            },
            include: {
                user:{
                    select: {
                    id: true,
                    username: true}
                },
                item: {
                    select:{
                        id:true,
                        name:true
                    }
                }
            }
        });

        if (!review|| review.itemId !== itemId){
           return  res.status(404).send({message: 'Review not found fot this item'})
        }
        res.send(review);
    }catch(error){
        next(error);
    }
};

module.exports = {getAllReviewsForItem, postReview, getReviewById};



// const updateReview = async (req,res,nex) => {
    // const itemId = req.params.itemId;
//     const update = await prisma.review.update();
// };

// const deleteReview = async (req) => {
//     const review = await prisma.review.delete();
// }


