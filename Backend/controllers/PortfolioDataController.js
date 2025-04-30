const express = require('express');
const multer = require('multer');
const path = require('path');
const PortfolioData = require('../models/PortfolioData');
const Template = require('../models/Templates');

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path.join(__dirname, '../uploads/portfolio');
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({ storage });

// Save basic information
exports.saveBasicInfo = async (req, res) => {
    try {
        const { userId } = req.params;
        console.log(`[saveBasicInfo] Saving basic info for user: ${userId}`);
        console.log(`[saveBasicInfo] Request body:`, JSON.stringify(req.body, null, 2));

        let portfolio = await PortfolioData.findOne({ userId });
        if (!portfolio) {
            console.log(`[saveBasicInfo] Portfolio not found for user: ${userId}`);
            return res.status(404).json({ message: 'Portfolio not found' });
        }

        portfolio.basics = {
            ...portfolio.basics,
            ...req.body
        };

        if (req.file) {
            console.log(`[saveBasicInfo] Profile image uploaded: ${req.file.filename}`);
            portfolio.basics.profileImage = `/uploads/portfolio/${req.file.filename}`;
        }

        await portfolio.save();
        console.log(`[saveBasicInfo] Successfully saved basic info for user: ${userId}`);

        res.status(200).json({
            message: 'Basic information updated successfully',
            data: portfolio.basics
        });
    } catch (error) {
        console.error('[saveBasicInfo] Error updating basic information:', error);
        res.status(500).json({ message: 'Error updating basic information' });
    }
};


exports.getBasicInfo = async (req, res) => {
    try {
        const { userId } = req.params;
        console.log(`[GET /basic-info] Fetching basic info for user: ${userId}`);

        const portfolio = await PortfolioData.findOne({ userId });
        if (!portfolio) {
            console.log(`[GET /basic-info] Portfolio not found for user: ${userId}`);
            return res.status(404).json({ message: 'Portfolio not found' });
        }

        console.log(`[GET /basic-info] Successfully retrieved basic info for user: ${userId}`);
        res.status(200).json({
            message: 'Basic information retrieved successfully',
            data: portfolio.basics
        });
    } catch (error) {
        console.error('[GET /basic-info] Error retrieving basic information:', error);
        res.status(500).json({ message: 'Error retrieving basic information' });
    }
};

// Save about section information
exports.saveAboutInfo = async (req, res) => {
    try {
        const { userId } = req.params;
        console.log(`[saveAboutInfo] Saving about info for user: ${userId}`);
        console.log(`[saveAboutInfo] Request body:`, JSON.stringify(req.body, null, 2));

        // --- Start Validation ---
        const { description, vision, mission, highlights } = req.body;

        if (description && typeof description !== 'string') {
            return res.status(400).json({ message: 'Invalid about data format: description must be a string.' });
        }
        if (vision && typeof vision !== 'string') {
            return res.status(400).json({ message: 'Invalid about data format: vision must be a string.' });
        }
        if (mission && typeof mission !== 'string') {
            return res.status(400).json({ message: 'Invalid about data format: mission must be a string.' });
        }
        if (highlights && !Array.isArray(highlights)) {
            return res.status(400).json({ message: 'Invalid about data format: highlights must be an array.' });
        }
        // Optional: Validate structure within highlights array if needed
        if (Array.isArray(highlights)) {
            for (const item of highlights) {
                if (typeof item.text !== 'string' || typeof item.isVisible !== 'boolean') {
                    return res.status(400).json({ message: 'Invalid about data format: Each highlight must have a string `text` and a boolean `isVisible`.' });
                }
            }
        }
        // --- End Validation ---

        let portfolio = await PortfolioData.findOne({ userId });
        if (!portfolio) {
            console.log(`[saveAboutInfo] Portfolio not found for user: ${userId}`);
            return res.status(404).json({ message: 'Portfolio not found' });
        }

        // Update about section
        portfolio.about = {
            ...portfolio.about,
            description: req.body.description,
            vision: req.body.vision,
            mission: req.body.mission,
            highlights: req.body.highlights || [],
            isVisible: true
        };

        await portfolio.save();
        console.log(`[saveAboutInfo] Successfully saved about info for user: ${userId}`);

        res.status(200).json({
            message: 'About information updated successfully',
            data: portfolio.about
        });
    } catch (error) {
        console.error('[saveAboutInfo] Error updating about information:', error);
        res.status(500).json({ message: 'Error updating about information' });
    }
};

