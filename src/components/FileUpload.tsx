'use client';

import { useRef, useState } from 'react';
import { FaUpload, FaVideo, FaImage, FaTimes, FaCamera, FaVideoSlash } from 'react-icons/fa';

interface FileUploadProps {
  isOpen: boolean;
  onClose: () => void;
  onFileSelect: (file: File) => void;
}

export default function FileUpload({ isOpen, onClose, onFileSelect }: FileUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
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

  const openCamera = () => {
    cameraInputRef.current?.click();
  };

  const openVideoCamera = () => {
    videoInputRef.current?.click();
  };

  const openGallery = () => {
    fileInputRef.current?.click();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end lg:items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="bg-gray-900 rounded-t-3xl lg:rounded-2xl p-6 w-full max-w-md mx-0 lg:mx-4 relative max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors z-10 p-2 rounded-full hover:bg-gray-800 touch-manipulation"
        >
          <FaTimes className="text-xl" />
        </button>

        {/* Header */}
        <div className="text-center mb-6 pt-2">
          <h2 className="text-2xl font-bold text-white mb-2">Créer du contenu</h2>
          <p className="text-gray-400">Prenez une photo, enregistrez une vidéo ou sélectionnez depuis votre galerie</p>
        </div>

        {/* Camera Actions - Mobile First */}
        <div className="grid grid-cols-1 gap-4 mb-6">
          {/* Take Photo */}
          <button
            onClick={openCamera}
            className="flex items-center justify-center space-x-3 bg-gradient-to-r from-[#FF0050] to-[#FF3366] hover:from-[#FF1155] hover:to-[#FF4477] rounded-xl p-4 transition-all duration-300 active:scale-95 touch-manipulation min-h-[60px]"
          >
            <FaCamera className="text-white text-xl" />
            <span className="text-white font-semibold text-lg">Prendre une photo</span>
          </button>

          {/* Record Video */}
          <button
            onClick={openVideoCamera}
            className="flex items-center justify-center space-x-3 bg-gradient-to-r from-[#7C3AED] to-[#9333EA] hover:from-[#8B5CF6] hover:to-[#A855F7] rounded-xl p-4 transition-all duration-300 active:scale-95 touch-manipulation min-h-[60px]"
          >
            <FaVideo className="text-white text-xl" />
            <span className="text-white font-semibold text-lg">Enregistrer une vidéo</span>
          </button>
        </div>

        {/* Divider */}
        <div className="flex items-center my-6">
          <div className="flex-1 h-px bg-gray-700"></div>
          <span className="px-4 text-gray-400 text-sm">ou</span>
          <div className="flex-1 h-px bg-gray-700"></div>
        </div>

        {/* Gallery Selection */}
        <button
          onClick={openGallery}
          className="w-full flex items-center justify-center space-x-3 bg-gray-800 hover:bg-gray-700 rounded-xl p-4 transition-all duration-300 active:scale-95 touch-manipulation min-h-[60px] mb-4"
        >
          <FaImage className="text-gray-300 text-xl" />
          <span className="text-white font-semibold text-lg">Choisir depuis la galerie</span>
        </button>

        {/* Drag & Drop Area - Desktop */}
        <div className="hidden lg:block">
          <div
            className={`
              border-2 border-dashed rounded-xl p-6 text-center transition-all duration-300 cursor-pointer
              ${dragActive 
                ? 'border-[#FF0050] bg-[#FF0050]/10' 
                : 'border-gray-600 hover:border-gray-500'
              }
            `}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={openGallery}
          >
            <div className="flex flex-col items-center space-y-3">
              <div className="bg-gradient-to-r from-[#FF0050] to-[#7C3AED] rounded-full p-3">
                <FaUpload className="text-white text-xl" />
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
        </div>

        {/* Hidden File Inputs */}
        <input
          ref={fileInputRef}
          type="file"
          accept="video/*,image/*"
          onChange={(e) => handleFileSelect(e.target.files)}
          className="hidden"
        />

        {/* Camera Input for Photos */}
        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={(e) => handleFileSelect(e.target.files)}
          className="hidden"
        />

        {/* Camera Input for Videos */}
        <input
          ref={videoInputRef}
          type="file"
          accept="video/*"
          capture="environment"
          onChange={(e) => handleFileSelect(e.target.files)}
          className="hidden"
        />

        {/* Supported Formats */}
        <div className="mt-4 text-center">
          <p className="text-xs text-gray-500">
            Formats supportés: MP4, MOV, AVI, JPG, PNG, GIF, WEBP
          </p>
        </div>

        {/* Safe area padding for mobile */}
        <div className="h-safe-area-inset-bottom lg:hidden"></div>
      </div>
    </div>
  );
}