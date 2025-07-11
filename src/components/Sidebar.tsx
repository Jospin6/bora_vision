'use client';

import Link from 'next/link';
import { useState } from 'react';
import {
  FaHome,
  FaSearch,
  FaCompass,
  FaHeart,
  FaUser,
  FaPlus
} from 'react-icons/fa';

interface SidebarProps {
  onCreateClick: () => void;
}

export default function Sidebar({ onCreateClick }: SidebarProps) {
  const menuItems = [
    { icon: FaHome, label: 'Accueil', href: "#", active: true },
    { icon: FaCompass, label: 'Explorer', href: "#", active: false },
    { icon: FaSearch, label: 'Rechercher', href: "#", active: false },
    { icon: FaHeart, label: 'Notifications', href: "#", active: false },
    { icon: FaUser, label: 'Profil', href: "/profil", active: false },
  ];

  return (
    <>
      {/* Mobile Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-md border-t border-gray-800 safe-area-pb">
        <div className="flex items-center justify-around px-2 py-3 max-w-screen-sm mx-auto">
          {menuItems.map((item, index) => (
            <Link href={item.href} key={index} className="flex-1">
              <button
                className={`
                  w-full flex flex-col items-center py-2 px-1 rounded-xl transition-all duration-300 relative group
                  min-h-[60px] active:scale-95 touch-manipulation
                  ${item.active
                    ? 'text-white bg-white/10'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }
                `}
              >
                <item.icon className={`text-xl mb-1 transition-colors duration-300 ${item.active ? 'text-white' : ''}`} />
                <span className="text-[10px] font-medium leading-tight text-center">{item.label}</span>

                {item.active && (
                  <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-white rounded-full"></div>
                )}
              </button>
            </Link>
          ))}

          {/* Create Button */}
          <div className="flex-1">
            <button
              onClick={onCreateClick}
              className="w-full flex flex-col items-center py-2 px-1 rounded-xl transition-all duration-300 group relative min-h-[60px] active:scale-95 touch-manipulation"
            >
              <div className="bg-gradient-to-r from-[#FF0050] to-[#7C3AED] rounded-xl p-2 mb-1 shadow-lg group-active:scale-95 transition-transform duration-150">
                <FaPlus className="text-white text-xl" />
              </div>
              <span className="text-[10px] font-medium text-white leading-tight">Créer</span>
            </button>
          </div>
        </div>
        
        {/* Safe area padding for devices with home indicator */}
        <div className="h-safe-area-inset-bottom bg-black/95"></div>
      </div>

      {/* Desktop Sidebar - Hidden on mobile */}
      {/* <div className="hidden lg:flex fixed left-0 top-0 h-full w-64 bg-black/95 backdrop-blur-md border-r border-gray-800 flex-col z-40">
        <div className="flex-1 px-4 py-6">
          <div className="space-y-2">
            {menuItems.map((item, index) => (
              <Link href={item.href} key={index}>
                <button
                  className={`
                    w-full flex items-center px-4 py-3 rounded-xl transition-all duration-300 relative group
                    ${item.active
                      ? 'text-white bg-white/10'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }
                  `}
                >
                  <item.icon className={`text-xl mr-4 ${item.active ? 'text-white' : ''}`} />
                  <span className="text-sm font-medium">{item.label}</span>

                  {item.active && (
                    <div className="absolute right-2 top-1/2 transform -translate-y-1/2 w-1 h-6 bg-white rounded-full"></div>
                  )}
                </button>
              </Link>
            ))}

            {/* Desktop Create Button */}
            {/* <button
              onClick={onCreateClick}
              className="w-full flex items-center px-4 py-3 rounded-xl transition-all duration-300 group relative mt-6"
            >
              <div className="bg-gradient-to-r from-[#FF0050] to-[#7C3AED] rounded-xl p-2 mr-4">
                <FaPlus className="text-white text-xl" />
              </div>
              <span className="text-sm font-medium text-white">Créer</span>
            </button> */}
          {/* </div> */}
        {/* // </div> */}
      {/* // </div>  */}
        
      {/* Content spacer for desktop */}
      {/* <div className="hidden lg:block w-64 flex-shrink-0"></div> */}
    </>        
  );    
}