// Get about section information
exports.getAboutInfo = async (req, res) => {
    try {
        const { userId } = req.params;
        console.log(`[getAboutInfo] Fetching about info for user: ${userId}`);

        const portfolio = await PortfolioData.findOne({ userId });
        if (!portfolio) {
            console.log(`[getAboutInfo] Portfolio not found for user: ${userId}`);
            return res.status(404).json({ message: 'Portfolio not found' });
        }

        console.log(`[getAboutInfo] Successfully retrieved about info for user: ${userId}`);
        res.status(200).json({
            message: 'About information retrieved successfully',
            data: portfolio.about
        });
    } catch (error) {
        console.error('[getAboutInfo] Error retrieving about information:', error);
        res.status(500).json({ message: 'Error retrieving about information' });
    }
};

// Save skills information
exports.saveSkillsInfo = async (req, res) => {
    try {
        const userId = req.params.userId;
        console.log(`[saveSkillsInfo] Saving skills for user: ${userId}`);
        console.log('Request body:', req.body);

        // Find the user's portfolio
        let portfolio = await PortfolioData.findOne({ userId });
        if (!portfolio) {
            return res.status(404).json({ message: 'Portfolio not found' });
        }

        // Update skills
        portfolio.skills = req.body.skills.map(skill => ({
            name: skill.name,
            category: skill.category,
            proficiency: skill.proficiency,
            isVisible: true
        }));

        // Save the updated portfolio
        await portfolio.save();
        console.log(`[saveSkillsInfo] Successfully saved skills for user: ${userId}`);

        res.json({
            message: 'Skills information updated successfully',
            data: portfolio.skills
        });
    } catch (error) {
        console.error('[saveSkillsInfo] Error:', error);
        res.status(500).json({ message: 'Error saving skills information', error: error.message });
    }
};

// Get skills information
exports.getSkillsInfo = async (req, res) => {
    try {
        const userId = req.params.userId;
        console.log(`[getSkillsInfo] Getting skills for user: ${userId}`);

        const portfolio = await PortfolioData.findOne({ userId });
        if (!portfolio) {
            return res.status(404).json({ message: 'Portfolio not found' });
        }

        res.json({
            message: 'Skills information retrieved successfully',
            data: portfolio.skills
        });
    } catch (error) {
        console.error('[getSkillsInfo] Error:', error);
        res.status(500).json({ message: 'Error retrieving skills information', error: error.message });
    }
};

// Save experience information
exports.saveExperienceInfo = async (req, res) => {
    try {
        const userId = req.params.userId;
        console.log(`[saveExperienceInfo] Saving experience for user: ${userId}`);
        console.log('Request body:', req.body);

        // Find the user's portfolio
        let portfolio = await PortfolioData.findOne({ userId });
        if (!portfolio) {
            return res.status(404).json({ message: 'Portfolio not found' });
        }

        // Update experience
        portfolio.experience = req.body.experience.map(exp => ({
            title: exp.title,
            company: exp.company,
            location: exp.location,
            startDate: exp.startDate,
            endDate: exp.endDate,
            current: exp.current || false,
            description: exp.description,
            achievements: exp.achievements || [],
            isVisible: true
        }));

        // Save the updated portfolio
        await portfolio.save();
        console.log(`[saveExperienceInfo] Successfully saved experience for user: ${userId}`);

        res.json({
            message: 'Experience information updated successfully',
            data: portfolio.experience
        });
    } catch (error) {
        console.error('[saveExperienceInfo] Error:', error);
        res.status(500).json({ message: 'Error saving experience information', error: error.message });
    }
};

// Get experience information
exports.getExperienceInfo = async (req, res) => {
    try {
        const userId = req.params.userId;
        console.log(`[getExperienceInfo] Getting experience for user: ${userId}`);

        const portfolio = await PortfolioData.findOne({ userId });
        if (!portfolio) {
            return res.status(404).json({ message: 'Portfolio not found' });
        }

        res.json({
            message: 'Experience information retrieved successfully',
            data: portfolio.experience
        });
    } catch (error) {
        console.error('[getExperienceInfo] Error:', error);
        res.status(500).json({ message: 'Error retrieving experience information', error: error.message });
    }
};

