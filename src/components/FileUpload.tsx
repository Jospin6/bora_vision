'use client';

import { useRef, useState } from 'react';
import { FaUpload, FaVideo, FaImage, FaTimes } from 'react-icons/fa';

interface FileUploadProps {
  isOpen: boolean;
  onClose: () => void;
  onFileSelect: (file: File) => void;
}

export default function FileUpload({ isOpen, onClose, onFileSelect }: FileUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleFileSelect = (files: FileList | null) => {
    if (files && files.length > 0) {
      const file = files[0];
      if (file.type.startsWith('video/') || file.type.startsWith('image/')) {
        onFileSelect(file);
        onClose();
      } else {
        alert('Veuillez sélectionner un fichier vidéo ou image valide');
      }
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    handleFileSelect(e.dataTransfer.files);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="bg-gray-900 rounded-2xl p-6 w-full max-w-md mx-4 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
        >
          <FaTimes className="text-xl" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-white mb-2">Créer du contenu</h2>
          <p className="text-gray-400">Sélectionnez une vidéo ou une photo à partager</p>
        </div>

        {/* Drag & Drop Area */}
        <div
          className={`
            border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 cursor-pointer
            ${dragActive 
              ? 'border-[#FF0050] bg-[#FF0050]/10' 
              : 'border-gray-600 hover:border-gray-500'
            }
          `}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="flex flex-col items-center space-y-4">
            <div className="bg-gradient-to-r from-[#FF0050] to-[#7C3AED] rounded-full p-4">
              <FaUpload className="text-white text-2xl" />
            </div>
            
            <div>
              <p className="text-white font-semibold mb-1">
                Glissez-déposez votre fichier ici
              </p>
              <p className="text-gray-400 text-sm">
                ou cliquez pour parcourir
              </p>
            </div>

            <div className="flex items-center space-x-4 text-sm text-gray-400">
              <div className="flex items-center space-x-1">
                <FaVideo />
                <span>Vidéo</span>
              </div>
              <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
              <div className="flex items-center space-x-1">
                <FaImage />
                <span>Image</span>
              </div>
            </div>
          </div>
        </div>

        {/* File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="video/*,image/*"
          onChange={(e) => handleFileSelect(e.target.files)}
          className="hidden"
        />

        {/* Quick Actions */}
        <div className="mt-6 grid grid-cols-2 gap-3">
          <button
            onClick={() => {
              fileInputRef.current?.setAttribute('accept', 'video/*');
              fileInputRef.current?.click();
            }}
            className="flex items-center justify-center space-x-2 bg-gray-800 hover:bg-gray-700 rounded-xl p-4 transition-colors"
          >
            <FaVideo className="text-[#FF0050]" />
            <span className="text-white font-medium">Vidéo</span>
          </button>
          
          <button
            onClick={() => {
              fileInputRef.current?.setAttribute('accept', 'image/*');
              fileInputRef.current?.click();
            }}
            className="flex items-center justify-center space-x-2 bg-gray-800 hover:bg-gray-700 rounded-xl p-4 transition-colors"
          >
            <FaImage className="text-[#7C3AED]" />
            <span className="text-white font-medium">Photo</span>
          </button>
        </div>

        {/* Supported Formats */}
        <div className="mt-4 text-center">
          <p className="text-xs text-gray-500">
            Formats supportés: MP4, MOV, AVI, JPG, PNG, GIF
          </p>
        </div>
      </div>
    </div>
  );
}