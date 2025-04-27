const Vendor = require('../models/vendor.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const dotEnv = require('dotenv');
const { default: mongoose } = require('mongoose');

dotEnv.config();

const secretKey = process.env.Whatisyourname



//vendor register
const vendorRegister = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Validate input fields
    if (!username || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long' });
    }

    // Trim input fields
    const trimmedUsername = username.trim();
    const trimmedEmail = email.trim();

    // Check if email is already registered
    const vendorEmail = await Vendor.findOne({ email: trimmedEmail });

    if (vendorEmail) {
      return res.status(400).json({ error: 'Email already taken' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new vendor
    const newVendor = new Vendor({
      username: trimmedUsername,
      email: trimmedEmail,
      password: hashedPassword,
    });

    // Save the vendor to the database
    await newVendor.save();

    res.status(201).json({ message: 'Vendor registered successfully' });
    console.log('Vendor registered successfully');
  } catch (err) {
    console.error('Error during registration:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

//vendor login
const vendorLogin = async(req,res)=>{
  const {email , password} = req.body;
  try{

    const vendor = await Vendor.findOne({email});

    if(!vendor || !(await bcrypt.compare(password,vendor.password))) {
      return res.status(401).console.log("404 not found")
    }
    const token = jwt.sign({vendorId : vendor._id}, secretKey ,{expiresIn : "1h"})
    res.status(200).json({sucess:"login sucessful",token});
    console.log(email);
  }
  catch(error){
    console.log(error);
    res.status(500).json({error:"internal server error"});
    
  }
}

const getAllVendors = async(req,res)=>{
  try {
    const vendors = await Vendor.find().populate('firm');
    res.json({vendors})
    
    
  } catch (error) {
    console.log(error);
    res.status(500).json({error:"internal server error"});
    
    
  }
}

const getSingleVendorById = async(req,res)=>{
  const vendorId = req.params.id;
  try {
    if(!mongoose.Types.ObjectId.isValid(vendorId)){
      return res.status(400).json({error :"invalid blog id"})
    }

    const vendor = await Vendor.findById(vendorId).populate('firm');

    if(!vendor){
      return res.status(404).json({error:"vendor not found"})
    }
    return res.status(200).json({message:"blog found",vendor})
    
  } catch (error) {
    return res.status(500).json({error : "internal server error"});
  }
}

module.exports = { vendorRegister , vendorLogin , getAllVendors , getSingleVendorById };
