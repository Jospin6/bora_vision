'use client';

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
    { icon: FaHome, label: 'Accueil', active: true },
    { icon: FaCompass, label: 'Explorer', active: false },
    { icon: FaSearch, label: 'Rechercher', active: false },
    { icon: FaHeart, label: 'Notifications', active: false },
    { icon: FaUser, label: 'Profil', active: false },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-md border-t border-gray-800">
      <div className="flex items-center justify-around px-4 py-2 max-w-md mx-auto">
        {menuItems.map((item, index) => (
          <button
            key={index}
            className={`
              flex flex-col items-center p-2 rounded-lg transition-all duration-300 relative group
              ${item.active 
                ? 'text-white' 
                : 'text-gray-400 hover:text-white'
              }
            `}
          >
            <item.icon className={`text-xl mb-1 ${item.active ? 'text-white' : ''}`} />
            <span className="text-xs font-medium">{item.label}</span>
            
            {item.active && (
              <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-white rounded-full"></div>
            )}
          </button>
        ))}
        
        {/* Create Button */}
        <button 
          onClick={onCreateClick}
          className="flex flex-col items-center p-2 rounded-lg transition-all duration-300 group relative"
        >
          <div className="bg-gradient-to-r from-[#FF0050] to-[#7C3AED] rounded-lg p-2 mb-1">
            <FaPlus className="text-white text-xl" />
          </div>
          <span className="text-xs font-medium text-white">Créer</span>
        </button>
      </div>
    </div>
  );
}