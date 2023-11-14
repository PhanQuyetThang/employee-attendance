import mongoose, { Schema } from "mongoose";

const userSchema = new mongoose.Schema({
    attendanceId: {
        type: String,
        required: true,
        unique: true,
    },
    userID: {
        type: String,
        required: true,
        unique: true,
    },
    BiometricMethod: {
        type: String,
        required: true,
    },
    TimeIn: {
        type: Date, // Đây là kiểu dữ liệu thời gian (Date) cho thời gian đến
        required: true, // Có thể cần điều này tùy thuộc vào yêu cầu
    },
    status: { //Status ghi lai trang thai nhan vien cham cong nhu dung gio, muon, som, vang mat, v.v.
        type: String,
        required: true
    }
}, { timestamps: true });

const TimeInLog = mongoose.model('TimeInLog', userSchema)

export default TimeInLog;