import React, { useState, useEffect} from "react";
import { useNavigate } from 'react-router-dom';
import useTemplateStore from "../store/userTemplateStore";
import useAuthStore from "../store/userAuthStore";
import DeveloperHeader from "../TemplateComponents/Developer/DeveloperHeader";
import SimpleFooter from "../TemplateComponents/Simple/SimpleFooter";
import DeveloperFooter from "../TemplateComponents/Developer/DeveloperFooter";


const ThemePage = () => {
  const { activeTemplateId, templates, fetchTemplates } = useTemplateStore();
  const userId = useAuthStore((state) => state.userId);
  
 

  const [activeTab, setActiveTab] = useState("appearances");
  const [activeColorMode, setActiveColorMode] = useState(null);
  const [activePresetTheme, setActivePresetTheme]   = useState(null);
  const [activeFontStyle, setActiveFontStyle] = useState(null);
  const [selectedHeader, setSelectedHeader] = useState(""); // Initially no selection
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

  console.log("Fetching data for userId:", userId);
  
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


  // const handleHeaderChange = (event) => {
  //   const selected = event.target.value;
  //   setSelectedHeader(selected);
  //   setPreviewHeader(availableComponents[activeTemplate?.category]?.Header?.[selected] || null);
  // };
  
  // const handleFooterChange = (event) => {
  //   const selected = event.target.value;
  //   setSelectedFooter(selected);
  //   setPreviewFooter(availableComponents[activeTemplate?.category]?.Footer?.[selected] || null);
  // };
  
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


  useEffect(() => {
    console.log("Active Template Category:", activeTemplate?.category);
    console.log("Available Headers:", availableHeaders);
    console.log("Available Footers:", availableFooters);
    console.log("Selected Header:", selectedHeader);
    console.log("Selected Footer:", selectedFooter);
    console.log("Normalized Header:", normalizedHeader);
    console.log("Normalized Footer:", normalizedFooter);
    console.log("Preview for Header:", previewHeader);
    console.log("Preview for Footer:", previewFooter);
  }, [availableHeaders, availableFooters, normalizedHeader, normalizedFooter]);
  

  
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


{activeTab === "developerComponents" && (
  <div className="bg-white rounded-lg shadow-md p-6">
    
    {/* Header Selection */}
    <div className="mb-6 p-4 bg-white rounded-lg shadow-md">
      <h3 className="text-lg font-semibold text-gray-700 mb-4">Select Header</h3>
      <select 
        value={selectedHeader} 
        onChange={handleHeaderChange} 
        className="border p-2 rounded-md w-full"
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
      
      <div className="mt-4 border rounded-lg shadow-md bg-gray-50 flex items-center justify-center min-h-[80px] max-h-auto p-4"  
      style={{ pointerEvents: "none" }}>
        {previewHeader ? (
          <div className="w-full">{previewHeader}</div>
        ) : (
          <span className="text-md text-gray-500">
            {availableHeaders.length === 0 ? "🚀 Coming Soon" : "🔍 Select a header to preview"}
          </span>
        )}
      </div>
    </div>

    {/* Footer Selection */}
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h3 className="text-lg font-semibold text-gray-700 mb-4">Select Footer</h3>
      <select 
        value={selectedFooter} 
        onChange={handleFooterChange} 
        className="border p-2 rounded-md w-full"
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

      <div className="mt-4 border rounded-lg shadow-md bg-gray-50 flex items-center justify-center min-h-[80px] max-h-auto p-4"
      style={{ pointerEvents: "none" }}>
        {previewFooter ? (
          <div className="w-full">{previewFooter}</div>
        ) : (
          <span className="text-md text-gray-500">
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