// Save projects information
exports.saveProjectsInfo = async (req, res) => {
    try {
        const userId = req.params.userId;
        console.log(`[saveProjectsInfo] Saving projects for user: ${userId}`);
        console.log('Request body:', req.body);

        // Find the user's portfolio
        let portfolio = await PortfolioData.findOne({ userId });
        if (!portfolio) {
            return res.status(404).json({ message: 'Portfolio not found' });
        }

        // Handle uploaded files
        const uploadedFiles = req.files || [];
        const projectImages = uploadedFiles.map(file => `/uploads/projects/${file.filename}`);

        // Parse projects if it's a string (form-data) or use as is if it's JSON
        const projectsData = typeof req.body.projects === 'string' 
            ? JSON.parse(req.body.projects) 
            : req.body.projects;

        // Ensure projectsData is an array before mapping
        const validProjectsData = Array.isArray(projectsData) ? projectsData : [];

        // Update projects
        portfolio.projects = validProjectsData.map((project, index) => ({
            title: project.title,
            description: project.description,
            role: project.role,
            technologies: project.technologies || [],
            // If there are uploaded files for this project, use them, otherwise keep existing images
            images: projectImages.length > index ? [projectImages[index]] : (project.images || []),
            liveUrl: project.liveUrl,
            sourceUrl: project.sourceUrl,
            startDate: project.startDate,
            endDate: project.endDate,
            achievements: project.achievements || [],
            isVisible: true
        }));

        // Save the updated portfolio
        await portfolio.save();
        console.log(`[saveProjectsInfo] Successfully saved projects for user: ${userId}`);

        res.json({
            message: 'Projects information updated successfully',
            data: portfolio.projects
        });
    } catch (error) {
        console.error('[saveProjectsInfo] Error:', error);
        res.status(500).json({ message: 'Error saving projects information', error: error.message });
    }
};

// Get projects information
exports.getProjectsInfo = async (req, res) => {
    try {
        const userId = req.params.userId;
        console.log(`[getProjectsInfo] Getting projects for user: ${userId}`);

        const portfolio = await PortfolioData.findOne({ userId });
        if (!portfolio) {
            return res.status(404).json({ message: 'Portfolio not found' });
        }

        res.json({
            message: 'Projects information retrieved successfully',
            data: portfolio.projects
        });
    } catch (error) {
        console.error('[getProjectsInfo] Error:', error);
        res.status(500).json({ message: 'Error retrieving projects information', error: error.message });
    }
};

// Save education information
exports.saveEducationInfo = async (req, res) => {
    try {
        const userId = req.params.userId;
        console.log(`[saveEducationInfo] Saving education for user: ${userId}`);
        // Ensure req.body.education exists and is an array
        const educationData = req.body.education || [];
        console.log('Request body (education):', educationData);

        if (!Array.isArray(educationData)) {
             return res.status(400).json({ message: 'Invalid education data format. Expected an array.' });
        }

        // Find the user's portfolio
        let portfolio = await PortfolioData.findOne({ userId });
        if (!portfolio) {
            return res.status(404).json({ message: 'Portfolio not found' });
        }

        // Update education - map to ensure only expected fields are saved
        portfolio.education = educationData.map(edu => ({
            institution: edu.institution,
            degree: edu.degree,
            field: edu.field,
            location: edu.location,
            startDate: edu.startDate,
            // Explicitly set endDate to null if current is true
            endDate: edu.current ? null : edu.endDate, 
            current: edu.current || false,
            gpa: edu.gpa,
            achievements: edu.achievements || [],
            isVisible: edu.isVisible !== undefined ? edu.isVisible : true // Default to true if not provided
        }));

        // Save the updated portfolio
        await portfolio.save();
        console.log(`[saveEducationInfo] Successfully saved education for user: ${userId}`);

        res.json({
            message: 'Education information updated successfully',
            data: portfolio.education // Return the saved data
        });
    } catch (error) {
        console.error('[saveEducationInfo] Error:', error);
        res.status(500).json({ message: 'Error saving education information', error: error.message });
    }
};

