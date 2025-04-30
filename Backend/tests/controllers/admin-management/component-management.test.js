const { addComponent, updateComponentStatus, deleteComponent } = require('../../../controllers/AuthenticatedAdmin');
const Component = require('../../../models/Components');
const Templates = require('../../../models/Templates');

// Mock the models
jest.mock('../../../models/Components');
jest.mock('../../../models/Templates');

describe('UT-Admin-003: Component Management', () => {
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
            body: {},
            params: {}
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
            isActive: true,
            save: jest.fn().mockResolvedValue(true)
        };
    });

    afterEach(() => {
        // Restore original console functions
        console.error = originalConsoleError;
        console.log = originalConsoleLog;
    });

    describe('addComponent', () => {
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

    describe('updateComponentStatus', () => {
        it('should disable a component successfully', async () => {
            // Setup request data
            req.params = {
                componentId: 'componentId123'
            };
            req.body = {
                isActive: false
            };

            // Mock Component.findById to return a valid component
            Component.findById.mockResolvedValue(mockComponent);

            // Execute the function
            await updateComponentStatus(req, res);

            // Assertions
            expect(Component.findById).toHaveBeenCalledWith('componentId123');
            expect(mockComponent.isActive).toBe(false);
            expect(mockComponent.save).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Component deactivated successfully.',
                data: mockComponent
            });
        });

        it('should enable a component successfully', async () => {
            // Setup request data
            req.params = {
                componentId: 'componentId123'
            };
            req.body = {
                isActive: true
            };

            // Mock Component.findById to return a valid component
            const inactiveComponent = { ...mockComponent, isActive: false };
            Component.findById.mockResolvedValue(inactiveComponent);

            // Execute the function
            await updateComponentStatus(req, res);

            // Assertions
            expect(Component.findById).toHaveBeenCalledWith('componentId123');
            expect(inactiveComponent.isActive).toBe(true);
            expect(inactiveComponent.save).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Component activated successfully.',
                data: inactiveComponent
            });
        });

        it('should fail to update status of non-existent component', async () => {
            // Setup request data
            req.params = {
                componentId: 'nonExistentComponentId'
            };
            req.body = {
                isActive: false
            };

            // Mock Component.findById to return null (component not found)
            Component.findById.mockResolvedValue(null);

            // Execute the function
            await updateComponentStatus(req, res);

            // Assertions
            expect(Component.findById).toHaveBeenCalledWith('nonExistentComponentId');
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Component not found.'
            });
        });
    });

    describe('deleteComponent', () => {
        it('should delete a component successfully', async () => {
            // Setup request data
            req.params = {
                componentId: 'componentId123'
            };

            // Mock Component.findById to return a valid component
            Component.findById.mockResolvedValue(mockComponent);

            // Mock Component.findByIdAndDelete to return the deleted component
            Component.findByIdAndDelete.mockResolvedValue(mockComponent);

            // Execute the function
            await deleteComponent(req, res);

            // Assertions
            expect(Component.findById).toHaveBeenCalledWith('componentId123');
            expect(Component.findByIdAndDelete).toHaveBeenCalledWith('componentId123');
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Component deleted successfully.'
            });
        });

        it('should fail to delete non-existent component', async () => {
            // Setup request data
            req.params = {
                componentId: 'nonExistentComponentId'
            };

            // Mock Component.findById to return null (component not found)
            Component.findById.mockResolvedValue(null);

            // Execute the function
            await deleteComponent(req, res);

            // Assertions
            expect(Component.findById).toHaveBeenCalledWith('nonExistentComponentId');
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Component not found.'
            });
        });
    });
}); 