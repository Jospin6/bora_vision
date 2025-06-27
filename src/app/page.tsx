'use client';

import { useState, useEffect } from 'react';
import VideoFeed from '@/components/VideoFeed';
import Sidebar from '@/components/Sidebar';
import FileUpload from '@/components/FileUpload';
import { mockVideos } from '@/lib/mockData';

export default function Home() {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [videos] = useState(mockVideos);
  const [showFileUpload, setShowFileUpload] = useState(false);

  const handleVideoChange = (direction: 'up' | 'down') => {
    if (direction === 'up' && currentVideoIndex > 0) {
      setCurrentVideoIndex(currentVideoIndex - 1);
    } else if (direction === 'down' && currentVideoIndex < videos.length - 1) {
      setCurrentVideoIndex(currentVideoIndex + 1);
    }
  };

  const handleFileSelect = (file: File) => {
    console.log('Fichier sélectionné:', file);
    // Ici vous pouvez ajouter la logique pour traiter le fichier
    // Par exemple: upload vers un serveur, prévisualisation, etc.

    // Créer une URL temporaire pour prévisualiser le fichier
    const fileUrl = URL.createObjectURL(file);
    console.log('URL du fichier:', fileUrl);

    // Vous pouvez maintenant utiliser cette URL pour afficher le fichier
    // ou l'envoyer vers votre backend pour traitement
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp') {
        handleVideoChange('up');
      } else if (e.key === 'ArrowDown') {
        handleVideoChange('down');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentVideoIndex]);

  return (
    <div className="relative h-screen w-full bg-black overflow-hidden">
      <VideoFeed
        videos={videos}
        currentIndex={currentVideoIndex}
        onVideoChange={handleVideoChange}
      />

      <Sidebar onCreateClick={() => setShowFileUpload(true)} />

      <FileUpload
        isOpen={showFileUpload}
        onClose={() => setShowFileUpload(false)}
        onFileSelect={handleFileSelect}
      />
    </div>
  );
}