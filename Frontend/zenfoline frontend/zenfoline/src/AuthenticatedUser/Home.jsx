import React, { useEffect, useState } from 'react';
import useAuthStore from '../store/userAuthStore';
import useTemplateStore from '../store/userTemplateStore';
import { Link } from 'react-router-dom';
import { 
    FiEdit, FiEye, FiLayout, FiBarChart2, FiArrowRight, FiSettings, FiCheckCircle, 
    FiZap, FiUser, FiBriefcase, FiCode, FiAward, FiFileText, FiInfo, FiBook, FiStar, FiTool, FiAlertCircle, FiLoader, FiTrendingUp, FiClock
} from 'react-icons/fi';
import { FaPaintBrush } from 'react-icons/fa';
import Spinner from '../components/Spinner';

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
    const username = useAuthStore((state) => state.user?.name || state.profile?.name || 'User');
    const userId = useAuthStore((state) => state.userId);
    const { templates, activeTemplateId, fetchTemplates } = useTemplateStore();

    const [sectionVisibility, setSectionVisibility] = useState(null);
    const [contentCompletion, setContentCompletion] = useState({});
    const [themeSettings, setThemeSettings] = useState(null);
    const [isLoading, setIsLoading] = useState({ visibility: true, content: true, theme: true });
    const [error, setError] = useState({ visibility: null, content: null, theme: null });

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
            let finalCompletionStatus = {}; // Use a temporary object

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

                // 3. Fetch Theme Settings (concurrently with content? or sequentially? Sequential is simpler for now)
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
                    setThemeSettings(fetchedTheme); // Update theme state immediately for reference
                } catch (themeErr) {
                     console.error("Error fetching theme:", themeErr);
                     setError(prev => ({ ...prev, theme: themeErr.message || 'Failed to load theme' }));
                     // Set theme loading false even on error so content fetch can proceed
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
                } else {
                    // If no sections enabled, set content loading false
                     setIsLoading(prev => ({ ...prev, content: false }));
                }
                
                // 5. Check Customize completion (after theme and content fetches attempted)
                if (fetchedTheme) { // Use the theme data we fetched/defaulted earlier
                     const isCustomized = 
                        fetchedTheme.colorMode !== DEFAULT_THEME.colorMode ||
                        // Ensure presetTheme is treated as number if possible for comparison, handle null/undefined
                        (String(fetchedTheme.presetTheme ?? '') !== String(DEFAULT_THEME.presetTheme ?? '') && String(fetchedTheme.presetTheme ?? '') !== '0') || 
                        fetchedTheme.fontStyle !== DEFAULT_THEME.fontStyle;
                    finalCompletionStatus.customize = isCustomized;
                    console.log('Theme Check:', { fetched: fetchedTheme, default: DEFAULT_THEME, isCustomized }); // Add logging
                } else {
                     finalCompletionStatus.customize = false; 
                }
               
                setContentCompletion(finalCompletionStatus); // Final state update

            } catch (err) {
                console.error("Error fetching dashboard data:", err);
                setError(prev => ({ ...prev, visibility: err.message || 'Failed to load data' }));
                // If visibility fails, set all loading to false
                setIsLoading({ visibility: false, content: false, theme: false });
            } finally {
                 // Set content loading false *after* completion check
                 // Check if content loading was actually started and not skipped
                 if (isLoading.content) { // Ensure we only set false if it was true
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

    // --- Dynamic Checklist Generation (Now uses real completion state) ---
    const generateChecklistItems = () => {
        if (!sectionVisibility) return []; // Depends on visibility data

        const enabledSectionIds = Object.entries(sectionVisibility)
            .filter(([key, value]) => key !== 'customSections' && value.isEnabled)
            .sort(([, a], [, b]) => a.order - b.order)
            .map(([key]) => key);

        const items = enabledSectionIds
            .map(id => {
                const info = ALL_SECTIONS_INFO[id];
                if (!info) return null; 
                return {
                    id: id,
                    label: info.label,
                    icon: info.icon,
                    link: activeTemplateId ? `/template-editor/${activeTemplateId}#${id}` : '/dashboard/templates',
                    completed: contentCompletion[id] || false // Use REAL completion status
                };
            })
            .filter(item => item !== null); 

        items.push({
            id: 'customize',
            label: ALL_SECTIONS_INFO.customize.label,
            icon: ALL_SECTIONS_INFO.customize.icon,
            link: ALL_SECTIONS_INFO.customize.link,
            completed: contentCompletion.customize || false // Use REAL completion status for customize
        });

        return items;
    };

    const dynamicChecklistItems = generateChecklistItems();

    // --- Completion Calculation (Now uses real completion state) ---
    const completedItems = dynamicChecklistItems.filter(item => item.completed).length;
    const totalItems = dynamicChecklistItems.length;
    const completionPercentage = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

    // --- Render Logic ---
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
        // Error checking for content fetch could be added here if needed

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
                    {dynamicChecklistItems.map(item => (
                        <Link
                            key={item.id}
                            to={item.link}
                            onClick={(e) => { 
                                if ((item.link.includes('template-editor') && !activeTemplateId)) { 
                                    e.preventDefault(); 
                                } 
                            }}
                            className={`flex items-center justify-between p-3 rounded-md transition-colors duration-150 
                                ${item.completed ? 'bg-green-50' : 'bg-gray-50 hover:bg-gray-100'} 
                                ${(!activeTemplateId && item.link.includes('template-editor')) || item.id === 'customize' && !activeTemplateId ? 'opacity-50 cursor-not-allowed' : ''}`}
                            aria-disabled={(!activeTemplateId && item.link.includes('template-editor')) || item.id === 'customize' && !activeTemplateId}
                            tabIndex={(!activeTemplateId && item.link.includes('template-editor')) || item.id === 'customize' && !activeTemplateId ? -1 : 0}
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
                    ))}
                </div>
            </>
        );
    };

    // --- Main Return ---
    return (
        <div className="space-y-8">
            {/* Welcome Header */}
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-6 rounded-lg shadow-md text-white">
                <h1 className="text-2xl font-bold">Welcome back, {username}!</h1>
                <p className="mt-1 text-orange-100">Let's make your portfolio stand out today.</p>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column (Checklist, Active Template, Stats) */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Portfolio Checklist/Guide */}
                    <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100">
                        <h2 className="text-lg font-semibold text-gray-800 mb-1">Get Started Guide</h2>
                        <p className="text-sm text-gray-500 mb-4">Complete these steps for your active template.</p>
                        {renderChecklist()}
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
                    
                    {/* Quick Stats Card */}
                    <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100">
                         <h2 className="text-lg font-semibold text-gray-800 mb-4">Quick Stats</h2>
                         <div className="space-y-3">
                             <div className="flex items-center justify-between text-sm">
                                 <span className="flex items-center gap-2 text-gray-600"><FiCheckCircle className="w-4 h-4 text-green-500"/> Sections Complete</span>
                                 <span className="font-medium text-gray-800">
                                     {isLoading.content ? <Spinner size="sm" color="gray-500" className="inline-block h-4 w-4"/> : `${completedItems} / ${totalItems || '?'}`}
                                 </span>
                             </div>
                             <div className="flex items-center justify-between text-sm">
                                 <span className="flex items-center gap-2 text-gray-600"><FiTrendingUp className="w-4 h-4 text-blue-500"/> Profile Views (Month)</span>
                                 <span className="font-medium text-gray-800">_ _</span> 
                             </div>
                             <div className="flex items-center justify-between text-sm">
                                 <span className="flex items-center gap-2 text-gray-600"><FiClock className="w-4 h-4 text-purple-500"/> Last Updated</span>
                                 <span className="font-medium text-gray-800">Today</span> 
                             </div>
                         </div>
                    </div>
                </div>

                {/* Right Column (Quick Actions & Upgrade) */}
                <div className="space-y-6">
                    {/* Quick Actions Title */}
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
                    
                    {/* Analytics Placeholder Card */}
                    <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100 opacity-60 cursor-not-allowed flex flex-col">
                         <div>
                             <FiBarChart2 className="w-7 h-7 text-gray-400 mb-3" />
                             <h3 className="font-semibold text-gray-500 mb-1">View Analytics</h3>
                             <p className="text-sm text-gray-400">Track portfolio views and engagement. (Coming Soon)</p>
                         </div>
                         <span className="text-sm text-gray-400 font-medium mt-4 inline-flex items-center">
                             Coming Soon
                         </span>
                     </div>

                    {/* Upgrade Plan CTA */}
                    <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-5 rounded-lg shadow-md text-white text-center">
                        <FiZap className="w-10 h-10 mx-auto mb-3 text-indigo-200"/>
                        <h3 className="text-lg font-semibold mb-2">Unlock More Features</h3>
                        <p className="text-sm text-indigo-100 mb-4">Upgrade your plan for advanced templates, analytics, and support.</p>
                        <Link to="/dashboard/plans"> {/* Update path if needed */} 
                            <button className="bg-white hover:bg-gray-100 text-indigo-600 font-semibold px-5 py-2 rounded-md text-sm transition-colors">
                                See Plans
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
