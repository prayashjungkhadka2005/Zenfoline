const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { adminLogin, addAdmin } = require('../../../controllers/Authentications');
const Admin = require('../../../models/Admin');

// Mock the dependencies
jest.mock('../../../models/Admin');
jest.mock('bcrypt');
jest.mock('jsonwebtoken');

// Mock environment variables
process.env.JWT_SECRET = 'your_jwt_secret_key';
process.env.ADMIN_SECRET = 'admin-secret';

// Store original console.error
const originalConsoleError = console.error;

describe('Admin Authentication Tests', () => {
    let req;
    let res;

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

        // Setup request and response objects
        req = {
            body: {}
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        // Mock Admin.findOne to return a function that returns a promise
        Admin.findOne = jest.fn().mockReturnValue({
            lean: jest.fn().mockResolvedValue(null)
        });
    });

    describe('UT-Auth-007: Admin Login', () => {
        it('should successfully login admin with valid credentials', async () => {
            // Test input data
            const testData = {
                username: "newadmin@zenfoline.com",
                password: "Admin123"
            };

            // Mock admin data
            const mockAdmin = {
                _id: 'mockAdminId123',
                username: testData.username,
                password: 'hashedPassword123'
            };

            // Mock Admin.findOne
            Admin.findOne.mockReturnValue({
                lean: jest.fn().mockResolvedValue(mockAdmin)
            });

            // Mock bcrypt compare
            bcrypt.compare.mockResolvedValue(true);

            // Mock jwt sign
            const mockToken = 'mock.admin.jwt.token';
            jwt.sign.mockReturnValue(mockToken);

            req.body = testData;

            // Execute the admin login function
            await adminLogin(req, res);

            // Assertions
            expect(Admin.findOne).toHaveBeenCalledWith({ username: testData.username });
            expect(bcrypt.compare).toHaveBeenCalledWith(testData.password, mockAdmin.password);
            expect(jwt.sign).toHaveBeenCalledWith(
                { userId: mockAdmin._id, role: 'admin' },
                process.env.JWT_SECRET,
                { expiresIn: '24h' }
            );
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Admin login successful.',
                admin_id: mockAdmin._id,
                username: mockAdmin.username,
                token: mockToken
            });
        });

        it('should reject admin login with incorrect password', async () => {
            // Test input data
            const testData = {
                username: "admin@zenfoline.com",
                password: "WrongPassword123"
            };

            // Mock admin data
            const mockAdmin = {
                _id: 'mockAdminId123',
                username: testData.username,
                password: 'hashedPassword123'
            };

            // Mock Admin.findOne
            Admin.findOne.mockReturnValue({
                lean: jest.fn().mockResolvedValue(mockAdmin)
            });

            // Mock bcrypt compare to return false
            bcrypt.compare.mockResolvedValue(false);

            req.body = testData;

            // Execute the admin login function
            await adminLogin(req, res);

            // Assertions
            expect(Admin.findOne).toHaveBeenCalledWith({ username: testData.username });
            expect(bcrypt.compare).toHaveBeenCalledWith(testData.password, mockAdmin.password);
            expect(jwt.sign).not.toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Username or password incorrect.'
            });
        });

        it('should handle non-existent admin', async () => {
            // Test input data
            const testData = {
                username: "nonexistent@zenfoline.com",
                password: "Admin123"
            };

            // Mock Admin.findOne to return null
            Admin.findOne.mockReturnValue({
                lean: jest.fn().mockResolvedValue(null)
            });

            req.body = testData;

            // Execute the admin login function
            await adminLogin(req, res);

            // Assertions
            expect(Admin.findOne).toHaveBeenCalledWith({ username: testData.username });
            expect(bcrypt.compare).not.toHaveBeenCalled();
            expect(jwt.sign).not.toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Admin not found! Please signup to login.'
            });
        });
    });

    describe('UT-Auth-008: Admin Signup', () => {
        it('should successfully create new admin with valid credentials', async () => {
            // Test input data
            const testData = {
                username: "newadmin@zenfoline.com",
                email: "newadmin@zenfoline.com",
                password: "Admin123"
            };

            // Mock Admin.findOne to simulate no existing admin
            Admin.findOne.mockReturnValue({
                lean: jest.fn().mockResolvedValue(null)
            });

            // Mock bcrypt hash
            const hashedPassword = 'hashedPassword123';
            bcrypt.hash.mockResolvedValue(hashedPassword);

            // Mock Admin.create
            const mockCreatedAdmin = {
                _id: 'mockAdminId123',
                username: testData.username,
                email: testData.email,
                password: hashedPassword,
                role: 'Admin'
            };
            Admin.create.mockResolvedValue(mockCreatedAdmin);

            req.body = testData;

            // Execute the admin signup function
            await addAdmin(req, res);

            // Assertions
            expect(Admin.findOne).toHaveBeenCalledWith({
                $or: [
                    { email: testData.email.toLowerCase() },
                    { username: testData.username.toLowerCase() }
                ]
            });
            expect(bcrypt.hash).toHaveBeenCalledWith(testData.password, 10);
            expect(Admin.create).toHaveBeenCalledWith({
                username: testData.username.toLowerCase(),
                email: testData.email.toLowerCase(),
                password: hashedPassword,
                role: 'Admin'
            });
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Admin creation successful.',
                data: {
                    id: mockCreatedAdmin._id,
                    username: mockCreatedAdmin.username,
                    email: mockCreatedAdmin.email,
                    role: mockCreatedAdmin.role
                }
            });
        });

        it('should reject admin signup with existing email', async () => {
            // Test input data
            const testData = {
                username: "existing@zenfoline.com",
                email: "existing@zenfoline.com",
                password: "Admin123"
            };

            // Mock Admin.findOne to simulate existing admin
            Admin.findOne.mockReturnValue({
                lean: jest.fn().mockResolvedValue({ username: testData.username })
            });

            req.body = testData;

            // Execute the admin signup function
            await addAdmin(req, res);

            // Assertions
            expect(Admin.findOne).toHaveBeenCalledWith({
                $or: [
                    { email: testData.email.toLowerCase() },
                    { username: testData.username.toLowerCase() }
                ]
            });
            expect(bcrypt.hash).not.toHaveBeenCalled();
            expect(Admin.create).not.toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Admin with this email or username already exists.'
            });
        });

        it('should handle missing required fields', async () => {
            // Test input data with missing password
            const testData = {
                username: "newadmin@zenfoline.com",
                email: "newadmin@zenfoline.com"
            };

            req.body = testData;

            // Execute the admin signup function
            await addAdmin(req, res);

            // Assertions
            expect(Admin.findOne).not.toHaveBeenCalled();
            expect(bcrypt.hash).not.toHaveBeenCalled();
            expect(Admin.create).not.toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                message: 'All fields are required.'
            });
        });
    });
}); 