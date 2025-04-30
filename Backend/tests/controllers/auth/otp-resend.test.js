const { resendOTP } = require('../../../controllers/Authentications');
const User = require('../../../models/User');
const Otp = require('../../../models/Otp');

// Mock the dependencies
jest.mock('../../../models/User');
jest.mock('../../../models/Otp');

// Mock the sendOTPVerificationEmail function
jest.mock('../../../controllers/Authentications', () => {
    const originalModule = jest.requireActual('../../../controllers/Authentications');
    return {
        ...originalModule,
        sendOTPVerificationEmail: jest.fn().mockResolvedValue(true)
    };
});

// Store original console.error
const originalConsoleError = console.error;

describe('OTP Resend Tests', () => {
    let req;
    let res;

    beforeAll(() => {
        // Suppress console.error during tests
        console.error = jest.fn();
    });

    afterAll(() => {
        // Restore console.error
        console.error = originalConsoleError;
    });

    beforeEach(() => {
        // Clear all mocks before each test
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
        Otp.deleteMany = jest.fn().mockResolvedValue({ deletedCount: 1 });
        Otp.create = jest.fn().mockResolvedValue({ _id: 'otp123', otp: '123456' });
        Otp.updateOne = jest.fn().mockResolvedValue({ acknowledged: true });
    });

    describe('UT-Auth-009: OTP Resend', () => {
        it('should successfully resend OTP for unverified user', async () => {
            // Test input data
            const testData = {
                email: "unverifieduser@zenfoline.com"
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

            req.body = testData;

            // Execute the resend OTP function
            await resendOTP(req, res);

            // Assertions
            expect(User.findOne).toHaveBeenCalledWith({ email: testData.email });
            expect(Otp.updateOne).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                message: 'OTP resent successfully!'
            });
        });

        it('should handle already verified user', async () => {
            // Test input data
            const testData = {
                email: "prayash@example.com"
            };

            // Mock user data with verified status
            const mockUser = {
                _id: 'mockUserId123',
                email: testData.email,
                verified: true
            };

            // Mock User.findOne
            User.findOne.mockReturnValue({
                lean: jest.fn().mockResolvedValue(mockUser)
            });

            req.body = testData;

            // Execute the resend OTP function
            await resendOTP(req, res);

            // Assertions
            expect(User.findOne).toHaveBeenCalledWith({ email: testData.email });
            expect(Otp.updateOne).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                message: 'OTP resent successfully!'
            });
        });

        it('should handle non-existent user', async () => {
            // Test input data
            const testData = {
                email: "nonexistent@example.com"
            };

            // Mock User.findOne to return null
            User.findOne.mockReturnValue({
                lean: jest.fn().mockResolvedValue(null)
            });

            req.body = testData;

            // Execute the resend OTP function
            await resendOTP(req, res);

            // Assertions
            expect(User.findOne).toHaveBeenCalledWith({ email: testData.email });
            expect(Otp.updateOne).not.toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({
                message: 'User not found!'
            });
        });

        it('should handle missing email field', async () => {
            // Test input data with missing email
            const testData = {};

            req.body = testData;

            // Execute the resend OTP function
            await resendOTP(req, res);

            // Assertions
            expect(User.findOne).toHaveBeenCalledWith({ email: undefined });
            expect(Otp.updateOne).not.toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({
                message: 'User not found!'
            });
        });

        it('should handle database errors gracefully', async () => {
            // Test input data
            const testData = {
                email: "prayash@example.com"
            };

            // Mock User.findOne to simulate database error
            User.findOne.mockReturnValue({
                lean: jest.fn().mockRejectedValue(new Error('Database connection error'))
            });

            req.body = testData;

            // Execute the resend OTP function
            await resendOTP(req, res);

            // Assertions
            expect(User.findOne).toHaveBeenCalledWith({ email: testData.email });
            expect(Otp.updateOne).not.toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                message: 'An error occurred during OTP resend.'
            });
        });
    });
}); 