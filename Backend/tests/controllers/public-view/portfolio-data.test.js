const { getPortfolioDataByUserId } = require('../../../controllers/PublicViewPortfolioController');
const PortfolioData = require('../../../models/PortfolioData');

// Mock the models
jest.mock('../../../models/PortfolioData');

describe('UT-Public-001: getPortfolioDataByUserId', () => {
    let req;
    let res;
    let mockPortfolioData;
    let originalConsoleError;

    beforeEach(() => {
        // Reset all mocks before each test
        jest.clearAllMocks();

        // Store original console.error and mock it
        originalConsoleError = console.error;
        console.error = jest.fn();

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

        // Setup mock portfolio data with all required sections
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
                { name: 'Communication', category: 'Soft', proficiency: 'Expert', isVisible: true }
            ],
            experience: [
                {
                    title: 'Senior Developer',
                    company: 'Tech Corp',
                    startDate: '2020-01-01',
                    endDate: '2023-01-01',
                    isVisible: true
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
                }
            ],
            publications: [
                {
                    title: 'Modern Web Development',
                    publisher: 'Tech Journal',
                    year: '2023',
                    link: 'https://example.com/publication',
                    isVisible: true
                }
            ],
            certifications: [
                {
                    name: 'AWS Certified Developer',
                    issuer: 'Amazon Web Services',
                    year: '2023',
                    link: 'https://example.com/cert',
                    isVisible: true
                }
            ],
            awards: [
                {
                    title: 'Best Developer Award',
                    issuer: 'Tech Conference 2023',
                    year: '2023',
                    description: 'Recognition for outstanding contributions',
                    isVisible: true
                }
            ],
            services: [
                {
                    title: 'Web Development',
                    description: 'Full-stack web development services',
                    image: 'webdev.jpg',
                    isVisible: true
                }
            ],
            sectionConfiguration: {
                basics: { isEnabled: true },
                about: { isEnabled: true },
                skills: { isEnabled: true },
                experience: { isEnabled: true },
                education: { isEnabled: true },
                projects: { isEnabled: true },
                publications: { isEnabled: true },
                certifications: { isEnabled: true },
                awards: { isEnabled: true },
                services: { isEnabled: true }
            }
        };
    });

    afterEach(() => {
        // Restore original console.error
        console.error = originalConsoleError;
    });

    it('should fetch public data for valid user with portfolio', async () => {
        // Mock PortfolioData.findOne to return portfolio data
        PortfolioData.findOne.mockResolvedValue(mockPortfolioData);

        // Execute the function
        await getPortfolioDataByUserId(req, res);

        // Assertions
        expect(PortfolioData.findOne).toHaveBeenCalledWith({ userId: 'testUserId' });
        expect(res.json).toHaveBeenCalledWith({
            success: true,
            data: expect.objectContaining({
                basics: expect.any(Object),
                about: expect.any(Object),
                skills: expect.any(Array),
                experience: expect.any(Array),
                education: expect.any(Array),
                projects: expect.any(Array),
                publications: expect.any(Array),
                certifications: expect.any(Array),
                awards: expect.any(Array),
                services: expect.any(Array),
                sectionConfiguration: expect.any(Object)
            })
        });

        // Verify specific section data
        const responseData = res.json.mock.calls[0][0].data;
        expect(responseData.publications[0]).toEqual(expect.objectContaining({
            title: 'Modern Web Development',
            publisher: 'Tech Journal'
        }));
        expect(responseData.certifications[0]).toEqual(expect.objectContaining({
            name: 'AWS Certified Developer',
            issuer: 'Amazon Web Services'
        }));
        expect(responseData.awards[0]).toEqual(expect.objectContaining({
            title: 'Best Developer Award',
            issuer: 'Tech Conference 2023'
        }));
        expect(responseData.services[0]).toEqual(expect.objectContaining({
            title: 'Web Development',
            description: 'Full-stack web development services'
        }));
    });

    it('should handle missing portfolio', async () => {
        // Mock PortfolioData.findOne to return null
        PortfolioData.findOne.mockResolvedValue(null);

        // Execute the function
        await getPortfolioDataByUserId(req, res);

        // Assertions
        expect(PortfolioData.findOne).toHaveBeenCalledWith({ userId: 'testUserId' });
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
            success: false,
            message: 'Portfolio not found'
        });
    });

    it('should handle database errors', async () => {
        // Mock PortfolioData.findOne to throw an error
        PortfolioData.findOne.mockRejectedValue(new Error('Database error'));

        // Execute the function
        await getPortfolioDataByUserId(req, res);

        // Assertions
        expect(PortfolioData.findOne).toHaveBeenCalledWith({ userId: 'testUserId' });
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            success: false,
            message: 'Error fetching portfolio data',
            error: 'Database error'
        });
    });
}); 