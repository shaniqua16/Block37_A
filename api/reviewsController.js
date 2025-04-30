const {prisma} = require('../common');

const getAllReviewsForItem = async (req,res,next) => {
    try{
    const itemId = req.params.itemId;
    const reviewId = req.params.id;
    const reviews = await prisma.review.findMany({
        where: {
            id: reviewId,
            itemId: itemId
        
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
    const {content,rating} = req.body;

    if (!content || rating === undefined) {
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
            content: content,
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
        const review = await prisma.review.findFirst({
            where:{
            id: reviewId,
            itemId: itemId
    
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

const getMyReviews = async (req,res,next)=> {
    try{
    const userId= req.user.userId;
   

    const reviews= await prisma.review.findMany({
        where:{userId: userId
        },
        
    })
     res.send(reviews);
    }catch(error){
        next(error);
    }
};

const updateReview = async (req,res,next) => {
    try{ 
    const itemId = req.params.itemId;
    const {userId:paramUserId,reviewId } = req.params;
    const myId = req.user.userId;
    const {content, rating} = req.body;

    if (paramUserId !== myId) {
        return res.status(400).send({message:'you can only update your own reviews'})
    }

    if (rating !== undefined && (typeof rating !== 'number' || !Number.isInteger(rating) || rating<1 || rating >5)){
        return res.status(400).send({message: 'Rating must be a number between 1 and 5'})
    }

    if (content !== undefined && (typeof content !== 'string')){
        return res.status(400).send({message: 'please type a review'})
    }
    



    const update = await prisma.review.findUnique({
        where: {
            userId: myId,
            id: reviewId
        }
    });
    const updatedData= {};
    if (content !== undifined){
        updatedData.content = content;
    }
    if (rating !== undefined){
        updatedData.rating = rating;
    }
    const updatedComplete = await prisma. review.update({
        where:{
            id:reviewId,
            userId: myId,
        },
        data: updatedData
    });

    
    res.send(updatedComplete);
}catch(error){
    next(error);
}
};

const deleteReview = async (req) => {
    const {reviewId}= req.params;

    const userId = req.user.userId;
try{
        const deletedCommplete = await prisma.review.delete({
            where:{
                id:reviewId,
                userId: userId
            }
        });
        res.send(deletedCommplete);
    }
    catch(error){
        next(error);
    }
}



module.exports = {getAllReviewsForItem, postReview, getReviewById, getMyReviews, updateReview, deleteReview};





// const deleteReview = async (req) => {
//     const review = await prisma.review.delete();
// }


