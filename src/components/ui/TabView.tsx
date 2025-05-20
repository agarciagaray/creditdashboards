import React, { useEffect, useState } from "react";

interface Tab {
  label: string;
  icon?: React.ReactNode;
  content: React.ReactNode;
}

interface TabViewProps {
  tabs: Tab[];
  activeTab: number;
  onTabChange: (index: number) => void;
}

const TabView: React.FC<TabViewProps> = ({ tabs, activeTab, onTabChange }) => {
  const [fade, setFade] = useState(true);
  const [prevTab, setPrevTab] = useState(activeTab);

  useEffect(() => {
    if (activeTab !== prevTab) {
      setFade(false);
      const timeout = setTimeout(() => {
        setFade(true);
        setPrevTab(activeTab);
      }, 150); // Duración de la animación
      return () => clearTimeout(timeout);
    }
  }, [activeTab, prevTab]);

  return (
    <div className="w-full">
      <div
        className="border-b border-gray-200"
        role="tablist"
      >
        <nav
          className="flex space-x-8"
          aria-label="Navegación de pestañas"
        >
          {tabs.map((tab, index) => (
            <button
              key={index}
              onClick={() => onTabChange(index)}
              className={`
                py-4 px-1 border-b-2 font-medium text-sm
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500
                transition-colors duration-200
                ${
                  activeTab === index
                    ? "border-primary-500 text-primary-600 bg-primary-50 shadow-sm rounded-t-md"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }
              `}
              role="tab"
              aria-selected={activeTab === index}
              aria-controls={`panel-${index}`}
              id={`tab-${index}`}
            >
              <div className="flex items-center space-x-2">
                {tab.icon && (
                  <span
                    className="h-5 w-5"
                    aria-hidden="true"
                  >
                    {tab.icon}
                  </span>
                )}
                <span>{tab.label}</span>
              </div>
            </button>
          ))}
        </nav>
      </div>

      <div className="mt-6 min-h-[200px]">
        {tabs.map((tab, index) => (
          <div
            key={index}
            role="tabpanel"
            id={`panel-${index}`}
            aria-labelledby={`tab-${index}`}
            className={
              activeTab === index
                ? `block transition-opacity duration-300 ${
                    fade ? "opacity-100" : "opacity-0"
                  }`
                : "hidden"
            }
          >
            {tab.content}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TabView;
