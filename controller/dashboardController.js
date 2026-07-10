const dashboardModel = require('../model/dashboard');
const userModel = require('../model/user');
const sendEmail = require('../middlewares/nodemailer');
const cloudinary = require('cloudinary').v2;

// Make sure Cloudinary is configured somewhere in your project, e.g.:
// cloudinary.config({ 
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
//   api_key: process.env.CLOUDINARY_API_KEY, 
//   api_secret: process.env.CLOUDINARY_API_SECRET 
// });

exports.createProfile = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await userModel.findById(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if file is present
        if (!req.file) {
            return res.status(400).json({ message: 'No image file uploaded' });
        }

        // Upload image to Cloudinary
        const result = await cloudinary.uploader.upload(req.file.path, {
            folder: 'uploads',
            resource_type: 'image'
        });

        // Save image as object with publicId and imageUrl
        user.image = {
            publicId: result.public_id,
            imageUrl: result.secure_url
        };
        await user.save();

        const dashboard = new dashboardModel({
            username: user.fullName,
            balance: user.balance,
            totalDeposit: user.totalDeposit,
            image: user.image,
            user: user._id,
            transaction: user.transaction || [],
        });

        await dashboard.save();

        res.status(201).json({ message: 'Profile created successfully', dashboard });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating profile', error: error.message });
    }
};

exports.getDashboard = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await userModel.findById(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const dashboard = await dashboardModel.findOne({ user: user._id });
        if (!dashboard) {
            return res.status(404).json({ message: 'Dashboard not found' });
        }
        res.status(200).json({ dashboard });
    } catch (error) {
        console.error('Error fetching dashboard:', error);
        res.status(500).json({ message: 'Error fetching dashboard', error: error.message });
    }
};

exports.updateProfile = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await userModel.findById(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Update user fields if provided
        const { fullName, balance, totalDeposit } = req.body;
        if (fullName) user.fullName = fullName;
        if (balance) user.balance = balance;
        if (totalDeposit) user.totalDeposit = totalDeposit;

        // If a new image is uploaded, upload to Cloudinary and update
        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path, {
                folder: 'uploads',
                resource_type: 'image'
            });
            user.image = {
                publicId: result.public_id,
                imageUrl: result.secure_url
            };
        }

        await user.save();

        // Update dashboard as well
        const dashboard = await dashboardModel.findOne({ user: user._id });
        if (dashboard) {
            if (fullName) dashboard.username = fullName;
            if (balance) dashboard.balance = balance;
            if (totalDeposit) dashboard.totalDeposit = totalDeposit;
            if (user.image) dashboard.image = user.image;
            await dashboard.save();
        }

        res.status(200).json({ message: 'Profile updated successfully', user, dashboard });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating profile', error: error.message });
    }
};

exports.deleteProfile = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await userModel.findById(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Optionally: Delete profile image from Cloudinary if you store public_id
        // if (user.image && user.image.publicId) {
        //     await cloudinary.uploader.destroy(user.image.publicId);
        // }

        // Delete dashboard
        await dashboardModel.findOneAndDelete({ user: user._id });

        // Optionally: Delete user as well (uncomment if desired)
        // await userModel.findByIdAndDelete(id);

        res.status(200).json({ message: 'Profile deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting profile', error: error.message });
    }
};

exports.getProfile = async(req, res) => {
    try {
        const { id } = req.params;
        const user = await userModel.findById(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const dashboard = await dashboardModel.findOne({ user: user._id });
        if (!dashboard) {
            return res.status(404).json({ message: 'Dashboard not found' });
        }
        res.status(200).json({message: 'profile gotten successfully', user, dashboard });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error getting profile', error: error.message });
    }
};
