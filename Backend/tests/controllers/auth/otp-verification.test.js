const { verifyRegisterOtp } = require('../../../controllers/Authentications');
const User = require('../../../models/User');
const Otp = require('../../../models/Otp');

// Mock the dependencies
jest.mock('../../../models/User');
jest.mock('../../../models/Otp');

describe('OTP Verification Tests', () => {
    beforeEach(() => {
        // Clear all mocks before each test
        jest.clearAllMocks();
    });

    describe('UT-Auth-003: OTP Verification', () => {
        it('should successfully verify OTP for a valid user', async () => {
            // Test input data
            const testData = {
                email: "prayash@example.com",
                otp: "123456"
            };

            // Mock user data
            const mockUser = {
                _id: 'mockUserId123',
                email: testData.email,
                verified: false
            };

            // Mock OTP data
            const mockOtp = {
                _id: 'mockOtpId123',
                user_id: mockUser._id,
                otp: testData.otp,
                otpExpiry: new Date(Date.now() + 60 * 1000) // 1 minute in the future
            };

            // Mock User.findOne
            User.findOne.mockReturnValue({
                lean: jest.fn().mockResolvedValue(mockUser)
            });

            // Mock Otp.findOne
            Otp.findOne.mockReturnValue({
                lean: jest.fn().mockResolvedValue(mockOtp)
            });

            // Mock User.updateOne
            User.updateOne.mockResolvedValue({ modifiedCount: 1 });

            // Mock Otp.deleteOne
            Otp.deleteOne.mockResolvedValue({ deletedCount: 1 });

            // Create mock request and response objects
            const mockReq = {
                body: testData
            };
            const mockRes = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            // Execute the verification function
            await verifyRegisterOtp(mockReq, mockRes);

            // Assertions
            expect(User.findOne).toHaveBeenCalledWith({ email: testData.email });
            expect(Otp.findOne).toHaveBeenCalledWith({
                user_id: mockUser._id,
                otp: testData.otp
            });
            expect(User.updateOne).toHaveBeenCalledWith(
                { _id: mockUser._id },
                { verified: true }
            );
            expect(Otp.deleteOne).toHaveBeenCalledWith({ _id: mockOtp._id });
            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: 'Registration successful. You can now log in.'
            });
        });

        it('should reject verification with invalid OTP', async () => {
            // Test input data
            const testData = {
                email: "prayash@example.com",
                otp: "wrong-otp"
            };

            // Mock user data
            const mockUser = {
                _id: 'mockUserId123',
                email: testData.email,
                verified: false
            };

            // Mock User.findOne
            User.findOne.mockReturnValue({
                lean: jest.fn().mockResolvedValue(mockUser)
            });

            // Mock Otp.findOne to return null (invalid OTP)
            Otp.findOne.mockReturnValue({
                lean: jest.fn().mockResolvedValue(null)
            });

            // Create mock request and response objects
            const mockReq = {
                body: testData
            };
            const mockRes = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            // Execute the verification function
            await verifyRegisterOtp(mockReq, mockRes);

            // Assertions
            expect(User.findOne).toHaveBeenCalledWith({ email: testData.email });
            expect(Otp.findOne).toHaveBeenCalledWith({
                user_id: mockUser._id,
                otp: testData.otp
            });
            expect(User.updateOne).not.toHaveBeenCalled();
            expect(Otp.deleteOne).not.toHaveBeenCalled();
            expect(mockRes.status).toHaveBeenCalledWith(400);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: 'Invalid or expired OTP.'
            });
        });

        it('should reject verification with expired OTP', async () => {
            // Test input data
            const testData = {
                email: "prayash@example.com",
                otp: "123456"
            };

            // Mock user data
            const mockUser = {
                _id: 'mockUserId123',
                email: testData.email,
                verified: false
            };

            // Mock OTP data with expired timestamp
            const mockOtp = {
                _id: 'mockOtpId123',
                user_id: mockUser._id,
                otp: testData.otp,
                otpExpiry: new Date(Date.now() - 60 * 1000) // 1 minute in the past
            };

            // Mock User.findOne
            User.findOne.mockReturnValue({
                lean: jest.fn().mockResolvedValue(mockUser)
            });

            // Mock Otp.findOne
            Otp.findOne.mockReturnValue({
                lean: jest.fn().mockResolvedValue(mockOtp)
            });

            // Create mock request and response objects
            const mockReq = {
                body: testData
            };
            const mockRes = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            // Execute the verification function
            await verifyRegisterOtp(mockReq, mockRes);

            // Assertions
            expect(User.findOne).toHaveBeenCalledWith({ email: testData.email });
            expect(Otp.findOne).toHaveBeenCalledWith({
                user_id: mockUser._id,
                otp: testData.otp
            });
            expect(User.updateOne).not.toHaveBeenCalled();
            expect(Otp.deleteOne).not.toHaveBeenCalled();
            expect(mockRes.status).toHaveBeenCalledWith(400);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: 'Invalid or expired OTP.'
            });
        });

        it('should handle non-existent user', async () => {
            // Test input data
            const testData = {
                email: "nonexistent@example.com",
                otp: "123456"
            };

            // Mock User.findOne to return null (user not found)
            User.findOne.mockReturnValue({
                lean: jest.fn().mockResolvedValue(null)
            });

            // Create mock request and response objects
            const mockReq = {
                body: testData
            };
            const mockRes = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            // Execute the verification function
            await verifyRegisterOtp(mockReq, mockRes);

            // Assertions
            expect(User.findOne).toHaveBeenCalledWith({ email: testData.email });
            expect(Otp.findOne).not.toHaveBeenCalled();
            expect(User.updateOne).not.toHaveBeenCalled();
            expect(Otp.deleteOne).not.toHaveBeenCalled();
            expect(mockRes.status).toHaveBeenCalledWith(404);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: 'User not found.'
            });
        });
    });
}); 