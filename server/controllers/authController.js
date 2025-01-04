import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import userModel from '../models/userModel.js';
import transporter from '../config/nodeMailer.js';

export const register = async (req, res) => {

    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.json({ success: false, message: 'Missing details' })
    }

    try {

        const existingUser = await userModel.findOne({ email })

        if (existingUser) {
            return res.json({ success: false, message: "User already exist" })
        }

        const hashedePasssword = await bcrypt.hash(password, 10);

        const user = new userModel({ name, email, password: hashedePasssword });
        await user.save();

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

        //send email
        const mailOption = {
            from: process.env.SENDER_EMAIL,
            to: email,
            subject: 'Welcome to Website',
            text: `Welcome to our website. Your account has been successfully created with email id: ${email}`
        }

        await transporter.sendMail(mailOption)

        return res.json({ success: true })

    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}

export const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.json({ success: false, message: 'Email and password are required' })
    }

    try {
        const user = await userModel.findOne({ email });

        if (!user) {
            return res.json({ success: false, message: 'Invalid email' })
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.json({ success: false, message: 'Invalid password' })
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

        return res.json({ success: true })

    } catch (error) {
        return res.json({ success: false, message: error.message })
    }
}

export const logout = async (req, res) => {

    try {

        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict'
        })

        return res.json({ success: true, message: "Logged Out" })

    } catch (error) {
        return res.json({ success: false, message: error.message })
    }
}

//send verification OTP to user
export const sendVerifyOtp = async (req, res) => {

    try {
        const { userID } = req.body;

        const user = await userModel.findById(userID);

        if (user.isAccountVerified) {
            return res.json({ success: false, message: 'Account Already verified' })
        }

        const otp = String(Math.floor(100000 + Math.random() * 900000))

        user.verifyOtp = otp;
        user.verifyOtpExpiryAt = Date.now() + 24 * 60 * 60 * 1000

        await user.save();

        const mailOption = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: 'Account verfifcation OTP',
            text: `Your OTP is ${otp}. Verify your account using this OTP.`
        }

        await transporter.sendMail(mailOption);

        res.json({ success: true, message: 'Verification OTP sent on Email.' })


    } catch (error) {
        return res.json({ success: false, message: error.message })
    }
}

export const verifyEmail = async (req, res) => {
    const { userID, otp } = req.body;

    if (!userID || !otp) {
        return res.json({ success: false, message: 'Missing details' })
    }
    try {
        const user = await userModel.findById(userID);

        if (!user) {
            return res.json({ success: false, message: 'User Not Found' })
        }

        if (user.verifyOtp === '' || user.verifyOtp !== otp) {
            return res.json({ success: false, message: 'Invalid OTP' })
        }

        if (user.verifyOtpExpiryAt < Date.now()) {
            return res.json({ success: false, message: 'OTP expired' })
        }

        user.isAccountVerified = true;
        user.verifyOtp = '';
        user.verifyOtpExpiryAt = 0;

        await user.save();
        return res.json({ success: true, message: 'Email verfied successfully' })

    } catch (error) {
        return res.json({ success: false, message: error.message })
    }
}

//check if user is authenticated
export const isAuthenticated = (req, res) => {
    try {
        return res.json({ success: true })
    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}

//password reset otp
export const sendResetOtp = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.json({ success: false, message: "Email is required" })
    }

    try {
        const user = await userModel.findOne({ email })
        if (!email) {
            return res.json({ success: false, message: "User not found" })
        }
        const otp = String(Math.floor(100000 + Math.random() * 900000))

        user.resetOtp = otp;
        user.resetOtpExpiryAt = Date.now() + 15 * 60 * 1000

        await user.save();

        const mailOption = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: 'Password reset OTP',
            text: `Your OTP for resetting your password is ${otp}. Use this OTP for resetting the poassword`
        }
        await transporter.sendMail(mailOption);

        return res.json({ success: true, message: 'OTP sent to your email' })
    } catch (error) {
        return res.json({ success: false, message: error.message })
    }
}

//reset password
export const resetPassword = async (req, res) => {
    const { email, otp, newPassword } = req.body;
    if (!email || !otp || !newPassword) {
        return res.json({ success: false, message: 'Email , OTP and new password is required' })
    }

    try {
        const user = await userModel.findOne({email})
        if (!user) {
            return res.json({ success: false, message: 'User not found' })
        }

        if (user.resetOtp === "" || user.resetOtp !== otp) {
            return res.json({ success: false, message: 'Inavlid OTP' })
        }

        if (user.resetOtpExpiryAt < Date.now()) {
            return res.json({ success: false, message: 'OTP expired' })
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10)

        user.password = hashedPassword;
        user.resetOtp = '';
        user.resetOtpExpiryAt = '';

        await user.save()

        return res.json({success: true, message: 'Password has been reset successfully'})

    } catch (error) {
        return res.json({ success: false, message: error.message })
    }
}