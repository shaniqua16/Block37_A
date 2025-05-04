const {prisma} = require('../common');

const postComment = async (req,ress,next) => {
    try {
        const {reviewId, userId} = req.params;
    const commentId = req.comment.id;
    const { content } = req.body;

    if (!content === undefined) {
        return res
          .status(400)
          .send({ message: "Comment required." });
      }
    const comment= await prisma.review.findUnique({
        where:{
            id: reviewId,
        }
    })
    return res.send()

    } catch (error) {
        
    }
}