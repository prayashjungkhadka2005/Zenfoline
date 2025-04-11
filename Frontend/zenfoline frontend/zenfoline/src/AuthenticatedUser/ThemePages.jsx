import React, { useState, useEffect} from "react";
import { useNavigate } from 'react-router-dom';
import useTemplateStore from "../store/userTemplateStore";
import useAuthStore from "../store/userAuthStore";
import DeveloperHeader from "../TemplateComponents/Developer/DeveloperHeader";
import SimpleFooter from "../TemplateComponents/Simple/SimpleFooter";
import DeveloperFooter from "../TemplateComponents/Developer/DeveloperFooter";
import Spinner from "../components/Spinner";

const ThemePage = () => {
  const { activeTemplateId, templates, fetchTemplates } = useTemplateStore();
  const userId = useAuthStore((state) => state.userId);
  
  const [activeTab, setActiveTab] = useState("appearances");
  const [activeColorMode, setActiveColorMode] = useState(null);
  const [activePresetTheme, setActivePresetTheme] = useState(null);
  const [activeFontStyle, setActiveFontStyle] = useState(null);
  const [selectedHeader, setSelectedHeader] = useState(""); 
  const [selectedFooter, setSelectedFooter] = useState("");
  
  const [isLoading, setIsLoading] = useState(true);
  
  const [previewHeader, setPreviewHeader] = useState(null);
  const [previewFooter, setPreviewFooter] = useState(null);

  const [availableHeaders, setAvailableHeaders] = useState([]);
  const [availableFooters, setAvailableFooters] = useState([]);
  const [activeComponents, setActiveComponents] = useState([]);
  
  // Predefined component list
  const predefinedComponents = {
    Developer: {
      Header: {
        "Modern Header": <DeveloperHeader />,
        "Classic Header": <div>Classic Developer Header</div>,
        "Minimal Header": <div>Minimal Developer Header</div>,
      },
      Footer: {
        "basic-footer": <DeveloperFooter />,
        "Modern Footer": <DeveloperFooter />,
      },
    },
    Simple: {
      Header: {
        "Basic Header": <div>Basic Simple Header</div>,
      },
      Footer: {
        "Stylish Footer": <SimpleFooter />,
      },
    },
  };

  const activeTemplate = templates.find(
    (template) => template._id === activeTemplateId
  );
  
  const normalizedHeader = availableHeaders.length > 0
    ? (availableHeaders.includes(selectedHeader) ? selectedHeader : availableHeaders[0])
    : (selectedHeader ? selectedHeader : null); 

  const normalizedFooter = availableFooters.length > 0
    ? (availableFooters.includes(selectedFooter) ? selectedFooter : availableFooters[0])
    : (selectedFooter ? selectedFooter : null);  

  useEffect(() => {
    if (!activeTemplate?.category || !predefinedComponents[activeTemplate.category]) return;
   
    // Extract only matching components from fetched active components
    const validHeaders = activeComponents
      .filter((comp) => comp.category === activeTemplate.category && comp.componentSubType === "Header")
      .map((comp) => comp.componentType)
      .filter((header) => predefinedComponents[activeTemplate.category]?.Header?.[header]);

    const validFooters = activeComponents
      .filter((comp) => comp.category === activeTemplate.category && comp.componentSubType === "Footer")
      .map((comp) => comp.componentType)
      .filter((footer) => predefinedComponents[activeTemplate.category]?.Footer?.[footer]);

    setAvailableHeaders(validHeaders);
    setAvailableFooters(validFooters);
  }, [activeComponents, activeTemplate]);
  
  useEffect(() => {
    if (!availableHeaders || !availableFooters) return;

    setSelectedHeader((prevHeader) =>
        prevHeader !== "" ? prevHeader : ""
    );

    setSelectedFooter((prevFooter) =>
        prevFooter !== "" ? prevFooter : ""
    );
  }, [availableHeaders, availableFooters]);

  useEffect(() => {
    if (!userId) return;
    
    fetchTemplates(userId);
    fetchThemeSettings();
    fetchActiveComponents();
  }, [userId]);

  const fetchThemeSettings = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `http://localhost:3000/authenticated-user/gettheme?userId=${userId}`
      );
      if (!response.ok) throw new Error("Failed to fetch theme settings");

      const { theme } = await response.json();

      setActiveColorMode(theme.colorMode || "default");
      setActivePresetTheme(parseInt(theme.presetTheme, 10) || null);
      setActiveFontStyle(theme.fontStyle || "Poppins");

    } catch (error) {
      console.error("Error fetching theme settings:", error.message);
    } finally {
      setIsLoading(false);
    }
  };
  
  const updateTheme = async (updatedTheme) => {
    try {
      const response = await fetch(
        "http://localhost:3000/authenticated-user/updatetheme",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId, ...updatedTheme }),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to update theme");
      }
      console.log("Theme updated successfully");
    } catch (error) {
      console.error("Error updating theme:", error.message);
    }
  };

  const fetchActiveComponents = async () => {
    try {
      console.log("🚀 Fetching active components...");

      const response = await fetch(
        `http://localhost:3000/authenticated-user/getactivecomponents?userId=${userId}`
      );

      if (!response.ok) throw new Error("Failed to fetch active components");

      const { components } = await response.json();
      console.log("API Response Components:", components);

      if (!Array.isArray(components) || components.length === 0) {
        console.warn("No components found for this user.");
        return;
      }

      setActiveComponents(components);
    } catch (error) {
      console.error("Error fetching active components:", error.message);
      setActiveComponents([]);
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleColorModeChange = (mode) => {
    setActiveColorMode(mode);
    updateTheme({ colorMode: mode });
  };

  const handlePresetThemeSelect = (themeIndex) => {
    setActivePresetTheme(themeIndex);
    updateTheme({ presetTheme: themeIndex });
  };
  
  const handleFontStyleSelect = (font) => {
    setActiveFontStyle(font);
    updateTheme({ fontStyle: font });
  };
  
  const handleHeaderChange = (event) => {
    const selected = event.target.value;
    setSelectedHeader(selected);

    // Show preview only if a valid selection is made
    if (selected) {
      setPreviewHeader(predefinedComponents[activeTemplate?.category]?.Header?.[selected] || "Coming Soon");
    } else {
      setPreviewHeader(null); //if no selection is made then show nothing
    }
  };

  const handleFooterChange = (event) => {
    const selected = event.target.value;
    setSelectedFooter(selected);

    if (selected) {
      setPreviewFooter(predefinedComponents[activeTemplate?.category]?.Footer?.[selected] || "Coming Soon");
    } else {
      setPreviewFooter(null); 
    }
  };

  // Opens in another tab
  const handleViewSite = () => {
    if (userId) {
      const portfolioUrl = `${window.location.origin}/portfolio/${userId}`;
      window.open(portfolioUrl, "_blank");
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div>
            <h1 className="text-xl font-semibold text-gray-800">Theme Settings</h1>
            <p className="text-sm text-gray-500 mt-1">Customize the appearance of your portfolio</p>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-8 flex justify-center items-center min-h-[300px]">
          <div className="text-center">
            <Spinner size="md" color="orange-500" />
            <p className="mt-4 text-gray-600">Loading theme settings...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-xl font-semibold text-gray-800">Theme Settings</h1>
          <p className="text-sm text-gray-500 mt-1">Customize the appearance of your portfolio</p>
        </div>
      </div>

      <div className="mb-5 bg-white rounded-lg shadow-sm p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-l-4 border-orange-500">
        <h2 className="text-base font-medium text-gray-700">
          Current template:{" "}
          <span className="font-semibold text-gray-900">{activeTemplate ? activeTemplate.name : "None"}</span>
        </h2>
        <div className="flex items-center gap-3">
          {activeTemplate ? (
            <span className="text-green-500 text-sm font-medium flex items-center gap-1.5 bg-green-50 px-2 py-1 rounded-md">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span> Active
            </span>
          ) : (
            <span className="text-red-500 text-sm font-medium bg-red-50 px-2 py-1 rounded-md">No active template</span>
          )}
          <button
            onClick={handleViewSite}
            className={`text-orange-500 border border-orange-500 px-3 py-1.5 rounded-md text-sm ${
              activeTemplate ? 'hover:bg-orange-50' : 'cursor-not-allowed opacity-50'
            }`}
            disabled={!activeTemplate}
          >
            View Site
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-5 bg-white rounded-lg shadow-sm p-4">
        <div className="flex gap-3">
          <button
            onClick={() => activeTemplate && handleTabChange("appearances")}
            className={`px-4 py-1.5 text-sm border-b-2 transition-colors ${
              activeTab === "appearances"
                ? "border-orange-500 text-orange-500 font-medium"
                : activeTemplate
                ? "border-transparent text-gray-600 hover:text-gray-900"
                : "border-transparent text-gray-400 cursor-not-allowed"
            }`}
            disabled={!activeTemplate}
          >
            Appearances
          </button>

          <button
            onClick={() => activeTemplate && handleTabChange("developerComponents")}
            className={`px-4 py-1.5 text-sm border-b-2 transition-colors ${
              activeTab === "developerComponents"
                ? "border-orange-500 text-orange-500 font-medium"
                : activeTemplate
                ? "border-transparent text-gray-600 hover:text-gray-900"
                : "border-transparent text-gray-400 cursor-not-allowed"
            }`}
            disabled={!activeTemplate}
          >
            {activeTemplate ? activeTemplate.category : ""} Components
          </button>
        </div>
      </div>

      {activeTab === "appearances" && (
        <div className="space-y-5">
          {/* Color Mode */}
          <div className="bg-white rounded-lg shadow-sm p-5">
            <h3 className="text-base font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <i className="fas fa-palette text-orange-500"></i> Color Mode
            </h3>
            <div className="flex gap-3">
              {["default", "light", "dark"].map((mode) => (
                <button
                  key={mode}
                  onClick={() => handleColorModeChange(mode)}
                  className={`px-3 py-1.5 text-sm border rounded-md transition-all duration-200 ${
                    activeColorMode === mode 
                      ? "bg-orange-50 border-orange-500 text-orange-500 shadow-sm" 
                      : "border-gray-200 text-gray-700 hover:border-orange-200 hover:text-orange-500"
                  }`}
                >
                  {mode === "default" ? "⚙️ Default" : mode === "light" ? "☀️ Light" : "🌙 Dark"}
                </button>
              ))}
            </div>
          </div>

          {/* Preset Themes */}
          <div className="bg-white rounded-lg shadow-sm p-5">
            <h3 className="text-base font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <i className="fas fa-paint-brush text-orange-500"></i> Preset Themes
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {Array.from({ length: 12 }).map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => handlePresetThemeSelect(idx)}
                  className={`px-3 py-1.5 text-sm border rounded-md transition-all duration-200 ${
                    parseInt(activePresetTheme, 10) === idx 
                      ? "bg-orange-50 border-orange-500 text-orange-500 shadow-sm" 
                      : "border-gray-200 text-gray-700 hover:border-orange-200 hover:text-orange-500"
                  }`}
                >
                  Theme {idx + 1}
                </button>
              ))}
            </div>
          </div>

          {/* Font Style */}
          <div className="bg-white rounded-lg shadow-sm p-5">
            <h3 className="text-base font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <i className="fas fa-font text-orange-500"></i> Font Style
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {["Poppins", "Inter", "Inria Serif", "Crimson Text", "Lobster", "Playfair Display"].map(
                (font) => (
                  <button
                    key={font}
                    onClick={() => handleFontStyleSelect(font)}
                    className={`px-3 py-1.5 text-sm border rounded-md transition-all duration-200 ${
                      activeFontStyle === font 
                        ? "bg-orange-50 border-orange-500 text-orange-500 shadow-sm" 
                        : "border-gray-200 text-gray-700 hover:border-orange-200 hover:text-orange-500"
                    }`}
                  >
                    {font}
                  </button>
                )
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === "developerComponents" && (
        <div className="space-y-5">
          {/* Header Selection */}
          <div className="bg-white rounded-lg shadow-sm p-5">
            <h3 className="text-base font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <i className="fas fa-heading text-orange-500"></i> Select Header
            </h3>
            <select 
              value={selectedHeader} 
              onChange={handleHeaderChange} 
              className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-md mb-3 focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
            >
              <option value="" disabled>Select a header</option>
              {availableHeaders.length > 0 ? (
                availableHeaders.map((header) => (
                  <option key={header} value={header}>{header}</option>
                ))
              ) : (
                <option value="" disabled>Coming Soon</option>
              )}
            </select>
            
            <div className="border border-gray-200 rounded-md bg-gray-50 flex items-center justify-center min-h-[80px] p-3"  
              style={{ pointerEvents: "none" }}>
              {previewHeader ? (
                <div className="w-full">{previewHeader}</div>
              ) : (
                <span className="text-sm text-gray-500">
                  {availableHeaders.length === 0 ? "🚀 Coming Soon" : "🔍 Select a header to preview"}
                </span>
              )}
            </div>
          </div>

          {/* Footer Selection */}
          <div className="bg-white rounded-lg shadow-sm p-5">
            <h3 className="text-base font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <i className="fas fa-shoe-prints text-orange-500"></i> Select Footer
            </h3>
            <select 
              value={selectedFooter} 
              onChange={handleFooterChange} 
              className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-md mb-3 focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
            >
              <option value="" disabled>Select a footer</option>
              {availableFooters.length > 0 ? (
                availableFooters.map((footer) => (
                  <option key={footer} value={footer}>{footer}</option>
                ))
              ) : (
                <option value="" disabled>Coming Soon</option>
              )}
            </select>

            <div className="border border-gray-200 rounded-md bg-gray-50 flex items-center justify-center min-h-[80px] p-3"
              style={{ pointerEvents: "none" }}>
              {previewFooter ? (
                <div className="w-full">{previewFooter}</div>
              ) : (
                <span className="text-sm text-gray-500">
                  {availableFooters.length === 0 ? "🚀 Coming Soon" : "🔍 Select a footer to preview"}
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ThemePage;
