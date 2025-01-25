import React, { useState, useEffect} from "react";
import { useNavigate } from 'react-router-dom';
import useTemplateStore from "../store/userTemplateStore";
import useAuthStore from "../store/userAuthStore";
import tem1 from "../assets/tem1.png";
import tem2 from "../assets/tem2.png";
import tem3 from "../assets/tem3.png";
import tem4 from "../assets/tem4.png";
import tem5 from "../assets/tem5.png";
import tem6 from "../assets/tem6.png";

const ThemePage = () => {
  const { activeTemplateId, templates, fetchTemplates } = useTemplateStore();
  const userId = useAuthStore((state) => state.userId);
  const navigate = useNavigate();
 

  const [activeTab, setActiveTab] = useState("appearances");
  const [activeColorMode, setActiveColorMode] = useState(null);
  const [activePresetTheme, setActivePresetTheme] = useState(null);
  const [activeFontStyle, setActiveFontStyle] = useState(null);
  const [selectedNavigation, setSelectedNavigation] = useState(null);
  const [selectedFooter, setSelectedFooter] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [initialNavigation, setInitialNavigation] = useState("Developer Basic Navbar");
  const [initialFooter, setInitialFooter] = useState("Developer Basic Footer");

  const fetchThemeSettings = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `http://localhost:3000/authenticated-user/gettheme?userId=${userId}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch theme settings");
      }
      const { theme } = await response.json();

      // Update appearance settings from the fetched theme
      setActiveColorMode(theme.colorMode || "default");
      setActivePresetTheme(parseInt(theme.presetTheme, 10) || null);
      setActiveFontStyle(theme.fontStyle || "Poppins");
      setSelectedNavigation(theme.navigationBar || "Developer Basic Navbar");
      setSelectedFooter(theme.footer || "Developer Basic Footer");
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
  const navigationOptions = [
    { label: "Developer Basic Navbar", preview: tem1 },
    { label: "Advanced Navbar", preview: tem2 },
    { label: "Minimal Navbar", preview: tem3 },
  ];

  const footerOptions = [
    { label: "Developer Basic Footer", preview: tem4 },
    { label: "Advanced Footer", preview: tem5 },
    { label: "Minimal Footer", preview: tem6 },
  ];

  useEffect(() => {
    if (userId) {
      fetchTemplates(userId);
      fetchThemeSettings();
    }
  }, [userId, fetchTemplates]);

  const handleSaveNavigation = () => {
    setInitialNavigation(selectedNavigation);
  };

  const handleSaveFooter = () => {
    setInitialFooter(selectedFooter);
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


  const handleNavigationChange = (nav) => {
    setSelectedNavigation(nav);
    updateTheme({ navigationBar: nav });
  };

  const handleFooterChange = (footer) => {
    setSelectedFooter(footer);
    updateTheme({ footer });
  };

  const handleViewSite = () => {
    if (activeTemplate) {
      const url = `/template/${activeTemplate._id}`;
      window.open(url, "_blank");
    }
  };

  const activeTemplate = templates.find(
    (template) => template._id === activeTemplateId
  );
  
  if (isLoading) {
    return <div className="text-center py-10">Loading...</div>;
  }

  return (
    <div className="min-h-screen">
      <h1 className="text-2xl font-bold text-gray-800 mb-3">Themes</h1>

     
      <div className="mb-3 bg-white rounded-lg shadow-md p-6 flex justify-between items-center">
        <h2 className="text-lg font-medium text-gray-800">
          Current template:{" "}
          <span className="font-bold">{activeTemplate ? activeTemplate.name : "None"}</span>
        </h2>
        <div className="flex items-center gap-4">
          {activeTemplate ? (
            <span className="text-green-500 font-medium flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-green-500"></span> Active
            </span>
          ) : (
            <span className="text-red-500 font-medium">No active template</span>
          )}
           <button
        onClick={handleViewSite}
        className={`text-orange-600 border border-orange-600 px-3 py-1 rounded-md ${
          activeTemplate ? '' : 'cursor-not-allowed opacity-50'
        }`}
        disabled={!activeTemplate}
      >
        View Site
      </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-3 bg-white rounded-lg shadow-md p-6">
        <div className="flex gap-4">
          <button
            onClick={() => activeTemplate && handleTabChange("appearances")}
            className={`px-6 py-2 border-b-2 ${
              activeTab === "appearances"
                ? "border-orange-600 text-orange-600"
                : activeTemplate
                ? "border-transparent text-gray-600"
                : "border-transparent text-gray-400 cursor-not-allowed"
            }`}
            disabled={!activeTemplate}
          >
            Appearances
          </button>

          <button
            onClick={() => activeTemplate && handleTabChange("developerComponents")}
            className={`px-6 py-2 border-b-2 ${
              activeTab === "developerComponents"
                ? "border-orange-600 text-orange-600"
                : activeTemplate
                ? "border-transparent text-gray-600"
                : "border-transparent text-gray-400 cursor-not-allowed"
            }`}
            disabled={!activeTemplate}
          >
          {activeTemplate ? activeTemplate.category : ""}  Components
          </button>
        </div>
      </div>

     
      {activeTab === "appearances" && (
        <div>
          {/* Color Mode */}
          <div className="mb-3 bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Color Mode</h3>
            <div className="flex gap-4">
              {["default", "light", "dark"].map((mode) => (
                <button
                  key={mode}
                  onClick={() => handleColorModeChange(mode)}
                  className={`px-4 py-2 border rounded-md ${
                    activeColorMode === mode ? "bg-orange-100 border-orange-500" : ""
                  }`}
                >
                  {mode === "default" ? "⚙️ Default" : mode === "light" ? "☀️ Light" : "🌙 Dark"}
                </button>
              ))}
            </div>
          </div>

          {/* Preset Themes */}
<div className="mb-3 bg-white rounded-lg shadow-md p-6">
  <h3 className="text-lg font-semibold text-gray-800 mb-2">Preset Themes</h3>
  <div className="grid grid-cols-4 gap-4">
    {Array.from({ length: 12 }).map((_, idx) => (
      <button
        key={idx}
        onClick={() => handlePresetThemeSelect(idx)}
        className={`px-4 py-2 border rounded-md ${
          parseInt(activePresetTheme, 10) === idx ? "bg-orange-100 border-orange-500" : ""
        }`}
      >
        Theme {idx + 1}
        
      </button>
    ))}
  </div>
</div>


          {/* Font Style */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Font Style</h3>
            <div className="grid grid-cols-3 gap-4">
              {["Poppins", "Inter", "Inria Serif", "Crimson Text", "Lobster", "Playfair Display"].map(
                (font) => (
                  <button
                    key={font}
                    onClick={() => handleFontStyleSelect(font)}
                    className={`px-4 py-2 border rounded-md ${
                      activeFontStyle === font ? "bg-orange-100 border-orange-500" : ""
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


      {/* Components */}
      {activeTab === "developerComponents" && (
        <div>
          <div className="mb-6 bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-medium text-gray-800 mb-2">Navigation</h2>
            <div className="flex items-center gap-4 mb-4">
              <select
                value={selectedNavigation}
                onChange={(e) => setSelectedNavigation(e.target.value)}
                className="flex-grow border border-gray-300 rounded-md px-4 py-2"
              >
                {navigationOptions.map((option, idx) => (
                  <option key={idx} value={option.label}>
                    {option.label}
                  </option>
                ))}
              </select>
              <button
                onClick={handleSaveNavigation}
                disabled={selectedNavigation === initialNavigation}
                className={`px-4 py-2 rounded-md ${
                  selectedNavigation === initialNavigation
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-orange-600 text-white hover:bg-orange-700"
                }`}
              >
                Save
              </button>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-600 mb-2">Preview</h3>
              <img
                src={
                  navigationOptions.find((option) => option.label === selectedNavigation)?.preview
                }
                alt="Navigation Preview"
                className="rounded shadow-md w-full h-40 object-cover"
              />
            </div>
          </div>

          <div className="mb-6 bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-medium text-gray-800 mb-2">Footer</h2>
            <div className="flex items-center gap-4 mb-4">
              <select
                value={selectedFooter}
                onChange={(e) => setSelectedFooter(e.target.value)}
                className="flex-grow border border-gray-300 rounded-md px-4 py-2"
              >
                {footerOptions.map((option, idx) => (
                  <option key={idx} value={option.label}>
                    {option.label}
                  </option>
                ))}
              </select>
              <button
                onClick={handleSaveFooter}
                disabled={selectedFooter === initialFooter}
                className={`px-4 py-2 rounded-md ${
                  selectedFooter === initialFooter
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-orange-600 text-white hover:bg-orange-700"
                }`}
              >
                Save
              </button>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-600 mb-2">Preview</h3>
              <img
                src={footerOptions.find((option) => option.label === selectedFooter)?.preview}
                alt="Footer Preview"
                className="rounded shadow-md w-full h-40 object-cover"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ThemePage;