// Get education information
exports.getEducationInfo = async (req, res) => {
    try {
        const userId = req.params.userId;
        console.log(`[getEducationInfo] Getting education for user: ${userId}`);

        const portfolio = await PortfolioData.findOne({ userId });
        if (!portfolio || !portfolio.education) {
            // Return empty array if portfolio or education doesn't exist, which is valid
             console.log(`[getEducationInfo] Portfolio or education not found for user: ${userId}. Returning empty array.`);
            return res.json({
                message: 'Education information retrieved successfully (or empty)',
                data: []
            });
        }

        console.log(`[getEducationInfo] Successfully retrieved education for user: ${userId}`);
        res.json({
            message: 'Education information retrieved successfully',
            data: portfolio.education
        });
    } catch (error) {
        console.error('[getEducationInfo] Error:', error);
        res.status(500).json({ message: 'Error retrieving education information', error: error.message });
    }
};

// Save publications information
exports.savePublicationsInfo = async (req, res) => {
    try {
        const userId = req.params.userId;
        console.log(`[savePublicationsInfo] Saving publications for user: ${userId}`);
        const publicationsData = req.body.publications || [];
        console.log('Request body (publications):', publicationsData);

        if (!Array.isArray(publicationsData)) {
             return res.status(400).json({ message: 'Invalid publications data format. Expected an array.' });
        }

        let portfolio = await PortfolioData.findOne({ userId });
        if (!portfolio) {
            return res.status(404).json({ message: 'Portfolio not found' });
        }

        portfolio.publications = publicationsData.map(pub => ({
            title: pub.title,
            publisher: pub.publisher,
            publicationDate: pub.publicationDate, // Assuming date is handled correctly on frontend/backend
            description: pub.description,
            url: pub.url,
            image: pub.image, // Handle image uploads separately if needed
            isVisible: pub.isVisible !== undefined ? pub.isVisible : true
        }));

        await portfolio.save();
        console.log(`[savePublicationsInfo] Successfully saved publications for user: ${userId}`);

        res.json({
            message: 'Publications information updated successfully',
            data: portfolio.publications
        });
    } catch (error) {
        console.error('[savePublicationsInfo] Error:', error);
        res.status(500).json({ message: 'Error saving publications information', error: error.message });
    }
};

// Get publications information
exports.getPublicationsInfo = async (req, res) => {
    try {
        const userId = req.params.userId;
        console.log(`[getPublicationsInfo] Getting publications for user: ${userId}`);

        const portfolio = await PortfolioData.findOne({ userId });
        if (!portfolio || !portfolio.publications) {
             console.log(`[getPublicationsInfo] Portfolio or publications not found for user: ${userId}. Returning empty array.`);
            return res.json({
                message: 'Publications information retrieved successfully (or empty)',
                data: []
            });
        }

        console.log(`[getPublicationsInfo] Successfully retrieved publications for user: ${userId}`);
        res.json({
            message: 'Publications information retrieved successfully',
            data: portfolio.publications
        });
    } catch (error) {
        console.error('[getPublicationsInfo] Error:', error);
        res.status(500).json({ message: 'Error retrieving publications information', error: error.message });
    }
};

// Save certifications information
exports.saveCertificationsInfo = async (req, res) => {
    try {
        const userId = req.params.userId;
        console.log(`[saveCertificationsInfo] Saving certifications for user: ${userId}`);
        const certificationsData = req.body.certifications || [];
        console.log('Request body (certifications):', certificationsData);

        if (!Array.isArray(certificationsData)) {
             return res.status(400).json({ message: 'Invalid certifications data format. Expected an array.' });
        }

        let portfolio = await PortfolioData.findOne({ userId });
        if (!portfolio) {
            return res.status(404).json({ message: 'Portfolio not found' });
        }

        portfolio.certifications = certificationsData.map(cert => ({
            name: cert.name,
            issuer: cert.issuer,
            issueDate: cert.issueDate,
            expiryDate: cert.expiryDate, // Can be null
            credentialId: cert.credentialId,
            credentialUrl: cert.credentialUrl,
            description: cert.description,
            isVisible: cert.isVisible !== undefined ? cert.isVisible : true
        }));

        await portfolio.save();
        console.log(`[saveCertificationsInfo] Successfully saved certifications for user: ${userId}`);

        res.json({
            message: 'Certifications information updated successfully',
            data: portfolio.certifications
        });
    } catch (error) {
        console.error('[saveCertificationsInfo] Error:', error);
        res.status(500).json({ message: 'Error saving certifications information', error: error.message });
    }
};

