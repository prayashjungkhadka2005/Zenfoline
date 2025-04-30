const { addTemplate } = require('../../../controllers/AuthenticatedAdmin');
const Templates = require('../../../models/Templates');
const Admin = require('../../../models/Admin');
const User = require('../../../models/User');
const fs = require('fs');
const path = require('path');

// Mock the models
jest.mock('../../../models/Templates');
jest.mock('../../../models/Admin');
jest.mock('../../../models/User');
jest.mock('fs');
jest.mock('path');

describe('UT-Admin-001: Add Template', () => {
    let req;
    let res;
    let mockAdmin;
    let mockTemplate;
    let originalConsoleError;
    let originalConsoleLog;

    beforeEach(() => {
        // Reset mocks before each test
        jest.clearAllMocks();
        
        // Mock Templates.create to return a promise that resolves with the template
        Templates.create = jest.fn().mockImplementation((data) => {
            return Promise.resolve({ ...data, _id: 'templateId123' });
        });
        
        // Mock fs.existsSync and fs.unlinkSync
        fs.existsSync = jest.fn().mockReturnValue(true);
        fs.unlinkSync = jest.fn();

        // Mock path.join
        path.join.mockImplementation((...args) => args.join('/'));

        // Mock User.updateMany
        User.updateMany.mockResolvedValue({});

        // Setup request and response objects
        req = {
            body: {},
            file: {},
            params: {}
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
            role: 'Admin'
        };

        // Setup mock template
        mockTemplate = {
            _id: 'templateId123',
            name: 'Test Template',
            description: 'A test template',
            image: '/uploads/test-image.jpg',
            category: 'developer',
            predefinedTemplate: 'SimplePortfolioTemplate',
            addedBy: 'adminId123'
        };

        // Store original console functions and mock them
        originalConsoleError = console.error;
        originalConsoleLog = console.log;
        console.error = jest.fn();
        console.log = jest.fn();
    });

    afterEach(() => {
        // Restore original console functions
        console.error = originalConsoleError;
        console.log = originalConsoleLog;
    });

    it('should add a new template successfully', async () => {
        // Setup request data
        req.body = {
            name: 'Test Template',
            description: 'A test template',
            category: 'developer',
            predefinedTemplate: 'SimplePortfolioTemplate',
            adminId: 'adminId123'
        };
        req.file = {
            filename: 'test-image.jpg'
        };

        // Mock Admin.findById to return a valid admin with lean method
        const mockLean = jest.fn().mockResolvedValue(mockAdmin);
        Admin.findById = jest.fn().mockReturnValue({
            lean: mockLean
        });

        // Execute the function
        await addTemplate(req, res);

        // Assertions
        expect(Admin.findById).toHaveBeenCalledWith('adminId123');
        expect(mockLean).toHaveBeenCalled();
        expect(Templates.create).toHaveBeenCalledWith({
            name: 'Test Template',
            description: 'A test template',
            image: '/uploads/test-image.jpg',
            category: 'developer',
            predefinedTemplate: 'SimplePortfolioTemplate',
            addedBy: 'adminId123'
        });
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({
            message: 'Template added successfully.',
            data: expect.objectContaining({
                name: 'Test Template',
                description: 'A test template',
                image: '/uploads/test-image.jpg',
                category: 'developer',
                predefinedTemplate: 'SimplePortfolioTemplate',
                addedBy: 'adminId123'
            })
        });
    });

    it('should fail to add template with missing required fields', async () => {
        // Setup request data with missing fields
        req.body = {
            name: 'Test Template',
            // Missing description, category, predefinedTemplate, adminId
        };
        req.file = null; // Missing file

        // Execute the function
        await addTemplate(req, res);

        // Assertions
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            message: 'All fields are required!'
        });
    });

    it('should fail to add template with invalid admin ID', async () => {
        // Setup request data
        req.body = {
            name: 'Test Template',
            description: 'A test template',
            category: 'developer',
            predefinedTemplate: 'SimplePortfolioTemplate',
            adminId: 'invalidAdminId'
        };
        req.file = {
            filename: 'test-image.jpg'
        };

        // Mock Admin.findById to return null with lean method
        const mockLean = jest.fn().mockResolvedValue(null);
        Admin.findById = jest.fn().mockReturnValue({
            lean: mockLean
        });

        // Execute the function
        await addTemplate(req, res);

        // Assertions
        expect(Admin.findById).toHaveBeenCalledWith('invalidAdminId');
        expect(mockLean).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.json).toHaveBeenCalledWith({
            message: 'Only an admin can add templates.'
        });
    });
}); 