'use client';

import Link from 'next/link';
import { useState } from 'react';
import {
  FaHome,
  FaSearch,
  FaCompass,
  FaHeart,
  FaUser,
  FaPlus,
  FaTimes
} from 'react-icons/fa';

interface SidebarProps {
  onCreateClick: () => void;
}

export default function Sidebar({ onCreateClick }: SidebarProps) {
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeItem, setActiveItem] = useState('home');

  const menuItems = [
    { id: 'home', icon: FaHome, label: 'Accueil', href: "#", active: activeItem === 'home' },
    { id: 'explore', icon: FaCompass, label: 'Explorer', href: "#", active: activeItem === 'explore' },
    { id: 'search', icon: FaSearch, label: 'Rechercher', href: "#", active: activeItem === 'search' },
    { id: 'notifications', icon: FaHeart, label: 'Notifications', href: "#", active: activeItem === 'notifications' },
    { id: 'profile', icon: FaUser, label: 'Profil', href: "/profil", active: activeItem === 'profile' },
  ];

  const handleMenuClick = (itemId: string) => {
    if (itemId === 'search') {
      setShowSearch(true);
      setActiveItem('search');
    } else {
      setShowSearch(false);
      setActiveItem(itemId);
    }
  };

  const handleSearchClose = () => {
    setShowSearch(false);
    setSearchQuery('');
    setActiveItem('home');
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Ici vous pouvez ajouter la logique de recherche
    console.log('Recherche:', searchQuery);
  };

  return (
    <>
      {/* Search Overlay */}
      {showSearch && (
        <div className="fixed inset-0 z-60 bg-black/95 backdrop-blur-md">
          <div className="flex flex-col h-full">
            {/* Search Header */}
            <div className="flex items-center p-4 border-b border-gray-800">
              <button
                onClick={handleSearchClose}
                className="mr-4 p-2 rounded-full hover:bg-white/10 transition-colors duration-200"
              >
                <FaTimes className="text-white text-xl" />
              </button>
              <form onSubmit={handleSearchSubmit} className="flex-1">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Rechercher..."
                  className="w-full bg-gray-800/50 text-white placeholder-gray-400 rounded-full px-4 py-3 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all duration-200"
                  autoFocus
                />
              </form>
            </div>

            {/* Search Results */}
            <div className="flex-1 p-4 overflow-y-auto">
              {searchQuery ? (
                <div className="space-y-4">
                  <h3 className="text-white font-semibold text-lg">Résultats pour "{searchQuery}"</h3>
                  {/* Ici vous pouvez ajouter les résultats de recherche */}
                  <div className="text-gray-400 text-center py-8">
                    <FaSearch className="text-4xl mx-auto mb-4 opacity-50" />
                    <p>Aucun résultat trouvé</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-white font-semibold text-lg mb-4">Recherches récentes</h3>
                    <div className="space-y-2">
                      {['#tendance', '#art', '#photographie'].map((tag, index) => (
                        <button
                          key={index}
                          onClick={() => setSearchQuery(tag)}
                          className="block w-full text-left px-4 py-3 rounded-xl bg-gray-800/30 text-gray-300 hover:bg-gray-800/50 hover:text-white transition-all duration-200"
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-white font-semibold text-lg mb-4">Suggestions</h3>
                    <div className="space-y-2">
                      {['Découvrir', 'Populaire', 'Nouveau'].map((suggestion, index) => (
                        <button
                          key={index}
                          onClick={() => setSearchQuery(suggestion)}
                          className="block w-full text-left px-4 py-3 rounded-xl bg-gray-800/30 text-gray-300 hover:bg-gray-800/50 hover:text-white transition-all duration-200"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Mobile Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-md border-t border-gray-800 safe-area-pb">
        <div className="flex items-center justify-around px-2 py-3 max-w-screen-sm mx-auto">
          {menuItems.map((item, index) => (
            <div key={index} className="flex-1">
              {item.id === 'search' ? (
                <button
                  onClick={() => handleMenuClick(item.id)}
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
              ) : (
                <Link href={item.href}>
                  <button
                    onClick={() => handleMenuClick(item.id)}
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
              )}
            </div>
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
              <div key={index}>
                {item.id === 'search' ? (
                  <button
                    onClick={() => handleMenuClick(item.id)}
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
                ) : (
                  <Link href={item.href}>
                    <button
                      onClick={() => handleMenuClick(item.id)}
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
                )}
              </div>
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
            </button>
          </div>
        </div>
      </div> */}

      {/* Content spacer for desktop */}
      {/* <div className="hidden lg:block w-64 flex-shrink-0"></div> */} */
    </>
  );
}