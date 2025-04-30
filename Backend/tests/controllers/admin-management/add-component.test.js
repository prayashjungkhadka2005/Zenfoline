const { addComponent } = require('../../../controllers/AuthenticatedAdmin');
const Component = require('../../../models/Components');
const Templates = require('../../../models/Templates');

// Mock the models
jest.mock('../../../models/Components');
jest.mock('../../../models/Templates');

describe('UT-Admin-005: Add Component', () => {
    let req;
    let res;
    let mockComponent;
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

        // Setup mock component
        mockComponent = {
            _id: 'componentId123',
            name: 'Test Component',
            category: 'Developer',
            linkedTemplate: 'templateId123',
            componentType: 'Header',
            componentSubType: 'Standard',
            isActive: true
        };
    });

    afterEach(() => {
        // Restore original console functions
        console.error = originalConsoleError;
        console.log = originalConsoleLog;
    });

    it('should add a new component successfully', async () => {
        // Setup request data
        req.body = {
            name: 'New Component',
            category: 'Developer',
            linkedTemplate: 'templateId123',
            componentType: 'Header',
            componentSubType: 'Standard'
        };

        // Mock Templates.findById to return a valid template
        Templates.findById.mockResolvedValue({
            _id: 'templateId123',
            category: 'Developer'
        });

        // Mock Component.create to return the new component
        Component.create.mockResolvedValue(mockComponent);

        // Execute the function
        await addComponent(req, res);

        // Assertions
        expect(Templates.findById).toHaveBeenCalledWith('templateId123');
        expect(Component.create).toHaveBeenCalledWith({
            name: 'New Component',
            category: 'Developer',
            linkedTemplate: 'templateId123',
            componentType: 'Header',
            componentSubType: 'Standard',
            isActive: true
        });
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({
            message: 'Component added successfully.',
            data: mockComponent
        });
    });

    it('should fail to add component with missing required fields', async () => {
        // Setup request data with missing fields
        req.body = {
            name: 'New Component',
            // Missing other required fields
        };

        // Execute the function
        await addComponent(req, res);

        // Assertions
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            message: 'All fields are required!'
        });
    });

    it('should fail to add component with non-existent linked template', async () => {
        // Setup request data
        req.body = {
            name: 'New Component',
            category: 'Developer',
            linkedTemplate: 'nonExistentTemplateId',
            componentType: 'Header',
            componentSubType: 'Standard'
        };

        // Mock Templates.findById to return null (template not found)
        Templates.findById.mockResolvedValue(null);

        // Execute the function
        await addComponent(req, res);

        // Assertions
        expect(Templates.findById).toHaveBeenCalledWith('nonExistentTemplateId');
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
            message: 'Linked template not found.'
        });
    });

    it('should fail to add component with category mismatch', async () => {
        // Setup request data
        req.body = {
            name: 'New Component',
            category: 'Developer',
            linkedTemplate: 'templateId123',
            componentType: 'Header',
            componentSubType: 'Standard'
        };

        // Mock Templates.findById to return a template with different category
        Templates.findById.mockResolvedValue({
            _id: 'templateId123',
            category: 'Simple' // Different category
        });

        // Execute the function
        await addComponent(req, res);

        // Assertions
        expect(Templates.findById).toHaveBeenCalledWith('templateId123');
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            message: 'Category mismatch with the linked template.'
        });
    });
}); 