const User = require('../models/User');
const jwt = require('jsonwebtoken');
const twilio = require('twilio');

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

exports.register = async (req, res) => {
    try{
        const {email, password, phoneNumber} = req.body;

        const existingUser = await User.findOne({email});
        if(existingUser) return res.status(400).json({message: 'User already exists'});

        const newUser = new User({email, password, phoneNumber});
        await newUser.save();

        res.status(201).json({message: "User created successfully"});
    }catch(error){
        res.status(500).json({error: error.message});
    }
};

exports.login = async (req, res) => {
    try{
        const {email, password} = req.body;

        const user = await User.findOne({email});
        if(!isPasswordValid) return res.status(401).json({message: 'Invalid password'});

        const token = jwt.sign({id: user.id}, process.env.JWT_SECRET,{expiresIn: '1h'});

        //OTP
        const otp = Math.floor(1000000 + Math.random() *9000000).toString();
        await client.messages.create({
            body: 'your OTP code is ${opt}',
            from: process.env.TWILIO_PHONE_NUMBER,
            to: user.phoneNumber,
        });

        res.json({token, otp});
    }catch(error){
        res.status(500).json({error: error.message});
    }
};

exports.verifyOTP = async (req, res) => {
    try {
      const { email, otp } = req.body;
  
      // Mock verification of OTP (in real scenarios, store OTP in DB or cache and verify)
      if (otp !== '123456') return res.status(400).json({ message: 'Invalid OTP' });
  
      await User.updateOne({ email }, { $set: { isVerified: true } });
      res.json({ message: 'User verified successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };