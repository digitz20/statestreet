const Joi = require('joi')

exports.registerSchema = Joi.object().keys({
    fullName: Joi.string().min(3).trim().pattern(/^\s*[A-Za-z ]+\s*$/).messages({
        'any.required': 'FullName is required',
        'string.empty': 'FullName cannot be empty',
        'string.pattern.base': 'FullName should only contain alphabets',
        'string.min': 'FullName should not be less than 3 letters',
    }).required(),
    email: Joi.string().email().trim().required().messages({
        'string.email': 'Invalid email format',
        'any.required': 'Email is required',
        'string.empty': 'Email cannot be empty',
    }),
    password: Joi.string().pattern(/^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/).trim().messages({
        'string.pattern.base': 'Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character [!@#$%^&*]',
        'any.required': 'Password is required',
        'string.empty': 'Password cannot be empty',
    }).required(),
    confirmPassword: Joi.string().valid(Joi.ref('password')).messages({
        'any.only': 'Passwords do not match',
        'any.required': 'Confirm password is required',
    }).required(),
});



// exports.registerSchema = Joi.object().keys({
//     fullName: Joi.string().min(3).max(40).required(),
//     email: Joi.string().trim().email().required(),
//     password: Joi.string().required(),
//     confirmPassword: Joi.string().required().valid(Joi.ref('password')).required().messages({
//         'any.only': 'Passwords do not match',
//     }),
//     username: Joi.string().min(3).required(),

//  })



exports.loginSchema = Joi.object().keys({
    email: Joi.string().trim().email().required().messages({
        'string.email': 'Invalid email format',
        'any.required': 'Email is required',
        'string.empty': 'Email cannot be empty',
    }),
    password: Joi.string().trim().messages({
        'any.required': 'invalid credentials',
        'string.empty': 'password cannot be empty',
    }).required(),
    
})


exports.verificationEmailSchema = Joi.object().keys({
    email: Joi.string().trim().email().required().messages({
        'string.email': 'Invalid email format',
        'any.required': 'Email is required',
        'string.empty': 'Email cannot be empty',
    }),


})


exports.forgotPasswordSchema = Joi.object().keys({
    email: Joi.string().trim().email().required().messages({
        'string.email': 'Invalid email format',
        'any.required': 'Email is required',
        'string.empty': 'Email cannot be empty',
    }),

})


exports.verifyPasswordSchema = Joi.object().keys({
    otp: Joi.string().length(4).required().messages({
        'any.required': 'OTP is required',
        'string.length': 'OTP must be exactly 4 characters',
    }),

})





exports.resetPasswordschema = Joi.object().keys({
    // email: Joi.string().trim().email().required().messages({
    //     'string.email': 'Invalid email format',
    //     'any.required': 'Email is required',
    //     'string.empty': 'Email cannot be empty',
    // }),
    // otp: Joi.string().length(4).required().messages({
    //     'any.required': 'OTP is required',
    //     'string.length': 'OTP must be exactly 4 characters',
    // }),
    password: Joi.string().pattern(/^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/).trim().messages({
        "any.required":"password is required",
         "string.empty": "password cannot be Empty",
         "string.pattern.base": 'password must be mininum of 8 character and include at least one Uppercase, lowercase and a special character [!!@#$%^&*]'
    }).required(),
    confirmPassword: Joi.string().valid(Joi.ref('password')).messages({
        'any.only': 'Passwords do not match',
        'any.required': 'Confirm password is required',
    }).required(),
})


exports.changePassword = Joi.object().keys({
    oldPassword: Joi.string().required().messages({
        'any.required': 'Old password is required',
        'string.empty': 'Old password cannot be empty',
    }),
   newPassword: Joi.string().pattern(/^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/).trim().messages({
        'string.pattern.base': 'New password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character [!@#$%^&*]',
        'any.required': 'New password is required',
        'string.empty': 'New password cannot be empty',
    }).required(),
    confirmPassword: Joi.string().valid(Joi.ref('newPassword')).messages({
        'any.only': 'Passwords do not match',
        'any.required': 'Confirm password is required',
    }).required(),
})