// Get certifications information
exports.getCertificationsInfo = async (req, res) => {
    try {
        const userId = req.params.userId;
        console.log(`[getCertificationsInfo] Getting certifications for user: ${userId}`);

        const portfolio = await PortfolioData.findOne({ userId });
        if (!portfolio || !portfolio.certifications) {
             console.log(`[getCertificationsInfo] Portfolio or certifications not found for user: ${userId}. Returning empty array.`);
            return res.json({
                message: 'Certifications information retrieved successfully (or empty)',
                data: []
            });
        }

        console.log(`[getCertificationsInfo] Successfully retrieved certifications for user: ${userId}`);
        res.json({
            message: 'Certifications information retrieved successfully',
            data: portfolio.certifications
        });
    } catch (error) {
        console.error('[getCertificationsInfo] Error:', error);
        res.status(500).json({ message: 'Error retrieving certifications information', error: error.message });
    }
};

// Save awards information
exports.saveAwardsInfo = async (req, res) => {
    try {
        const userId = req.params.userId;
        console.log(`[saveAwardsInfo] Saving awards for user: ${userId}`);
        const awardsData = req.body.awards || [];
        console.log('Request body (awards):', awardsData);

        if (!Array.isArray(awardsData)) {
             return res.status(400).json({ message: 'Invalid awards data format. Expected an array.' });
        }

        let portfolio = await PortfolioData.findOne({ userId });
        if (!portfolio) {
            return res.status(404).json({ message: 'Portfolio not found' });
        }

        portfolio.awards = awardsData.map(award => ({
            title: award.title,
            issuer: award.issuer,
            date: award.date,
            description: award.description,
            image: award.image, // Handle image uploads separately if needed
            isVisible: award.isVisible !== undefined ? award.isVisible : true
        }));

        await portfolio.save();
        console.log(`[saveAwardsInfo] Successfully saved awards for user: ${userId}`);

        res.json({
            message: 'Awards information updated successfully',
            data: portfolio.awards
        });
    } catch (error) {
        console.error('[saveAwardsInfo] Error:', error);
        res.status(500).json({ message: 'Error saving awards information', error: error.message });
    }
};

// Get awards information
exports.getAwardsInfo = async (req, res) => {
    try {
        const userId = req.params.userId;
        console.log(`[getAwardsInfo] Getting awards for user: ${userId}`);

        const portfolio = await PortfolioData.findOne({ userId });
        if (!portfolio || !portfolio.awards) {
             console.log(`[getAwardsInfo] Portfolio or awards not found for user: ${userId}. Returning empty array.`);
            return res.json({
                message: 'Awards information retrieved successfully (or empty)',
                data: []
            });
        }

        console.log(`[getAwardsInfo] Successfully retrieved awards for user: ${userId}`);
        res.json({
            message: 'Awards information retrieved successfully',
            data: portfolio.awards
        });
    } catch (error) {
        console.error('[getAwardsInfo] Error:', error);
        res.status(500).json({ message: 'Error retrieving awards information', error: error.message });
    }
};

// Save services information
exports.saveServicesInfo = async (req, res) => {
    try {
        const userId = req.params.userId;
        console.log(`[saveServicesInfo] Saving services for user: ${userId}`);
        const servicesData = req.body.services || [];
        console.log('Request body (services):', servicesData);

        if (!Array.isArray(servicesData)) {
             return res.status(400).json({ message: 'Invalid services data format. Expected an array.' });
        }

        let portfolio = await PortfolioData.findOne({ userId });
        if (!portfolio) {
            return res.status(404).json({ message: 'Portfolio not found' });
        }

        // Map data, ensuring features is always an array
        portfolio.services = servicesData.map(service => ({
            title: service.title,
            description: service.description,
            image: service.image,
            price: service.price,
            features: Array.isArray(service.features) ? service.features : [], // Ensure features is an array
            isVisible: service.isVisible !== undefined ? service.isVisible : true
        }));

        await portfolio.save();
        console.log(`[saveServicesInfo] Successfully saved services for user: ${userId}`);

        res.json({
            message: 'Services information updated successfully',
            data: portfolio.services
        });
    } catch (error) {
        console.error('[saveServicesInfo] Error:', error);
        res.status(500).json({ message: 'Error saving services information', error: error.message });
    }
};

