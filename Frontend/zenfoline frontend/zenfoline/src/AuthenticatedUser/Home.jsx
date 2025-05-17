import React, { useEffect, useState } from 'react';
import useAuthStore from '../store/userAuthStore';
import useTemplateStore from '../store/userTemplateStore';
import { Link } from 'react-router-dom';
import { 
    FiEdit, FiEye, FiLayout, FiBarChart2, FiArrowRight, FiSettings, FiCheckCircle, 
    FiZap, FiUser, FiBriefcase, FiCode, FiAward, FiFileText, FiInfo, FiBook, FiStar, FiTool, FiAlertCircle, FiLoader, FiTrendingUp, FiClock, FiLock, FiUsers, FiTrendingDown
} from 'react-icons/fi';
import { FaPaintBrush } from 'react-icons/fa';
import Spinner from '../components/Spinner';
import axios from 'axios';

// Define API Base URL
const API_BASE_URL = 'http://localhost:3000';

// Define assumed default theme values
const DEFAULT_THEME = {
    colorMode: 'default',
    presetTheme: null, // Or 0, depending on how your presets are indexed
    fontStyle: 'Poppins'
};

// Mapping for all possible sections with labels and icons
const ALL_SECTIONS_INFO = {
    basics: { label: 'Fill Basic Info', icon: <FiUser className="w-5 h-5 text-blue-500" />, endpoint: 'basic-info' },
    about: { label: 'Write About Yourself', icon: <FiInfo className="w-5 h-5 text-teal-500" />, endpoint: 'about' },
    skills: { label: 'List Your Skills', icon: <FiCode className="w-5 h-5 text-red-500" />, endpoint: 'skills' },
    experience: { label: 'Add Experience', icon: <FiBriefcase className="w-5 h-5 text-purple-500" />, endpoint: 'experience' },
    education: { label: 'Detail Education', icon: <FiBook className="w-5 h-5 text-indigo-500" />, endpoint: 'education' },
    projects: { label: 'Showcase Projects', icon: <FiFileText className="w-5 h-5 text-green-500" />, endpoint: 'projects' },
    certifications: { label: 'Add Certifications', icon: <FiAward className="w-5 h-5 text-pink-500" />, endpoint: 'certifications' },
    publications: { label: 'Include Publications', icon: <FiFileText className="w-5 h-5 text-cyan-500" />, endpoint: 'publications' },
    awards: { label: 'Mention Awards', icon: <FiStar className="w-5 h-5 text-yellow-600" />, endpoint: 'awards' },
    services: { label: 'Define Services', icon: <FiTool className="w-5 h-5 text-gray-500" />, endpoint: 'services' },
    customize: { label: 'Customize Appearance', icon: <FaPaintBrush className="w-5 h-5 text-yellow-500" />, link: '/dashboard/themepage' }
};

// Function to check if a section's data meets completion criteria
const checkSectionCompletion = (sectionId, data) => {
    if (!data) return false;
    switch (sectionId) {
        case 'basics':
            return !!(data.name || data.email || data.role); // Basic check
        case 'about':
            return !!(data.description && data.description.trim() !== '');
        case 'skills':
            // Handles both array format and object with technical/soft arrays
            if (Array.isArray(data)) return data.length > 0;
            return !!(data.technical?.length > 0 || data.soft?.length > 0);
        case 'experience':
        case 'education':
        case 'projects':
        case 'publications':
        case 'certifications':
        case 'awards':
        case 'services':
            return Array.isArray(data) && data.length > 0;
        // case 'customize': // Customize completion logic is complex, default to false for now
        //     return false; 
        default:
            return false;
    }
};

