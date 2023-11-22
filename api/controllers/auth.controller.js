import User from "../models/user.model.js";
import bcryptjs from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid'; // Import phiên bản 4 của uuid
import { errorHandler } from "../utils/error.js";
import jwt from 'jsonwebtoken';

// export const signup = async (req, res, next) => {
//     const { username, email, password, phonenumber, department, address } = req.body;
//     const hashedPassword = bcryptjs.hashSync(password, 10);

//     // Generate a random userId (for example, a random string)
//     const userId = Math.random().toString(36).substr(2, 10);

//     const newUser = new User({ userId, username, email, password: hashedPassword, phonenumber, department, address });

//     try {
//         await newUser.save();
//         res.status(201).json("User created successfully!");
//     } catch (error) {
//         next(error);
//     }
// };

export const signup = async (req, res, next) => {
    const { username, email, password, phonenumber, department } = req.body;
    const hashedPassword = bcryptjs.hashSync(password, 10);

    // Tạo một chuỗi UUID ngẫu nhiên
    const userID = uuidv4();

    // Chọn những trường dữ liệu cần thiết và thêm trường userId
    const newUser = new User({ userID, username, email, password: hashedPassword, phonenumber, department });

    try {
        await newUser.save();
        res.status(201).json("User created successfully!");

    } catch (error) {
        next(error);
    }
};

export const signin = async (req, res, next) => {
    const { email, password } = req.body;
    try {
        const validUser = await User.findOne({ email })
        if (!validUser) return next(errorHandler(404, 'User not found!'))
        const validPassword = bcryptjs.compareSync(password, validUser.password);
        if (!validPassword) return next(errorHandler(401, 'Wrong credentials!'));
        const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET)
        //destructuring assignment with password, _doc means document data of user
        const { password: pass, ...rest } = validUser._doc;
        //rest contains user data except password
        res.cookie('access_token', token, { httpOnly: true }).status(200).json(rest)
    } catch (error) {
        next(error)
    }
}

export const google = async (req, res, next) => {
    try {
        const user = await User.findOne({ email: req.body.email });

        if (user) {
            // Xử lý khi người dùng đã tồn tại
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
            const { password: pass, ...rest } = user._doc;
            res.cookie('access_token', token, { httpOnly: true }).status(200).json(rest);
        } else {
            const generatedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
            const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);
            const generatedUserId = Math.floor(100000 + Math.random() * 900000); // Tạo số ngẫu nhiên từ 100000 đến 999999;
            const newUser = new User({
                userID: generatedUserId,
                username: req.body.name,
                email: req.body.email,
                password: hashedPassword,
                avatar: req.body.photo,
            });
            await newUser.save();

            const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);
            const { password: pass, ...rest } = newUser._doc;
            res.cookie('access_token', token, { httpOnly: true }).status(200).json(rest);
        }
    } catch (error) {
        next(error);
    }
};

export const signout = async (req, res, next) => {
    try {
        res.clearCookie('access_token');
        res.status(200).json('User has been logged out!')
    } catch (error) {
        next(error)
    }
}