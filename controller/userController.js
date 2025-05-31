const userModel = require('../model/userModel')
// const bcrypt  = require('bcryptjs')
const sendEmail = require('../middlewares/nodemailer')
// const jwt = require('jsonwebtoken')
const bcrypt  = require('bcrypt')
const jwt =require('jsonwebtoken')
const { signUpTemplate ,forgotTemplate } = require('../utils/mailTemplates')
const {validate} = require('../helper/utilities')
const {registerSchema, loginSchema, verificationEmailSchema, forgotPasswordSchema, resetPasswordschema, changePassword} = require('../validation/user')






exports.register = async (req, res) => {
    try {
        
        let validated;
        try {
            validated = await validate(req.body, registerSchema);
        } catch (validationError) {
            return res.status(400).json({ error: validationError.message });
        }
        
        const {fullName, username, email, password, confirmPassword} = validated

        if(password !== confirmPassword) {
            return res.status(400).json({message: 'passwords do not match'})
        }

        const user = await userModel.findOne({ email: email.toLowerCase()})

        if(user) {
            return res.status(400).json({message: `user with email: ${email} already exists`})
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

     

        const newUser = new userModel({
            fullName,
            email,
            password: hashedPassword,
            username
            
        })


        const token = await jwt.sign({ userId: newUser._id}, process.env.JWT_SECRET, { expiresIn: '2day'})

        const link = `${req.protocol}://${req.get('host')}/api/v1/user-verify/${token}`

        const firstName = newUser.fullName.split(' ')[0]


        const mailDetails = {
            subject: 'Welcome Email',
            email: newUser.email,
            html : signUpTemplate(link, firstName)
        }

        await sendEmail(mailDetails)

        await newUser.save()

        res.status(201).json({message: 'user registered successfully', data: newUser })

    } catch (error) {
        console.log(error.message)
        res.status(500).json({message: 'error registering user',  error: error.message})
        
    }
}




exports.login = async (req, res) => {
    try {
        const validated = await validate(req.body , loginSchema)

        const {email, username, password} = validated

        if(!email && !username) {
            return res.status(400).json({message: 'please enter either email or username'})    
        }

        if(!password) {
            return res.status(400).json({message: 'please enter your password'})    
        }

        const user = await userModel.findOne({ $or: [{ email}, {username: username}]})

        if(user === null) {
            return res.status(404).json({message: 'user not found'})  
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password)

        if(isPasswordCorrect === false) {
            return res.status(400).json({message: 'incorrect password'})  
        }

        if(user.isVerified === false) {
            return res.status(400).json({message: 'account not verified, please check your email for link'})  
        }


        const token = await jwt.sign({userId: user._id}, process.env.JWT_SECRET, { expiresIn:'1day'})

        res.status(200).json({message: 'login successful', data: user, token})

    } catch (error) {
        console.log(error.message)
        res.status(500).json({message: 'error loging user' , error: error.message})
    }
}





exports.verifyEmail = async (req, res) => {
    try {
        
        const {token}  = req.params

        if(!token) {
            return res.status(400).json({message: 'token not found'})
        }

        const decodedToken = await jwt.verify(token, process.env.JWT_SECRET)

        const user = await userModel.findById(decodedToken.userId)

        if(!user) {
            return res.status(404).json({message: 'user not found'})
        }

        if(user.isVerified === true) {
            return res.status(400).json({message: 'user has already been verified'})
        }

        user.isVerified = true

        await user.save()

        res.status(200).json({message: 'user verified successfully'})


    } catch (error) {
        console.log(error.message)
        if(error instanceof jwt.JsonWebTokenError) {
            return res.status(401).json({message: 'verification link expired'})
        }
    }
    res.status(500).json({message: 'error verifying user:' , error:error.message})
}




exports.resendVerificationEmail = async (req, res) => {
    try {
        
        let validated;
        try {
            validated = await validate(req.body, verificationEmailSchema);
        } catch (validationError) {
            return res.status(400).json({ error: validationError.message });
        }

        const {email} = validated

        if(!email) {
            return res.status(400).json({message: 'please enter email address'})
        }

        const user = await userModel.findOne({email: email.toLowerCase()})

        if(!user) {
            return res.status(404).json({message: 'user not found'})
        }

        const token = await jwt.sign({ userId: user._id}, process.env.JWT_SECRET, { expiresIn: '2h'})

        const link = `${req.protocol}://${req.get('host')}/api/v1/user-verify/${token}`

        const firstName = user.fullName.split('')[0]

        const html = signUpTemplate(link, firstName)

        const mailOptions = {
            subject: 'email verification',
            email: user.email,
            html
        }

        await sendEmail(mailOptions)

        res.status(200).json({message: 'verification email sent, please check mail box'})


    } catch (error) {
        console.log(error.message)
        res.status(500).json({message: 'error resending verification email' + error.message})
    }
}


exports.forgotPassword = async (req, res) => {
    try {

        let validated;
        try {
            validated = await validate(req.body, forgotPasswordSchema);
        } catch (validationError) {
            return res.status(400).json({ error: validationError.message });
        }

      const { email } = validated

      const user = await userModel.findOne({ email: email.toLowerCase() });
  
      if (!user) {
        return res.status(404).json({
          message: 'Account not found'
        })
      };
  
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1hour' });
      const link = `${req.protocol}://${req.get('host')}/api/v1/reset-password/${token}`; // consumed post link
      const firstName = user.fullName.split(' ')[0];
  
      const mailOptions = {
        email: user.email,
        subject: 'Reset Password',
        html: forgotTemplate(link, firstName)
      };
  
      await sendEmail(mailOptions);
      return res.status(200).json({
        message: 'Link has been sent to email address'
      })
    } catch (error) {
      console.log(error.message);
      res.status(500).json({
        message: 'Forgot password failed',
        error: error.message
      })
    }
};

  

exports.resetPassword = async (req, res) => {
    try {
      const { token } = req.params;
  
      if (!token) {
        return res.status(404).json({
          message: 'Token not found'
        })
      };
      const validated = await validate(req.body , resetPasswordschema)
      
      const { password, confirmPassword } = validated
  
      if (password !== confirmPassword) {
        return res.status(400).json({
          message: 'Password does not match'
        })
      };
  
      const { userId } = jwt.verify(token, process.env.JWT_SECRET);
      const user = await userModel.findById(userId);
  
      if (!user) {
        return res.status(404).json({
          message: 'Account not found'
        })
      };
  
      const saltedRound = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, saltedRound);
      user.password = hashedPassword;
      await user.save();
  
      res.status(200).json({
        message: 'Password changed successfully'
      });
    } catch (error) {
      console.log(error.message);
      if (error instanceof jwt.JsonWebTokenError) {
        return res.status(400).json({
          message: 'Session expired. Please enter your email to resend link'
        })
      };
      res.status(500).json({
        message: 'Error resetting password',
        error: error.message
      })
    }
};
  