// Get services information
exports.getServicesInfo = async (req, res) => {
    try {
        const userId = req.params.userId;
        console.log(`[getServicesInfo] Getting services for user: ${userId}`);

        const portfolio = await PortfolioData.findOne({ userId });
        if (!portfolio || !portfolio.services) {
             console.log(`[getServicesInfo] Portfolio or services not found for user: ${userId}. Returning empty array.`);
            return res.json({
                message: 'Services information retrieved successfully (or empty)',
                data: []
            });
        }

        console.log(`[getServicesInfo] Successfully retrieved services for user: ${userId}`);
        // Ensure features is always an array in the response
        const responseData = portfolio.services.map(service => ({
             ...service.toObject(), // Convert Mongoose doc to plain object if needed
             features: Array.isArray(service.features) ? service.features : []
        }));
        res.json({
            message: 'Services information retrieved successfully',
            data: responseData
        });
    } catch (error) {
        console.error('[getServicesInfo] Error:', error);
        res.status(500).json({ message: 'Error retrieving services information', error: error.message });
    }
};

// Update section visibility settings
exports.updateSectionVisibility = async (req, res) => {
    try {
        const userId = req.params.userId;
        console.log(`[updateSectionVisibility] Updating section visibility for user: ${userId}`);
        console.log('Request body:', req.body);

        // Find the user's portfolio
        let portfolio = await PortfolioData.findOne({ userId });
        if (!portfolio) {
            return res.status(404).json({ message: 'Portfolio not found' });
        }

        // Update section visibility settings
        const { sectionConfiguration } = req.body;
        
        // Validate the section configuration
        if (!sectionConfiguration || typeof sectionConfiguration !== 'object') {
            return res.status(400).json({ message: 'Invalid section configuration' });
        }

        // Update each section's visibility
        Object.keys(sectionConfiguration).forEach(section => {
            if (portfolio.sectionConfiguration[section]) {
                portfolio.sectionConfiguration[section].isEnabled = sectionConfiguration[section].isEnabled;
            }
        });

        // Save the updated portfolio
        await portfolio.save();
        console.log(`[updateSectionVisibility] Successfully updated section visibility for user: ${userId}`);

        res.json({
            message: 'Section visibility updated successfully',
            data: portfolio.sectionConfiguration
        });
    } catch (error) {
        console.error('[updateSectionVisibility] Error:', error);
        res.status(500).json({ message: 'Error updating section visibility', error: error.message });
    }
};

// Get section visibility settings
exports.getSectionVisibility = async (req, res) => {
    try {
        const userId = req.params.userId;
        console.log(`[getSectionVisibility] Getting section visibility for user: ${userId}`);

        // Find the user's portfolio
        const portfolio = await PortfolioData.findOne({ userId });
        if (!portfolio) {
            return res.status(404).json({ message: 'Portfolio not found' });
        }

        console.log(`[getSectionVisibility] Successfully retrieved section visibility for user: ${userId}`);

        res.json({
            message: 'Section visibility retrieved successfully',
            data: portfolio.sectionConfiguration
        });
    } catch (error) {
        console.error('[getSectionVisibility] Error:', error);
        res.status(500).json({ message: 'Error retrieving section visibility', error: error.message });
    }
};

// Get available sections for a template
exports.getTemplateSections = async (req, res) => {
    try {
        const { templateId } = req.params;
        console.log(`[getTemplateSections] Getting sections for template: ${templateId}`);

        // Find the template
        const template = await Template.findById(templateId);
        if (!template) {
            console.log(`[getTemplateSections] Template not found: ${templateId}`);
            return res.status(404).json({ message: 'Template not found' });
        }

        // Get available sections from the template
        const availableSections = template.sections || [];
        
        console.log(`[getTemplateSections] Successfully retrieved ${availableSections.length} sections for template: ${templateId}`);
        res.status(200).json({
            message: 'Template sections retrieved successfully',
            sections: availableSections
        });
    } catch (error) {
        console.error('[getTemplateSections] Error retrieving template sections:', error);
        res.status(500).json({ message: 'Error retrieving template sections' });
    }
};

// Export the upload middleware for use in routes
exports.upload = upload;




