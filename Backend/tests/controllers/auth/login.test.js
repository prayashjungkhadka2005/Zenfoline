const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { userLogin } = require('../../../controllers/Authentications');
const User = require('../../../models/User');

// Mock the dependencies
jest.mock('../../../models/User');
jest.mock('bcrypt');
jest.mock('jsonwebtoken');

// Mock environment variables
process.env.JWT_SECRET = 'your_jwt_secret_key';

// Store original console.error
const originalConsoleError = console.error;

describe('Login Tests', () => {
    beforeAll(() => {
        // Suppress console.error during tests
        console.error = jest.fn();
    });

    afterAll(() => {
        // Restore console.error after tests
        console.error = originalConsoleError;
    });

    beforeEach(() => {
        // Clear all mocks before each test
        jest.clearAllMocks();
    });

    describe('UT-Auth-004: User Login', () => {
        it('should successfully login with valid credentials', async () => {
            // Test input data
            const testData = {
                email: "prayash@example.com",
                password: "Prayash123"
            };

            // Mock user data
            const mockUser = {
                _id: 'mockUserId123',
                email: testData.email,
                password: 'hashedPassword123',
                verified: true
            };

            // Mock User.findOne
            User.findOne.mockReturnValue({
                lean: jest.fn().mockResolvedValue(mockUser)
            });

            // Mock bcrypt compare
            bcrypt.compare.mockResolvedValue(true);

            // Mock jwt sign
            const mockToken = 'mock.jwt.token';
            jwt.sign.mockReturnValue(mockToken);

            // Create mock request and response objects
            const mockReq = {
                body: testData
            };
            const mockRes = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            // Execute the login function
            await userLogin(mockReq, mockRes);

            // Assertions
            expect(User.findOne).toHaveBeenCalledWith({ email: testData.email });
            expect(bcrypt.compare).toHaveBeenCalledWith(testData.password, mockUser.password);
            expect(jwt.sign).toHaveBeenCalledWith(
                { userId: mockUser._id },
                process.env.JWT_SECRET,
                { expiresIn: '1h' }
            );
            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: 'Login successful.',
                token: mockToken,
                user_id: mockUser._id
            });
        });

        it('should reject login with incorrect password', async () => {
            // Test input data
            const testData = {
                email: "prayash@example.com",
                password: "WrongPassword123"
            };

            // Mock user data
            const mockUser = {
                _id: 'mockUserId123',
                email: testData.email,
                password: 'hashedPassword123',
                verified: true
            };

            // Mock User.findOne
            User.findOne.mockReturnValue({
                lean: jest.fn().mockResolvedValue(mockUser)
            });

            // Mock bcrypt compare to return false
            bcrypt.compare.mockResolvedValue(false);

            // Create mock request and response objects
            const mockReq = {
                body: testData
            };
            const mockRes = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            // Execute the login function
            await userLogin(mockReq, mockRes);

            // Assertions
            expect(User.findOne).toHaveBeenCalledWith({ email: testData.email });
            expect(bcrypt.compare).toHaveBeenCalledWith(testData.password, mockUser.password);
            expect(jwt.sign).not.toHaveBeenCalled();
            expect(mockRes.status).toHaveBeenCalledWith(400);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: 'Email or password incorrect.'
            });
        });

        it('should handle non-existent user', async () => {
            // Test input data
            const testData = {
                email: "nonexistent@example.com",
                password: "Prayash123"
            };

            // Mock User.findOne to return null
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

            // Execute the login function
            await userLogin(mockReq, mockRes);

            // Assertions
            expect(User.findOne).toHaveBeenCalledWith({ email: testData.email });
            expect(bcrypt.compare).not.toHaveBeenCalled();
            expect(jwt.sign).not.toHaveBeenCalled();
            expect(mockRes.status).toHaveBeenCalledWith(404);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: 'User not found! Please signup to login.'
            });
        });

        it('should handle missing credentials', async () => {
            // Test input data with missing password
            const testData = {
                email: "prayash@example.com"
            };

            // Create mock request and response objects
            const mockReq = {
                body: testData
            };
            const mockRes = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            // Execute the login function
            await userLogin(mockReq, mockRes);

            // Assertions
            expect(User.findOne).toHaveBeenCalledWith({ email: testData.email });
            expect(bcrypt.compare).not.toHaveBeenCalled();
            expect(jwt.sign).not.toHaveBeenCalled();
            expect(mockRes.status).toHaveBeenCalledWith(404);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: 'User not found! Please signup to login.'
            });
        });
    });
}); 