exports.changePassword = async (req, res) => {
    try {

        let validated;
        try {
            validated = await validate(req.body, changePassword);
        } catch (validationError) {
            return res.status(400).json({ error: validationError.message });
        }


        const {oldPassword, newPassword, confirmPassword} = validated

        const {id} = req.user;

        if (!id) {
            return res.status(401).json({ message: 'Unauthorized. tenant not authenticated' });
        }
        

        if (!oldPassword || !newPassword || !confirmPassword) {
            return res.status(400).json({ message: 'Please fill all fields' });
        }

        if (newPassword !== confirmPassword) {
            return res.status(400).json({ message: 'Passwords do not match' });
        }

        const user = await userModel.findById(id);
        

        if (!user) {
            return res.status(404).json({ message: 'user not found' });
        }

        const isPasswordCorrect = await bcrypt.compare(oldPassword, user.password);

        if (!isPasswordCorrect) {
            return res.status(400).json({ message: 'invalid credentials' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        user.password = hashedPassword;

        await user.save();

        res.status(200).json({ message: 'Password change successful' });
        
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Error initiating change password', error: error.message }); 
    }
};



exports.logout = async (req, res) => {
    try {
        const { id } = req.user;

        if (!id) {
            return res.status(401).json({ message: 'Unauthorized. user not authenticated' });
        }

        const user = await userModel.findById(id);


        if (!user) {
            return res.status(404).json({ message: 'user not found' });
        }

        user.isLoggedIn = false;

        await user.save();

        res.status(200).json({ message: 'Logout successful' });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Error logging out user', error: error.message });
    }
};
