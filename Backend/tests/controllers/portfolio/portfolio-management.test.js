const { 
    saveBasicInfo, 
    saveSkillsInfo, 
    getExperienceInfo, 
    getProjectsInfo, 
    updateSectionVisibility,
    saveAboutInfo,
    getAboutInfo,
    saveEducationInfo,
    getEducationInfo,
    savePublicationsInfo,
    getPublicationsInfo,
    saveCertificationsInfo,
    getCertificationsInfo,
    saveServicesInfo,
    getServicesInfo,
    saveCustomSectionInfo,
    getCustomSectionInfo,
    saveProjectsInfo
} = require('../../../controllers/PortfolioDataController');
const PortfolioData = require('../../../models/PortfolioData');

// Mock the PortfolioData model
jest.mock('../../../models/PortfolioData', () => ({
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn()
}));

describe('Portfolio Management Tests', () => {
    let req;
    let res;
    let mockPortfolioData;

    beforeEach(() => {
        req = {
            params: {
                userId: 'testUserId'
            },
            body: {},
            files: []
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        mockPortfolioData = {
            save: jest.fn().mockResolvedValue(true),
            basics: {},
            skills: [],
            experience: [],
            projects: [],
            education: [],
            publications: [],
            certifications: [],
            services: [],
            about: {},
            sectionConfiguration: {
                basics: { isEnabled: true },
                about: { isEnabled: true },
                skills: { isEnabled: true },
                experience: { isEnabled: true },
                education: { isEnabled: true },
                projects: { isEnabled: true },
                certifications: { isEnabled: true },
                publications: { isEnabled: true },
                awards: { isEnabled: true },
                services: { isEnabled: true },
                customSections: { isEnabled: true }
            }
        };
        jest.clearAllMocks();
    });

    describe('UT-Port-001: saveBasicInfo (controller)', () => {
        it('should save new basic info for a user', async () => {
            // Mock data
            const basicInfo = {
                name: 'John Doe',
                role: 'Software Developer',
                bio: 'Experienced developer with 5 years of experience',
                email: 'john@example.com',
                phone: '1234567890',
                location: 'New York, USA'
            };

            // Mock PortfolioData.findOne to return a portfolio
            PortfolioData.findOne.mockResolvedValue({
                ...mockPortfolioData,
                basics: {},
                save: jest.fn().mockResolvedValue({
                    basics: basicInfo
                })
            });

            // Set request body
            req.body = basicInfo;

            // Execute the function
            await saveBasicInfo(req, res);

            // Assertions
            expect(PortfolioData.findOne).toHaveBeenCalledWith({ userId: 'testUserId' });
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Basic information updated successfully',
                data: basicInfo
            });
        });

        it('should return 404 if portfolio not found', async () => {
            // Mock PortfolioData.findOne to return null
            PortfolioData.findOne.mockResolvedValue(null);

            // Execute the function
            await saveBasicInfo(req, res);

            // Assertions
            expect(PortfolioData.findOne).toHaveBeenCalledWith({ userId: 'testUserId' });
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ message: 'Portfolio not found' });
        });
    });

    describe('UT-Port-002: saveBasicInfo (controller)', () => {
        it('should update existing basic info', async () => {
            // Mock existing portfolio data
            const existingBasics = {
                name: 'John Doe',
                role: 'Software Developer',
                bio: 'Experienced developer',
                email: 'john@example.com'
            };

            // Updated data
            const updatedBasics = {
                name: 'John Smith',
                role: 'Senior Developer'
            };

            // Mock PortfolioData.findOne to return a portfolio with existing data
            PortfolioData.findOne.mockResolvedValue({
                ...mockPortfolioData,
                basics: existingBasics,
                save: jest.fn().mockResolvedValue({
                    basics: { ...existingBasics, ...updatedBasics }
                })
            });

            // Set request body with updated data
            req.body = updatedBasics;

            // Execute the function
            await saveBasicInfo(req, res);

            // Assertions
            expect(PortfolioData.findOne).toHaveBeenCalledWith({ userId: 'testUserId' });
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Basic information updated successfully',
                data: { ...existingBasics, ...updatedBasics }
            });
        });
    });

    describe('UT-Port-003: saveSkillsInfo (controller)', () => {
        it('should add multiple skills', async () => {
            // Mock skills data
            const skillsData = {
                skills: [
                    { name: 'JavaScript', category: 'Programming', proficiency: 'Advanced' },
                    { name: 'React', category: 'Frontend', proficiency: 'Intermediate' },
                    { name: 'Node.js', category: 'Backend', proficiency: 'Expert' }
                ]
            };

            // Mock PortfolioData.findOne to return a portfolio
            PortfolioData.findOne.mockResolvedValue({
                ...mockPortfolioData,
                skills: [],
                save: jest.fn().mockResolvedValue({
                    skills: skillsData.skills.map(skill => ({
                        ...skill,
                        isVisible: true
                    }))
                })
            });

            // Set request body
            req.body = skillsData;

            // Execute the function
            await saveSkillsInfo(req, res);

            // Assertions
            expect(PortfolioData.findOne).toHaveBeenCalledWith({ userId: 'testUserId' });
            expect(res.json).toHaveBeenCalledWith({
                message: 'Skills information updated successfully',
                data: expect.arrayContaining([
                    expect.objectContaining({
                        name: 'JavaScript',
                        category: 'Programming',
                        proficiency: 'Advanced',
                        isVisible: true
                    })
                ])
            });
        });

        it('should return 404 if portfolio not found', async () => {
            // Mock PortfolioData.findOne to return null
            PortfolioData.findOne.mockResolvedValue(null);

            // Set request body
            req.body = { skills: [] };

            // Execute the function
            await saveSkillsInfo(req, res);

            // Assertions
            expect(PortfolioData.findOne).toHaveBeenCalledWith({ userId: 'testUserId' });
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ message: 'Portfolio not found' });
        });
    });

    describe('UT-Port-004: getExperienceInfo (controller)', () => {
        it('should fetch experience data for a user with entries', async () => {
            // Mock experience data
            const experienceData = [
                {
                    title: 'Software Developer',
                    company: 'Tech Corp',
                    location: 'New York',
                    startDate: '2020-01-01',
                    endDate: '2022-01-01',
                    current: false,
                    description: 'Developed web applications',
                    achievements: ['Increased performance by 50%']
                },
                {
                    title: 'Senior Developer',
                    company: 'Innovation Inc',
                    location: 'San Francisco',
                    startDate: '2022-02-01',
                    endDate: null,
                    current: true,
                    description: 'Leading development team',
                    achievements: ['Launched 3 major products']
                }
            ];

            // Mock PortfolioData.findOne to return a portfolio with experience data
            PortfolioData.findOne.mockResolvedValue({
                ...mockPortfolioData,
                experience: experienceData
            });

            // Execute the function
            await getExperienceInfo(req, res);

            // Assertions
            expect(PortfolioData.findOne).toHaveBeenCalledWith({ userId: 'testUserId' });
            expect(res.json).toHaveBeenCalledWith({
                message: 'Experience information retrieved successfully',
                data: experienceData
            });
        });

        it('should return 404 if portfolio not found', async () => {
            // Mock PortfolioData.findOne to return null
            PortfolioData.findOne.mockResolvedValue(null);

            // Execute the function
            await getExperienceInfo(req, res);

            // Assertions
            expect(PortfolioData.findOne).toHaveBeenCalledWith({ userId: 'testUserId' });
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ message: 'Portfolio not found' });
        });
    });

    describe('UT-Port-005: getProjectsInfo (controller)', () => {
        it('should fetch project data for a user with no projects', async () => {
            // Mock PortfolioData.findOne to return a portfolio with empty projects array
            PortfolioData.findOne.mockResolvedValue({
                ...mockPortfolioData,
                projects: []
            });

            // Execute the function
            await getProjectsInfo(req, res);

            // Assertions
            expect(PortfolioData.findOne).toHaveBeenCalledWith({ userId: 'testUserId' });
            expect(res.json).toHaveBeenCalledWith({
                message: 'Projects information retrieved successfully',
                data: []
            });
        });

        it('should return 404 if portfolio not found', async () => {
            // Mock PortfolioData.findOne to return null
            PortfolioData.findOne.mockResolvedValue(null);

            // Execute the function
            await getProjectsInfo(req, res);

            // Assertions
            expect(PortfolioData.findOne).toHaveBeenCalledWith({ userId: 'testUserId' });
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ message: 'Portfolio not found' });
        });
    });

    describe('UT-Port-006: updateSectionVisibility (controller)', () => {
        it('should hide the Awards section', async () => {
            // Mock section configuration
            const sectionConfiguration = {
                awards: { isEnabled: false }
            };

            // Mock PortfolioData.findOne to return a portfolio
            PortfolioData.findOne.mockResolvedValue({
                ...mockPortfolioData,
                sectionConfiguration: {
                    ...mockPortfolioData.sectionConfiguration,
                    awards: { isEnabled: true }
                },
                save: jest.fn().mockResolvedValue({
                    sectionConfiguration: {
                        ...mockPortfolioData.sectionConfiguration,
                        awards: { isEnabled: false }
                    }
                })
            });

            // Set request body
            req.body = { sectionConfiguration };

            // Execute the function
            await updateSectionVisibility(req, res);

            // Assertions
            expect(PortfolioData.findOne).toHaveBeenCalledWith({ userId: 'testUserId' });
            expect(res.json).toHaveBeenCalledWith({
                message: 'Section visibility updated successfully',
                data: expect.objectContaining({
                    awards: { isEnabled: false }
                })
            });
        });

        it('should return 404 if portfolio not found', async () => {
            // Mock PortfolioData.findOne to return null
            PortfolioData.findOne.mockResolvedValue(null);

            // Set request body
            req.body = { sectionConfiguration: { awards: { isEnabled: false } } };

            // Execute the function
            await updateSectionVisibility(req, res);

            // Assertions
            expect(PortfolioData.findOne).toHaveBeenCalledWith({ userId: 'testUserId' });
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ message: 'Portfolio not found' });
        });

        it('should return 400 if section configuration is invalid', async () => {
            // Mock PortfolioData.findOne to return a portfolio
            PortfolioData.findOne.mockResolvedValue({
                ...mockPortfolioData,
                sectionConfiguration: {}
            });

            // Set invalid request body
            req.body = { sectionConfiguration: null };

            // Execute the function
            await updateSectionVisibility(req, res);

            // Assertions
            expect(PortfolioData.findOne).toHaveBeenCalledWith({ userId: 'testUserId' });
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ message: 'Invalid section configuration' });
        });
    });

    describe('UT-Port-007: About Section Management', () => {
        it('should save about section information', async () => {
            const aboutData = {
                description: 'Experienced professional with a passion for technology',
                vision: 'To create innovative solutions',
                mission: 'To help businesses grow through technology',
                highlights: [
                    { text: '10+ years of experience', isVisible: true },
                    { text: 'Led 20+ successful projects', isVisible: true }
                ]
            };

            PortfolioData.findOne.mockResolvedValue({
                ...mockPortfolioData,
                about: {},
                save: jest.fn().mockResolvedValue({ 
                    about: {
                        ...aboutData,
                        isVisible: true
                    }
                })
            });

            req.body = aboutData;
            await saveAboutInfo(req, res);

            expect(PortfolioData.findOne).toHaveBeenCalledWith({ userId: 'testUserId' });
            expect(res.json).toHaveBeenCalledWith({
                message: 'About information updated successfully',
                data: expect.objectContaining({
                    description: aboutData.description,
                    vision: aboutData.vision,
                    mission: aboutData.mission,
                    highlights: expect.arrayContaining([
                        expect.objectContaining({ text: '10+ years of experience', isVisible: true })
                    ]),
                    isVisible: true
                })
            });
        });

        it('should handle invalid about data format', async () => {
            const invalidData = {
                description: 123, // Should be string
                highlights: 'not an array'
            };

            PortfolioData.findOne.mockResolvedValue({
                ...mockPortfolioData,
                about: {},
                save: jest.fn()
            });

            req.body = invalidData;
            await saveAboutInfo(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Invalid about data format: description must be a string.'
            });
        });
    });

    describe('UT-Port-008: Education Management', () => {
        it('should save education information', async () => {
            const educationData = {
                education: [
                    {
                        institution: 'University of Technology',
                        degree: 'Bachelor of Science',
                        field: 'Computer Science',
                        startDate: '2018-09-01',
                        endDate: '2022-06-01',
                        current: false,
                        gpa: '3.8',
                        achievements: ['Dean\'s List', 'Academic Excellence Award']
                    }
                ]
            };

            PortfolioData.findOne.mockResolvedValue({
                ...mockPortfolioData,
                education: [],
                save: jest.fn().mockResolvedValue({
                    education: educationData.education.map(edu => ({
                        ...edu,
                        isVisible: true,
                        location: undefined
                    }))
                })
            });

            req.body = educationData;
            await saveEducationInfo(req, res);

            expect(PortfolioData.findOne).toHaveBeenCalledWith({ userId: 'testUserId' });
            expect(res.json).toHaveBeenCalledWith({
                message: 'Education information updated successfully',
                data: expect.arrayContaining([
                    expect.objectContaining({
                        institution: 'University of Technology',
                        degree: 'Bachelor of Science',
                        field: 'Computer Science',
                        startDate: '2018-09-01',
                        endDate: '2022-06-01',
                        current: false,
                        gpa: '3.8',
                        achievements: ['Dean\'s List', 'Academic Excellence Award'],
                        isVisible: true
                    })
                ])
            });
        });

        it('should handle invalid education data format', async () => {
            const invalidData = {
                education: 'not an array'
            };

            PortfolioData.findOne.mockResolvedValue({
                ...mockPortfolioData,
                education: [],
                save: jest.fn()
            });

            req.body = invalidData;
            await saveEducationInfo(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Invalid education data format. Expected an array.'
            });
        });
    });

    describe('UT-Port-009: Publications Management', () => {
        it('should save publications information', async () => {
            const publicationsData = {
                publications: [
                    {
                        title: 'Advanced Web Development',
                        authors: ['John Doe', 'Jane Smith'],
                        publisher: 'Tech Publishing',
                        publicationDate: '2023-01-15',
                        url: 'https://example.com/publication',
                        description: 'A comprehensive guide to web development'
                    }
                ]
            };

            PortfolioData.findOne.mockResolvedValue({
                ...mockPortfolioData,
                publications: [],
                save: jest.fn().mockResolvedValue({
                    publications: publicationsData.publications.map(pub => ({
                        title: pub.title,
                        publisher: pub.publisher,
                        publicationDate: pub.publicationDate,
                        description: pub.description,
                        url: pub.url,
                        image: undefined,
                        isVisible: true
                    }))
                })
            });

            req.body = publicationsData;
            await savePublicationsInfo(req, res);

            expect(PortfolioData.findOne).toHaveBeenCalledWith({ userId: 'testUserId' });
            expect(res.json).toHaveBeenCalledWith({
                message: 'Publications information updated successfully',
                data: expect.arrayContaining([
                    expect.objectContaining({
                        title: 'Advanced Web Development',
                        publisher: 'Tech Publishing',
                        publicationDate: '2023-01-15',
                        url: 'https://example.com/publication',
                        description: 'A comprehensive guide to web development',
                        isVisible: true
                    })
                ])
            });
        });

        it('should handle invalid publications data format', async () => {
            const invalidData = {
                publications: 'not an array'
            };

            PortfolioData.findOne.mockResolvedValue({
                ...mockPortfolioData,
                publications: [],
                save: jest.fn()
            });

            req.body = invalidData;
            await savePublicationsInfo(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Invalid publications data format. Expected an array.'
            });
        });
    });

    describe('UT-Port-010: Certifications Management', () => {
        it('should save certifications information', async () => {
            const certificationsData = {
                certifications: [
                    {
                        name: 'AWS Certified Solutions Architect',
                        issuer: 'Amazon Web Services',
                        issueDate: '2023-03-01',
                        expiryDate: '2026-03-01',
                        credentialId: 'AWS-123456',
                        credentialUrl: 'https://aws.amazon.com/verification'
                    }
                ]
            };

            PortfolioData.findOne.mockResolvedValue({
                ...mockPortfolioData,
                certifications: [],
                save: jest.fn().mockResolvedValue({
                    certifications: certificationsData.certifications.map(cert => ({
                        ...cert,
                        description: undefined,
                        isVisible: true
                    }))
                })
            });

            req.body = certificationsData;
            await saveCertificationsInfo(req, res);

            expect(PortfolioData.findOne).toHaveBeenCalledWith({ userId: 'testUserId' });
            expect(res.json).toHaveBeenCalledWith({
                message: 'Certifications information updated successfully',
                data: expect.arrayContaining([
                    expect.objectContaining({
                        name: 'AWS Certified Solutions Architect',
                        issuer: 'Amazon Web Services',
                        issueDate: '2023-03-01',
                        expiryDate: '2026-03-01',
                        credentialId: 'AWS-123456',
                        credentialUrl: 'https://aws.amazon.com/verification',
                        isVisible: true
                    })
                ])
            });
        });

        it('should handle invalid certifications data format', async () => {
            const invalidData = {
                certifications: 'not an array'
            };

            PortfolioData.findOne.mockResolvedValue({
                ...mockPortfolioData,
                certifications: [],
                save: jest.fn()
            });

            req.body = invalidData;
            await saveCertificationsInfo(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Invalid certifications data format. Expected an array.'
            });
        });
    });

    describe('UT-Port-011: Services Management', () => {
        it('should save services information', async () => {
            const servicesData = {
                services: [
                    {
                        title: 'Web Development Consulting',
                        description: 'Professional web development services',
                        price: '1000',
                        duration: '1 month',
                        features: ['Custom Design', 'Responsive Layout', 'SEO Optimization']
                    }
                ]
            };

            PortfolioData.findOne.mockResolvedValue({
                ...mockPortfolioData,
                services: [],
                save: jest.fn().mockResolvedValue({
                    services: servicesData.services.map(service => ({
                        title: service.title,
                        description: service.description,
                        price: service.price,
                        features: service.features,
                        image: undefined,
                        isVisible: true
                    }))
                })
            });

            req.body = servicesData;
            await saveServicesInfo(req, res);

            expect(PortfolioData.findOne).toHaveBeenCalledWith({ userId: 'testUserId' });
            expect(res.json).toHaveBeenCalledWith({
                message: 'Services information updated successfully',
                data: expect.arrayContaining([
                    expect.objectContaining({
                        title: 'Web Development Consulting',
                        description: 'Professional web development services',
                        price: '1000',
                        features: ['Custom Design', 'Responsive Layout', 'SEO Optimization'],
                        isVisible: true
                    })
                ])
            });
        });

        it('should handle invalid services data format', async () => {
            const invalidData = {
                services: 'not an array'
            };

            PortfolioData.findOne.mockResolvedValue({
                ...mockPortfolioData,
                services: [],
                save: jest.fn()
            });

            req.body = invalidData;
            await saveServicesInfo(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Invalid services data format. Expected an array.'
            });
        });
    });

    describe('File Upload Handling', () => {
        it('should handle project file upload', async () => {
            const mockFile = {
                fieldname: 'projectFile',
                originalname: 'test.pdf',
                encoding: '7bit',
                mimetype: 'application/pdf',
                buffer: Buffer.from('test file content'),
                size: 1024,
                filename: 'mockfilename.pdf'
            };
            const projectData = {
                title: 'Test Project',
                description: 'Project description',
                technologies: ['React', 'Node.js'],
                liveUrl: 'https://example.com/project',
                sourceUrl: 'https://github.com/user/project'
            };
            req.files = [mockFile]; 
            req.body = { projects: JSON.stringify([projectData]) }; 

            // Update the mockSavedPortfolio to match the actual implementation
            const mockSavedPortfolio = {
                ...mockPortfolioData,
                projects: [{
                    title: projectData.title,
                    description: projectData.description,
                    technologies: projectData.technologies,
                    images: [`/uploads/projects/${mockFile.filename}`],
                    liveUrl: projectData.liveUrl,
                    sourceUrl: projectData.sourceUrl,
                    role: undefined,
                    startDate: undefined,
                    endDate: undefined,
                    achievements: [],
                    isVisible: true
                }]
            };
            const mockFoundPortfolio = {
                ...mockPortfolioData,
                projects: [],
                save: jest.fn().mockResolvedValue(mockSavedPortfolio)
            };
            PortfolioData.findOne.mockResolvedValue(mockFoundPortfolio);

            await saveProjectsInfo(req, res);

            expect(PortfolioData.findOne).toHaveBeenCalledWith({ userId: 'testUserId' });
            expect(mockFoundPortfolio.save).toHaveBeenCalled();
            expect(res.json).toHaveBeenCalledWith({
                message: 'Projects information updated successfully',
                data: mockSavedPortfolio.projects
            });
        });

        it('should handle missing projects data gracefully', async () => {
            // Renamed test for clarity - testing how controller handles missing projects body
            const mockFile = {
                fieldname: 'projectFile',
                originalname: 'test.exe', // Keep original file for this scenario
                encoding: '7bit',
                mimetype: 'application/x-msdownload',
                buffer: Buffer.from('test file content'),
                size: 1024,
                filename: 'mockfilename.exe'
            };
            req.files = [mockFile]; 
            req.body = {}; // No projects field

            // Refined Mock Setup
            const mockSavedPortfolio = {
                ...mockPortfolioData,
                projects: [] // Expect empty projects after save
            };
             const mockFoundPortfolio = {
                ...mockPortfolioData,
                projects: [], // Initial state
                save: jest.fn().mockResolvedValue(mockSavedPortfolio)
            };
            PortfolioData.findOne.mockResolvedValue(mockFoundPortfolio);

            await saveProjectsInfo(req, res);

            expect(PortfolioData.findOne).toHaveBeenCalledWith({ userId: 'testUserId' });
            expect(mockFoundPortfolio.save).toHaveBeenCalled(); // Save should still be called
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                message: 'Projects information updated successfully',
                data: [] // Expect empty projects array
            }));
        });

        it('should handle file uploads correctly (now using req.files)', async () => {
            const mockFile = {
                fieldname: 'projectImage',
                originalname: 'test.jpg',
                mimetype: 'image/jpeg',
                buffer: Buffer.from('test'),
                size: 1024,
                filename: 'mockfilename.jpg'
            };
            const projectBody = {
                title: 'Test Project',
                description: 'Test Description',
                technologies: ['React', 'Node.js'],
                liveUrl: 'https://test.com'
            };
            req.files = [mockFile]; 
            req.body = { projects: JSON.stringify([projectBody]) }; 

            // Update the mockSavedPortfolio to match the actual implementation
            const mockSavedPortfolio = {
                ...mockPortfolioData,
                projects: [{
                    ...projectBody,
                    images: [`/uploads/projects/${mockFile.filename}`],
                    liveUrl: projectBody.liveUrl,
                    sourceUrl: undefined,
                    role: undefined,
                    startDate: undefined,
                    endDate: undefined,
                    achievements: [],
                    isVisible: true
                }]
            };
            const mockFoundPortfolio = {
                ...mockPortfolioData,
                projects: [],
                save: jest.fn().mockResolvedValue(mockSavedPortfolio)
            };
            PortfolioData.findOne.mockResolvedValue(mockFoundPortfolio);

            await saveProjectsInfo(req, res);

            expect(PortfolioData.findOne).toHaveBeenCalledWith({ userId: 'testUserId' });
            expect(mockFoundPortfolio.save).toHaveBeenCalled();
            expect(res.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    message: 'Projects information updated successfully',
                    data: mockSavedPortfolio.projects
                })
            );
        });
    });
}); 