import React, { useRef } from 'react';

const ModernDrawer = ({ 
  sidebarContent, 
  label = "Open drawer", 
  labelStyles = {} 
}) => {
  const checkboxRef = useRef(null);

  return (
    <div className="drawer lg:drawer-open h-full sticky top-0 z-50 ">
      <input id={checkboxRef} type="checkbox" className="drawer-toggle" />
      <div className="drawer-content">
        {/* Page content here */}
        <label htmlFor={checkboxRef} className={`${labelStyles} btn drawer-button lg:hidden`}>
          {label}
        </label>
      </div>
      <div className="drawer-side h-full">
        <label htmlFor={checkboxRef} aria-label="close sidebar" className="drawer-overlay"></label>   
        <ul className="h-full bg-base-100 menu lg:card p-4 w-80 text-base-content">
          <li className="p-4 text-left text-xl font-bold">Seller Dashboard</li>
          {sidebarContent}
        </ul>
      </div>
    </div>
  );
};

export default ModernDrawer;
