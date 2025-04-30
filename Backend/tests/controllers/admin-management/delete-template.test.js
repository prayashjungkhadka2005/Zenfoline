const { deleteTemplate } = require('../../../controllers/AuthenticatedAdmin');
const Templates = require('../../../models/Templates');
const User = require('../../../models/User');
const fs = require('fs');
const path = require('path');

// Mock the models
jest.mock('../../../models/Templates');
jest.mock('../../../models/User');
jest.mock('fs');
jest.mock('path');

describe('UT-Admin-002: Delete Template', () => {
    let req;
    let res;
    let mockTemplate;
    let originalConsoleError;
    let originalConsoleLog;

    beforeEach(() => {
        // Reset mocks before each test
        jest.clearAllMocks();
        
        // Mock fs.existsSync and fs.unlinkSync
        fs.existsSync = jest.fn().mockReturnValue(true);
        fs.unlinkSync = jest.fn();

        // Mock path.join
        path.join.mockImplementation((...args) => args.join('/'));

        // Mock User.updateMany
        User.updateMany.mockResolvedValue({});

        // Setup request and response objects
        req = {
            params: {}
        };
        res = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis()
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

    it('should delete an existing template successfully', async () => {
        // Setup request data
        req.params = {
            templateId: 'templateId123'
        };

        // Mock Templates.findById to return a valid template
        Templates.findById.mockResolvedValue(mockTemplate);

        // Mock Templates.findByIdAndDelete to return the deleted template
        Templates.findByIdAndDelete.mockResolvedValue(mockTemplate);

        // Execute the function
        await deleteTemplate(req, res);

        // Assertions
        expect(Templates.findById).toHaveBeenCalledWith('templateId123');
        expect(fs.existsSync).toHaveBeenCalled();
        expect(fs.unlinkSync).toHaveBeenCalled();
        expect(Templates.findByIdAndDelete).toHaveBeenCalledWith('templateId123');
        expect(User.updateMany).toHaveBeenCalledWith(
            { selectedTemplate: 'templateId123' },
            { $set: { selectedTemplate: null } }
        );
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            message: 'Template deleted successfully.'
        });
    });

    it('should fail to delete non-existent template', async () => {
        // Setup request data
        req.params = {
            templateId: 'nonExistentTemplateId'
        };

        // Mock Templates.findById to return null (template not found)
        Templates.findById.mockResolvedValue(null);

        // Execute the function
        await deleteTemplate(req, res);

        // Assertions
        expect(Templates.findById).toHaveBeenCalledWith('nonExistentTemplateId');
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
            message: 'Template not found.'
        });
    });

    it('should fail to delete template with missing ID', async () => {
        // Setup request data with missing templateId
        req.params = {};

        // Execute the function
        await deleteTemplate(req, res);

        // Assertions
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            message: 'Template ID is required.'
        });
    });
}); 