import React, { useState } from 'react';

interface TabViewProps {
  tabs: {
    label: string;
    content: React.ReactNode;
    icon?: React.ReactNode;
  }[];
}

const TabView: React.FC<TabViewProps> = ({ tabs }) => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="animate-fade-in">
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex -mb-px overflow-x-auto hide-scrollbar">
          {tabs.map((tab, index) => (
            <button
              key={index}
              className={`py-4 px-6 text-sm font-medium transition-all duration-200 border-b-2 whitespace-nowrap flex items-center ${
                activeTab === index
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab(index)}
            >
              {tab.icon && <span className="mr-2">{tab.icon}</span>}
              {tab.label}
            </button>
          ))}
        </nav>
      </div>
      
      <div className="animate-fade-in">
        {tabs[activeTab].content}
      </div>
    </div>
  );
};

export default TabView;