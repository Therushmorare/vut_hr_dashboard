"use client"

import React, { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';


const Sidebar = () => {
  const router = useRouter();
  const pathname = usePathname();

  const menuItems = [
    { id: 'applications', label: 'Applications', href: '/pages/applications' },
    { id: 'employees', label: 'Employees', href: '/pages/employees' },
    { id: 'candidates', label: 'Candidates', href: '/pages/candidates' },
    { id: 'interviews', label: 'Interviews', href: '/pages/interviews' },
    { id: 'reports', label: 'Reports', href: '/pages/reports' },
    { id: 'recruitment', label: 'Recruitment', href: '/pages/recruitment' }
  ];

  const handleItemClick = (href) => {
    router.push(href);
  };

  return (
    <div className="w-48 h-screen bg-white text-black flex flex-col fixed top-0 left-0 shadow-[4px_0_6px_-1px_rgba(0,0,0,0.1)]">
      {/* Logo */}
      <div className="p-6 border-b border-gray-600">
        <img src="https://res.cloudinary.com/dbuuizuka/image/upload/v1761697835/id3tj44Wsz_1761674029816_z2fjde.png" alt="Logo" className="w-full max-w-28 ml-2 top-0 h-auto object-contain" />
      </div>

      {/* 
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-2xl font-extrabold text-green-600 tracking-tight">
          HR Dashboard
        </h1>
      </div>
      */}


      {/* Navigation Items */}
      <nav className="flex-1 p-4">
        <ul className="flex flex-col space-y-0.5">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            
            return (
              <li key={item.id}>
                <button
                  onClick={() => handleItemClick( item.href)}
                  className={`w-full flex items-center justify-between p-2 rounded-md transition-all duration-200 border-none cursor-pointer text-black text-sm ${
                    isActive 
                      ? 'bg-green-100 text-blue-700 font-medium' 
                      : 'hover:bg-green-100 hover:text-green-700'
                  }`}
                >
                  <div className="flex items-center gap-1">
                    <span>{item.label}</span>
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;