const Firm = require('../models/Firm.model');
const Product = require('../models/product.model');
const multer  = require('multer');


//for images storing we are using this code
const storage = multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,'uploads/');
    },
    filename:function(req,file,cb){
        cb(null,Date.now()+ path.extname(file.originalname));
    }

});

const upload = multer({storage : storage});

const addProduct = async(req,res)=>{
    try {
        const {productName,price,category,bestseller,description} = req.body;
        const image = req.file ? req.file.filename : undefined;

        const firmId = req.params.id;
        const firm = await Firm.findById(firmId);

        if(!firm){
            return res.status(404).json({error:"no firm found"})
        }

        const product = new Product({
            productName,price,category,bestseller,description,image,firm :firm._id

        })

        const savedProduct = await product.save();
        firm.products.push(savedProduct);

        await firm.save();
        return res.status(200).json({product:savedProduct}) 
        
        
    } catch (error) {
        console.log(error);
        
        return res.status(500).json({error:"internal server error"})
    }
}

const getProductByFirm = async(req,res)=>{
    try {
        const firmId = req.params.id;
        const firm = await Firm.findById(firmId);

        if(!firm){
            return res.status(404).json({error:"no firm found"});
        }

        const restaurantName = firm.firmname;
        const products = await Product.find({firm: firmId});
        return res.status(200).json({restaurantName,products});
    } catch (error) {
        console.log(error);
        return res.status(500).json({error:"internal server error"})
    }
}

const deleteProductBYId = async(req,res)=>{
    try {
        const productId = req.params.productId;
        const deleteProduct = await Product.findByIdAndDelete(productId);
        if(!deleteProduct){
            return res.status(404).json({msg:"no product found"});
        }
    } catch (error) {
        res.status(500).json({msg:"internal server error"});
    }
} 

module.exports = {addProduct :[upload.single('image'),addProduct],getProductByFirm ,deleteProductBYId};