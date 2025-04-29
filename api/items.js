const {router} = require('../common');
const {getAllItems, getIemsById} = require('./itemsController');


router.get('/', getAllItems);
router.get('/:itemsId', getIemsById);



module.exports = router;