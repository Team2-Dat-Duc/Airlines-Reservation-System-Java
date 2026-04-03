const User = require('../models/User');

exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.userId).select('-passwordHash');
        if (!user) return res.status(404).json({ message: "Không tìm thấy người dùng" });
        
        res.status(200).json(user);
    } catch (err) {
        res.status(500).json({ message: "Lỗi server", error: err.message });
    }
};

exports.updateProfile = async (req, res) => {
    try {
        const { name, phone, dateOfBirth, gender, address } = req.body;

        const updatedUser = await User.findByIdAndUpdate(
            req.userId,
            { name, phone, dateOfBirth, gender, address },
            { new: true, runValidators: true }
        ).select('-passwordHash');

        res.status(200).json({ message: "Cập nhật thành công", user: updatedUser });
    } catch (err) {
        res.status(500).json({ message: "Lỗi khi cập nhật", error: err.message });
    }
};

exports.getSavedPassengers = async (req, res) => {
    try {
        const user = await User.findById(req.userId).select('savedPassengers');
        if (!user) return res.status(404).json({ message: "Không tìm thấy người dùng" });
        
        res.status(200).json(user.savedPassengers);
    } catch (err) {
        res.status(500).json({ message: "Lỗi server", error: err.message });
    }
};

exports.addSavedPassenger = async (req, res) => {
    try {
        const newPassenger = req.body; 
        
        const user = await User.findByIdAndUpdate(
            req.userId, 
            { $push: { savedPassengers: newPassenger } }, 
            { new: true, runValidators: true }
        ).select('savedPassengers');

        if (!user) return res.status(404).json({ message: "Không tìm thấy người dùng" });

        res.status(201).json({ message: "Thêm hành khách thành công", savedPassengers: user.savedPassengers });
    } catch (err) {
        res.status(500).json({ message: "Lỗi khi thêm hành khách", error: err.message });
    }
};

exports.deleteSavedPassenger = async (req, res) => {
    try {
        const passengerId = req.params.id;
        
        const user = await User.findByIdAndUpdate(
            req.userId,
            { $pull: { savedPassengers: { _id: passengerId } } }, 
            { new: true }
        ).select('savedPassengers');

        if (!user) return res.status(404).json({ message: "Không tìm thấy người dùng" });

        res.status(200).json({ message: "Xóa hành khách thành công", savedPassengers: user.savedPassengers });
    } catch (err) {
        res.status(500).json({ message: "Lỗi khi xóa hành khách", error: err.message });
    }
};