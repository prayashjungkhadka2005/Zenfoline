const { updateComponentStatus } = require('../../../controllers/AuthenticatedAdmin');
const Component = require('../../../models/Components');

// Mock the Component model
jest.mock('../../../models/Components');

describe('UT-Admin-006: Update Component Status', () => {
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
            params: {},
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
            isActive: true,
            save: jest.fn().mockResolvedValue(true)
        };
    });

    afterEach(() => {
        // Restore original console functions
        console.error = originalConsoleError;
        console.log = originalConsoleLog;
    });

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