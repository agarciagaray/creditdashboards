import { ChevronRight, Home } from "lucide-react";
import React from "react";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ items }) => {
  return (
    <nav
      className="flex"
      aria-label="Breadcrumb"
    >
      <ol className="flex items-center space-x-2">
        <li>
          <a
            href="/"
            className="text-gray-500 hover:text-gray-700 flex items-center"
          >
            <Home
              className="h-4 w-4"
              aria-hidden="true"
            />
          </a>
        </li>
        {items.map((item, index) => (
          <li
            key={index}
            className="flex items-center"
          >
            <ChevronRight
              className="h-4 w-4 text-gray-400"
              aria-hidden="true"
            />
            {item.href ? (
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
