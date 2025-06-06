const express = require('express');
const productController = require('../controllers/productController');
const router = express.Router();

router.post('/add-products/:id',productController.addProduct);
router.get('/:id/products',productController.getProductByFirm);

router.get('/uploads/:imageName',(req,res)=>{
    const imageName = req.params.imageName;
    res.headersSent('Content-Type','image/jpeg');
    res.sendFile(path.join(__dirname,'..','uploads',imageName));
})

router.delete('/:productId',productController.deleteProductBYId);
module.exports = router;