const Home = () => {
    const email = useAuthStore((state) => state.email);
    const userId = useAuthStore((state) => state.userId);
    const { templates, activeTemplateId, fetchTemplates } = useTemplateStore();

    const [sectionVisibility, setSectionVisibility] = useState(null);
    const [contentCompletion, setContentCompletion] = useState({});
    const [themeSettings, setThemeSettings] = useState(null);
    const [isLoading, setIsLoading] = useState({ visibility: true, content: true, theme: true });
    const [error, setError] = useState({ visibility: null, content: null, theme: null });
    const [userStats, setUserStats] = useState({
        sectionsComplete: 0,
        totalSections: 0,
        profileViews: 0,
        uniqueVisitors: 0,
        averageSessionDuration: 0,
        bounceRate: 0,
        lastUpdated: null
    });

    useEffect(() => {
        if (!userId) {
            setIsLoading({ visibility: false, content: false, theme: false });
            return;
        }

        const fetchAllData = async () => {
            setIsLoading({ visibility: true, content: true, theme: true });
            setError({ visibility: null, content: null, theme: null });
            let visibilityData = null;
            let fetchedTheme = null;
            let finalCompletionStatus = {};
            let analyticsSummary = null;

            try {
                // 1. Fetch Templates
                await fetchTemplates(userId);

                // 2. Fetch Section Visibility
                const visibilityResponse = await fetch(`${API_BASE_URL}/portfolio-save/section-visibility/${userId}`);
                if (!visibilityResponse.ok) throw new Error(`Visibility fetch failed: ${visibilityResponse.statusText}`);
                const visibilityResult = await visibilityResponse.json();
                if (!visibilityResult.data) throw new Error('Invalid visibility data format');
                visibilityData = visibilityResult.data;
                setSectionVisibility(visibilityData);
                setIsLoading(prev => ({ ...prev, visibility: false }));

                // 3. Fetch Theme Settings
                try {
                    const themeResponse = await fetch(`${API_BASE_URL}/authenticated-user/gettheme?userId=${userId}`);
                    if (!themeResponse.ok) {
                        if (themeResponse.status === 404) {
                            fetchedTheme = DEFAULT_THEME;
                        } else {
                            throw new Error(`Theme fetch failed: ${themeResponse.statusText}`);
                        }
                    } else {
                        const themeResult = await themeResponse.json();
                        fetchedTheme = themeResult.theme;
                    }
                    setThemeSettings(fetchedTheme);
                } catch (themeErr) {
                    console.error("Error fetching theme:", themeErr);
                    setError(prev => ({ ...prev, theme: themeErr.message || 'Failed to load theme' }));
                } finally {
                    setIsLoading(prev => ({ ...prev, theme: false }));
                }

                // 4. Fetch Content for ENABLED sections
                const enabledSections = Object.entries(visibilityData)
                    .filter(([key, value]) => key !== 'customSections' && value.isEnabled)
                    .map(([key]) => key);
                
                if (enabledSections.length > 0) {
                    const contentPromises = enabledSections.map(async (sectionId) => {
                        const endpoint = ALL_SECTIONS_INFO[sectionId]?.endpoint;
                        if (!endpoint) return { sectionId, completed: false };
                        try {
                            const contentResponse = await fetch(`${API_BASE_URL}/portfolio-save/${endpoint}/${userId}`);
                            if (contentResponse.status === 404) return { sectionId, completed: false };
                            if (!contentResponse.ok) return { sectionId, completed: false }; 
                            const contentResult = await contentResponse.json();
                            return { sectionId, completed: checkSectionCompletion(sectionId, contentResult.data) };
                        } catch (err) { return { sectionId, completed: false }; }
                    });
                    const completionResults = await Promise.all(contentPromises);
                    completionResults.forEach(result => { if (result) { finalCompletionStatus[result.sectionId] = result.completed; } });
                }

                // 5. Check Customize completion
                if (fetchedTheme) {
                    const isCustomized = 
                        fetchedTheme.colorMode !== DEFAULT_THEME.colorMode ||
                        (String(fetchedTheme.presetTheme ?? '') !== String(DEFAULT_THEME.presetTheme ?? '') && String(fetchedTheme.presetTheme ?? '') !== '0') || 
                        fetchedTheme.fontStyle !== DEFAULT_THEME.fontStyle;
                    finalCompletionStatus.customize = isCustomized;
                } else {
                    finalCompletionStatus.customize = false;
                }

                // 6. Fetch analytics summary for profile views
                try {
                    const analyticsRes = await axios.get(`http://localhost:3000/api/analytics/summary?userId=${userId}&timeRange=30d`);
                    analyticsSummary = analyticsRes.data.data;
                } catch (analyticsErr) {
                    console.error('Error fetching analytics summary:', analyticsErr);
                }

                // Update completion status and stats
                setContentCompletion(finalCompletionStatus);
                const completedCount = Object.values(finalCompletionStatus).filter(Boolean).length;
                setUserStats(prev => ({
                    ...prev,
                    sectionsComplete: completedCount,
                    totalSections: Object.keys(finalCompletionStatus).length,
                    profileViews: analyticsSummary?.totalSessions || 0,
                    uniqueVisitors: analyticsSummary?.uniqueVisitors || 0,
                    averageSessionDuration: analyticsSummary?.averageSessionDuration || 0,
                    bounceRate: analyticsSummary?.bounceRate || 0,
                    lastUpdated: new Date().toLocaleDateString()
                }));

            } catch (err) {
                console.error("Error fetching dashboard data:", err);
                setError(prev => ({ ...prev, visibility: err.message || 'Failed to load data' }));
                setIsLoading({ visibility: false, content: false, theme: false });
            } finally {
                if (isLoading.content) {
                    setIsLoading(prev => ({ ...prev, content: false }));
                }
            }
        };

        fetchAllData();
    }, [userId, fetchTemplates]);

    const activeTemplate = templates.find(t => t._id === activeTemplateId);

    const handleEditTemplate = (sectionId = '') => {
        if (activeTemplateId) {
            const url = `/template-editor/${activeTemplateId}${sectionId ? `#${sectionId}` : ''}`;
            window.open(url, '_blank');
        }
    };

    const handleViewSite = () => {
        if (userId) {
            const portfolioUrl = `${window.location.origin}/portfolio/${userId}`;
            window.open(portfolioUrl, '_blank');
        }
    };

    // --- Dynamic Checklist Generation ---
    const generateChecklistItems = () => {
        if (!sectionVisibility) return [];

        const enabledSectionIds = Object.entries(sectionVisibility)
            .filter(([key, value]) => key !== 'customSections' && value.isEnabled)
            .sort(([, a], [, b]) => a.order - b.order)
            .map(([key]) => key);

        const items = enabledSectionIds
            .map(id => {
                const info = ALL_SECTIONS_INFO[id];
                if (!info) return null;
                return {
                    id: id, // Use the section ID
                    label: info.label,
                    icon: info.icon,
                    // Link is no longer needed here for editor items
                    completed: contentCompletion[id] || false
                };
            })
            .filter(item => item !== null);

        // Manually add the customize appearance step - still uses Link
        items.push({
            id: 'customize',
            label: ALL_SECTIONS_INFO.customize.label,
            icon: ALL_SECTIONS_INFO.customize.icon,
            link: ALL_SECTIONS_INFO.customize.link, // Keep link for this one
            completed: contentCompletion.customize || false
        });

        return items;
    };

    const dynamicChecklistItems = generateChecklistItems();

    // --- Completion Calculation ---
    const completedItems = dynamicChecklistItems.filter(item => item.completed).length;
    const totalItems = dynamicChecklistItems.length;
    const completionPercentage = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

    // --- Render Logic (Updated to use Buttons for editor items) ---
    const renderChecklist = () => {
        if (isLoading.visibility || isLoading.theme) {
            return (
                <div className="flex flex-col items-center justify-center p-6 text-gray-500 min-h-[150px]">
                    <Spinner size="sm" color="orange-500" className="mb-2"/>
                    Loading setup...
                </div>
            );
        }
        if (error.visibility || error.theme) {
            return <div className="flex items-center justify-center p-6 text-red-600"><FiAlertCircle className="mr-2"/> Error loading setup: {error.visibility || error.theme}</div>;
        }
        if (isLoading.content) { 
            return (
                <div className="flex flex-col items-center justify-center p-6 text-gray-500 min-h-[150px]">
                    <Spinner size="sm" color="orange-500" className="mb-2"/>
                     Checking progress...
                </div>
            );
        }
        if (error.content) {
             return <div className="flex items-center justify-center p-6 text-red-600"><FiAlertCircle className="mr-2"/> Error checking progress: {error.content}</div>;
        }

        if (dynamicChecklistItems.length === 0 && !activeTemplateId) {
             return <div className="text-center py-4">
                        <p className="text-gray-500 mb-3">Activate a template to see the setup guide.</p>
                        <Link to="/dashboard/templates">
                            <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
                                Choose a Template
                            </button>
                        </Link>
                    </div>;
        }
        if (dynamicChecklistItems.length === 0) {
            return <div className="text-center py-4 text-gray-500">No sections seem to be enabled for your current template. Check settings?</div>;
        }

        return (
            <>
                {/* Progress Bar */}
                <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4 dark:bg-gray-700">
                    <div className="bg-orange-500 h-2.5 rounded-full transition-width duration-500" style={{ width: `${completionPercentage}%` }}></div>
                </div>
                <p className="text-right text-sm text-gray-600 mb-4">{completionPercentage}% Complete</p>

                <div className="space-y-3">
                    {dynamicChecklistItems.map(item => {
                        // Check if the item should navigate within the app (Customize) or open editor
                        const isInternalLink = item.id === 'customize';
                        const isDisabled = !activeTemplateId && !isInternalLink;

                        return isInternalLink ? (
                            // Render Link for Customize Appearance
                            <Link
                                key={item.id}
                                to={item.link}
                                className={`flex items-center justify-between p-3 rounded-md transition-colors duration-150 
                                    ${item.completed ? 'bg-green-50' : 'bg-gray-50 hover:bg-gray-100'} 
                                    ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                                aria-disabled={isDisabled}
                                tabIndex={isDisabled ? -1 : 0}
                                onClick={(e) => { if (isDisabled) e.preventDefault(); }}
                            >
                                <div className="flex items-center gap-3">
                                    {item.icon}
                                    <span className={`text-sm font-medium ${item.completed ? 'text-gray-500 line-through' : 'text-gray-700'}`}>{item.label}</span>
                                </div>
                                {item.completed ? (
                                    <FiCheckCircle className="w-5 h-5 text-green-500" />
                                ) : (
                                    <FiArrowRight className="w-4 h-4 text-gray-400" />
                                )}
                            </Link>
                        ) : (
                            // Render Button for items opening the editor
                            <button
                                key={item.id}
                                onClick={() => handleEditTemplate(item.id)}
                                disabled={isDisabled}
                                className={`w-full flex items-center justify-between p-3 rounded-md transition-colors duration-150 text-left 
                                    ${item.completed ? 'bg-green-50' : 'bg-gray-50 hover:bg-gray-100'} 
                                    ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                <div className="flex items-center gap-3">
                                    {item.icon}
                                    <span className={`text-sm font-medium ${item.completed ? 'text-gray-500 line-through' : 'text-gray-700'}`}>{item.label}</span>
                                </div>
                                {item.completed ? (
                                    <FiCheckCircle className="w-5 h-5 text-green-500" />
                                ) : (
                                    <FiArrowRight className="w-4 h-4 text-gray-400" />
                                )}
                            </button>
                        );
                    })}
                </div>
            </>
        );
    };

    // --- Main Return ---
    return (
        <div className="space-y-8">
            {/* Welcome Header */}
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-6 rounded-lg shadow-md text-white">
                <h1 className="text-2xl font-bold">Welcome back, {email?.split('@')[0] || 'User'}!</h1>
                <p className="mt-1 text-orange-100">Let's make your portfolio stand out today.</p>
            </div>

            {/* Quick Stats Card */}
            <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Quick Stats</h2>
                {activeTemplateId ? (
                    <div className="grid grid-cols-1 sm:grid-cols-3">
                        {/* Sections Complete */}
                        <div className="flex flex-col items-center sm:items-start py-2 px-4">
                            <span className="flex items-center gap-1.5 text-sm text-gray-500 mb-1">
                                <FiCheckCircle className="w-4 h-4 text-green-500"/> Sections Complete
                            </span>
                            <span className="text-2xl font-bold text-gray-800">
                                {isLoading.content ? (
                                    <Spinner size="sm" color="gray-500" className="inline-block h-5 w-5"/>
                                ) : (
                                    `${userStats.sectionsComplete} / ${userStats.totalSections}`
                                )}
                            </span>
                        </div>
                        {/* Profile Views */}
                        <div className="flex flex-col items-center sm:items-start py-2 px-4 sm:border-l sm:border-gray-200">
                            <span className="flex items-center gap-1.5 text-sm text-gray-500 mb-1">
                                <FiTrendingUp className="w-4 h-4 text-blue-500"/> Profile Views
                            </span>
                            <span className="text-2xl font-bold text-gray-800">
                                {isLoading.content ? (
                                    <Spinner size="sm" color="gray-500" className="inline-block h-5 w-5"/>
                                ) : (
                                    userStats.profileViews
                                )}
                            </span>
                        </div>
                        {/* Last Updated */}
                        <div className="flex flex-col items-center sm:items-start py-2 px-4 sm:border-l sm:border-gray-200">
                            <span className="flex items-center gap-1.5 text-sm text-gray-500 mb-1">
                                <FiClock className="w-4 h-4 text-purple-500"/> Last Updated
                            </span>
                            <span className="text-2xl font-bold text-gray-800">
                                {isLoading.content ? (
                                    <Spinner size="sm" color="gray-500" className="inline-block h-5 w-5"/>
                                ) : (
                                    userStats.lastUpdated || 'Never'
                                )}
                            </span>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-8">
                        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-orange-100 mb-3">
                            <FiLayout className="w-7 h-7 text-orange-500" />
                        </div>
                        <div className="text-lg font-semibold text-gray-800 mb-1">No Template Active</div>
                        <div className="text-gray-500 text-sm mb-4 text-center max-w-xs">
                            Choose and activate a template to start building your portfolio and track your progress here.
                        </div>
                        <Link to="/dashboard/templates">
                            <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors shadow-sm">
                                Browse Templates
                            </button>
                        </Link>
                    </div>
                )}
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column (Checklist, Active Template, Stats) */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Portfolio Checklist/Guide */}
                    <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100">
                        <h2 className="text-lg font-semibold text-gray-800 mb-1">Get Started Guide</h2>
                        {activeTemplateId ? (
                            <>
                                <p className="text-sm text-gray-500 mb-4">Complete these steps for your active template.</p>
                                {renderChecklist()}
                            </>
                        ) : (
                            <>
                                <p className="text-sm text-gray-500 mb-4">Follow these steps to create your portfolio.</p>
                                <div className="space-y-6">
                                    {/* Step 1: Choose Template */}
                                    <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg shadow-sm border border-orange-200">
                                        <div className="flex-shrink-0 w-10 h-10 bg-orange-500 text-white rounded-full flex items-center justify-center text-lg font-bold">1</div>
                                        <div className="flex-grow">
                                            <h3 className="text-base font-semibold text-gray-800">Choose a Template</h3>
                                            <p className="text-sm text-gray-600 mt-1">Select a template that best represents your professional style.</p>
                                            <Link to="/dashboard/templates" className="mt-3 inline-block">
                                                <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2">
                                                    Browse Templates <FiArrowRight className="w-4 h-4" />
                                                </button>
                                            </Link>
                                        </div>
                                    </div>

                                    {/* Step 2: Customize Appearance */}
                                    <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg shadow-sm border border-blue-200 opacity-60">
                                        <div className="flex-shrink-0 w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center text-lg font-bold">2</div>
                                        <div className="flex-grow">
                                            <h3 className="text-base font-semibold text-gray-700">Customize Appearance</h3>
                                            <p className="text-sm text-gray-600 mt-1">Personalize colors, fonts, and layout after selecting a template.</p>
                                            <div className="mt-3">
                                                <button disabled className="bg-gray-300 text-gray-500 px-4 py-2 rounded-md text-sm font-medium cursor-not-allowed flex items-center gap-2">
                                                    Customize <FiLock className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Step 3: Add Content */}
                                    <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg shadow-sm border border-purple-200 opacity-60">
                                        <div className="flex-shrink-0 w-10 h-10 bg-purple-500 text-white rounded-full flex items-center justify-center text-lg font-bold">3</div>
                                        <div className="flex-grow">
                                            <h3 className="text-base font-semibold text-gray-700">Add Your Content</h3>
                                            <p className="text-sm text-gray-600 mt-1">Fill in your professional information and showcase your work.</p>
                                            <div className="mt-3">
                                                <button disabled className="bg-gray-300 text-gray-500 px-4 py-2 rounded-md text-sm font-medium cursor-not-allowed flex items-center gap-2">
                                                    Add Content <FiLock className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>

                    {/* Active Template Section */}
                    <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4">Active Template</h2>
                        {activeTemplate ? (
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                <div>
                                    <p className="font-medium text-gray-700">{activeTemplate.name}</p>
                                    <span className="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full font-medium mt-1 inline-block">Active</span>
                                </div>
                                <div className="flex gap-2 flex-shrink-0">
                                    <button
                                        onClick={() => handleEditTemplate()} 
                                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 rounded-md text-sm font-medium transition-colors flex items-center gap-1.5"
                                    >
                                        <FiEdit className="w-4 h-4"/> Edit
                                    </button>
                                    <button
                                        onClick={handleViewSite}
                                        className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-md text-sm font-medium transition-colors flex items-center gap-1.5"
                                    >
                                        <FiEye className="w-4 h-4"/> View Site
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-4">
                                <p className="text-gray-500 mb-3">No template is currently active.</p>
                                <Link to="/dashboard/templates">
                                    <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
                                        Choose a Template
                                    </button>
                                </Link>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Column (Quick Actions & Analytics) */}
                <div className="flex flex-col h-full space-y-6">
                    {/* Quick Actions Title, Manage Templates, Customize Appearance, Overview Analytics */}
                    <h2 className="text-lg font-semibold text-gray-800">Quick Actions</h2>
                    
                    {/* Manage Templates Card */}
                    <Link to="/dashboard/templates" className="block group">
                        <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100 hover:shadow-md hover:bg-gray-50 hover:border-orange-200 transition-all duration-200 h-full flex flex-col justify-between">
                            <div>
                                <FiLayout className="w-7 h-7 text-orange-500 mb-3" />
                                <h3 className="font-semibold text-gray-800 mb-1">Manage Templates</h3>
                                <p className="text-sm text-gray-500">Select, activate, or preview your portfolio templates.</p>
                            </div>
                            <span className="text-sm text-orange-600 font-medium mt-4 inline-flex items-center group-hover:translate-x-1 transition-transform">
                                Go to Templates <FiArrowRight className="ml-1.5 w-4 h-4" />
                            </span>
                        </div>
                    </Link>
    
                    {/* Customize Appearance Card */}
                    <Link to="/dashboard/themepage" className="block group">
                        <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100 hover:shadow-md hover:bg-gray-50 hover:border-orange-200 transition-all duration-200 h-full flex flex-col justify-between">
                            <div>
                                <FaPaintBrush className="w-7 h-7 text-orange-500 mb-3" /> 
                                <h3 className="font-semibold text-gray-800 mb-1">Customize Appearance</h3>
                                <p className="text-sm text-gray-500">Adjust colors, fonts, and components for your active template.</p>
                            </div>
                             <span className="text-sm text-orange-600 font-medium mt-4 inline-flex items-center group-hover:translate-x-1 transition-transform">
                               Customize <FiArrowRight className="ml-1.5 w-4 h-4" />
                            </span>
                        </div>
                    </Link>

                    {/* Overview Analytics Card */}
                    {activeTemplateId ? (
                        <div className="mt-6">
                            <h2 className="text-lg font-semibold text-gray-800 mb-4">Overview Analytics</h2>
                            <div className="grid grid-cols-1 gap-4">
                                {/* Unique Visitors */}
                                <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100 flex items-center gap-4">
                                    <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full bg-green-50">
                                        <FiUsers className="w-6 h-6 text-green-500" />
                                    </div>
                                    <div>
                                        <div className="text-xs text-gray-500">Unique Visitors</div>
                                        <div className="text-2xl font-bold text-gray-800">{userStats.uniqueVisitors ?? 0}</div>
                                    </div>
                                </div>
                                {/* Avg. Session Duration */}
                                <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100 flex items-center gap-4">
                                    <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full bg-purple-50">
                                        <FiClock className="w-6 h-6 text-purple-500" />
                                    </div>
                                    <div>
                                        <div className="text-xs text-gray-500">Avg. Session Duration</div>
                                        <div className="text-2xl font-bold text-gray-800">{userStats.averageSessionDuration ?? 0}s</div>
                                    </div>
                                </div>
                                {/* Bounce Rate */}
                                <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100 flex items-center gap-4">
                                    <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full bg-red-50">
                                        <FiTrendingDown className="w-6 h-6 text-red-500" />
                                    </div>
                                    <div>
                                        <div className="text-xs text-gray-500">Bounce Rate</div>
                                        <div className="text-2xl font-bold text-gray-800">{userStats.bounceRate ?? 0}%</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="mt-6">
                            <h2 className="text-lg font-semibold text-gray-800 mb-4">Overview Analytics</h2>
                            <div className="grid grid-cols-1 gap-4">
                                {/* Unique Visitors */}
                                <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100 flex items-center gap-4">
                                    <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full bg-green-50">
                                        <FiUsers className="w-6 h-6 text-green-500" />
                                    </div>
                                    <div>
                                        <div className="text-xs text-gray-500">Unique Visitors</div>
                                        <div className="text-gray-400 text-sm">Activate a template to see analytics.</div>
                                    </div>
                                </div>
                                {/* Avg. Session Duration */}
                                <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100 flex items-center gap-4">
                                    <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full bg-purple-50">
                                        <FiClock className="w-6 h-6 text-purple-500" />
                                    </div>
                                    <div>
                                        <div className="text-xs text-gray-500">Avg. Session Duration</div>
                                        <div className="text-gray-400 text-sm">Activate a template to see analytics.</div>
                                    </div>
                                </div>
                                {/* Bounce Rate */}
                                <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100 flex items-center gap-4">
                                    <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full bg-red-50">
                                        <FiTrendingDown className="w-6 h-6 text-red-500" />
                                    </div>
                                    <div>
                                        <div className="text-xs text-gray-500">Bounce Rate</div>
                                        <div className="text-gray-400 text-sm">Activate a template to see analytics.</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
                {/* Next Steps Section - Full Row */}
                {activeTemplateId && (
                    <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100 lg:col-span-3 col-span-full">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4">Next Steps</h2>
                        <div className="space-y-4">
                            {/* Step 2: Customize Appearance */}
                            <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg shadow-sm border border-blue-200">
                                <div className="flex-shrink-0 w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center text-lg font-bold">2</div>
                                <div className="flex-grow">
                                    <h3 className="text-base font-semibold text-gray-700">Customize Appearance</h3>
                                    <p className="text-sm text-gray-600 mt-1">Personalize colors, fonts, and layout for your portfolio.</p>
                                    <Link to="/dashboard/themepage" className="mt-3 inline-block">
                                        <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2">
                                            Customize <FiArrowRight className="w-4 h-4" />
                                        </button>
                                    </Link>
                                </div>
                            </div>
                            {/* Step 3: Add Content */}
                            <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg shadow-sm border border-purple-200">
                                <div className="flex-shrink-0 w-10 h-10 bg-purple-500 text-white rounded-full flex items-center justify-center text-lg font-bold">3</div>
                                <div className="flex-grow">
                                    <h3 className="text-base font-semibold text-gray-700">Add Your Content</h3>
                                    <p className="text-sm text-gray-600 mt-1">Fill in your professional information and showcase your work.</p>
                                    <button 
                                        onClick={() => handleEditTemplate()}
                                        className="mt-3 bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2"
                                    >
                                        Add Content <FiArrowRight className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Home;
