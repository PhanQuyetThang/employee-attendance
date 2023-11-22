import User from "../models/user.model.js"
import { errorHandler } from "../utils/error.js"
import bcryptjs from 'bcryptjs'

export const test = (req, res) => {
    res.json({
        message: 'Api is working!',
    })
}

export const updateUser = async (req, res, next) => {
    if (req.user.id !== req.params.id) return next(errorHandler(401, "You can only update your own account!"))
    try {
        if (req.body.password) {
            req.body.password = bcryptjs.hashSync(req.body.password, 10)
        }
        const updatedUser = await User.findByIdAndUpdate(req.params.id, {
            $set: {
                username: req.body.username,
                email: req.body.email,
                password: req.body.password,
                avatar: req.body.avatar,
                phonenumber: req.body.phonenumber,
                address: req.body.address,
                department: req.body.department
            }
        }, { new: true })
        const { password, ...rest } = updatedUser._doc;
        res.status(200).json(rest)
    } catch (error) {
        next(error)
    }
}

export const deleteUser = async (req, res, next) => {
    if (req.user.id !== req.params.id) return next(errorHandler(401, "You can only delete your own account!"))
    try {
        await User.findByIdAndDelete(req.params.id, { new: true })
        res.clearCookie("access_token")
        res.status(200).json("User has been deleted!")
    } catch (error) {
        next(error)
    }
}

export const getUser = async (req, res, next) => {
    try {
        const users = await User.find(); // Lấy danh sách người dùng từ cơ sở dữ liệu
        // Trả về danh sách người dùng dưới dạng phản hồi JSON
        res.json(users);
    } catch (error) {
        // Xử lý lỗi nếu có
        next(error); // Gọi middleware tiếp theo hoặc xử lý lỗi nếu cần
    }
};

export const amountUser = async (req, res, next) => {
    try {
        const users = await User.find();
        const userCount = users.length;

        res.json({ totalUsers: userCount });
    } catch (error) {
        next(error);
    }
};

export const ProfileDetail = async (req, res, next) => {
    try {
        if (!req.params.id) {
            throw errorHandler(402, "User not found!");
        }
        const userID = req.params.id;
        const user = await User.findOne({ userID: userID });
        const { password, ...rest } = user._doc;
        res.status(200).json(rest)
    } catch (error) {
        next(error);
    }
};

export const AttendanceDetail = async (req, res, next) => {
    try {
        const userId = req.params.id;

        // Kiểm tra xem userId có giá trị không hoặc có định dạng hợp lệ không
        if (!userId || !isValidUserId(userId)) {
            throw new Error("Invalid user ID");
        }

        const user = await User.findById(userId);

        // Kiểm tra xem user có tồn tại không
        if (!user) {
            throw new Error("User not found");
        }

        // Loại bỏ trường password trước khi trả về dữ liệu
        const { password, ...rest } = user._doc;

        res.status(200).json(rest);
    } catch (error) {
        // Xử lý lỗi và chuyển tiếp cho middleware xử lý lỗi tiếp theo
        next(error);
    }
};

// Hàm kiểm tra định dạng user ID có thể được thêm vào
const isValidUserId = (userId) => {
    // Kiểm tra logic định dạng user ID
    return true;
};

export const saveBiometricData = async (req, res, next) => {
    const { userID, method, data } = req.body;

    try {
        const user = await User.saveBiometricData(userID, method, data);
        res.status(200).json({ success: true, message: 'Biometric data saved successfully', user });
    } catch (error) {
        next(error)
    }
};

export const saveBiometric = async (req, res, next) => {
    try {
        const { userId, biometricData } = req.body;

        // Assuming saveBiometricData is a function that saves data to your database
        await saveBiometricData(userId, biometricData);

        // Update the user's biometrics array
        await User.findOneAndUpdate(
            { userID: userId },
            { $push: { biometrics: biometricData } },
            { new: true }
        );

        res.json({ success: true, message: 'Biometric data saved successfully' });
    } catch (error) {
        next(error)
    }
}

