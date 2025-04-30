const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

// Mock the dependencies first
jest.mock('nodemailer');

// Set up nodemailer mock before requiring the authentication module
const mockSendMail = jest.fn().mockResolvedValue({ response: 'Email sent' });
const mockTransporter = {
    sendMail: mockSendMail
};
nodemailer.createTransport = jest.fn().mockReturnValue(mockTransporter);

// Now require the modules that use nodemailer
const { handleSignupMethod } = require('../../../controllers/Authentications');
const User = require('../../../models/User');
const Otp = require('../../../models/Otp');

// Mock the other dependencies
jest.mock('../../../models/User');
jest.mock('../../../models/Otp');

// Mock environment variables
process.env.EMAIL_USER = 'test@example.com';
process.env.EMAIL_PASS = 'testpassword';
process.env.JWT_SECRET = 'test-secret';

// Suppress console.error during tests
const originalConsoleError = console.error;
beforeAll(() => {
    console.error = jest.fn();
});

afterAll(() => {
    console.error = originalConsoleError;
});

describe('User Registration Tests', () => {
    beforeEach(() => {
        // Clear all mocks before each test
        jest.clearAllMocks();
        
        // Mock bcrypt hash
        jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashedPassword123');
    });

    describe('UT-Auth-001: Successful User Registration', () => {
        it('should successfully register a new user with valid credentials', async () => {
            // Test input data
            const testUserData = {
                email: "prayash@example.com",
                password: "Prayash123"
            };

            // Mock the User.findOne to simulate no existing user
            const mockFindOne = jest.fn().mockReturnValue({
                lean: jest.fn().mockResolvedValue(null)
            });
            User.findOne = mockFindOne;

            // Mock the User.create to simulate successful user creation
            const mockCreatedUser = {
                _id: 'mockUserId123',
                email: testUserData.email,
                password: 'hashedPassword123',
                verified: false
            };
            User.create.mockResolvedValue(mockCreatedUser);

            // Mock OTP creation
            Otp.create.mockResolvedValue({
                _id: 'mockOtpId123',
                userId: 'mockUserId123',
                otp: '123456'
            });

            // Create mock request and response objects
            const mockReq = {
                body: testUserData
            };
            const mockRes = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            // Execute the registration function
            await handleSignupMethod(mockReq, mockRes);

            // Assertions
            expect(mockFindOne).toHaveBeenCalledWith({ email: testUserData.email.toLowerCase() });
            expect(bcrypt.hash).toHaveBeenCalledWith(testUserData.password, 10);
            expect(User.create).toHaveBeenCalledWith({
                email: testUserData.email.toLowerCase(),
                password: 'hashedPassword123',
                verified: false
            });
            expect(Otp.create).toHaveBeenCalled();
            expect(mockSendMail).toHaveBeenCalledWith(expect.objectContaining({
                from: process.env.EMAIL_USER,
                to: testUserData.email,
                subject: 'Welcome to Zenfoline!'
            }));
            expect(mockRes.status).toHaveBeenCalledWith(201);
            expect(mockRes.json).toHaveBeenCalledWith({
                status: 'Pending',
                message: 'Verification OTP email is being sent.',
                data: {
                    userId: 'mockUserId123',
                    email: testUserData.email.toLowerCase()
                }
            });
        });
    });

    describe('UT-Auth-002: Registration with Existing Email', () => {
        it('should reject registration with existing email', async () => {
            // Test input data
            const testUserData = {
                email: "prayash@example.com",
                password: "Prayash123"
            };

            // Mock the User.findOne to simulate existing user
            const mockFindOne = jest.fn().mockReturnValue({
                lean: jest.fn().mockResolvedValue({ email: testUserData.email })
            });
            User.findOne = mockFindOne;

            // Create mock request and response objects
            const mockReq = {
                body: testUserData
            };
            const mockRes = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            // Execute the registration function
            await handleSignupMethod(mockReq, mockRes);

            // Assertions
            expect(mockFindOne).toHaveBeenCalledWith({ email: testUserData.email.toLowerCase() });
            expect(User.create).not.toHaveBeenCalled();
            expect(Otp.create).not.toHaveBeenCalled();
            expect(mockSendMail).not.toHaveBeenCalled();
            expect(mockRes.status).toHaveBeenCalledWith(400);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: 'Email is already registered.'
            });
        });
    });

    describe('UT-Auth-003: Registration with Invalid Input', () => {
        it('should reject registration with short password', async () => {
            // Test input data
            const testUserData = {
                email: "prayash@example.com",
                password: "123" // Less than 4 characters
            };

            // Create mock request and response objects
            const mockReq = {
                body: testUserData
            };
            const mockRes = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            // Execute the registration function
            await handleSignupMethod(mockReq, mockRes);

            // Assertions
            expect(User.findOne).not.toHaveBeenCalled();
            expect(User.create).not.toHaveBeenCalled();
            expect(Otp.create).not.toHaveBeenCalled();
            expect(mockSendMail).not.toHaveBeenCalled();
            expect(mockRes.status).toHaveBeenCalledWith(400);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: 'Password must be at least 4 characters long.'
            });
        });

        it('should handle missing email field', async () => {
            // Test input data with missing email
            const testUserData = {
                password: "Prayash123"
            };

            // Create mock request and response objects
            const mockReq = {
                body: testUserData
            };
            const mockRes = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            // Execute the registration function
            await handleSignupMethod(mockReq, mockRes);

            // Assertions
            expect(User.findOne).not.toHaveBeenCalled();
            expect(User.create).not.toHaveBeenCalled();
            expect(Otp.create).not.toHaveBeenCalled();
            expect(mockSendMail).not.toHaveBeenCalled();
            expect(mockRes.status).toHaveBeenCalledWith(500);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: 'An error occurred. Please try again later.'
            });
        });
    });

    describe('UT-Auth-004: Error Handling', () => {
        it('should handle database errors gracefully', async () => {
            // Test input data
            const testUserData = {
                email: "prayash@example.com",
                password: "Prayash123"
            };

            // Mock the User.findOne to simulate database error
            const mockFindOne = jest.fn().mockReturnValue({
                lean: jest.fn().mockRejectedValue(new Error('Database connection error'))
            });
            User.findOne = mockFindOne;

            // Create mock request and response objects
            const mockReq = {
                body: testUserData
            };
            const mockRes = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            // Execute the registration function
            await handleSignupMethod(mockReq, mockRes);

            // Assertions
            expect(mockFindOne).toHaveBeenCalledWith({ email: testUserData.email.toLowerCase() });
            expect(User.create).not.toHaveBeenCalled();
            expect(Otp.create).not.toHaveBeenCalled();
            expect(mockSendMail).not.toHaveBeenCalled();
            expect(mockRes.status).toHaveBeenCalledWith(500);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: 'An error occurred. Please try again later.'
            });
        });
    });
}); 