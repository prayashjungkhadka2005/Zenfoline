const { getTemplateByUserId } = require('../../../controllers/PublicViewPortfolioController');
const Template = require('../../../models/Templates');
const User = require('../../../models/User');

// Mock the models
jest.mock('../../../models/Templates');
jest.mock('../../../models/User');

describe('UT-Public-002: getTemplateByUserId', () => {
    let req;
    let res;
    let mockTemplate;
    let mockUser;
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
            params: {
                userId: 'testUserId'
            }
        };
        res = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis()
        };

        // Setup mock template
        mockTemplate = {
            _id: 'templateId',
            name: 'Modern Portfolio',
            category: 'Professional',
            sections: ['basics', 'about', 'skills', 'experience', 'education', 'projects'],
            sectionConfiguration: {
                basics: { isEnabled: true },
                about: { isEnabled: true },
                skills: { isEnabled: true },
                experience: { isEnabled: true },
                education: { isEnabled: true },
                projects: { isEnabled: true }
            }
        };

        // Setup mock user
        mockUser = {
            _id: 'testUserId',
            selectedTemplate: mockTemplate
        };
    });

    afterEach(() => {
        // Restore original console functions
        console.error = originalConsoleError;
        console.log = originalConsoleLog;
    });

    it('should fetch user-specific template', async () => {
        // Mock Template.findOne to return a template
        Template.findOne.mockResolvedValue(mockTemplate);

        // Execute the function
        await getTemplateByUserId(req, res);

        // Assertions
        expect(Template.findOne).toHaveBeenCalledWith({ userId: 'testUserId' });
        expect(res.json).toHaveBeenCalledWith({
            success: true,
            data: mockTemplate
        });
    });

    it('should fetch template from user\'s selected template when no user-specific template exists', async () => {
        // Mock Template.findOne to return null
        Template.findOne.mockResolvedValue(null);
        // Mock User.findById to return user with selected template
        User.findById.mockReturnValue({
            populate: jest.fn().mockResolvedValue(mockUser)
        });

        // Execute the function
        await getTemplateByUserId(req, res);

        // Assertions
        expect(Template.findOne).toHaveBeenCalledWith({ userId: 'testUserId' });
        expect(User.findById).toHaveBeenCalledWith('testUserId');
        expect(res.json).toHaveBeenCalledWith({
            success: true,
            data: mockTemplate
        });
    });

    it('should handle missing template', async () => {
        // Mock Template.findOne to return null
        Template.findOne.mockResolvedValue(null);
        // Mock User.findById to return user without selected template
        User.findById.mockReturnValue({
            populate: jest.fn().mockResolvedValue({ ...mockUser, selectedTemplate: null })
        });

        // Execute the function
        await getTemplateByUserId(req, res);

        // Assertions
        expect(Template.findOne).toHaveBeenCalledWith({ userId: 'testUserId' });
        expect(User.findById).toHaveBeenCalledWith('testUserId');
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
            success: false,
            message: 'Template not found'
        });
    });

    it('should handle database errors', async () => {
        // Mock Template.findOne to throw an error
        Template.findOne.mockRejectedValue(new Error('Database error'));

        // Execute the function
        await getTemplateByUserId(req, res);

        // Assertions
        expect(Template.findOne).toHaveBeenCalledWith({ userId: 'testUserId' });
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            success: false,
            message: 'Error fetching template',
            error: 'Database error'
        });
    });
}); 