import User from "../models/user.model.js"
import { errorHandler } from "../utils/error.js"
import bcryptjs from 'bcryptjs'
import fuzzy from 'fuzzy';

export const test = (req, res) => {
    res.json({
        message: 'Api is working!',
    })
}

export const testApi = (req, res) => {
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

export const testdelete = async (req, res, next) => {
    try {
        await User.findByIdAndDelete(req.params.id, { new: true })
        res.clearCookie("access_token")
        res.status(200).json("User has been deleted!")
    } catch (error) {
        next(error)
    }
}

export const deleteUser = async (req, res, next) => {
    try {
        // Tìm người dùng theo userID và xóa
        const result = await User.deleteOne({ userID: req.params.id });

        // Kiểm tra xem có bản ghi nào bị xóa không
        if (result.deletedCount === 0) {
            return res.status(404).json({ success: false, message: "Người dùng không tồn tại." });
        }

        // Gửi phản hồi về phía client
        res.status(200).json({ success: true, message: "Người dùng đã được xóa!" });
    } catch (error) {
        // Xử lý lỗi và chuyển tiếp cho middleware xử lý lỗi tiếp theo
        next(error);
    }
};


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

        // Tìm kiếm người dùng trong cơ sở dữ liệu với userID
        const user = await User.findOne({ userID: userId });

        // Kiểm tra xem user có tồn tại không
        if (!user) {
            throw new Error("User not found");
        }

        // Thêm biometricData vào mảng biometrics của user
        user.biometrics.push({
            method: biometricData.method,
            data: biometricData.data
        });

        // Lưu cập nhật vào cơ sở dữ liệu
        await user.save();

        // Loại bỏ trường password trước khi trả về dữ liệu
        const { password, ...rest } = user._doc;

        // Gửi phản hồi về client với thông tin user đã được cập nhật
        res.status(200).json({ rest, message: 'Biometric data saved successfully', user });
    } catch (error) {
        next(error);
    }
};

// Hàm kiểm tra vân tay
export const checkFingerprint = async (req, res, next) => {
    try {
        const { userId, fingerprintData } = req.body;

        // Tìm kiếm người dùng trong cơ sở dữ liệu với userID
        const user = await User.findOne({ userID: userId });

        // Kiểm tra xem user có tồn tại không
        if (!user) {
            throw new Error("User not found");
        }

        // Lấy ra mảng biometrics của người dùng
        const userBiometrics = user.biometrics;

        // So sánh dữ liệu vân tay mới với dữ liệu trong mảng biometrics
        const matchingBiometric = userBiometrics.find((biometric) =>
            biometric.data.includes(fingerprintData)
        );

        // Kết quả của quá trình kiểm tra
        const isMatch = !!matchingBiometric;

        // Gửi phản hồi về client với kết quả kiểm tra
        res.status(200).json({ isMatch });
    } catch (error) {
        next(error);
    }
};


export const Search = async (req, res, next) => {
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

export const getBiometric = async (req, res, next) => {
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
}