const Firm = require('../models/Firm.model');
const Vendor = require('../models/vendor.model');
const multer = require('multer');

const storage = multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,'uploads/');
    },
    filename:function(req,file,cb){
        cb(null,Date.now()+ path.extname(file.originalname));
    }

});

const upload = multer({storage : storage});

const addFirm = async(req,res)=>{
    
    try {
        const {firmname,area,category,region,offer} = req.body;

    const image = req.file? req.file.filename : undefined;


    const vendor = await Vendor.findById(req.vendorId);
    if(!vendor){
        return res.status(404).json({error:"vendor not found"})
    }

    const frim = new Firm({
        firmname,area,category,region,offer,image,vendor: vendor._id
    })

    const savedFirm = await frim.save();

    vendor.firm.push(savedFirm);

    await vendor.save();

    return res.status(200).json({msg:"firm added sucessfully"})
    } catch (error) {
        console.log(error);
        res.status(500).json({error:"internal server error"})
    }
}

const deleteFirmById = async(req,res)=>{
    try {
        const firmId = req.params.firmId;
        const deleteFirm = await Firm.findByIdAndDelete(firmId);

        if(!deleteFirm){
            return res.status(404).json({msg:"Firm not deleted..!"});
        }
    } catch (error) {
        return res.status(500).json({msg:"internal server error"});
    }
}

module.exports = {addFirm:[upload.single('image'),addFirm],deleteFirmById}