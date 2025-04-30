const { deleteComponent } = require('../../../controllers/AuthenticatedAdmin');
const Component = require('../../../models/Components');

// Mock the Component model
jest.mock('../../../models/Components');

describe('UT-Admin-007: Delete Component', () => {
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
            remove: jest.fn().mockResolvedValue(true)
        };
    });

    afterEach(() => {
        // Restore original console functions
        console.error = originalConsoleError;
        console.log = originalConsoleLog;
    });

    it('should delete a component successfully', async () => {
        // Setup request data
        req.params = {
            componentId: 'componentId123'
        };

        // Mock Component.findById to return a valid component
        Component.findById.mockResolvedValue(mockComponent);

        // Execute the function
        await deleteComponent(req, res);

        // Assertions
        expect(Component.findById).toHaveBeenCalledWith('componentId123');
        expect(mockComponent.remove).toHaveBeenCalled();
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

    it('should handle errors during component deletion', async () => {
        // Setup request data
        req.params = {
            componentId: 'componentId123'
        };

        // Mock Component.findById to return a valid component
        Component.findById.mockResolvedValue(mockComponent);

        // Mock component.remove to throw an error
        mockComponent.remove.mockRejectedValue(new Error('Database error'));

        // Execute the function
        await deleteComponent(req, res);

        // Assertions
        expect(Component.findById).toHaveBeenCalledWith('componentId123');
        expect(mockComponent.remove).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            message: 'Error deleting component.',
            error: expect.any(String)
        });
    });
}); 