const { updateTemplate } = require('../../../controllers/AuthenticatedAdmin');
const Templates = require('../../../models/Templates');
const fs = require('fs');
const path = require('path');

// Mock the models
jest.mock('../../../models/Templates');
jest.mock('fs');
jest.mock('path');

describe('UT-Admin-003: Update Template', () => {
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

        // Setup request and response objects
        req = {
            params: {},
            body: {},
            file: {}
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

    it('should update an existing template successfully', async () => {
        // Setup request data
        req.params = {
            templateId: 'templateId123'
        };
        req.body = {
            name: 'Updated Template',
            description: 'Updated description',
            category: 'developer',
            predefinedTemplate: 'UpdatedTemplate'
        };
        req.file = {
            filename: 'updated-image.jpg'
        };

        // Mock Templates.findById to return a valid template
        Templates.findById.mockResolvedValue(mockTemplate);
        
        // Mock Templates.findByIdAndUpdate to return the updated template
        const updatedTemplate = {
            ...mockTemplate,
            name: 'Updated Template',
            description: 'Updated description',
            image: '/uploads/updated-image.jpg',
            predefinedTemplate: 'UpdatedTemplate'
        };
        Templates.findByIdAndUpdate.mockResolvedValue(updatedTemplate);

        // Execute the function
        await updateTemplate(req, res);

        // Assertions
        expect(Templates.findById).toHaveBeenCalledWith('templateId123');
        expect(Templates.findByIdAndUpdate).toHaveBeenCalledWith(
            'templateId123',
            {
                name: 'Updated Template',
                description: 'Updated description',
                category: 'developer',
                predefinedTemplate: 'UpdatedTemplate',
                image: '/uploads/updated-image.jpg'
            },
            { new: true }
        );
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            message: 'Template updated successfully.',
            data: updatedTemplate
        });
    });

    it('should fail to update non-existent template', async () => {
        // Setup request data
        req.params = {
            templateId: 'nonExistentTemplateId'
        };
        req.body = {
            name: 'Updated Template'
        };

        // Mock Templates.findById to return null (template not found)
        Templates.findById.mockResolvedValue(null);

        // Execute the function
        await updateTemplate(req, res);

        // Assertions
        expect(Templates.findById).toHaveBeenCalledWith('nonExistentTemplateId');
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
            message: 'Template not found.'
        });
    });

    it('should fail to update template with missing ID', async () => {
        // Setup request data with missing templateId
        req.params = {};
        req.body = {
            name: 'Updated Template'
        };

        // Execute the function
        await updateTemplate(req, res);

        // Assertions
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            message: 'Template ID is required.'
        });
    });
}); 