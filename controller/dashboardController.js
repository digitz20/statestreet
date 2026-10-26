const dashboardModel = require('../model/dashboard');
const userModel = require('../model/user');

exports.getDashboard = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await userModel.findById(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const dashboard = await dashboardModel.findOne({ user: user._id }).populate('transaction');
        if (!dashboard) {
            return res.status(404).json({ message: 'Dashboard not found' });
        }
        res.status(200).json({ dashboard });
    } catch (error) {
        console.error('Error fetching dashboard:', error);
        res.status(500).json({ message: 'Error fetching dashboard', error: error.message });
    }
};
exports.getProfile = async(req, res) => {
    try {
        const { id } = req.params;
        console.log(`Attempting to get profile for user ID: ${id}`);
        const user = await userModel.findById(id);
        if (!user) {
            console.log(`User not found for ID: ${id}`);
            return res.status(404).json({ message: 'User not found' });
        }
        console.log(`User found: ${user._id}`);
        const dashboard = await dashboardModel.findOne({ user: user._id }).populate('transaction');
        if (!dashboard) {
            console.log(`Dashboard not found for user ID: ${user._id}`);
            return res.status(404).json({ message: 'Dashboard not found' });
        }
        res.status(200).json({message: 'User and dashboard data retrieved successfully', user, dashboard });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error getting profile', error: error.message });
    }
};