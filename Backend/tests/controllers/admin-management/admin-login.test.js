const { adminLogin } = require('../../../controllers/Authentications');
const Admin = require('../../../models/Admin');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Mock the models and dependencies
jest.mock('../../../models/Admin');
jest.mock('bcrypt');
jest.mock('jsonwebtoken');

describe('UT-Admin-002: Admin Login', () => {
    let req;
    let res;
    let mockAdmin;
    let originalConsoleError;
    let originalConsoleLog;

    beforeEach(() => {
        // Reset all mocks before each test
        jest.clearAllMocks();

        // Store original console functions and mock them
        originalConsoleError = console.error;
        originalConsoleLog = console.log;
        console.error = jest.fn();
        console.log = jest.fn();

        // Setup request and response objects
        req = {
            body: {}
        };
        res = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis()
        };

        // Setup mock admin
        mockAdmin = {
            _id: 'adminId123',
            username: 'admin',
            email: 'admin@example.com',
            password: 'hashedPassword123',
            role: 'Admin'
        };

        // Mock process.env.JWT_SECRET
        process.env.JWT_SECRET = 'your_jwt_secret_key';

        // Mock bcrypt functions
        bcrypt.hash.mockResolvedValue('hashedPassword123');
        bcrypt.compare.mockResolvedValue(true);
        jwt.sign.mockReturnValue('mockToken123');
    });

    afterEach(() => {
        // Restore original console functions
        console.error = originalConsoleError;
        console.log = originalConsoleLog;
    });

    it('should login successfully with valid credentials', async () => {
        // Setup request data
        req.body = {
            username: 'admin',
            password: 'password123'
        };

        // Mock Admin.findOne to return a valid admin
        Admin.findOne.mockReturnValue({
            lean: jest.fn().mockResolvedValue(mockAdmin)
        });

        // Execute the function
        await adminLogin(req, res);

        // Assertions
        expect(Admin.findOne).toHaveBeenCalledWith({ username: 'admin' });
        expect(bcrypt.compare).toHaveBeenCalledWith('password123', 'hashedPassword123');
        expect(jwt.sign).toHaveBeenCalledWith(
            { userId: 'adminId123', role: 'admin' },
            'your_jwt_secret_key',
            { expiresIn: '24h' }
        );
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            message: 'Admin login successful.',
            admin_id: 'adminId123',
            username: 'admin',
            token: 'mockToken123'
        });
    });

    it('should fail to login with non-existent email', async () => {
        // Setup request data
        req.body = {
            username: 'nonexistent',
            password: 'password123'
        };

        // Mock Admin.findOne to return null (admin not found)
        Admin.findOne.mockReturnValue({
            lean: jest.fn().mockResolvedValue(null)
        });

        // Execute the function
        await adminLogin(req, res);

        // Assertions
        expect(Admin.findOne).toHaveBeenCalledWith({ username: 'nonexistent' });
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
            message: 'Admin not found! Please signup to login.'
        });
    });

    it('should fail to login with incorrect password', async () => {
        // Setup request data
        req.body = {
            username: 'admin',
            password: 'wrongpassword'
        };

        // Mock Admin.findOne to return a valid admin
        Admin.findOne.mockReturnValue({
            lean: jest.fn().mockResolvedValue(mockAdmin)
        });

        // Mock bcrypt.compare to return false (wrong password)
        bcrypt.compare.mockResolvedValueOnce(false);

        // Execute the function
        await adminLogin(req, res);

        // Assertions
        expect(Admin.findOne).toHaveBeenCalledWith({ username: 'admin' });
        expect(bcrypt.compare).toHaveBeenCalledWith('wrongpassword', 'hashedPassword123');
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            message: 'Username or password incorrect.'
        });
    });

    it('should fail to login with missing required fields', async () => {
        // Setup request data with missing fields
        req.body = {
            username: 'admin',
            // Missing password
        };

        // Execute the function
        await adminLogin(req, res);

        // Assertions
        expect(Admin.findOne).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            message: 'All fields are required.'
        });
    });
}); 