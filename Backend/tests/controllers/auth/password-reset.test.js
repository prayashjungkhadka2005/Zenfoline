const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const { forgotPasswordOtp, verifyForgotPasswordOtp, updateForgotPassword } = require('../../../controllers/Authentications');
const User = require('../../../models/User');
const Otp = require('../../../models/Otp');

// Mock dependencies
jest.mock('bcrypt');
jest.mock('nodemailer');
jest.mock('../../../models/User');
jest.mock('../../../models/Otp');

// Store original console.error
const originalConsoleError = console.error;

describe('Password Reset Tests', () => {
    let req;
    let res;

    beforeAll(() => {
        // Suppress console.error during tests
        console.error = jest.fn();

        // Mock environment variables
        process.env.EMAIL = 'test@example.com';
        process.env.EMAIL_PASSWORD = 'test-password';
    });

    afterAll(() => {
        // Restore console.error
        console.error = originalConsoleError;
    });

    beforeEach(() => {
        // Reset all mocks
        jest.clearAllMocks();

        // Setup request and response objects
        req = {
            body: {}
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        // Mock User.findOne to return a function that returns a promise
        User.findOne = jest.fn().mockReturnValue({
            lean: jest.fn().mockResolvedValue(null)
        });

        // Mock Otp methods
        Otp.findOne = jest.fn().mockReturnValue({
            lean: jest.fn().mockResolvedValue(null)
        });
        Otp.updateOne = jest.fn().mockResolvedValue({ acknowledged: true });
        Otp.deleteOne = jest.fn().mockResolvedValue({ acknowledged: true });
    });

    describe('UT-Auth-005: Forgot Password OTP Generation', () => {
        it('should send reset OTP successfully for existing user', async () => {
            const mockUser = { _id: 'user123', email: 'test@example.com' };
            User.findOne.mockReturnValue({
                lean: jest.fn().mockResolvedValue(mockUser)
            });

            req.body = { email: 'test@example.com' };

            await forgotPasswordOtp(req, res);

            expect(User.findOne).toHaveBeenCalledWith({ email: 'test@example.com' });
            expect(Otp.updateOne).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                status: 'Pending',
                message: 'Password reset OTP email is being sent.',
                data: { email: 'test@example.com' }
            });
        });

        it('should handle non-existent user', async () => {
            User.findOne.mockReturnValue({
                lean: jest.fn().mockResolvedValue(null)
            });

            req.body = { email: 'nonexistent@example.com' };

            await forgotPasswordOtp(req, res);

            expect(User.findOne).toHaveBeenCalledWith({ email: 'nonexistent@example.com' });
            expect(Otp.updateOne).not.toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({
                message: 'User not found! Please enter a correct email.'
            });
        });
    });

    describe('UT-Auth-006: Verify Forgot Password OTP', () => {
        it('should verify OTP successfully', async () => {
            const mockUser = { _id: 'user123', email: 'test@example.com' };
            const mockOtp = { _id: 'otp123', otp: '123456' };
            
            User.findOne.mockReturnValue(mockUser);
            Otp.findOne.mockReturnValue(mockOtp);

            req.body = { email: 'test@example.com', otp: '123456' };

            await verifyForgotPasswordOtp(req, res);

            expect(User.findOne).toHaveBeenCalledWith({ email: 'test@example.com' });
            expect(Otp.findOne).toHaveBeenCalledWith({
                user_id: mockUser._id,
                otp: '123456'
            });
            expect(Otp.deleteOne).toHaveBeenCalledWith({ _id: mockOtp._id });
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                message: 'OTP verified. You can now update your password.'
            });
        });

        it('should handle invalid OTP', async () => {
            const mockUser = { _id: 'user123', email: 'test@example.com' };
            
            User.findOne.mockReturnValue(mockUser);
            Otp.findOne.mockReturnValue(null);

            req.body = { email: 'test@example.com', otp: '123456' };

            await verifyForgotPasswordOtp(req, res);

            expect(User.findOne).toHaveBeenCalledWith({ email: 'test@example.com' });
            expect(Otp.findOne).toHaveBeenCalledWith({
                user_id: mockUser._id,
                otp: '123456'
            });
            expect(Otp.deleteOne).not.toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Invalid or expired OTP.'
            });
        });

        it('should handle non-existent user during verification', async () => {
            User.findOne.mockReturnValue(null);

            req.body = { email: 'nonexistent@example.com', otp: '123456' };

            await verifyForgotPasswordOtp(req, res);

            expect(User.findOne).toHaveBeenCalledWith({ email: 'nonexistent@example.com' });
            expect(Otp.findOne).not.toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({
                message: 'User not found!'
            });
        });
    });

    describe('UT-Auth-007: Update Forgot Password', () => {
        it('should update password successfully', async () => {
            const mockUser = {
                _id: 'user123',
                email: 'test@example.com',
                password: 'old-hashed-password',
                save: jest.fn().mockResolvedValue(true)
            };

            User.findOne.mockReturnValue(mockUser);
            bcrypt.compare.mockResolvedValue(false);
            bcrypt.hash.mockResolvedValue('new-hashed-password');

            req.body = { email: 'test@example.com', newPassword: 'newPassword123' };

            await updateForgotPassword(req, res);

            expect(User.findOne).toHaveBeenCalledWith({ email: 'test@example.com' });
            expect(bcrypt.compare).toHaveBeenCalledWith('newPassword123', 'old-hashed-password');
            expect(bcrypt.hash).toHaveBeenCalled();
            expect(mockUser.save).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Password updated successfully.'
            });
        });

        it('should reject same password', async () => {
            const mockUser = {
                _id: 'user123',
                email: 'test@example.com',
                password: 'hashed-password',
                save: jest.fn()
            };

            User.findOne.mockReturnValue(mockUser);
            bcrypt.compare.mockResolvedValue(true);

            req.body = { email: 'test@example.com', newPassword: 'oldPassword123' };

            await updateForgotPassword(req, res);

            expect(User.findOne).toHaveBeenCalledWith({ email: 'test@example.com' });
            expect(bcrypt.compare).toHaveBeenCalledWith('oldPassword123', 'hashed-password');
            expect(bcrypt.hash).not.toHaveBeenCalled();
            expect(mockUser.save).not.toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Enter a different password.'
            });
        });

        it('should handle non-existent user during password update', async () => {
            User.findOne.mockReturnValue(null);

            req.body = { email: 'nonexistent@example.com', newPassword: 'newPassword123' };

            await updateForgotPassword(req, res);

            expect(User.findOne).toHaveBeenCalledWith({ email: 'nonexistent@example.com' });
            expect(bcrypt.compare).not.toHaveBeenCalled();
            expect(bcrypt.hash).not.toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({
                message: 'User not found!'
            });
        });
    });
}); 