const { getPortfolioDataByUserId } = require('../../../controllers/PublicViewPortfolioController');
const PortfolioData = require('../../../models/PortfolioData');

// Mock the models
jest.mock('../../../models/PortfolioData');

describe('UT-Public-003: getPortfolioDataByUserId - Section Visibility', () => {
    let req;
    let res;
    let mockPortfolioData;
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

        // Setup mock portfolio data with some sections disabled
        mockPortfolioData = {
            userId: 'testUserId',
            basics: {
                name: 'John Doe',
                role: 'Software Developer',
                bio: 'Experienced developer'
            },
            about: {
                description: 'About me',
                vision: 'My vision',
                mission: 'My mission'
            },
            skills: [
                { name: 'JavaScript', category: 'Technical', proficiency: 'Advanced', isVisible: true },
                { name: 'Communication', category: 'Soft', proficiency: 'Expert', isVisible: false }
            ],
            experience: [
                {
                    title: 'Senior Developer',
                    company: 'Tech Corp',
                    startDate: '2020-01-01',
                    endDate: '2023-01-01',
                    isVisible: true
                },
                {
                    title: 'Junior Developer',
                    company: 'Startup Inc',
                    startDate: '2018-01-01',
                    endDate: '2020-01-01',
                    isVisible: false
                }
            ],
            education: [
                {
                    institution: 'University of Technology',
                    degree: 'Bachelor of Science',
                    field: 'Computer Science',
                    startDate: '2016-09-01',
                    endDate: '2020-06-01',
                    isVisible: true
                }
            ],
            projects: [
                {
                    title: 'Portfolio Website',
                    description: 'A personal portfolio website',
                    technologies: ['React', 'Node.js'],
                    isVisible: true
                },
                {
                    title: 'Hidden Project',
                    description: 'This project should be hidden',
                    technologies: ['Python'],
                    isVisible: false
                }
            ],
            sectionConfiguration: {
                basics: { isEnabled: true },
                about: { isEnabled: true },
                skills: { isEnabled: true },
                experience: { isEnabled: true },
                education: { isEnabled: true },
                projects: { isEnabled: true }
            }
        };
    });

    afterEach(() => {
        // Restore original console functions
        console.error = originalConsoleError;
        console.log = originalConsoleLog;
    });

    it('should return all items regardless of visibility', async () => {
        // Mock PortfolioData.findOne to return portfolio data
        PortfolioData.findOne.mockResolvedValue(mockPortfolioData);

        // Execute the function
        await getPortfolioDataByUserId(req, res);

        // Get the data passed to res.json
        const responseData = res.json.mock.calls[0][0].data;

        // Assertions
        expect(PortfolioData.findOne).toHaveBeenCalledWith({ userId: 'testUserId' });
        expect(res.json).toHaveBeenCalledWith({
            success: true,
            data: expect.objectContaining({
                skills: expect.arrayContaining([
                    expect.objectContaining({ name: 'JavaScript', isVisible: true }),
                    expect.objectContaining({ name: 'Communication', isVisible: false })
                ]),
                experience: expect.arrayContaining([
                    expect.objectContaining({ title: 'Senior Developer', isVisible: true }),
                    expect.objectContaining({ title: 'Junior Developer', isVisible: false })
                ]),
                projects: expect.arrayContaining([
                    expect.objectContaining({ title: 'Portfolio Website', isVisible: true }),
                    expect.objectContaining({ title: 'Hidden Project', isVisible: false })
                ])
            })
        });

        // Verify that both visible and invisible items are included
        expect(responseData.skills).toHaveLength(2);
        expect(responseData.experience).toHaveLength(2);
        expect(responseData.projects).toHaveLength(2);
    });

    it('should handle empty sections gracefully', async () => {
        // Create portfolio data with empty sections
        const emptyPortfolioData = {
            userId: 'testUserId',
            basics: {
                name: 'John Doe',
                role: 'Software Developer',
                bio: 'Experienced developer'
            },
            about: {
                description: 'About me',
                vision: 'My vision',
                mission: 'My mission'
            },
            skills: [],
            experience: [],
            education: [],
            projects: [],
            sectionConfiguration: {
                basics: { isEnabled: true },
                about: { isEnabled: true },
                skills: { isEnabled: true },
                experience: { isEnabled: true },
                education: { isEnabled: true },
                projects: { isEnabled: true }
            }
        };

        // Mock PortfolioData.findOne to return empty portfolio data
        PortfolioData.findOne.mockResolvedValue(emptyPortfolioData);

        // Execute the function
        await getPortfolioDataByUserId(req, res);

        // Assertions
        expect(PortfolioData.findOne).toHaveBeenCalledWith({ userId: 'testUserId' });
        expect(res.json).toHaveBeenCalledWith({
            success: true,
            data: expect.objectContaining({
                skills: [],
                experience: [],
                education: [],
                projects: []
            })
        });
    });
}); 