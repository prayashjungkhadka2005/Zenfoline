import React, { useState, useEffect } from "react";
import useTemplateStore from '../store/templateStore';
import useAuthStore from '../store/userAuthStore';
import tem1 from '../assets/tem1.png';
import tem2 from '../assets/tem2.png';
import tem3 from '../assets/tem3.png';
import tem4 from '../assets/tem4.png';
import tem5 from '../assets/tem5.png';
import tem6 from '../assets/tem6.png';



const ThemePage = () => {

  const { activeTemplateId, templates, fetchTemplates } = useTemplateStore();
  const userId = useAuthStore((state) => state.userId);

  useEffect(() => {
    if (userId) {
      fetchTemplates(userId); // Fetch templates and active template for the user
    }
  }, [userId, fetchTemplates]);

  const activeTemplate = templates.find((template) => template._id === activeTemplateId);

  const [activeTab, setActiveTab] = useState("appearances"); //track active tab
  const [activeColorMode, setActiveColorMode] = useState("default");
  const [activePresetTheme, setActivePresetTheme] = useState(null);
  const [activeFontStyle, setActiveFontStyle] = useState("Poppins");
  const [selectedNavigation, setSelectedNavigation] = useState("Developer Basic Navbar");
  const [initialNavigation, setInitialNavigation] = useState("Developer Basic Navbar");
  const [selectedFooter, setSelectedFooter] = useState("Developer Basic Footer");
  const [initialFooter, setInitialFooter] = useState("Developer Basic Footer");

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

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleColorModeChange = (mode) => {
    setActiveColorMode(mode);
  };

  const handlePresetThemeSelect = (theme) => {
    setActivePresetTheme(theme);
  };

  const handleFontStyleSelect = (font) => {
    setActiveFontStyle(font);
  };

  const handleSaveNavigation = () => {
    setInitialNavigation(selectedNavigation); //save selected navigation
  };

  const handleSaveFooter = () => {
    setInitialFooter(selectedFooter); //save selected footer
  };

  return (
    <div className="min-h-screen">
      <h1 className="text-2xl font-bold text-gray-800 mb-3">Themes</h1>

      <div className="mb-3 bg-white rounded-lg shadow-md p-6 flex justify-between items-center">
      <h2 className="text-lg font-medium text-gray-800">
        Current template:{' '}
        <span className="font-bold">{activeTemplate ? activeTemplate.name : 'None'}</span>
      </h2>
      <div className="flex items-center gap-4">
        {activeTemplate ? (
          <span className="text-green-500 font-medium flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-green-500"></span> Active
          </span>
        ) : (
          <span className="text-red-500 font-medium">No active template</span>
        )}

        <button className="text-orange-600 border border-orange-600 px-3 py-1 rounded-md">
          View Site
        </button>
      </div>
    </div>

    <div className="mb-3 bg-white rounded-lg shadow-md p-6">
  <div className="flex gap-4">
  
    <button
      onClick={() => handleTabChange("appearances")}
      className={`px-6 py-2 border-b-2 ${
        activeTab === "appearances"
          ? "border-orange-600 text-orange-600"
          : "border-transparent text-gray-600"
      }`}
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
      disabled={!activeTemplate} // button will be disabled if no template is active
    >
      <span>{activeTemplate ? activeTemplate.category : 'No'} </span>Components
    </button>
  </div>
</div>


      {activeTab === "appearances" && (
        <div>
          <div className="mb-3 bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Color Mode</h3>
            <p className="text-sm text-gray-600 mb-4">
              Choose if web appearance should be light or dark or default.
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => handleColorModeChange("default")}
                className={`flex items-center gap-2 px-4 py-2 border rounded-md ${
                  activeColorMode === "default" ? "bg-orange-100 border-orange-500" : ""
                }`}
              >
                ⚙️ Default
              </button>
              <button
                onClick={() => handleColorModeChange("light")}
                className={`flex items-center gap-2 px-4 py-2 border rounded-md ${
                  activeColorMode === "light" ? "bg-orange-100 border-orange-500" : ""
                }`}
              >
                ☀️ Light mode
              </button>
              <button
                onClick={() => handleColorModeChange("dark")}
                className={`flex items-center gap-2 px-4 py-2 border rounded-md ${
                  activeColorMode === "dark" ? "bg-orange-100 border-orange-500" : ""
                }`}
              >
                🌙 Dark mode
              </button>
            </div>
          </div>

          <div className="mb-3 bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Preset themes</h3>
            <p className="text-sm text-gray-600 mb-4">
              Choose a preset theme from our theme library.
            </p>
            <div className="grid grid-cols-4 gap-4">
              {Array.from({ length: 12 }).map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => handlePresetThemeSelect(idx)}
                  className={`px-4 py-2 border rounded-md ${
                    activePresetTheme === idx ? "bg-orange-100 border-orange-500" : ""
                  }`}
                >
                  Default
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Font Style</h3>
            <p className="text-sm text-gray-600 mb-4">
              Choose font family for your template.
            </p>
            <div className="grid grid-cols-3 gap-4">
              {["Poppins", "Inter", "Inria Serif", "Crimson Text", "Source Serif Pro", "Playfair Display"].map(
                (font, idx) => (
                  <button
                    key={idx}
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
