const {prisma} =require('../common');

const getAllItems = async(req, res) =>{
try {
    const items = await prisma.item.findMany();
    res.send(items);
} catch (error) {
   next(error);
}
};

const getIemsById = async (req,res, next) => {  
try {
    const itemId = parseInt(req.params.itemsId);
    // if (isNaN(itemId)) {
    //     return res.status(400).send({ message: 'Invalid Item ID format.' });
    // }

    const item = await prisma.item.findUnique({
        where: {id: itemId}
    });
    if (!item) {
        return res.status(404).send({ message: 'Item not found.' });
    }
    res.send(item);
} catch (error) {
    next(error);
}
}

module.exports = {getAllItems, getIemsById};