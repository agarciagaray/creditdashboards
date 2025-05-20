import { ChevronRight, Home } from "lucide-react";
import React from "react";

interface BreadcrumbItem {
  label: string;
  href?: string;
  onClick?: () => void;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ items }) => {
  return (
    <nav
      className="flex bg-gray-50 rounded-md px-4 py-2 shadow-sm border border-gray-200"
      aria-label="Breadcrumb"
    >
      <ol className="flex items-center space-x-2">
        <li>
          {items[0]?.onClick ? (
            <button
              type="button"
              onClick={items[0].onClick}
              className="text-gray-500 hover:text-gray-700 flex items-center focus:outline-none"
            >
              <Home
                className="h-4 w-4"
                aria-hidden="true"
              />
            </button>
          ) : (
            <a
              href={items[0]?.href || "/"}
              className="text-gray-500 hover:text-gray-700 flex items-center"
            >
              <Home
                className="h-4 w-4"
                aria-hidden="true"
              />
            </a>
          )}
        </li>
        {items.slice(1).map((item, index) => (
          <li
            key={index}
            className="flex items-center"
          >
            <ChevronRight
              className="h-4 w-4 text-gray-400"
              aria-hidden="true"
            />
            {item.onClick ? (
              <button
                type="button"
                onClick={item.onClick}
                className="ml-2 text-sm font-medium text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                {item.label}
              </button>
            ) : item.href ? (
              <a
                href={item.href}
                className="ml-2 text-sm font-medium text-gray-500 hover:text-gray-700"
              >
                {item.label}
              </a>
            ) : (
              <span className="ml-2 text-sm font-medium text-gray-700">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
