import User from "../models/user.model.js"
import TimeInLog from "../models/timeInLogs.model.js";
import TimeOutLog from '../models/timeOutLog.model.js'
import { startOfDay, endOfDay } from 'date-fns';
import moment from 'moment-timezone';
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
        const user = await User.findOne({ userID: userId });

        if (!user) {
            throw new Error("User not found");
        }

        // Tìm kiếm biometric có cùng method để cập nhật hoặc tạo mới nếu không tồn tại
        const existingBiometricIndex = user.biometrics.findIndex(bio => bio.method === biometricData.method);

        if (existingBiometricIndex !== -1) {
            // Nếu biometric đã tồn tại, cập nhật dữ liệu
            user.biometrics[existingBiometricIndex].data = biometricData.data;
        } else {
            // Nếu biometric chưa tồn tại, thêm mới vào mảng biometrics của user
            user.biometrics.push({
                method: biometricData.method,
                data: biometricData.data
            });
        }

        // Lưu cập nhật vào cơ sở dữ liệu
        await user.save();

        const { password, ...rest } = user._doc;
        res.status(200).json({ rest, message: 'Biometric data saved successfully', user });
    } catch (error) {
        next(error);
    }
};

export const deleteBiometric = async (req, res, next) => {
    try {
        const { userId, method } = req.body;

        // Tìm kiếm người dùng trong cơ sở dữ liệu với userID
        const user = await User.findOne({ userID: userId });

        // Kiểm tra xem user có tồn tại không
        if (!user) {
            throw new Error("User not found");
        }

        // Tìm kiếm biometric có cùng method để xóa
        const biometricIndexToDelete = user.biometrics.findIndex(bio => bio.method === method);

        if (biometricIndexToDelete !== -1) {
            // Nếu biometric tồn tại, xóa khỏi mảng biometrics của user
            user.biometrics.splice(biometricIndexToDelete, 1);

            // Lưu cập nhật vào cơ sở dữ liệu
            await user.save();

            // Loại bỏ trường password trước khi trả về dữ liệu
            const { password, ...rest } = user._doc;

            // Gửi phản hồi về client với thông tin user đã được cập nhật
            res.status(200).json({ rest, message: 'Biometric data deleted successfully', user });
        } else {
            // Nếu biometric không tồn tại, trả về thông báo
            res.status(404).json({ message: 'Biometric not found' });
        }
    } catch (error) {
        next(error);
    }
};


// Hàm tạo chuỗi ngẫu nhiên với ký tự số và độ dài 6
function generateUniqueAttendanceId() {
    let result = '';
    const characters = '0123456789';
    const length = 6;

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        result += characters.charAt(randomIndex);
    }

    return result;
}

export const checkAttendance = async (req, res, next) => {
    try {
        const { biometricData } = req.body;

        // Lấy thông tin người dùng dựa trên biometricData
        const user = await User.findOne({
            'biometrics.method': biometricData.method,
            'biometrics.data': biometricData.data,
        });

        // Kiểm tra xem user có tồn tại không
        if (!user) {
            throw new Error("User not found");
        }

        // Lấy thông tin username và userID từ user
        const { username, userID } = user;

        // Kiểm tra xem đã có bản ghi trong ngày chưa
        const todayStart = startOfDay(new Date());
        const todayEnd = endOfDay(new Date());
        const existingLog = await TimeInLog.findOne({
            userID,
            TimeIn: { $gte: todayStart, $lt: todayEnd },
        });

        // Nếu đã có bản ghi trong ngày, không thêm mới
        if (existingLog) {
            return res.status(200).json({ isMatch: false, username, userID, message: "Đã chấm công trong ngày" });
        }

        // Lấy ra mảng biometrics của người dùng
        const userBiometrics = user.biometrics || [];

        // So sánh dữ liệu vân tay mới với dữ liệu trong mảng biometrics
        const matchingBiometric = userBiometrics.find((biometric) =>
            biometric.data === biometricData.data && biometric.method === 'fingerprint'
        );

        // Kết quả của quá trình kiểm tra
        const isMatch = !!matchingBiometric;

        // Thêm mới bản ghi nếu chưa có trong ngày
        if (isMatch) {
            const attendanceId = generateUniqueAttendanceId();

            const timeInUTC = new Date();
            const timeInLocal = moment(timeInUTC).tz('Asia/Ho_Chi_Minh').format("YYYY-MM-DD HH:mm:ss");

            const timeInLog = new TimeInLog({
                attendanceId,
                userID: userID,
                username: username,
                BiometricMethod: matchingBiometric.method,
                TimeIn: timeInLocal,
                status: "Chấm công thành công",
            });

            await timeInLog.save();
        }

        // Gửi phản hồi về client với kết quả kiểm tra và thông tin username và userID
        res.status(200).json({ isMatch, username, userID });
    } catch (error) {
        next(error);
    }
};


export const getAttendanceInfo = async (req, res, next) => {
    try {
        if (!req.params.id) {
            throw errorHandler(402, "User not found!")
        }

        const userID = req.params.id;
        const attendanceInfo = await TimeInLog.findOne({ userID: userID });

        if (!attendanceInfo) {
            return res.status(404).json({ error: "Không tìm thấy thông tin chấm công cho người dùng." });
        }

        res.status(200).json(attendanceInfo);
    } catch (error) {
        // Xử lý lỗi sử dụng middleware next hoặc gửi phản hồi lỗi
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

let currentUserId = null;
let currentMethod = null;
let isDataAvailable = false;

// Get userID from UI
export const saveCurrentUserID = (req, res, next) => {
    try {
        const userId = req.params.id;
        const method = req.body.method;
        currentUserId = userId;
        currentMethod = method;
        isDataAvailable = true;

        res.json({ userId: currentUserId, method: currentMethod, message: 'UserID updated successfully' });
    } catch (error) {
        next(error);
    }
};

// GetBiometric API Route for ESP32
export const getBiometric = (req, res, next) => {
    try {
        if (!isDataAvailable) {
            return res.status(404).json({ error: 'Data not available yet' });
        }

        const userId = currentUserId;
        const method = currentMethod;

        // Reset data and flag after sending the response
        res.json({ userId, method });
        currentUserId = null;
        currentMethod = null;
        isDataAvailable = false;
    } catch (error) {
        next(error);
    }
};


